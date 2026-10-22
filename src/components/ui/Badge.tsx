import type { HTMLAttributes } from 'react';
import { Icon } from './Icon';
import { cn, type Tone } from './utils';

export type BadgeVariant = 'soft' | 'solid';
export type BadgeSize = 'sm' | 'md';

const variantClasses: Record<BadgeVariant, Record<Tone, string>> = {
  // "Día A: 11 Oct", "+1.9 °C", "+3.2σ Térmica"
  soft: {
    neutral: 'bg-surface-container-high text-on-surface',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    tertiary: 'bg-tertiary/10 text-tertiary',
    error: 'bg-error-container/40 text-error',
  },
  // "HOY", "DÍA B", "+2.8σ Pluvial", "3 act."
  solid: {
    neutral: 'bg-surface-container-highest text-on-surface',
    primary: 'bg-primary text-on-primary',
    secondary: 'bg-secondary-container text-on-secondary-container',
    tertiary: 'bg-tertiary text-on-tertiary',
    error: 'bg-error-container text-on-error-container',
  },
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-[10px] leading-[14px] px-1.5 py-0.5',
  md: 'text-mono-badge px-2 py-0.5',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: string;
  /** Forma de píldora (rounded-full) */
  pill?: boolean;
}

export function Badge({
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  icon,
  pill = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 font-mono-badge whitespace-nowrap',
        pill ? 'rounded-full' : 'rounded',
        variantClasses[variant][tone],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 12 : 13} />}
      {children}
    </span>
  );
}
