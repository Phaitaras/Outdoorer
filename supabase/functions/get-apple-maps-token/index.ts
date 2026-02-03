import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// token cache with expiry tracking
let cachedToken: string | null = null;
let cachedTokenExpiryMs = 0;

const TOKEN_LIFETIME_SECONDS = 30 * 60; // JWT lifetime
const APPLE_MAPS_TOKEN_URL = "https://maps-api.apple.com/v1/token";

async function createAppleMapsJWT(): Promise<string> {
  const nowSeconds = Math.floor(Date.now() / 1000);

  const teamId = Deno.env.get("APPLE_TEAM_ID");
  const keyId = Deno.env.get("APPLE_KEY_ID");
  const privateKeyPem = Deno.env.get("APPLE_MAPS_PRIVATE_KEY");

  if (!teamId || !keyId || !privateKeyPem) {
    throw new Error("Missing Apple Maps credentials in environment");
  }

  const privateKey = await jose.importPKCS8(privateKeyPem, "ES256");

  const payload: jose.JWTPayload = {
    iss: teamId,
    iat: nowSeconds,
    exp: nowSeconds + TOKEN_LIFETIME_SECONDS,
  };

  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "ES256", kid: keyId, typ: "JWT" })
    .sign(privateKey);
}

async function requestAppleMapsAccessToken(): Promise<{ token: string; expiresAtMs: number }> {
  const jwt = await createAppleMapsJWT();

  const response = await fetch(APPLE_MAPS_TOKEN_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: "application/json",
    },
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Apple Maps token endpoint error: ${response.status} ${text}`);
  }

  const data = JSON.parse(text);

  const accessToken = data?.accessToken;
  const expiresInSeconds = data?.expiresInSeconds;

  if (!accessToken || typeof expiresInSeconds !== "number") {
    throw new Error(`Unexpected Apple /v1/token response: ${text}`);
  }

  const expiresAtMs = Date.now() + expiresInSeconds * 1000;
  return { token: accessToken, expiresAtMs };
}

async function getAppleMapsAccessToken(): Promise<{ token: string; expiresAtMs: number }> {
  const nowMs = Date.now();

  if (cachedToken && cachedTokenExpiryMs - nowMs > 5 * 60 * 1000) {
    return { token: cachedToken, expiresAtMs: cachedTokenExpiryMs };
  }

  const fresh = await requestAppleMapsAccessToken();
  cachedToken = fresh.token;
  cachedTokenExpiryMs = fresh.expiresAtMs;

  return fresh;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { token, expiresAtMs } = await getAppleMapsAccessToken();
    const nowMs = Date.now();
    const expiresIn = Math.max(0, Math.floor((expiresAtMs - nowMs) / 1000));

    return new Response(
      JSON.stringify({
        token,
        expiresIn,
        expiresAt: expiresAtMs,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          // client-side caching for 25 minutes
          "Cache-Control": "private, max-age=1500",
        },
      }
    );
  } catch (error) {
    console.error("Apple Maps token error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to generate token",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
