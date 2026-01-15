import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Units = "metric" | "imperial";

function isUnits(val: unknown): val is Units {
  return val === "metric" || val === "imperial";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let lat: number | null = null;
    let lon: number | null = null;
    let units: Units = "metric";

    try {
      const body = await req.json();
      lat = typeof body.lat === "number" ? body.lat : Number(body.lat);
      lon = typeof body.lon === "number" ? body.lon : Number(body.lon);
      if (isUnits(body.units)) units = body.units;
    } catch {
      const url = new URL(req.url);
      const latStr = url.searchParams.get("lat");
      const lonStr = url.searchParams.get("lon");
      const unitsStr = url.searchParams.get("units");

      lat = latStr ? Number(latStr) : null;
      lon = lonStr ? Number(lonStr) : null;
      if (isUnits(unitsStr)) units = unitsStr;
    }

    if (lat === null || lon === null || Number.isNaN(lat) || Number.isNaN(lon)) {
      throw new Error("Missing or invalid lat/lon");
    }

    const unitParams =
      units === "imperial"
        ? "&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch"
        : "";

    const hourlyVars = [
      "temperature_2m",
      "weathercode",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
      "precipitation",
    ].join(",");

    const currentVars = [
      "temperature_2m",
      "weathercode",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
      "precipitation",
    ].join(",");

    const apiUrl =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${encodeURIComponent(String(lat))}` +
      `&longitude=${encodeURIComponent(String(lon))}` +
      `&current=${encodeURIComponent(currentVars)}` +
      `&hourly=${encodeURIComponent(hourlyVars)}` +
      `&timezone=auto` +
      `&forecast_days=1` +
      unitParams;

    const weatherRes = await fetch(apiUrl);
    if (!weatherRes.ok) {
      const text = await weatherRes.text();
      throw new Error(`Open-Meteo API error: ${text}`);
    }

    const data = await weatherRes.json();

    // Build 24 hourly entries for the day returned (forecast_days=1)
    const times: string[] = data.hourly?.time ?? [];
    const temps: number[] = data.hourly?.temperature_2m ?? [];
    const codes: number[] = data.hourly?.weathercode ?? [];
    const windSpeeds: number[] = data.hourly?.wind_speed_10m ?? [];
    const windDirs: number[] = data.hourly?.wind_direction_10m ?? [];
    const gusts: number[] = data.hourly?.wind_gusts_10m ?? [];
    const precip: number[] = data.hourly?.precipitation ?? [];

    // If Open-Meteo returns fewer/more than 24 due to edge cases,
    // we still zip safely by min length.
    const n = Math.min(
      times.length,
      temps.length,
      codes.length,
      windSpeeds.length,
      windDirs.length,
      gusts.length,
      precip.length
    );

    const hours = Array.from({ length: n }, (_, i) => ({
      time: times[i],
      temperature_2m: temps[i],
      weathercode: codes[i],
      wind_speed_10m: windSpeeds[i],
      wind_direction_10m: windDirs[i],
      wind_gusts_10m: gusts[i],
      precipitation: precip[i],
    }));

    const result = {
      units, // echo back the units used
      current: {
        time: data.current?.time,
        temperature_2m: data.current?.temperature_2m,
        weathercode: data.current?.weathercode,
        wind_speed_10m: data.current?.wind_speed_10m,
        wind_direction_10m: data.current?.wind_direction_10m,
        wind_gusts_10m: data.current?.wind_gusts_10m,
        precipitation: data.current?.precipitation,
      },
      hours, // full-day hourly window for forecast_days=1
      location: { lat, lon },
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
