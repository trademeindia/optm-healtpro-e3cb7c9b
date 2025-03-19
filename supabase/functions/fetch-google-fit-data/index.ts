
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { userId, accessToken, timeRange = "week", metricTypes = [] } = await req.json();

    if (!userId || !accessToken) {
      return new Response(
        JSON.stringify({ error: "Missing userId or accessToken" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate time range based on the requested range
    const endTime = new Date();
    const startTime = new Date();
    
    switch (timeRange) {
      case "day":
        startTime.setDate(startTime.getDate() - 1);
        break;
      case "week":
        startTime.setDate(startTime.getDate() - 7);
        break;
      case "month":
        startTime.setDate(startTime.getDate() - 30);
        break;
      case "year":
        startTime.setFullYear(startTime.getFullYear() - 1);
        break;
      default:
        startTime.setDate(startTime.getDate() - 7); // Default to a week
    }

    // Define data types to fetch based on requested metric types
    const dataTypesToFetch = [];
    
    // Always include basic metrics
    dataTypesToFetch.push(
      { dataTypeName: "com.google.step_count.delta" },
      { dataTypeName: "com.google.heart_rate.bpm" },
      { dataTypeName: "com.google.calories.expended" }
    );
    
    // Conditionally add other metrics based on request
    if (metricTypes.includes("distance")) {
      dataTypesToFetch.push({ dataTypeName: "com.google.distance.delta" });
    }
    
    if (metricTypes.includes("sleep")) {
      dataTypesToFetch.push({ dataTypeName: "com.google.sleep.segment" });
    }
    
    if (metricTypes.includes("workout")) {
      dataTypesToFetch.push({ dataTypeName: "com.google.activity.segment" });
    }

    // Fetch data from Google Fit API
    const response = await fetch(
      "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aggregateBy: dataTypesToFetch,
          bucketByTime: { durationMillis: 86400000 }, // 1 day in milliseconds
          startTimeMillis: startTime.getTime(),
          endTimeMillis: endTime.getTime(),
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google Fit API error: ${errorText}`);
      
      // Check if token is expired
      if (response.status === 401) {
        // Try to refresh the token
        const refreshResult = await refreshGoogleFitToken(userId, supabase);
        if (refreshResult.success) {
          return new Response(
            JSON.stringify({ refreshed: true, message: "Token refreshed, please retry" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } else {
          return new Response(
            JSON.stringify({ error: "Authentication expired. Please reconnect Google Fit." }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
      
      return new Response(
        JSON.stringify({ error: `Google Fit API error: ${errorText}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fitData = await response.json();
    
    // Process and store all the requested data types
    const processedData = await processGoogleFitData(fitData, timeRange);
    
    // Store processed data in Supabase
    await storeDataInSupabase(userId, processedData, supabase);
    
    // Return processed data
    return new Response(
      JSON.stringify(processedData),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fetch-google-fit-data function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Enhanced function to process Google Fit data
async function processGoogleFitData(data: any, timeRange: string) {
  const processedData: any = {
    steps: [],
    heartRate: [],
    calories: [],
    distance: [],
    sleep: [],
    workout: []
  };
  
  // Calculate percent changes for comparing to previous periods
  const prevPeriodData = {
    steps: 0,
    heartRate: 0,
    calories: 0,
    distance: 0,
    sleepMinutes: 0
  };
  
  if (!data.bucket || !data.bucket.length) {
    return processedData;
  }
  
  // Process all buckets (typically days)
  data.bucket.forEach((bucket: any, index: number) => {
    const date = new Date(parseInt(bucket.startTimeMillis));
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Process steps
    const stepsDataset = bucket.dataset.find((d: any) => 
      d.dataSourceId.includes("com.google.step_count.delta")
    );
    
    if (stepsDataset && stepsDataset.point && stepsDataset.point.length) {
      const dailySteps = stepsDataset.point.reduce((total: number, point: any) => {
        return total + (point.value[0]?.intVal || 0);
      }, 0);
      
      processedData.steps.push({
        date: dateStr,
        timestamp: date.toISOString(),
        value: dailySteps
      });
      
      // For the most recent day, calculate percentage change
      if (index === data.bucket.length - 1) {
        processedData.lastSteps = dailySteps;
      }
      // For comparison to calculate change
      else if (index === data.bucket.length - 2) {
        prevPeriodData.steps = dailySteps;
      }
    }
    
    // Process heart rate
    const heartRateDataset = bucket.dataset.find((d: any) => 
      d.dataSourceId.includes("com.google.heart_rate.bpm")
    );
    
    if (heartRateDataset && heartRateDataset.point && heartRateDataset.point.length) {
      let totalHeartRate = 0;
      let count = 0;
      
      heartRateDataset.point.forEach((point: any) => {
        if (point.value[0]?.fpVal) {
          totalHeartRate += point.value[0].fpVal;
          count++;
          
          // Store individual readings for detailed charts
          processedData.heartRate.push({
            timestamp: new Date(parseInt(point.startTimeNanos) / 1000000).toISOString(),
            value: point.value[0].fpVal
          });
        }
      });
      
      // Daily average
      if (count > 0) {
        const avgHeartRate = Math.round(totalHeartRate / count);
        
        // For the most recent day
        if (index === data.bucket.length - 1) {
          processedData.lastHeartRate = avgHeartRate;
        }
        // For comparison
        else if (index === data.bucket.length - 2) {
          prevPeriodData.heartRate = avgHeartRate;
        }
      }
    }
    
    // Process calories
    const caloriesDataset = bucket.dataset.find((d: any) => 
      d.dataSourceId.includes("com.google.calories.expended")
    );
    
    if (caloriesDataset && caloriesDataset.point && caloriesDataset.point.length) {
      const dailyCalories = caloriesDataset.point.reduce((total: number, point: any) => {
        return total + (point.value[0]?.fpVal || 0);
      }, 0);
      
      processedData.calories.push({
        date: dateStr,
        timestamp: date.toISOString(),
        value: Math.round(dailyCalories)
      });
      
      // For the most recent day
      if (index === data.bucket.length - 1) {
        processedData.lastCalories = Math.round(dailyCalories);
      }
      // For comparison
      else if (index === data.bucket.length - 2) {
        prevPeriodData.calories = Math.round(dailyCalories);
      }
    }
    
    // Process distance if available
    const distanceDataset = bucket.dataset.find((d: any) => 
      d.dataSourceId.includes("com.google.distance.delta")
    );
    
    if (distanceDataset && distanceDataset.point && distanceDataset.point.length) {
      const dailyDistance = distanceDataset.point.reduce((total: number, point: any) => {
        return total + (point.value[0]?.fpVal || 0);
      }, 0);
      
      // Convert to kilometers
      const distanceKm = dailyDistance / 1000;
      
      processedData.distance.push({
        date: dateStr,
        timestamp: date.toISOString(),
        value: parseFloat(distanceKm.toFixed(2))
      });
      
      // For the most recent day
      if (index === data.bucket.length - 1) {
        processedData.lastDistance = parseFloat(distanceKm.toFixed(2));
      }
      // For comparison
      else if (index === data.bucket.length - 2) {
        prevPeriodData.distance = parseFloat(distanceKm.toFixed(2));
      }
    }
    
    // Process sleep data if available
    const sleepDataset = bucket.dataset.find((d: any) => 
      d.dataSourceId.includes("com.google.sleep.segment")
    );
    
    if (sleepDataset && sleepDataset.point && sleepDataset.point.length) {
      let totalSleepMinutes = 0;
      
      sleepDataset.point.forEach((point: any) => {
        if (point.value[0]?.intVal) {
          // Calculate duration in minutes
          const startTime = parseInt(point.startTimeNanos) / 1000000;
          const endTime = parseInt(point.endTimeNanos) / 1000000;
          const durationMinutes = (endTime - startTime) / (1000 * 60);
          
          totalSleepMinutes += durationMinutes;
          
          // Store sleep segments for detailed analysis
          processedData.sleep.push({
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
            sleepStage: point.value[0].intVal,
            durationMinutes: Math.round(durationMinutes)
          });
        }
      });
      
      // For the most recent day
      if (index === data.bucket.length - 1) {
        processedData.lastSleepMinutes = Math.round(totalSleepMinutes);
      }
      // For comparison
      else if (index === data.bucket.length - 2) {
        prevPeriodData.sleepMinutes = Math.round(totalSleepMinutes);
      }
    }
    
    // Process workout/activity data if available
    const workoutDataset = bucket.dataset.find((d: any) => 
      d.dataSourceId.includes("com.google.activity.segment")
    );
    
    if (workoutDataset && workoutDataset.point && workoutDataset.point.length) {
      workoutDataset.point.forEach((point: any) => {
        if (point.value[0]?.intVal) {
          const startTime = parseInt(point.startTimeNanos) / 1000000;
          const endTime = parseInt(point.endTimeNanos) / 1000000;
          const durationMinutes = (endTime - startTime) / (1000 * 60);
          
          // Store workout segments
          processedData.workout.push({
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
            activityType: point.value[0].intVal,
            durationMinutes: Math.round(durationMinutes)
          });
        }
      });
    }
  });
  
  // Calculate changes
  processedData.stepsChange = prevPeriodData.steps > 0 
    ? Math.round((processedData.lastSteps - prevPeriodData.steps) / prevPeriodData.steps * 100) 
    : 0;
    
  processedData.heartRateChange = prevPeriodData.heartRate > 0 
    ? Math.round((processedData.lastHeartRate - prevPeriodData.heartRate) / prevPeriodData.heartRate * 100) 
    : 0;
    
  processedData.caloriesChange = prevPeriodData.calories > 0 
    ? Math.round((processedData.lastCalories - prevPeriodData.calories) / prevPeriodData.calories * 100) 
    : 0;
    
  processedData.distanceChange = prevPeriodData.distance > 0 
    ? Math.round((processedData.lastDistance - prevPeriodData.distance) / prevPeriodData.distance * 100) 
    : 0;
    
  processedData.sleepChange = prevPeriodData.sleepMinutes > 0 
    ? Math.round((processedData.lastSleepMinutes - prevPeriodData.sleepMinutes) / prevPeriodData.sleepMinutes * 100) 
    : 0;
  
  return processedData;
}

// Function to store processed data in Supabase
async function storeDataInSupabase(userId: string, data: any, supabase: any) {
  const timestamp = new Date();
  
  // Store steps data
  if (data.steps && data.steps.length > 0) {
    for (const stepData of data.steps) {
      await storeMetric(
        supabase,
        userId,
        "steps",
        "google_fit",
        "steps",
        stepData.value,
        new Date(stepData.timestamp),
        { change: data.stepsChange }
      );
    }
  }
  
  // Store heart rate data
  if (data.heartRate && data.heartRate.length > 0) {
    for (const hrData of data.heartRate) {
      await storeMetric(
        supabase,
        userId,
        "heart_rate",
        "google_fit",
        "bpm",
        hrData.value,
        new Date(hrData.timestamp),
        { change: data.heartRateChange }
      );
    }
  }
  
  // Store calories data
  if (data.calories && data.calories.length > 0) {
    for (const calorieData of data.calories) {
      await storeMetric(
        supabase,
        userId,
        "calories",
        "google_fit",
        "kcal",
        calorieData.value,
        new Date(calorieData.timestamp),
        { change: data.caloriesChange }
      );
    }
  }
  
  // Store distance data
  if (data.distance && data.distance.length > 0) {
    for (const distanceData of data.distance) {
      await storeMetric(
        supabase,
        userId,
        "distance",
        "google_fit",
        "km",
        distanceData.value,
        new Date(distanceData.timestamp),
        { change: data.distanceChange }
      );
    }
  }
  
  // Store sleep data
  if (data.sleep && data.sleep.length > 0) {
    for (const sleepData of data.sleep) {
      await storeMetric(
        supabase,
        userId,
        "sleep",
        "google_fit",
        "min",
        sleepData.durationMinutes,
        new Date(sleepData.startTime),
        new Date(sleepData.endTime),
        { 
          sleepStage: sleepData.sleepStage,
          change: data.sleepChange
        }
      );
    }
  }
  
  // Store workout data
  if (data.workout && data.workout.length > 0) {
    for (const workoutData of data.workout) {
      await storeMetric(
        supabase,
        userId,
        "workout",
        "google_fit",
        "min",
        workoutData.durationMinutes,
        new Date(workoutData.startTime),
        new Date(workoutData.endTime),
        { activityType: workoutData.activityType }
      );
    }
  }
  
  // Update last_sync time in fitness_connections
  const { error } = await supabase
    .from("fitness_connections")
    .update({ last_sync: timestamp.toISOString() })
    .eq("user_id", userId)
    .eq("provider", "google_fit");
    
  if (error) {
    console.error("Error updating last_sync time:", error);
  }
}

// Helper function to store a metric in the database
async function storeMetric(
  supabase: any,
  userId: string,
  dataType: string,
  source: string,
  unit: string,
  value: number,
  startTime: Date,
  endTimeOrMetadata: Date | object = new Date(),
  metadata: object = {}
) {
  try {
    let endTime: Date;
    let metadataObj: object;
    
    if (endTimeOrMetadata instanceof Date) {
      endTime = endTimeOrMetadata;
      metadataObj = metadata;
    } else {
      endTime = startTime; // Use start time as end time if not provided
      metadataObj = endTimeOrMetadata;
    }
    
    // Check if this exact data point already exists to avoid duplicates
    const { data: existingData, error: checkError } = await supabase
      .from("fitness_data")
      .select("id")
      .eq("user_id", userId)
      .eq("data_type", dataType)
      .eq("source", source)
      .eq("value", value)
      .eq("start_time", startTime.toISOString())
      .eq("end_time", endTime.toISOString())
      .limit(1);
      
    if (checkError) {
      console.error(`Error checking for existing ${dataType} data:`, checkError);
      return;
    }
    
    // Skip if data already exists
    if (existingData && existingData.length > 0) {
      return;
    }
    
    // Insert the new data point
    const { error } = await supabase
      .from("fitness_data")
      .insert({
        user_id: userId,
        data_type: dataType,
        source: source,
        unit: unit,
        value: value,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        metadata: metadataObj
      });
      
    if (error) {
      console.error(`Error storing ${dataType} data:`, error);
    }
  } catch (err) {
    console.error(`Exception storing ${dataType} data:`, err);
  }
}

// Function to refresh Google Fit token
async function refreshGoogleFitToken(userId: string, supabase: any) {
  try {
    // Get current connection with refresh token
    const { data: connections, error } = await supabase
      .from("fitness_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("provider", "google_fit");
      
    if (error || !connections || connections.length === 0 || !connections[0].refresh_token) {
      console.error("Error fetching refresh token:", error);
      return { success: false };
    }
    
    const connection = connections[0];
    const refreshToken = connection.refresh_token;
    
    // Refresh the token
    const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
    const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
    
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
      }),
    });
    
    if (!response.ok) {
      console.error("Error refreshing token:", await response.text());
      return { success: false };
    }
    
    const tokenData = await response.json();
    
    // Update the token in database
    const { error: updateError } = await supabase
      .from("fitness_connections")
      .update({
        access_token: tokenData.access_token,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      })
      .eq("user_id", userId)
      .eq("provider", "google_fit");
      
    if (updateError) {
      console.error("Error updating token:", updateError);
      return { success: false };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in refreshGoogleFitToken:", error);
    return { success: false };
  }
}
