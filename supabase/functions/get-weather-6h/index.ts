import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let lat, lon;
    
    try {
      const body = await req.json();
      lat = body.lat;
      lon = body.lon;
    } catch {
      const url = new URL(req.url);
      lat = url.searchParams.get('lat');
      lon = url.searchParams.get('lon');
    }

    if (!lat || !lon) {
      throw new Error('Missing lat or lon in request body');
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode&hourly=temperature_2m,weathercode&timezone=auto&forecast_days=2`;
    
    const weatherRes = await fetch(url);
    if (!weatherRes.ok) {
      const text = await weatherRes.text();
      throw new Error(`Open-Meteo API error: ${text}`);
    }
    const data = await weatherRes.json();

    const now = new Date();
    const currentEpoch = now.getTime();
    
    const nextHours = [];
    const times = data.hourly?.time || [];
    const temps = data.hourly?.temperature_2m || [];
    const codes = data.hourly?.weathercode || [];

    for (let i = 0; i < times.length; i++) {
      const timeEpoch = new Date(times[i]).getTime();
      
      // Filter: Keep hours that are roughly now or in the future
      // subtract 30 mins to ensure we catch the current hour block even if we are at 12:59
      if (timeEpoch >= (currentEpoch - 30 * 60 * 1000)) {
        nextHours.push({
          time: times[i],
          temperature_2m: temps[i],
          weathercode: codes[i]
        });
      }
      // 6 entries
      if (nextHours.length >= 6) break;
    }

    const result = {
      current: {
        temp: data.current.temperature_2m,
        code: data.current.weathercode,
        time: data.current.time
      },
      hours: nextHours,
      location: { lat, lon }
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})