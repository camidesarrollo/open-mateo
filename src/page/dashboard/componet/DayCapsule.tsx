import { memo } from 'react';
import { classifyWeather } from '../../../utils/weatherClassification';
import type { DayAnomaly, WeatherDay } from '../../../types/weather';
import { formatDay } from '../../../helper/time';
import { Card, type CardVariant } from '../../../components/ui/Card';
// ⚠️ Ajusta esta ruta si tu Card.tsx está en otro lugar.
//    Regla: cuenta los ../ desde donde está ESTE archivo hasta Card.tsx.

export interface DayCapsuleProps {
  /** Jornada normalizada. Referencia estable (viene de useMemo en App). */
  day: WeatherDay;
  /** Anomalía calculada. Referencia estable (viene de useMemo en App). */
  anomaly?: DayAnomaly;
  /** true si esta fecha es hoy. Primitivo. */
  isToday: boolean;
  /** Etiqueta "-7d" / "HOY" / "+3d". Primitivo. */
  offsetLabel: string;
  /** RF-02 — reservado para cuando llegue el reducer. */
  investigated?: boolean;
  /** RF-03 — reservado para cuando llegue la comparación. */
  selected?: boolean;
  /** Si existe, la cápsula es interactiva. Reservado para más adelante. */
  onActivate?: (date: string) => void;
}

function DayCapsuleBase({
  day,
  anomaly,
  isToday,
  offsetLabel,
  investigated = false,
  selected = false,
  onActivate,
}: DayCapsuleProps) {
  const info = classifyWeather(
    day.weatherCode,
    day.windSpeedMax,
    day.precipitation,
  );

  const isAnomaly = anomaly?.isAnomaly ?? false;

  // ─────────────────────────────────────────────
  // Mapeo: estado visual → variante de Card
  // ─────────────────────────────────────────────
  const variant: CardVariant = isToday
    ? 'highlight'
    : isAnomaly
      ? 'anomaly'
      : 'default';

  const interactive = Boolean(onActivate) && !isToday;

  return (
    <Card
      id={`day-${day.date}`}
      as={onActivate ? 'button' : 'article'}
      variant={variant}
      padding="sm"
      interactive={interactive}
      selected={selected}
      onClick={onActivate ? () => onActivate(day.date) : undefined}
      aria-label={
        `Jornada del ${formatDay(day.date)}` +
        (isToday ? ', hoy' : '') +
        (isAnomaly ? ', anomalía térmica' : '') +
        (investigated ? ', investigada' : '') +
        (selected ? ', seleccionada para comparar' : '')
      }
      className="flex flex-col justify-between gap-2"
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

      {/* Badge de estado: investigado > anomalía > normal/previsto */}
      <div className="w-full flex justify-center">
        {investigated ? (
          <span
            className="font-mono-badge text-[10px] text-secondary bg-surface-container-highest px-1.5 py-0.5 rounded flex items-center justify-center gap-0.5 w-full"
            aria-label="Jornada ya investigada"
          >
            <span
              className="material-symbols-outlined text-[12px]"
              aria-hidden="true"
            >
              check_circle
            </span>
            Investigado
          </span>
        ) : isAnomaly && anomaly?.z != null ? (
          <span
            className="bg-error-container text-on-error-container font-mono-badge text-[10px] px-1.5 py-0.5 rounded flex items-center justify-center gap-1 w-full"
            aria-label={`Anomalía de temperatura: valor ${
              anomaly.direction === 'above' ? 'superior' : 'inferior'
            } a la media por ${anomaly.z.toFixed(1)} desviaciones estándar`}
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
    </Card>
  );
}

export const DayCapsule = memo(DayCapsuleBase);
DayCapsule.displayName = 'DayCapsule';