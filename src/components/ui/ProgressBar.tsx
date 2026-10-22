import type { ReactNode } from 'react';
import { bgTone, cn, textTone, type Tone } from './utils';

export type ProgressBarSize = 'xs' | 'sm' | 'md';

const sizeClasses: Record<ProgressBarSize, string> = { xs: 'h-1', sm: 'h-1.5', md: 'h-2' };

export interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: Tone;
  size?: ProgressBarSize;
  /** Texto a la izquierda ("Expedición") */
  label?: ReactNode;
  /** Texto a la derecha ("2/5 Jornadas") */
  valueLabel?: ReactNode;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  tone = 'secondary',
  size = 'xs',
  label,
  valueLabel,
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || valueLabel) && (
        <div className="flex items-center justify-between gap-2">
          {label && <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span>}
          {valueLabel && (
            <span className={cn('font-mono-badge text-mono-badge', textTone[tone])}>
              {valueLabel}
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={typeof label === 'string' ? label : undefined}
        className={cn('w-full overflow-hidden rounded-full bg-surface-container-highest', sizeClasses[size])}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-300', bgTone[tone])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
