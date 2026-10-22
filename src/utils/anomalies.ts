import type {
  AnomalyResult,
  AnomalyStats,
  DayAnomaly,
  WeatherDay,
} from '../types/weather';

function computeStats(values: number[]): AnomalyStats {
  const n = values.length;

  if (n < 2) {
    return {
      mean: n === 1 ? values[0] : 0,
      stdDev: 0,
      isValid: false,
      sampleSize: n,
    };
  }

  const sum = values.reduce((acc, x) => acc + x, 0);
  const mean = sum / n;

  // Desviación estándar POBLACIONAL: divide entre n, no n-1
  const variance = values.reduce((acc, x) => acc + (x - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);

  return { mean, stdDev, isValid: stdDev > 0, sampleSize: n };
}

export function computeAnomalies(days: WeatherDay[]): AnomalyResult {
  const validTemps = days
    .map((d) => d.temperatureMax)
    .filter((t): t is number => typeof t === 'number' && Number.isFinite(t));

  const stats = computeStats(validTemps);
  const byDate: Record<string, DayAnomaly> = {};

  for (const day of days) {
    const t = day.temperatureMax;

    // Día sin dato válido → z null, no anómalo, sin dirección
    if (typeof t !== 'number' || !Number.isFinite(t)) {
      byDate[day.date] = { isAnomaly: false, z: null, direction: null };
      continue;
    }

    // σ = 0 → sin anomalías, rareza 0
    if (!stats.isValid) {
      byDate[day.date] = { isAnomaly: false, z: 0, direction: null };
      continue;
    }

    const delta = t - stats.mean;
    const distance = Math.abs(delta);
    const isAnomaly = distance > stats.stdDev; // estricto, no >=
    const z = distance / stats.stdDev;
    const direction: DayAnomaly['direction'] =
      delta > 0 ? 'above' : delta < 0 ? 'below' : null;

    byDate[day.date] = { isAnomaly, z, direction };
  }

  return { stats, byDate };
}