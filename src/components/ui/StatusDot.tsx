import { bgTone, cn, type Tone } from './utils';

export type StatusDotSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<StatusDotSize, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

export interface StatusDotProps {
  tone?: Tone;
  size?: StatusDotSize;
  /** pulse: parpadeo suave · ping: onda expansiva (sensor en vivo) */
  animation?: 'none' | 'pulse' | 'ping';
  /** Texto accesible ("Operativo", "En línea"); también se usa como title */
  label?: string;
  className?: string;
}

export function StatusDot({
  tone = 'secondary',
  size = 'md',
  animation = 'none',
  label,
  className,
}: StatusDotProps) {
  return (
    <span className={cn('relative inline-flex shrink-0', sizeClasses[size], className)} title={label}>
      {animation === 'ping' && (
        <span className={cn('absolute inset-0 rounded-full opacity-75 animate-ping', bgTone[tone])} />
      )}
      <span
        className={cn(
          'relative inline-flex h-full w-full rounded-full',
          bgTone[tone],
          animation === 'pulse' && 'animate-pulse',
        )}
      />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
