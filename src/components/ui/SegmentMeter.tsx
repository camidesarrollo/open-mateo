import { cn, type Tone } from './utils';

// Segmentos encendidos con halo, como la barra del "Expediente de Investigación"
const activeClasses: Record<Tone, string> = {
  neutral: 'bg-on-surface-variant',
  primary: 'bg-primary shadow-[0_0_8px_rgba(164,201,255,0.4)]',
  secondary: 'bg-secondary shadow-[0_0_8px_rgba(68,226,205,0.4)]',
  tertiary: 'bg-tertiary shadow-[0_0_8px_rgba(206,189,255,0.4)]',
  error: 'bg-error shadow-[0_0_8px_rgba(255,180,171,0.4)]',
};

export interface SegmentMeterProps {
  /** Segmentos completados */
  value: number;
  /** Segmentos totales */
  segments?: number;
  tone?: Tone;
  label?: string;
  className?: string;
}

export function SegmentMeter({ value, segments = 5, tone = 'secondary', label, className }: SegmentMeterProps) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={segments}
      aria-valuenow={value}
      aria-label={label}
      className={cn('grid h-2 w-full gap-1.5', className)}
      style={{ gridTemplateColumns: `repeat(${segments}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: segments }, (_, i) => (
        <div
          key={i}
          className={cn('rounded-full', i < value ? activeClasses[tone] : 'bg-surface-container-highest')}
        />
      ))}
    </div>
  );
}
