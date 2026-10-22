// src/config/api.ts
export const API_CONFIG = {
  FORECAST_BASE: 'https://api.open-meteo.com/v1',
  ARCHIVE_BASE: 'https://archive-api.open-meteo.com/v1',
  DEFAULT_TIMEOUT_MS: 10_000,
  MAX_RETRIES: 2,           // RT-09
  RETRY_BASE_MS: 500,       // RT-09
} as const;