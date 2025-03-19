
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
    const { userId, accessToken } = await req.json();

    if (!userId || !accessToken) {
      return new Response(
        JSON.stringify({ error: "Missing userId or accessToken" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate time range (last 7 days)
    const endTime = new Date();
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - 7);

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
          aggregateBy: [
            { dataTypeName: "com.google.step_count.delta" },
            { dataTypeName: "com.google.heart_rate.bpm" },
            { dataTypeName: "com.google.calories.expended" },
          ],
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
    
    // Process data
    const processedData = processGoogleFitData(fitData);
    
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

// Function to process Google Fit data
function processGoogleFitData(data: any) {
  let steps = 0;
  let heartRate = 0;
  let calories = 0;
  let heartRateCount = 0;
  
  // Previous values for change calculation
  let prevSteps = 8000; // Default previous values
  let prevHeartRate = 75;
  let prevCalories = 1200;
  
  if (data.bucket && data.bucket.length > 0) {
    // Get the most recent day's data
    const recentBucket = data.bucket[data.bucket.length - 1];
    
    // Process step count
    const stepsDataset = recentBucket.dataset.find((d: any) => 
      d.dataSourceId.includes("com.google.step_count.delta")
    );
    if (stepsDataset && stepsDataset.point && stepsDataset.point.length > 0) {
      steps = stepsDataset.point.reduce((total: number, point: any) => {
        return total + (point.value[0]?.intVal || 0);
      }, 0);
    }
    
    // Process heart rate
    const heartRateDataset = recentBucket.dataset.find((d: any) => 
      d.dataSourceId.includes("com.google.heart_rate.bpm")
    );
    if (heartRateDataset && heartRateDataset.point && heartRateDataset.point.length > 0) {
      heartRateDataset.point.forEach((point: any) => {
        if (point.value[0]?.fpVal) {
          heartRate += point.value[0].fpVal;
          heartRateCount++;
        }
      });
      if (heartRateCount > 0) {
        heartRate = Math.round(heartRate / heartRateCount);
      }
    }
    
    // Process calories
    const caloriesDataset = recentBucket.dataset.find((d: any) => 
      d.dataSourceId.includes("com.google.calories.expended")
    );
    if (caloriesDataset && caloriesDataset.point && caloriesDataset.point.length > 0) {
      calories = caloriesDataset.point.reduce((total: number, point: any) => {
        return total + (point.value[0]?.fpVal || 0);
      }, 0);
      calories = Math.round(calories);
    }
    
    // Get data from previous period for comparison
    if (data.bucket.length > 1) {
      const previousBucket = data.bucket[data.bucket.length - 2];
      
      // Previous steps
      const prevStepsDataset = previousBucket.dataset.find((d: any) => 
        d.dataSourceId.includes("com.google.step_count.delta")
      );
      if (prevStepsDataset && prevStepsDataset.point && prevStepsDataset.point.length > 0) {
        prevSteps = prevStepsDataset.point.reduce((total: number, point: any) => {
          return total + (point.value[0]?.intVal || 0);
        }, 0);
      }
      
      // Previous heart rate
      let prevHeartRateTotal = 0;
      let prevHeartRateCount = 0;
      const prevHeartRateDataset = previousBucket.dataset.find((d: any) => 
        d.dataSourceId.includes("com.google.heart_rate.bpm")
      );
      if (prevHeartRateDataset && prevHeartRateDataset.point && prevHeartRateDataset.point.length > 0) {
        prevHeartRateDataset.point.forEach((point: any) => {
          if (point.value[0]?.fpVal) {
            prevHeartRateTotal += point.value[0].fpVal;
            prevHeartRateCount++;
          }
        });
        if (prevHeartRateCount > 0) {
          prevHeartRate = Math.round(prevHeartRateTotal / prevHeartRateCount);
        }
      }
      
      // Previous calories
      const prevCaloriesDataset = previousBucket.dataset.find((d: any) => 
        d.dataSourceId.includes("com.google.calories.expended")
      );
      if (prevCaloriesDataset && prevCaloriesDataset.point && prevCaloriesDataset.point.length > 0) {
        prevCalories = prevCaloriesDataset.point.reduce((total: number, point: any) => {
          return total + (point.value[0]?.fpVal || 0);
        }, 0);
        prevCalories = Math.round(prevCalories);
      }
    }
  }
  
  // Calculate percent changes
  const stepsChange = prevSteps > 0 ? Math.round((steps - prevSteps) / prevSteps * 100) : 0;
  const heartRateChange = prevHeartRate > 0 ? Math.round((heartRate - prevHeartRate) / prevHeartRate * 100) : 0;
  const caloriesChange = prevCalories > 0 ? Math.round((calories - prevCalories) / prevCalories * 100) : 0;
  
  return {
    steps,
    heartRate,
    calories,
    stepsChange,
    heartRateChange,
    caloriesChange
  };
}

// Function to store processed data in Supabase
async function storeDataInSupabase(userId: string, data: any, supabase: any) {
  const timestamp = new Date();
  const metrics = [
    {
      user_id: userId,
      data_type: "steps",
      source: "google_fit",
      unit: "steps",
      value: data.steps,
      start_time: timestamp.toISOString(),
      end_time: timestamp.toISOString(),
      metadata: { change: data.stepsChange }
    },
    {
      user_id: userId,
      data_type: "heart_rate",
      source: "google_fit",
      unit: "bpm",
      value: data.heartRate,
      start_time: timestamp.toISOString(),
      end_time: timestamp.toISOString(),
      metadata: { change: data.heartRateChange }
    },
    {
      user_id: userId,
      data_type: "calories",
      source: "google_fit",
      unit: "kcal",
      value: data.calories,
      start_time: timestamp.toISOString(),
      end_time: timestamp.toISOString(),
      metadata: { change: data.caloriesChange }
    }
  ];
  
  // Insert metrics into fitness_data table
  for (const metric of metrics) {
    const { error } = await supabase.from("fitness_data").insert(metric);
    if (error) {
      console.error(`Error storing ${metric.data_type} data:`, error);
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
