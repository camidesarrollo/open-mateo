import type { ReactNode } from 'react';
import { Card } from './Card';
import { Icon } from './Icon';
import { cn, textTone, type Tone } from './utils';

type StatTone = Exclude<Tone, 'neutral'>;

const deltaClasses: Record<StatTone, string> = {
  primary: 'text-primary-container bg-surface-container-highest',
  secondary: 'text-secondary bg-surface-container-highest',
  tertiary: 'text-tertiary bg-surface-container-highest',
  error: 'text-error bg-error-container/40',
};

/** Convierte una serie de valores en un path SVG dentro de un viewBox 100x20 */
function sparklinePath(values: number[]): string {
  if (values.length < 2) return '';
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 18 - ((v - min) / range) * 16;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export interface StatProps {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  icon?: string;
  tone?: StatTone;
  /** Chip de variación ("+1.9 °C", "4 eventos") */
  delta?: ReactNode;
  deltaIcon?: string;
  /** Texto de referencia a la derecha del delta ("vs. 1991-2020") */
  caption?: ReactNode;
  /** Serie para el mini gráfico inferior */
  trend?: number[];
  className?: string;
}

/** Tarjeta de métrica resumen (fila superior del observatorio) */
export function Stat({
  label,
  value,
  unit,
  icon,
  tone = 'primary',
  delta,
  deltaIcon,
  caption,
  trend,
  className,
}: StatProps) {
  return (
    <Card interactive className={cn('relative flex flex-col justify-between overflow-hidden cursor-default', className)}>
      <div className="mb-2 flex items-center justify-between gap-2 text-on-surface-variant">
        <span className="font-label-sm text-label-sm uppercase tracking-wider">{label}</span>
        {icon && <Icon name={icon} size={18} className={textTone[tone]} />}
      </div>

      <div className="my-1 flex items-baseline gap-2">
        <span className="font-telemetry-metric text-telemetry-metric tracking-tight tabular-nums text-on-surface">
          {value}
        </span>
        {unit && <span className={cn('font-mono-data text-mono-data', textTone[tone])}>{unit}</span>}
      </div>

      {(delta || caption) && (
        <div className="mt-1 flex items-center justify-between gap-2 pt-2">
          {delta && (
            <span
              className={cn(
                'flex items-center gap-0.5 rounded px-1.5 py-0.5 font-mono-badge text-mono-badge',
                deltaClasses[tone],
              )}
            >
              {deltaIcon && <Icon name={deltaIcon} size={13} />}
              {delta}
            </span>
          )}
          {caption && <span className="font-mono-data text-[11px] text-on-surface-variant">{caption}</span>}
        </div>
      )}

      {trend && trend.length > 1 && (
        <div className="mt-2 h-4 w-full opacity-75">
          <svg className={cn('h-full w-full', textTone[tone])} preserveAspectRatio="none" viewBox="0 0 100 20" aria-hidden>
            <path
              d={sparklinePath(trend)}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )}
    </Card>
  );
}
