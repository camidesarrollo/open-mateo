import { memo } from 'react';
import { classifyWeather } from '../../../utils/weatherClassification';
import type { DayAnomaly, WeatherDay } from '../../../types/weather';
import { formatDay } from '../../../helper/time';

export interface DayCapsuleProps {
  /** Jornada normalizada. Referencia estable (viene de useMemo en App). */
  day: WeatherDay;
  /** Anomalía calculada. Referencia estable (viene de useMemo en App). */
  anomaly?: DayAnomaly;
  /** true si esta fecha es hoy. Primitivo. */
  isToday: boolean;
  /** Etiqueta "-7d" / "HOY" / "+3d". Primitivo. */
  offsetLabel: string;
}

function DayCapsuleBase({ day, anomaly, isToday, offsetLabel }: DayCapsuleProps) {
  // Derivado puro: se recalcula solo si la jornada cambia
  const info = classifyWeather(
    day.weatherCode,
    day.windSpeedMax,
    day.precipitation,
  );

  const isAnomaly = anomaly?.isAnomaly ?? false;

  return (
    <article
      aria-label={
        `Jornada del ${formatDay(day.date)}` +
        (isToday ? ', hoy' : '') +
        (isAnomaly ? ', anomalía térmica' : '')
      }
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
          {offsetLabel}
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
            {isToday ? 'Normal' : 'Previsto'}
          </span>
        )}
      </div>
    </article>
  );
}

/**
 * memo con comparación por defecto (shallow).
 * Funciona bien porque TODAS las props son primitivas o referencias estables
 * (day y anomaly vienen de useMemo en el padre).
 */
export const DayCapsule = memo(DayCapsuleBase);

// Ayuda a DevTools a mostrar el nombre correcto
DayCapsule.displayName = 'DayCapsule';