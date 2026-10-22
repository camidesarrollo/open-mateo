import type { OpenMeteoDailyResponse, WeatherDay, WeatherSource } from "../types/weather";

export  const normalizeData = (
      res: OpenMeteoDailyResponse | null,
      source: WeatherSource,
    ): WeatherDay[] => {
      if (!res?.daily?.time) return [];
      return res.daily.time.map((date, i) => ({
        date,
        temperatureMax: res.daily.temperature_2m_max?.[i] ?? null,
        temperatureMin: res.daily.temperature_2m_min?.[i] ?? null,
        precipitation: res.daily.precipitation_sum?.[i] ?? null,
        windSpeedMax: res.daily.wind_speed_10m_max?.[i] ?? null,
        weatherCode: res.daily.weather_code?.[i] ?? null,
        source,
      }));
    };
