
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
const REDIRECT_URI = Deno.env.get("SUPABASE_URL") ? 
  `${Deno.env.get("SUPABASE_URL")}/functions/v1/google-fit-callback` : 
  "http://localhost:54321/functions/v1/google-fit-callback";

// Frontend URL for redirecting after OAuth
const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "http://localhost:5173";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state"); // Contains userId
    const error = url.searchParams.get("error");

    if (error) {
      return redirectWithError(`Google OAuth error: ${error}`);
    }

    if (!code || !state) {
      return redirectWithError("Missing code or state parameter");
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      return redirectWithError(`Error exchanging code for tokens: ${JSON.stringify(errorData)}`);
    }

    const tokenData = await tokenResponse.json();

    // Store tokens in Supabase
    const userId = state; // The userId is passed in the state parameter
    const { error: upsertError } = await supabase
      .from("fitness_connections")
      .upsert({
        user_id: userId,
        provider: "google_fit",
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        scope: tokenData.scope,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        last_sync: new Date().toISOString(),
      });

    if (upsertError) {
      return redirectWithError(`Error storing tokens: ${upsertError.message}`);
    }

    // Redirect to health apps page with success message
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: `${FRONTEND_URL}/health-apps?connected=true`,
      },
    });
  } catch (error) {
    console.error("Error in google-fit-callback function:", error);
    return redirectWithError(`Server error: ${error.message}`);
  }

  function redirectWithError(errorMessage: string) {
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: `${FRONTEND_URL}/health-apps?error=${encodeURIComponent(errorMessage)}`,
      },
    });
  }
});
