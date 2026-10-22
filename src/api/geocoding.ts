// src/api/geocoding.ts
import type { City } from '../constans/cities';

const GEO_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country?: string;
  country_code?: string;
  admin1?: string;
  population?: number;
}

export async function searchCities(
  query: string,
  signal?: AbortSignal,
): Promise<City[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({
    name: query,
    count: '10',
    language: 'es',
    format: 'json',
  });

  const res = await fetch(`${GEO_BASE}?${params}`, { signal });
  if (!res.ok) throw new Error(`Geocoding error: ${res.status}`);

  const data = await res.json();
  const results: GeoResult[] = data.results ?? [];

  return results.map((r) => ({
    id: String(r.id),
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
    country: r.country,
  }));
}