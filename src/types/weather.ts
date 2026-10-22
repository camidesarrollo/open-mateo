// ─────────────────────────────────────────────────────────────
// Tipos base
// ─────────────────────────────────────────────────────────────

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'windy';
export type WeatherSource = 'archive' | 'forecast';

export interface WeatherDay {
  date: string;
  temperatureMax: number | null;
  temperatureMin: number | null;
  precipitation: number | null;
  windSpeedMax: number | null;
  weatherCode: number | null;
  source: WeatherSource;
}

// ─────────────────────────────────────────────────────────────
// Anomalías (RF-04 / RF-06)
// ─────────────────────────────────────────────────────────────

export interface AnomalyStats {
  mean: number;
  stdDev: number;
  isValid: boolean;
  sampleSize: number;
}

export interface DayAnomaly {
  isAnomaly: boolean;
  z: number | null;
  direction: 'above' | 'below' | null;
}

export interface AnomalyResult {
  stats: AnomalyStats;
  byDate: Record<string, DayAnomaly>;
}

// ─────────────────────────────────────────────────────────────
// Respuesta cruda de Open-Meteo
// ─────────────────────────────────────────────────────────────

export interface OpenMeteoDailyResponse {
  daily: {
    time: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_sum?: number[];
    wind_speed_10m_max?: number[];
    weather_code?: number[];
  };
  timezone?: string;
}