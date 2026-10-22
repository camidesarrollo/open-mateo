import { useEffect, useMemo, useState } from 'react';
import './App.css';
import type { Temperatures } from './types/temperatures.types';
import type { ArchiveTemperatures } from './types/archiveTemperatures.types';
import type { WeatherDay } from './types/weather';
import { addDays, hoyISO, getOffsetLabel } from './helper/time';
import { computeAnomalies } from './utils/anomalies';
import { normalizeData } from './helper/normalizcionDatos';
import { DayCapsule } from './page/dashboard/componet/DayCapsule';

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
          {days.map((day) => (
            <DayCapsule
              key={day.date}
              day={day}
              anomaly={anomalies.byDate[day.date]}
              isToday={day.date === hoyISO}
              offsetLabel={getOffsetLabel(day.date, hoyISO)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;