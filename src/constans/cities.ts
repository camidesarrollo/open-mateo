// src/constants/cities.ts
export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string; // IANA
}

export const CITIES: readonly City[] = [
  // ─── España (obligatorias + extras) ───
  { id: 'madrid', name: 'Madrid', latitude: 40.4168, longitude: -3.7038, timezone: 'Europe/Madrid' },
  { id: 'barcelona', name: 'Barcelona', latitude: 41.3851, longitude: 2.1734, timezone: 'Europe/Madrid' },
  { id: 'valencia', name: 'Valencia', latitude: 39.4699, longitude: -0.3763, timezone: 'Europe/Madrid' },
  { id: 'sevilla', name: 'Sevilla', latitude: 37.3891, longitude: -5.9845, timezone: 'Europe/Madrid' },
  { id: 'bilbao', name: 'Bilbao', latitude: 43.2630, longitude: -2.9350, timezone: 'Europe/Madrid' },
  { id: 'malaga', name: 'Málaga', latitude: 36.7213, longitude: -4.4214, timezone: 'Europe/Madrid' },
  { id: 'zaragoza', name: 'Zaragoza', latitude: 41.6488, longitude: -0.8891, timezone: 'Europe/Madrid' },
  { id: 'palma', name: 'Palma de Mallorca', latitude: 39.5696, longitude: 2.6502, timezone: 'Europe/Madrid' },
  { id: 'las-palmas', name: 'Las Palmas de Gran Canaria', latitude: 28.1235, longitude: -15.4366, timezone: 'Atlantic/Canary' },
  { id: 'santa-cruz-tenerife', name: 'Santa Cruz de Tenerife', latitude: 28.4636, longitude: -16.2518, timezone: 'Atlantic/Canary' },

  // ─── Latinoamérica (obligatorias + extras) ───
  { id: 'buenos-aires', name: 'Buenos Aires', latitude: -34.6037, longitude: -58.3816, timezone: 'America/Argentina/Buenos_Aires' },
  { id: 'ciudad-de-mexico', name: 'Ciudad de México', latitude: 19.4326, longitude: -99.1332, timezone: 'America/Mexico_City' },
  { id: 'bogota', name: 'Bogotá', latitude: 4.7110, longitude: -74.0721, timezone: 'America/Bogota' },
  { id: 'santiago', name: 'Santiago de Chile', latitude: -33.4489, longitude: -70.6693, timezone: 'America/Santiago' },
  { id: 'lima', name: 'Lima', latitude: -12.0464, longitude: -77.0428, timezone: 'America/Lima' },
  { id: 'quito', name: 'Quito', latitude: -0.1807, longitude: -78.4678, timezone: 'America/Guayaquil' },
  { id: 'caracas', name: 'Caracas', latitude: 10.4806, longitude: -66.9036, timezone: 'America/Caracas' },
  { id: 'montevideo', name: 'Montevideo', latitude: -34.9011, longitude: -56.1645, timezone: 'America/Montevideo' },
  { id: 'asuncion', name: 'Asunción', latitude: -25.2637, longitude: -57.5759, timezone: 'America/Asuncion' },
  { id: 'la-paz', name: 'La Paz', latitude: -16.4897, longitude: -68.1193, timezone: 'America/La_Paz' },
  { id: 'sao-paulo', name: 'São Paulo', latitude: -23.5505, longitude: -46.6333, timezone: 'America/Sao_Paulo' },
  { id: 'rio-de-janeiro', name: 'Río de Janeiro', latitude: -22.9068, longitude: -43.1729, timezone: 'America/Sao_Paulo' },
  { id: 'san-jose-cr', name: 'San José (Costa Rica)', latitude: 9.9281, longitude: -84.0907, timezone: 'America/Costa_Rica' },
  { id: 'panama', name: 'Ciudad de Panamá', latitude: 8.9824, longitude: -79.5199, timezone: 'America/Panama' },
  { id: 'santo-domingo', name: 'Santo Domingo', latitude: 18.4861, longitude: -69.9312, timezone: 'America/Santo_Domingo' },
  { id: 'la-habana', name: 'La Habana', latitude: 23.1136, longitude: -82.3666, timezone: 'America/Havana' },
  { id: 'san-juan-pr', name: 'San Juan (Puerto Rico)', latitude: 18.4655, longitude: -66.1057, timezone: 'America/Puerto_Rico' },

  // ─── Europa ───
  { id: 'londres', name: 'Londres', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { id: 'paris', name: 'París', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { id: 'berlin', name: 'Berlín', latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin' },
  { id: 'roma', name: 'Roma', latitude: 41.9028, longitude: 12.4964, timezone: 'Europe/Rome' },
  { id: 'lisboa', name: 'Lisboa', latitude: 38.7223, longitude: -9.1393, timezone: 'Europe/Lisbon' },
  { id: 'amsterdam', name: 'Ámsterdam', latitude: 52.3676, longitude: 4.9041, timezone: 'Europe/Amsterdam' },
  { id: 'bruselas', name: 'Bruselas', latitude: 50.8503, longitude: 4.3517, timezone: 'Europe/Brussels' },
  { id: 'viena', name: 'Viena', latitude: 48.2082, longitude: 16.3738, timezone: 'Europe/Vienna' },
  { id: 'zurich', name: 'Zúrich', latitude: 47.3769, longitude: 8.5417, timezone: 'Europe/Zurich' },
  { id: 'estocolmo', name: 'Estocolmo', latitude: 59.3293, longitude: 18.0686, timezone: 'Europe/Stockholm' },
  { id: 'oslo', name: 'Oslo', latitude: 59.9139, longitude: 10.7522, timezone: 'Europe/Oslo' },
  { id: 'copenhague', name: 'Copenhague', latitude: 55.6761, longitude: 12.5683, timezone: 'Europe/Copenhagen' },
  { id: 'helsinki', name: 'Helsinki', latitude: 60.1699, longitude: 24.9384, timezone: 'Europe/Helsinki' },
  { id: 'atenas', name: 'Atenas', latitude: 37.9838, longitude: 23.7275, timezone: 'Europe/Athens' },
  { id: 'dublin', name: 'Dublín', latitude: 53.3498, longitude: -6.2603, timezone: 'Europe/Dublin' },
  { id: 'moscu', name: 'Moscú', latitude: 55.7558, longitude: 37.6173, timezone: 'Europe/Moscow' },
  { id: 'estambul', name: 'Estambul', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul' },

  // ─── Norteamérica ───
  { id: 'nueva-york', name: 'Nueva York', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  { id: 'los-angeles', name: 'Los Ángeles', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles' },
  { id: 'chicago', name: 'Chicago', latitude: 41.8781, longitude: -87.6298, timezone: 'America/Chicago' },
  { id: 'miami', name: 'Miami', latitude: 25.7617, longitude: -80.1918, timezone: 'America/New_York' },
  { id: 'toronto', name: 'Toronto', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto' },
  { id: 'vancouver', name: 'Vancouver', latitude: 49.2827, longitude: -123.1207, timezone: 'America/Vancouver' },
  { id: 'ciudad-de-guatemala', name: 'Ciudad de Guatemala', latitude: 14.6349, longitude: -90.5069, timezone: 'America/Guatemala' },

  // ─── Asia y Oceanía ───
  { id: 'tokio', name: 'Tokio', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { id: 'seul', name: 'Seúl', latitude: 37.5665, longitude: 126.9780, timezone: 'Asia/Seoul' },
  { id: 'pekin', name: 'Pekín', latitude: 39.9042, longitude: 116.4074, timezone: 'Asia/Shanghai' },
  { id: 'shanghai', name: 'Shanghái', latitude: 31.2304, longitude: 121.4737, timezone: 'Asia/Shanghai' },
  { id: 'singapur', name: 'Singapur', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
  { id: 'bangkok', name: 'Bangkok', latitude: 13.7563, longitude: 100.5018, timezone: 'Asia/Bangkok' },
  { id: 'nueva-delhi', name: 'Nueva Delhi', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata' },
  { id: 'dubai', name: 'Dubái', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  { id: 'sydney', name: 'Sídney', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  { id: 'melbourne', name: 'Melbourne', latitude: -37.8136, longitude: 144.9631, timezone: 'Australia/Melbourne' },
  { id: 'auckland', name: 'Auckland', latitude: -36.8485, longitude: 174.7633, timezone: 'Pacific/Auckland' },

  // ─── África ───
  { id: 'el-cairo', name: 'El Cairo', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo' },
  { id: 'ciudad-del-cabo', name: 'Ciudad del Cabo', latitude: -33.9249, longitude: 18.4241, timezone: 'Africa/Johannesburg' },
  { id: 'nairobi', name: 'Nairobi', latitude: -1.2921, longitude: 36.8219, timezone: 'Africa/Nairobi' },
  { id: 'casablanca', name: 'Casablanca', latitude: 33.5731, longitude: -7.5898, timezone: 'Africa/Casablanca' },
] as const;

export const DEFAULT_CITY = CITIES[0]; // Madrid