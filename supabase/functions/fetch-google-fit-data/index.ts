
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Google OAuth configuration
const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const requestData = await req.json();
    const { userId, accessToken, timeRange = "week", metricTypes = ["steps", "heart_rate", "calories"] } = requestData;

    if (!userId || !accessToken) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Fetching Google Fit data for user ${userId}, timeRange: ${timeRange}`);

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate time range
    const endTime = new Date();
    let startTime = new Date();
    
    switch (timeRange) {
      case "day":
        startTime.setDate(startTime.getDate() - 1);
        break;
      case "week":
        startTime.setDate(startTime.getDate() - 7);
        break;
      case "month":
        startTime.setMonth(startTime.getMonth() - 1);
        break;
      case "year":
        startTime.setFullYear(startTime.getFullYear() - 1);
        break;
      default:
        startTime.setDate(startTime.getDate() - 7); // Default to 1 week
    }

    // Format times for Google Fit API (nanoseconds since epoch)
    const startTimeNs = startTime.getTime() * 1000000;
    const endTimeNs = endTime.getTime() * 1000000;

    // Fetch data from Google Fit
    const fitnessData = {
      steps: [],
      heart_rate: [],
      calories: [],
      distance: [],
      sleep: [],
      workout: []
    };

    // Check which metrics to fetch
    const fetchSteps = metricTypes.includes("steps");
    const fetchHeartRate = metricTypes.includes("heart_rate");
    const fetchCalories = metricTypes.includes("calories");
    const fetchDistance = metricTypes.includes("distance");
    const fetchSleep = metricTypes.includes("sleep");
    const fetchWorkout = metricTypes.includes("workout");

    // Helper function to refresh token if expired
    async function refreshTokenIfNeeded() {
      const { data: connections, error } = await supabase
        .from("fitness_connections")
        .select("*")
        .eq("user_id", userId)
        .eq("provider", "google_fit")
        .single();

      if (error || !connections) {
        console.error("Error fetching connection:", error);
        return { success: false, error: "Connection not found" };
      }

      const expiresAt = new Date(connections.expires_at);
      if (expiresAt > new Date()) {
        return { success: true }; // Token still valid
      }

      console.log("Token expired, refreshing...");

      try {
        const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID || "",
            client_secret: GOOGLE_CLIENT_SECRET || "",
            refresh_token: connections.refresh_token,
            grant_type: "refresh_token",
          }),
        });

        const refreshData = await refreshResponse.json();

        if (!refreshResponse.ok) {
          console.error("Error refreshing token:", refreshData);
          return { success: false, error: "Error refreshing token" };
        }

        // Update token in database
        const { error: updateError } = await supabase
          .from("fitness_connections")
          .update({
            access_token: refreshData.access_token,
            expires_at: new Date(Date.now() + refreshData.expires_in * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)
          .eq("provider", "google_fit");

        if (updateError) {
          console.error("Error updating token:", updateError);
          return { success: false, error: "Error updating token" };
        }

        return { 
          success: true, 
          accessToken: refreshData.access_token,
          refreshed: true
        };
      } catch (error) {
        console.error("Error in token refresh:", error);
        return { success: false, error: "Error in token refresh" };
      }
    }

    // Fetch and process data
    async function fetchGoogleFitData() {
      try {
        // Check if token needs refreshing
        const refreshResult = await refreshTokenIfNeeded();
        
        if (!refreshResult.success) {
          return new Response(
            JSON.stringify({ error: refreshResult.error }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Use refreshed token if available
        const currentToken = refreshResult.accessToken || accessToken;

        // Construct dataset request for each data type
        if (fetchSteps) {
          const stepsRequest = {
            aggregateBy: [{
              dataTypeName: "com.google.step_count.delta",
              dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
            }],
            bucketByTime: { durationMillis: 86400000 }, // 1 day
            startTimeMillis: startTime.getTime(),
            endTimeMillis: endTime.getTime()
          };

          const stepsResponse = await fetch(
            "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${currentToken}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify(stepsRequest)
            }
          );

          const stepsData = await stepsResponse.json();
          console.log("Steps data received:", stepsData.bucket ? stepsData.bucket.length : 0, "buckets");

          if (stepsResponse.ok && stepsData.bucket) {
            for (const bucket of stepsData.bucket) {
              const startTimeMillis = parseInt(bucket.startTimeMillis);
              const endTimeMillis = parseInt(bucket.endTimeMillis);
              const bucketDate = new Date(startTimeMillis);
              
              if (bucket.dataset && bucket.dataset[0].point) {
                let dailySteps = 0;
                
                for (const point of bucket.dataset[0].point) {
                  if (point.value && point.value[0] && point.value[0].intVal) {
                    dailySteps += point.value[0].intVal;
                  }
                }
                
                fitnessData.steps.push({
                  date: bucketDate.toISOString().split('T')[0],
                  value: dailySteps,
                  startTime: new Date(startTimeMillis).toISOString(),
                  endTime: new Date(endTimeMillis).toISOString()
                });
                
                // Save to database
                await supabase.from("fitness_data").insert({
                  user_id: userId,
                  data_type: "steps",
                  source: "google_fit",
                  value: dailySteps,
                  unit: "steps",
                  start_time: new Date(startTimeMillis).toISOString(),
                  end_time: new Date(endTimeMillis).toISOString(),
                  metadata: { date: bucketDate.toISOString().split('T')[0] }
                });
              }
            }
          }
        }

        // Fetch heart rate data
        if (fetchHeartRate) {
          const heartRateRequest = {
            aggregateBy: [{
              dataTypeName: "com.google.heart_rate.bpm",
              dataSourceId: "derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm"
            }],
            bucketByTime: { durationMillis: 86400000 }, // 1 day
            startTimeMillis: startTime.getTime(),
            endTimeMillis: endTime.getTime()
          };

          const heartRateResponse = await fetch(
            "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${currentToken}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify(heartRateRequest)
            }
          );

          const heartRateData = await heartRateResponse.json();
          console.log("Heart rate data received:", heartRateData.bucket ? heartRateData.bucket.length : 0, "buckets");

          if (heartRateResponse.ok && heartRateData.bucket) {
            for (const bucket of heartRateData.bucket) {
              const startTimeMillis = parseInt(bucket.startTimeMillis);
              const endTimeMillis = parseInt(bucket.endTimeMillis);
              const bucketDate = new Date(startTimeMillis);
              
              if (bucket.dataset && bucket.dataset[0].point && bucket.dataset[0].point.length > 0) {
                let sum = 0;
                let count = 0;
                let min = Infinity;
                let max = -Infinity;
                
                for (const point of bucket.dataset[0].point) {
                  if (point.value && point.value[0] && point.value[0].fpVal) {
                    const value = point.value[0].fpVal;
                    sum += value;
                    count++;
                    min = Math.min(min, value);
                    max = Math.max(max, value);
                  }
                }
                
                if (count > 0) {
                  const avgHeartRate = sum / count;
                  
                  fitnessData.heart_rate.push({
                    date: bucketDate.toISOString().split('T')[0],
                    value: Math.round(avgHeartRate),
                    min: Math.round(min),
                    max: Math.round(max),
                    startTime: new Date(startTimeMillis).toISOString(),
                    endTime: new Date(endTimeMillis).toISOString()
                  });
                  
                  // Save to database
                  await supabase.from("fitness_data").insert({
                    user_id: userId,
                    data_type: "heart_rate",
                    source: "google_fit",
                    value: Math.round(avgHeartRate),
                    unit: "bpm",
                    start_time: new Date(startTimeMillis).toISOString(),
                    end_time: new Date(endTimeMillis).toISOString(),
                    metadata: { 
                      date: bucketDate.toISOString().split('T')[0],
                      min: Math.round(min),
                      max: Math.round(max)
                    }
                  });
                }
              }
            }
          }
        }

        // Fetch calories data
        if (fetchCalories) {
          const caloriesRequest = {
            aggregateBy: [{
              dataTypeName: "com.google.calories.expended",
              dataSourceId: "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended"
            }],
            bucketByTime: { durationMillis: 86400000 }, // 1 day
            startTimeMillis: startTime.getTime(),
            endTimeMillis: endTime.getTime()
          };

          const caloriesResponse = await fetch(
            "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${currentToken}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify(caloriesRequest)
            }
          );

          const caloriesData = await caloriesResponse.json();
          console.log("Calories data received:", caloriesData.bucket ? caloriesData.bucket.length : 0, "buckets");

          if (caloriesResponse.ok && caloriesData.bucket) {
            for (const bucket of caloriesData.bucket) {
              const startTimeMillis = parseInt(bucket.startTimeMillis);
              const endTimeMillis = parseInt(bucket.endTimeMillis);
              const bucketDate = new Date(startTimeMillis);
              
              if (bucket.dataset && bucket.dataset[0].point) {
                let dailyCalories = 0;
                
                for (const point of bucket.dataset[0].point) {
                  if (point.value && point.value[0] && point.value[0].fpVal) {
                    dailyCalories += point.value[0].fpVal;
                  }
                }
                
                fitnessData.calories.push({
                  date: bucketDate.toISOString().split('T')[0],
                  value: Math.round(dailyCalories),
                  startTime: new Date(startTimeMillis).toISOString(),
                  endTime: new Date(endTimeMillis).toISOString()
                });
                
                // Save to database
                await supabase.from("fitness_data").insert({
                  user_id: userId,
                  data_type: "calories",
                  source: "google_fit",
                  value: Math.round(dailyCalories),
                  unit: "kcal",
                  start_time: new Date(startTimeMillis).toISOString(),
                  end_time: new Date(endTimeMillis).toISOString(),
                  metadata: { date: bucketDate.toISOString().split('T')[0] }
                });
              }
            }
          }
        }

        // Update last sync time in fitness_connections
        await supabase
          .from("fitness_connections")
          .update({ last_sync: new Date().toISOString() })
          .eq("user_id", userId)
          .eq("provider", "google_fit");

        // Return the fitness data to the client
        return new Response(
          JSON.stringify({ 
            success: true, 
            refreshed: refreshResult.refreshed || false,
            data: fitnessData 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Error fetching Google Fit data:", error);
        return new Response(
          JSON.stringify({ error: "Error fetching Google Fit data", details: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return await fetchGoogleFitData();
  } catch (error) {
    console.error("Unexpected error in fetch-google-fit-data:", error);
    return new Response(
      JSON.stringify({ error: "Unexpected server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
