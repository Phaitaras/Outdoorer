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

type HourRow = {
  time: string;
  temperature_2m: number;
  weathercode: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  precipitation: number;
  dew_point_2m: number;
  is_day: number;
  precipitation_probability: number;
  wave_height?: number | null;
  wave_period?: number | null;
  wind_wave_height?: number | null;
  ocean_current_velocity?: number | null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let lat: number | null = null;
    let lon: number | null = null;
    let units: Units = "metric";
    let targetDate: string | null = null;
    let marine: boolean = false;

    try {
      const body = await req.json();
      lat = typeof body.lat === "number" ? body.lat : Number(body.lat);
      lon = typeof body.lon === "number" ? body.lon : Number(body.lon);
      if (isUnits(body.units)) units = body.units;
      if (typeof body.date === "string") targetDate = body.date;
      if (typeof body.marine === "boolean") marine = body.marine;
    } catch {
      const url = new URL(req.url);
      const latStr = url.searchParams.get("lat");
      const lonStr = url.searchParams.get("lon");
      const unitsStr = url.searchParams.get("units");
      const dateStr = url.searchParams.get("date");
      const marineStr = url.searchParams.get("marine");

      lat = latStr ? Number(latStr) : null;
      lon = lonStr ? Number(lonStr) : null;
      if (isUnits(unitsStr)) units = unitsStr;
      if (dateStr) targetDate = dateStr;
      if (marineStr === "true") marine = true;
    }

    if (lat === null || lon === null || Number.isNaN(lat) || Number.isNaN(lon)) {
      throw new Error("Missing or invalid lat/lon");
    }

    // Calculate forecast days needed based on target date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
    
    let forecastDays = 2; // default for today + tomorrow
    let requestedDateStr = todayStr; // default to today
    let isPastDate = false;
    
    if (targetDate) {
      // Validate and parse target date
      const targetDateObj = new Date(targetDate + 'T00:00:00');
      if (isNaN(targetDateObj.getTime())) {
        throw new Error("Invalid date format. Use YYYY-MM-DD");
      }
      
      requestedDateStr = targetDate;
      const daysDiff = Math.ceil((targetDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff < 0) {
        isPastDate = true;
      } else if (daysDiff > 15) {
        throw new Error("Cannot request weather more than 15 days in advance");
      } else {
        forecastDays = Math.max(2, daysDiff + 2); // ensure we get the target day + buffer
      }
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
      "dew_point_2m",
      "is_day",
      "precipitation_probability",
    ].join(",");

    // only include current weather if requesting today's data
    const currentVars = requestedDateStr === todayStr ? hourlyVars : "";
    const currentParam = currentVars ? `&current=${currentVars}` : "";

    let apiUrl: string;
    if (isPastDate) {
      // for past dates, use start_date and end_date parameters
      apiUrl =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lat}` +
        `&longitude=${lon}` +
        `&start_date=${requestedDateStr}` +
        `&end_date=${requestedDateStr}` +
        `&hourly=${hourlyVars}` +
        unitParams;
    } else {
      // for today and future dates, use forecast_days
      apiUrl =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lat}` +
        `&longitude=${lon}` +
        currentParam +
        `&hourly=${hourlyVars}` +
        `&forecast_days=${forecastDays}` +
        unitParams;
    }

    // console.log('url:', apiUrl);

    const weatherRes = await fetch(apiUrl);
    if (!weatherRes.ok) {
      const text = await weatherRes.text();
      throw new Error(`Open-Meteo API error: ${text}`);
    }

    const data = await weatherRes.json();

    const times: string[] = data.hourly?.time ?? [];
    const temps: number[] = data.hourly?.temperature_2m ?? [];
    const codes: number[] = data.hourly?.weathercode ?? [];
    const windSpeeds: number[] = data.hourly?.wind_speed_10m ?? [];
    const windDirs: number[] = data.hourly?.wind_direction_10m ?? [];
    const gusts: number[] = data.hourly?.wind_gusts_10m ?? [];
    const precip: number[] = data.hourly?.precipitation ?? [];
    const dewPoints: number[] = data.hourly?.dew_point_2m ?? [];
    const isDays: number[] = data.hourly?.is_day ?? [];
    const precipProbs: number[] = data.hourly?.precipitation_probability ?? [];

    const n = Math.min(
      times.length,
      temps.length,
      codes.length,
      windSpeeds.length,
      windDirs.length,
      gusts.length,
      precip.length,
      dewPoints.length,
      isDays.length,
      precipProbs.length
    );

    // Fetch marine data if requested
    let marineData: any = null;
    if (marine) {
      try {
        const marineVars = [
          "wave_height",
          "wave_period",
          "wind_wave_height",
          "ocean_current_velocity",
        ].join(",");

        let marineUrl: string;
        if (isPastDate) {
          marineUrl =
            `https://marine-api.open-meteo.com/v1/marine` +
            `?latitude=${lat}` +
            `&longitude=${lon}` +
            `&start_date=${requestedDateStr}` +
            `&end_date=${requestedDateStr}` +
            `&hourly=${marineVars}` +
            unitParams;
        } else {
          marineUrl =
            `https://marine-api.open-meteo.com/v1/marine` +
            `?latitude=${lat}` +
            `&longitude=${lon}` +
            `&hourly=${marineVars}` +
            `&forecast_days=${forecastDays}` +
            unitParams;
        }

        const marineRes = await fetch(marineUrl);
        if (marineRes.ok) {
          marineData = await marineRes.json();
        }
      } catch (marineError) {
        console.error('Marine API error:', marineError);
        // Continue without marine data
      }
    }

    const waveHeights: (number | null)[] = marineData?.hourly?.wave_height ?? [];
    const wavePeriods: (number | null)[] = marineData?.hourly?.wave_period ?? [];
    const windWaveHeights: (number | null)[] = marineData?.hourly?.wind_wave_height ?? [];
    const oceanCurrentVelocities: (number | null)[] = marineData?.hourly?.ocean_current_velocity ?? [];

    const allHours: HourRow[] = Array.from({ length: n }, (_, i) => ({
      time: times[i],
      temperature_2m: temps[i],
      weathercode: codes[i],
      wind_speed_10m: windSpeeds[i],
      wind_direction_10m: windDirs[i],
      wind_gusts_10m: gusts[i],
      precipitation: precip[i],
      dew_point_2m: dewPoints[i],
      is_day: isDays[i],
      precipitation_probability: precipProbs[i],
      wave_height: waveHeights[i] ?? null,
      wave_period: wavePeriods[i] ?? null,
      wind_wave_height: windWaveHeights[i] ?? null,
      ocean_current_velocity: oceanCurrentVelocities[i] ?? null,
    }));

    if (allHours.length === 0) throw new Error("No hourly data returned from Open-Meteo");

    // filter hours for the requested date
    const dayHours = allHours.filter((h) => h.time.startsWith(requestedDateStr));
    
    if (dayHours.length === 0) {
      throw new Error(`No weather data available for date: ${requestedDateStr}`);
    }

    // build next 6 hours
    let next6: HourRow[] = [];
    
    if (requestedDateStr === todayStr) {
      // for today start from current hour
      const currentTimeStr: string | undefined = data.current?.time;
      const nowEpoch = currentTimeStr ? new Date(currentTimeStr).getTime() : Date.now();
      
      for (const h of allHours) {
        const t = new Date(h.time).getTime();
        // back shift to include the current hour block
        if (t >= nowEpoch - 30 * 60 * 1000) {
          next6.push(h);
          if (next6.length >= 6) break;
        }
      }

      // fallback if current.time is missing to use Date.now()
      if (next6.length < 6) {
        const nowFallback = Date.now();
        const tmp: HourRow[] = [];
        for (const h of allHours) {
          const t = new Date(h.time).getTime();
          if (t >= nowFallback - 30 * 60 * 1000) {
            tmp.push(h);
            if (tmp.length >= 6) break;
          }
        }
        if (tmp.length > next6.length) {
          next6.splice(0, next6.length, ...tmp);
        }
      }
    } else {
      // for past or future dates start from 6 AM or first available hour
      const targetDate6AM = `${requestedDateStr}T06:00`;
      const startFromHour = allHours.find(h => h.time >= targetDate6AM) || dayHours[0];
      
      if (startFromHour) {
        const startIndex = allHours.findIndex(h => h.time === startFromHour.time);
        next6 = allHours.slice(startIndex, startIndex + 6);
      }
    }

    const result = {
      units,
      date: requestedDateStr,
      current: requestedDateStr === todayStr ? {
        time: data.current?.time,
        temperature_2m: data.current?.temperature_2m,
        weathercode: data.current?.weathercode,
        wind_speed_10m: data.current?.wind_speed_10m,
        wind_direction_10m: data.current?.wind_direction_10m,
        wind_gusts_10m: data.current?.wind_gusts_10m,
        precipitation: data.current?.precipitation,
        dew_point_2m: data.current?.dew_point_2m,
        is_day: data.current?.is_day,
        precipitation_probability: data.current?.precipitation_probability,
      } : null, // No current weather for past or future dates
      dayHours, // full 24h for the requested date
      next6,    // 6 hours starting from current time (today) or 6 AM (past/future dates)
      location: { lat, lon },
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = String(error?.message ?? error);
    console.error('Function error:', errorMessage);
    console.error('Error details:', error);
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      timestamp: new Date().toISOString(),
    }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
