
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Supabase client setup with service role
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Constants for Google Fit API
const GOOGLE_FIT_API_BASE = "https://www.googleapis.com/fitness/v1/users/me";
const TOKEN_REFRESH_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { userId, accessToken, timeRange = "week", metricTypes = ["steps", "heart_rate", "calories", "distance"] } = await req.json();

    if (!userId || !accessToken) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log the request for debugging
    console.log(`Fetching Google Fit data for user ${userId}, timeRange: ${timeRange}, metrics: ${metricTypes.join(", ")}`);

    // Verify and refresh the token if needed
    const tokenStatus = await verifyAccessToken(accessToken);
    if (!tokenStatus.valid) {
      console.log("Access token is invalid, attempting to refresh...");
      
      // Get the refresh token from the database
      const { data: connectionData, error: connectionError } = await supabase
        .from("fitness_connections")
        .select("refresh_token")
        .eq("user_id", userId)
        .eq("provider", "google_fit")
        .single();

      if (connectionError || !connectionData?.refresh_token) {
        console.error("Failed to get refresh token:", connectionError);
        return new Response(
          JSON.stringify({ error: "Failed to refresh access token", details: connectionError }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Attempt to refresh the token
      const refreshResult = await refreshAccessToken(connectionData.refresh_token);
      if (!refreshResult.success) {
        return new Response(
          JSON.stringify({ error: "Token refresh failed", details: refreshResult.error }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update the token in the database
      const { error: updateError } = await supabase
        .from("fitness_connections")
        .update({
          access_token: refreshResult.accessToken,
          refresh_token: refreshResult.refreshToken || connectionData.refresh_token,
          expires_at: new Date(Date.now() + refreshResult.expiresIn * 1000).toISOString()
        })
        .eq("user_id", userId)
        .eq("provider", "google_fit");

      if (updateError) {
        console.error("Failed to update tokens:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update tokens", details: updateError }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Return a response indicating the token was refreshed
      return new Response(
        JSON.stringify({ refreshed: true, message: "Token refreshed, please retry the request" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate time boundaries based on timeRange
    const { startTimeMillis, endTimeMillis } = calculateTimeRange(timeRange);

    // Fetch data from Google Fit API with parallel requests for each metric type
    const fetchPromises = metricTypes.map(async (metricType) => {
      try {
        const data = await fetchGoogleFitData(accessToken, metricType, startTimeMillis, endTimeMillis);
        return { metricType, data, error: null };
      } catch (error) {
        console.error(`Error fetching ${metricType} data:`, error);
        return { metricType, data: null, error: error.message };
      }
    });

    // Wait for all fetch promises to resolve
    const results = await Promise.all(fetchPromises);

    // Process and save the collected data
    const successfulResults = results.filter(result => result.data !== null);
    if (successfulResults.length === 0) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch any data from Google Fit", details: results.map(r => r.error).filter(Boolean) }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process and save each metric type
    for (const { metricType, data } of successfulResults) {
      if (!data) continue;
      
      // Process the data based on metric type
      const processedData = processGoogleFitData(data, metricType);
      if (!processedData) continue;
      
      // Store processed data in Supabase
      await storeHealthMetric(supabase, userId, metricType, processedData);
    }

    // Update last sync time
    await supabase
      .from("fitness_connections")
      .update({ last_sync: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("provider", "google_fit");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Data synchronized successfully",
        metricsFetched: successfulResults.map(r => r.metricType),
        syncTime: new Date().toISOString(),
        timeRange: { startTimeMillis, endTimeMillis }
      }),
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

// Verify if the access token is still valid
async function verifyAccessToken(accessToken) {
  try {
    const response = await fetch(`${GOOGLE_FIT_API_BASE}/dataSources`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return { valid: response.ok };
  } catch (error) {
    console.error("Error verifying access token:", error);
    return { valid: false };
  }
}

// Refresh the access token using the refresh token
async function refreshAccessToken(refreshToken) {
  try {
    const response = await fetch(TOKEN_REFRESH_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Token refresh failed:", errorData);
      return { success: false, error: errorData };
    }

    const data = await response.json();
    return {
      success: true,
      accessToken: data.access_token,
      refreshToken: data.refresh_token, // Might be undefined if Google didn't send a new refresh token
      expiresIn: data.expires_in
    };
  } catch (error) {
    console.error("Error refreshing token:", error);
    return { success: false, error: error.message };
  }
}

// Calculate time range boundaries based on specified time range
function calculateTimeRange(timeRange) {
  const now = new Date();
  const endTimeMillis = now.getTime();
  let startTimeMillis;

  switch (timeRange) {
    case "day":
      startTimeMillis = endTimeMillis - (24 * 60 * 60 * 1000); // 1 day
      break;
    case "week":
      startTimeMillis = endTimeMillis - (7 * 24 * 60 * 60 * 1000); // 7 days
      break;
    case "month":
      startTimeMillis = endTimeMillis - (30 * 24 * 60 * 60 * 1000); // 30 days
      break;
    case "year":
      startTimeMillis = endTimeMillis - (365 * 24 * 60 * 60 * 1000); // 365 days
      break;
    default:
      startTimeMillis = endTimeMillis - (7 * 24 * 60 * 60 * 1000); // Default to 7 days
  }

  return { startTimeMillis, endTimeMillis };
}

// Fetch data from Google Fit API for a specific metric type
async function fetchGoogleFitData(accessToken, metricType, startTimeMillis, endTimeMillis) {
  const dataSourceId = getDataSourceForMetricType(metricType);
  if (!dataSourceId) {
    throw new Error(`Unsupported metric type: ${metricType}`);
  }

  // Construct the appropriate URL and request parameters based on metric type
  let url, body;

  if (["steps", "calories", "distance"].includes(metricType)) {
    // For aggregated data like steps, calories, and distance
    url = `${GOOGLE_FIT_API_BASE}/dataset:aggregate`;
    body = {
      aggregateBy: [{ dataTypeName: dataSourceId }],
      bucketByTime: { durationMillis: 86400000 }, // 1 day per bucket
      startTimeMillis,
      endTimeMillis
    };
  } else if (metricType === "heart_rate") {
    // For heart rate data
    url = `${GOOGLE_FIT_API_BASE}/dataset:aggregate`;
    body = {
      aggregateBy: [{ dataTypeName: "com.google.heart_rate.bpm" }],
      bucketByTime: { durationMillis: 86400000 }, // 1 day per bucket
      startTimeMillis,
      endTimeMillis
    };
  } else if (metricType === "sleep") {
    // For sleep data
    url = `${GOOGLE_FIT_API_BASE}/sessions`;
    const params = new URLSearchParams({
      startTime: new Date(startTimeMillis).toISOString(),
      endTime: new Date(endTimeMillis).toISOString(),
      activityType: "72" // 72 is for sleep
    });
    url = `${url}?${params.toString()}`;
    body = null;
  } else if (metricType === "workout") {
    // For workout/activity data
    url = `${GOOGLE_FIT_API_BASE}/sessions`;
    const params = new URLSearchParams({
      startTime: new Date(startTimeMillis).toISOString(),
      endTime: new Date(endTimeMillis).toISOString()
    });
    url = `${url}?${params.toString()}`;
    body = null;
  }

  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch ${metricType} data: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}

// Get data source ID for a specific metric type
function getDataSourceForMetricType(metricType) {
  switch (metricType) {
    case "steps":
      return "com.google.step_count.delta";
    case "heart_rate":
      return "com.google.heart_rate.bpm";
    case "calories":
      return "com.google.calories.expended";
    case "distance":
      return "com.google.distance.delta";
    case "sleep":
    case "workout":
      return null; // These use the sessions API, not specific data sources
    default:
      return null;
  }
}

// Process Google Fit data based on metric type
function processGoogleFitData(data, metricType) {
  try {
    if (!data) return null;

    switch (metricType) {
      case "steps":
      case "calories":
      case "distance":
      case "heart_rate":
        return processAggregatedData(data, metricType);
      case "sleep":
        return processSleepData(data);
      case "workout":
        return processWorkoutData(data);
      default:
        console.error(`Unsupported metric type: ${metricType}`);
        return null;
    }
  } catch (error) {
    console.error(`Error processing ${metricType} data:`, error);
    return null;
  }
}

// Process aggregated data (steps, calories, distance, heart rate)
function processAggregatedData(data, metricType) {
  if (!data.bucket || data.bucket.length === 0) {
    return null;
  }

  // Extract relevant field names based on metric type
  let fieldName, unit;
  switch (metricType) {
    case "steps":
      fieldName = "steps";
      unit = "count";
      break;
    case "calories":
      fieldName = "calories";
      unit = "kcal";
      break;
    case "distance":
      fieldName = "distance";
      unit = "m";
      break;
    case "heart_rate":
      fieldName = "bpm";
      unit = "bpm";
      break;
  }

  // Extract and format the data points
  const processedData = data.bucket.map(bucket => {
    let value = 0;
    
    if (bucket.dataset && bucket.dataset.length > 0) {
      bucket.dataset.forEach(dataset => {
        if (dataset.point && dataset.point.length > 0) {
          dataset.point.forEach(point => {
            if (point.value && point.value.length > 0) {
              if (metricType === "heart_rate") {
                // For heart rate, we average the readings
                const readings = point.value.filter(v => v.fpVal !== undefined);
                if (readings.length > 0) {
                  value = readings.reduce((sum, v) => sum + v.fpVal, 0) / readings.length;
                }
              } else {
                // For other metrics, we sum the values
                point.value.forEach(val => {
                  if (val.intVal !== undefined) {
                    value += val.intVal;
                  } else if (val.fpVal !== undefined) {
                    value += val.fpVal;
                  }
                });
              }
            }
          });
        }
      });
    }

    return {
      timestamp: new Date(parseInt(bucket.startTimeMillis)).toISOString(),
      value: metricType === "heart_rate" ? Math.round(value) : value,
      unit
    };
  });

  return processedData;
}

// Process sleep data
function processSleepData(data) {
  if (!data.session || data.session.length === 0) {
    return null;
  }

  const sleepSessions = data.session.filter(session => session.activityType === 72); // 72 is for sleep
  
  return sleepSessions.map(session => {
    const startTime = new Date(session.startTimeMillis);
    const endTime = new Date(session.endTimeMillis);
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (60 * 1000);
    
    return {
      timestamp: startTime.toISOString(),
      value: durationMinutes,
      unit: "minutes",
      metadata: {
        endTime: endTime.toISOString(),
        name: session.name,
        description: session.description
      }
    };
  });
}

// Process workout/activity data
function processWorkoutData(data) {
  if (!data.session || data.session.length === 0) {
    return null;
  }

  const workoutSessions = data.session.filter(session => session.activityType !== 72); // Exclude sleep
  
  return workoutSessions.map(session => {
    const startTime = new Date(session.startTimeMillis);
    const endTime = new Date(session.endTimeMillis);
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (60 * 1000);
    
    return {
      timestamp: startTime.toISOString(),
      value: durationMinutes,
      unit: "minutes",
      metadata: {
        endTime: endTime.toISOString(),
        activityType: session.activityType,
        name: session.name,
        description: session.description
      }
    };
  });
}

// Store health metric in Supabase
async function storeHealthMetric(supabase, userId, metricType, data) {
  if (!data || data.length === 0) {
    console.log(`No data to store for ${metricType}`);
    return;
  }

  try {
    // Convert metric type to the database format
    const dbMetricType = metricType.replace(/-/g, '_');
    
    // Prepare data for insertion
    const records = data.map(item => ({
      user_id: userId,
      metric_type: dbMetricType,
      timestamp: item.timestamp,
      value: typeof item.value === 'number' ? item.value : 0,
      unit: item.unit,
      source: 'google_fit',
      metadata: item.metadata || {}
    }));
    
    // Insert data using upsert to avoid duplicates
    const { error } = await supabase
      .from('health_metrics')
      .upsert(records, { 
        onConflict: 'user_id, metric_type, timestamp',
        ignoreDuplicates: false
      });
    
    if (error) {
      console.error(`Error storing ${metricType} data:`, error);
      throw error;
    }
    
    console.log(`Successfully stored ${records.length} ${metricType} records for user ${userId}`);
  } catch (error) {
    console.error(`Error in storeHealthMetric for ${metricType}:`, error);
    throw error;
  }
}
