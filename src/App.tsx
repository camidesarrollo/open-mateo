import { useEffect, useMemo, useState } from 'react';
import './App.css';
import type { Temperatures } from './types/temperatures.types';
import type { ArchiveTemperatures } from './types/archiveTemperatures.types';
import type { WeatherDay } from './types/weather';
import { addDays, formatDay, hoyISO, getOffsetLabel } from './helper/time';
import { classifyWeather } from './utils/weatherClassification';
import { computeAnomalies } from './utils/anomalies';
import { normalizeData } from './helper/normalizcionDatos';

const TIME_ENDPOINT = 'https://api.open-meteo.com/v1/';
const ARCHIVE_ENDPOINT = 'https://archive-api.open-meteo.com/v1/';

function App() {
  const [time, setTime] = useState<Temperatures | null>(null);
  const [archiveTime, setArchiveTime] = useState<ArchiveTemperatures | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const coordenadas = ['-33.4489', '-70.6693'];
    const cantidadDias = 7;

    const archiveStart = addDays(hoyISO, -7);
    const archiveEnd = addDays(hoyISO, -1);

    const dailyVars =
      'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weather_code';

    const controller = new AbortController();

    const forecastURL =
      `${TIME_ENDPOINT}forecast?latitude=${coordenadas[0]}&longitude=${coordenadas[1]}` +
      `&daily=${dailyVars}&forecast_days=${cantidadDias}&timezone=auto`;

    const archiveURL =
      `${ARCHIVE_ENDPOINT}archive?latitude=${coordenadas[0]}&longitude=${coordenadas[1]}` +
      `&daily=${dailyVars}&start_date=${archiveStart}&end_date=${archiveEnd}&timezone=auto`;

    Promise.all([
      fetch(forecastURL, { signal: controller.signal }).then((r) => r.json()),
      fetch(archiveURL, { signal: controller.signal }).then((r) => r.json()),
    ])
      .then(([forecastData, archiveData]) => {
        setTime(forecastData);
        setArchiveTime(archiveData);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
      });

    return () => controller.abort();
  }, []);

  const days: WeatherDay[] = useMemo(() => {
    return [
      ...normalizeData(archiveTime, 'archive'),
      ...normalizeData(time, 'forecast'),
    ].sort((a, b) => a.date.localeCompare(b.date));
  }, [archiveTime, time]);

  // Anomalías: SIEMPRE sobre `days` completo, NO sobre filtros
  const anomalies = useMemo(() => computeAnomalies(days), [days]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-space-xs text-secondary font-mono-badge text-mono-badge uppercase tracking-wider">
        <span className="material-symbols-outlined text-[14px]">public</span>
        <span>Red Global Copernicus · Nodo Ibérico N-404</span>
      </div>
      <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
        Observatorio climático
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
        Explora patrones, detecta anomalías y registra descubrimientos en el lienzo bioclimático.
      </p>

      {error && (
        <div className="bg-error-container text-on-error-container p-2 rounded">
          Error: {error}
        </div>
      )}

      <div className="flex flex-col gap-space-md">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-space-sm">
          {days.map((day) => {
            const info = classifyWeather(
              day.weatherCode,
              day.windSpeedMax,
              day.precipitation,
            );
            const isToday = day.date === hoyISO;
            const anomaly = anomalies.byDate[day.date];
            const isAnomaly = anomaly?.isAnomaly ?? false;

            return (
              <div
                key={day.date}
                className={[
                  'p-space-sm rounded-xl flex flex-col justify-between gap-2',
                  isToday
                    ? 'bg-surface-bright shadow-xl bg-gradient-to-b from-primary/25 via-surface-bright to-tertiary/15 relative'
                    : isAnomaly
                      ? 'bg-surface-container-high shadow-md border-l-4 border-error'
                      : 'bg-surface-container shadow-sm hover:bg-surface-container-high transition-colors',
                ].join(' ')}
              >
                {/* Cabecera: fecha + offset */}
                <div className="flex items-center justify-between">
                  <span
                    className={
                      isToday
                        ? 'font-mono-data text-mono-data text-primary font-bold'
                        : 'font-mono-data text-mono-data text-on-surface-variant'
                    }
                  >
                    {formatDay(day.date)}
                  </span>
                  <span
                    className={
                      isToday
                        ? 'bg-primary text-on-primary font-mono-badge text-[10px] font-bold px-1.5 py-0.2 rounded'
                        : 'font-mono-badge text-[10px] text-outline'
                    }
                  >
                    {getOffsetLabel(day.date, hoyISO)}
                  </span>
                </div>

                {/* Icono + temps + label */}
                <div className="flex flex-col items-center py-1">
                  <span className="material-symbols-outlined text-secondary text-[26px]">
                    {info.icon}
                  </span>
                  <span className="font-mono-data text-mono-data text-on-surface font-semibold mt-1">
                    {day.temperatureMax === null ? '—' : Math.round(day.temperatureMax)}°
                    {' / '}
                    {day.temperatureMin === null ? '—' : Math.round(day.temperatureMin)}°
                  </span>
                  <span
                    className={
                      isToday
                        ? 'font-label-sm text-[11px] text-primary font-semibold truncate'
                        : 'font-label-sm text-[11px] text-on-surface-variant truncate'
                    }
                  >
                    {info.label}
                  </span>
                </div>

                {/* Pluv + viento */}
                <div className="flex flex-col gap-0.5 font-mono-data text-[11px] text-on-surface-variant bg-surface-container-low p-1.5 rounded">
                  <div className="flex justify-between">
                    <span>Pluv:</span>
                    <span className="text-on-surface">
                      {day.precipitation === null
                        ? '—'
                        : `${day.precipitation.toFixed(1)}mm`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Viento:</span>
                    <span className="text-on-surface">
                      {day.windSpeedMax === null
                        ? '—'
                        : `${Math.round(day.windSpeedMax)}km/h`}
                    </span>
                  </div>
                </div>

                {/* Badge de estado: anomalía o normal */}
                <div className="w-full flex justify-center">
                  {isAnomaly && anomaly?.z != null ? (
                    <span
                      className="bg-error-container text-on-error-container font-mono-badge text-[10px] px-1.5 py-0.5 rounded flex items-center justify-center gap-1 w-full"
                      aria-label={
                        `Anomalía de temperatura: valor ${
                          anomaly.direction === 'above' ? 'superior' : 'inferior'
                        } a la media por ${anomaly.z.toFixed(1)} desviaciones estándar`
                      }
                    >
                      <span
                        className="material-symbols-outlined text-[12px]"
                        aria-hidden="true"
                      >
                        {anomaly.direction === 'above'
                          ? 'local_fire_department'
                          : 'ac_unit'}
                      </span>
                      <span>Anomalía · {anomaly.z.toFixed(1)}σ</span>
                    </span>
                  ) : (
                    <span className="font-mono-badge text-[10px] text-outline uppercase tracking-wider">
                      Normal
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;