import { cn } from './utils';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerTone = 'primary' | 'secondary' | 'tertiary' | 'muted' | 'current';

const sizes: Record<SpinnerSize, number> = { sm: 14, md: 20, lg: 28 };

const tones: Record<SpinnerTone, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
  muted: 'text-on-surface-variant',
  current: 'text-current',
};

export interface SpinnerProps {
  size?: SpinnerSize;
  tone?: SpinnerTone;
  /** Texto para lectores de pantalla y, con showLabel, visible al lado */
  label?: string;
  showLabel?: boolean;
  className?: string;
}

export function Spinner({
  size = 'md',
  tone = 'primary',
  label = 'Cargando',
  showLabel = false,
  className,
}: SpinnerProps) {
  const px = sizes[size];
  return (
    <span role="status" className={cn('inline-flex items-center gap-2', tones[tone], className)}>
      <svg className="animate-spin" width={px} height={px} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {showLabel ? (
        <span className="font-mono-badge text-mono-badge text-on-surface-variant">{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </span>
  );
}
