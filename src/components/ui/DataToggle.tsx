import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from './utils';

const trackTone = {
  primary: 'peer-checked:bg-primary',
  secondary: 'peer-checked:bg-secondary',
  tertiary: 'peer-checked:bg-tertiary',
};

export interface DataToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: ReactNode;
  onChange?: (checked: boolean) => void;
  tone?: keyof typeof trackTone;
  /** Envuelve el interruptor en una píldora (como "Solo anomalías") */
  pill?: boolean;
}

/** Interruptor on/off para filtros de datos */
export function DataToggle({
  label,
  onChange,
  tone = 'secondary',
  pill = true,
  disabled,
  className,
  ...rest
}: DataToggleProps) {
  return (
    <label
      className={cn(
        'inline-flex cursor-pointer select-none items-center gap-2',
        pill && 'rounded-lg bg-surface-container px-space-sm py-1.5 transition-colors hover:bg-surface-container-high',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        type="checkbox"
        role="switch"
        className="peer sr-only"
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        {...rest}
      />
      <span
        aria-hidden
        className={cn(
          'relative h-4 w-8 shrink-0 rounded-full bg-surface-container-highest transition-colors',
          'after:absolute after:left-0.5 after:top-0.5 after:h-3 after:w-3 after:rounded-full after:bg-on-surface after:transition-transform',
          'peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40',
          trackTone[tone],
        )}
      />
      <span className="font-label-sm text-label-sm text-on-surface">{label}</span>
    </label>
  );
}
