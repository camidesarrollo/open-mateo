import type { RangeValue } from '../components/ui/RangeSlider';
import type { WeatherFilter } from '../page/dashboard/componet/WeatherFilterGroup';
import type { AnomalyResult, WeatherDay } from '../types/weather';
import { classifyWeather } from './weatherClassification';

export type SortKey = 'fecha' | 'tempMax' | 'precipitacion' | 'rareza';
export type SortDirection = 'asc' | 'desc';
/** [inicio, fin] en ISO, ambos inclusivos */
export type DateRange = [string, string];

export interface TimelineFilters {
  /** null = todas las fechas */
  dateRange: DateRange | null;
  range: RangeValue;
  weather: WeatherFilter;
  onlyAnomalies: boolean;
  sortKey: SortKey;
  sortDirection: SortDirection;
}

// Límites del slider: el rango completo equivale a "sin filtro térmico"
export const TEMP_BOUNDS: RangeValue = [0, 45];

export const DEFAULT_FILTERS: TimelineFilters = {
  dateRange: null,
  range: TEMP_BOUNDS,
  weather: 'all',
  onlyAnomalies: false,
  sortKey: 'fecha',
  sortDirection: 'asc',
};

export const isDefaultFilters = (f: TimelineFilters) =>
  f.dateRange === null &&
  f.range[0] === DEFAULT_FILTERS.range[0] &&
  f.range[1] === DEFAULT_FILTERS.range[1] &&
  f.weather === DEFAULT_FILTERS.weather &&
  f.onlyAnomalies === DEFAULT_FILTERS.onlyAnomalies &&
  f.sortKey === DEFAULT_FILTERS.sortKey &&
  f.sortDirection === DEFAULT_FILTERS.sortDirection;

// Valor por el que se ordena cada jornada; null = sin dato
const sortValue = (
  day: WeatherDay,
  key: SortKey,
  anomalies: AnomalyResult,
): string | number | null => {
  switch (key) {
    case 'fecha':
      return day.date;
    case 'tempMax':
      return day.temperatureMax;
    case 'precipitacion':
      return day.precipitation;
    case 'rareza':
      return anomalies.byDate[day.date]?.z ?? null;
  }
};

export function applyFilters(
  days: WeatherDay[],
  anomalies: AnomalyResult,
  filters: TimelineFilters,
): WeatherDay[] {
  const [low, high] = filters.range;
  const rangeActive = low > TEMP_BOUNDS[0] || high < TEMP_BOUNDS[1];

  const filtered = days.filter((day) => {
    // 0) Rango de fechas: las fechas ISO se comparan bien como texto
    if (filters.dateRange) {
      const [from, to] = filters.dateRange;
      if (day.date < from || day.date > to) return false;
    }

    // 1) Rango térmico sobre la máxima del día
    if (rangeActive) {
      const t = day.temperatureMax;
      if (t === null || t < low || t > high) return false;
    }

    // 2) Tipo de clima, con la misma clasificación que muestra la cápsula
    if (filters.weather !== 'all') {
      const { type } = classifyWeather(day.weatherCode, day.windSpeedMax, day.precipitation);
      if (type !== filters.weather) return false;
    }

    // 3) Solo anomalías
    if (filters.onlyAnomalies && !anomalies.byDate[day.date]?.isAnomaly) return false;

    return true;
  });

  const dir = filters.sortDirection === 'asc' ? 1 : -1;

  return filtered.sort((a, b) => {
    const va = sortValue(a, filters.sortKey, anomalies);
    const vb = sortValue(b, filters.sortKey, anomalies);

    // Los días sin dato van siempre al final, sin importar la dirección
    if (va === null && vb === null) return a.date.localeCompare(b.date);
    if (va === null) return 1;
    if (vb === null) return -1;

    const cmp = typeof va === 'string' ? va.localeCompare(vb as string) : va - (vb as number);
    // Desempate por fecha para que el orden sea estable
    return cmp !== 0 ? cmp * dir : a.date.localeCompare(b.date);
  });
}
