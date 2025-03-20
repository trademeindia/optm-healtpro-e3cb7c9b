
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

// Google Fit scopes
const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/fitness.location.read",
  "https://www.googleapis.com/auth/fitness.sleep.read",
].join(" ");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get user ID from query params
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing userId parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing Google Fit connection for user: ${userId}`);

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error("Missing Google API credentials");
      return new Response(
        JSON.stringify({ error: "Google API credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Store the state in a format we can identify later
    const state = `google_fit_${userId}`;
    
    console.log(`Generating OAuth URL with state: ${state}`);
    console.log(`Redirect URI: ${REDIRECT_URI}`);

    // Generate the Google OAuth URL
    const authUrl = new URL("https://accounts.google.com/o/oauth2/auth");
    authUrl.searchParams.append("client_id", GOOGLE_CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", SCOPES);
    authUrl.searchParams.append("access_type", "offline");
    authUrl.searchParams.append("prompt", "consent");
    authUrl.searchParams.append("state", state); // Pass userId in state parameter

    console.log(`Redirecting to Google OAuth: ${authUrl.toString()}`);

    // Redirect to Google OAuth
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: authUrl.toString(),
      },
    });
  } catch (error) {
    console.error("Error in connect-google-fit function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
