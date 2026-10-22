import type { WeatherType } from "../types/weather";

// src/utils/weatherClassification.ts
interface CodeInfo {
  type: WeatherType;
  icon: string;          // material symbol
  label: string;         // texto corto
}

const CODE_MAP: Record<number, CodeInfo> = {
  0:  { type: 'sunny',  icon: 'sunny',             label: 'Despejado' },
  1:  { type: 'sunny',  icon: 'wb_sunny',          label: 'Mayormente despejado' },
  2:  { type: 'cloudy', icon: 'partly_cloudy_day', label: 'Parcialmente nublado' },
  3:  { type: 'cloudy', icon: 'cloud',             label: 'Nublado' },
  45: { type: 'cloudy', icon: 'foggy',             label: 'Niebla' },
  48: { type: 'cloudy', icon: 'foggy',             label: 'Niebla con escarcha' },
  51: { type: 'rainy',  icon: 'rainy',             label: 'Llovizna ligera' },
  53: { type: 'rainy',  icon: 'rainy',             label: 'Llovizna moderada' },
  55: { type: 'rainy',  icon: 'rainy',             label: 'Llovizna intensa' },
  56: { type: 'rainy',  icon: 'rainy',             label: 'Llovizna helada' },
  57: { type: 'rainy',  icon: 'rainy',             label: 'Llovizna helada fuerte' },
  61: { type: 'rainy',  icon: 'rainy',             label: 'Lluvia ligera' },
  63: { type: 'rainy',  icon: 'rainy',             label: 'Lluvia moderada' },
  65: { type: 'rainy',  icon: 'rainy',             label: 'Lluvia intensa' },
  66: { type: 'rainy',  icon: 'rainy',             label: 'Lluvia helada' },
  67: { type: 'rainy',  icon: 'rainy',             label: 'Lluvia helada fuerte' },
  71: { type: 'rainy',  icon: 'weather_snowy',     label: 'Nevada ligera' },
  73: { type: 'rainy',  icon: 'weather_snowy',     label: 'Nevada moderada' },
  75: { type: 'rainy',  icon: 'weather_snowy',     label: 'Nevada intensa' },
  77: { type: 'rainy',  icon: 'weather_snowy',     label: 'Granos de nieve' },
  80: { type: 'rainy',  icon: 'rainy',             label: 'Chubascos ligeros' },
  81: { type: 'rainy',  icon: 'rainy',             label: 'Chubascos moderados' },
  82: { type: 'rainy',  icon: 'rainy',             label: 'Chubascos violentos' },
  85: { type: 'rainy',  icon: 'weather_snowy',     label: 'Chubascos de nieve' },
  86: { type: 'rainy',  icon: 'weather_snowy',     label: 'Chubascos de nieve fuertes' },
  95: { type: 'rainy',  icon: 'thunderstorm',      label: 'Tormenta' },
  96: { type: 'rainy',  icon: 'thunderstorm',      label: 'Tormenta con granizo' },
  99: { type: 'rainy',  icon: 'thunderstorm',      label: 'Tormenta fuerte con granizo' },
};

const FALLBACK: CodeInfo = { type: 'cloudy', icon: 'cloud', label: 'Sin clasificar' };

// Umbrales para RF-05 (ajustables)
const WINDY_THRESHOLD_KMH = 40;  // Beaufort 6: "viento fuerte"
const RAINY_THRESHOLD_MM  = 1;   // por debajo es traza, no lluvia

const WINDY: CodeInfo = { type: 'windy', icon: 'air',   label: 'Ventoso' };
const RAINY: CodeInfo = { type: 'rainy', icon: 'rainy', label: 'Lluvia' };

export function classifyWeather(
  code: number | null,
  windSpeedMax: number | null = null,
  precipitation: number | null = null,
): CodeInfo {
  const base = code === null ? FALLBACK : CODE_MAP[code] ?? FALLBACK;

  // La lluvia/tormenta del código WMO tiene prioridad
  if (base.type === 'rainy') return base;

  // null = sin dato (CA-03): no cuenta para los umbrales
  if (windSpeedMax !== null && windSpeedMax >= WINDY_THRESHOLD_KMH) return WINDY;
  if (precipitation !== null && precipitation >= RAINY_THRESHOLD_MM) return RAINY;

  return base;
}