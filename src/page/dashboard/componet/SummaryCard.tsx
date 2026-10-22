import type { ReactNode } from 'react';
import { Card } from '../../../components/ui/Card';
import { Icon } from '../../../components/ui/Icon';
import { cn } from '../../../components/ui/utils';

export type MetricTone = 'primary' | 'secondary' | 'tertiary' | 'error';

const toneText: Record<MetricTone | 'muted', string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
  error: 'text-error',
  muted: 'text-on-surface-variant',
};

const toneBadge: Record<MetricTone, string> = {
  primary: 'text-primary bg-surface-container-highest',
  secondary: 'text-secondary bg-surface-container-highest',
  tertiary: 'text-tertiary bg-surface-container-highest',
  error: 'text-error bg-error-container/40',
};

export interface SummaryCardProps {
  /** Título en mayúsculas ("Temp. Máx. Media") */
  label: string;
  /** Nombre del Material Symbol (thermostat, rainy, air, warning…) */
  icon: string;
  /** Tono base: colora el icono, la unidad y el sparkline */
  tone: MetricTone;
  /** Valor principal ("24.8", "62", "3") */
  value: string | number;
  /** Unidad junto al valor ("°C", "mm", "km/h", "eventos") */
  unit: string;
  /** Override del color de la unidad. Por defecto hereda `tone`. */
  unitTone?: MetricTone | 'muted';
  /** Contenido del badge (puede incluir icono + texto) */
  badge: ReactNode;
  /** Texto secundario a la derecha del badge */
  meta: string;
  /** Atributo `d` del path del sparkline */
  sparklinePath: string;
}

export function SummaryCard({
  label,
  icon,
  tone,
  value,
  unit,
  unitTone,
  badge,
  meta,
  sparklinePath,
}: SummaryCardProps) {
  return (
    <Card padding="md" interactive className="flex flex-col justify-between">
      {/* Header: label + icono */}
      <div className="flex items-center justify-between text-on-surface-variant mb-2">
        <span className="font-label-sm text-label-sm uppercase tracking-wider">
          {label}
        </span>
        <Icon name={icon} size={18} className={toneText[tone]} />
      </div>

      {/* Valor + unidad */}
      <div className="flex items-baseline gap-2 my-1">
        <span className="font-telemetry-metric text-telemetry-metric text-on-surface font-mono-data tracking-tight">
          {value}
        </span>
        <span
          className={cn(
            'font-mono-data text-mono-data',
            toneText[unitTone ?? tone],
          )}
        >
          {unit}
        </span>
      </div>

      {/* Badge + meta */}
      <div className="flex items-center justify-between pt-2 mt-1">
        <span
          className={cn(
            'font-mono-badge text-mono-badge px-1.5 py-0.5 rounded flex items-center gap-0.5',
            toneBadge[tone],
          )}
        >
          {badge}
        </span>
        <span className="font-mono-data text-[11px] text-on-surface-variant">
          {meta}
        </span>
      </div>

      {/* Sparkline */}
      <div className="w-full h-4 mt-2 opacity-75">
        <svg
          className={cn('w-full h-full', toneText[tone])}
          preserveAspectRatio="none"
          viewBox="0 0 100 20"
          aria-hidden="true"
        >
          <path
            d={sparklinePath}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth={2}
          />
        </svg>
      </div>
    </Card>
  );
}