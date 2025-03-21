
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Google OAuth configuration
const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
const REDIRECT_URI = Deno.env.get("SUPABASE_URL") ? 
  `${Deno.env.get("SUPABASE_URL")}/functions/v1/google-fit-callback` : 
  "http://localhost:54321/functions/v1/google-fit-callback";

// Frontend URL for redirecting back
const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "http://localhost:5173";

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Google Fit callback function invoked");
    
    // Get authorization code and state from query params
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");
    
    // Log important debug information
    console.log(`Callback received. Code exists: ${!!code}, State: ${state}, Error: ${error || 'none'}`);

    // Handle error from Google
    if (error) {
      console.error(`Error from Google: ${error}`);
      return redirectToFrontend(`Error from Google: ${error}`, true);
    }

    // Check for required params
    if (!code || !state) {
      console.error("Missing required parameters");
      return redirectToFrontend("Missing required parameters", true);
    }

    // Extract user ID from state
    // State format: google_fit_USER_ID
    const userId = state.startsWith("google_fit_") ? 
      state.substring("google_fit_".length) : 
      null;

    if (!userId) {
      console.error("Invalid state parameter, could not extract user ID");
      return redirectToFrontend("Invalid state parameter", true);
    }

    console.log(`Processing Google Fit callback for user: ${userId}`);

    // Check for required credentials
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error("Missing Google API credentials");
      return redirectToFrontend("Google API credentials not configured", true);
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Failed to exchange authorization code for tokens:", tokenData);
      return redirectToFrontend(`Failed to exchange authorization code: ${tokenData.error}`, true);
    }

    console.log("Successfully obtained access token and refresh token");

    // Create a Supabase client with service role to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Store tokens in fitness_connections table
    const { data: connectionData, error: connectionError } = await supabase
      .from("fitness_connections")
      .upsert(
        {
          user_id: userId,
          provider: "google_fit",
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString(),
          last_sync: new Date().toISOString(),
          is_connected: true,
        },
        { onConflict: "user_id,provider" }
      )
      .select("id");

    if (connectionError) {
      console.error("Error storing connection:", connectionError);
      
      // For demo users, we'll simulate success even if DB storage fails
      if (userId.startsWith("demo-")) {
        console.log("Demo user detected, simulating successful connection");
        return redirectToFrontend("Google Fit connected successfully", false);
      }
      
      return redirectToFrontend("Failed to store connection data", true);
    }

    console.log(`Connection stored successfully: ${connectionData?.[0]?.id}`);

    // Redirect back to the frontend with success
    return redirectToFrontend("Google Fit connected successfully", false);
  } catch (error) {
    console.error("Error in google-fit-callback function:", error);
    return redirectToFrontend(`Error processing callback: ${error.message}`, true);
  }

  // Helper function to redirect back to frontend with message
  function redirectToFrontend(message: string, isError = false) {
    const redirectUrl = new URL(`${FRONTEND_URL}/health-apps`);
    
    if (isError) {
      redirectUrl.searchParams.append("error", encodeURIComponent(message));
    } else {
      redirectUrl.searchParams.append("connected", "true");
      redirectUrl.searchParams.append("message", encodeURIComponent(message));
    }

    console.log(`Redirecting to frontend: ${redirectUrl.toString()}`);
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: redirectUrl.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache"
      },
    });
  }
});
