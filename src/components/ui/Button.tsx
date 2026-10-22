import type { ButtonHTMLAttributes } from 'react';
import { Icon } from './Icon';
import { Spinner } from './Spinner';
import { cn, focusRing } from './utils';

export type ButtonVariant =
  | 'primary' // "Ir a Hoy", "Abrir cuaderno de hipótesis"
  | 'tonal' // "Cuaderno hipótesis", "Exportar cotejo"
  | 'secondary' // "Exportar CSV", "Descargar expediente"
  | 'subtle' // "Compacta", botón de orden
  | 'ghost' // iconos de la cabecera
  | 'quiet' // "Restablecer" filtros
  | 'accent' // "Comparar [A / B]"
  | 'danger'; // "Reintentar"

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary font-semibold shadow-sm hover:bg-primary-container hover:text-on-primary-container',
  tonal: 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary',
  secondary: 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest',
  subtle: 'bg-surface-container text-on-surface hover:bg-surface-container-high',
  ghost: 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
  quiet: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
  accent: 'bg-surface-container-high text-secondary hover:bg-surface-container-highest',
  danger: 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'p-1.5 gap-1 font-label-sm text-label-sm', // "Restablecer"
  sm: 'px-space-sm py-1 gap-1 font-label-sm text-label-sm',
  md: 'px-space-sm py-1.5 gap-1.5 font-label-md text-label-md',
  lg: 'px-space-md py-2.5 gap-2 font-label-md text-label-md',
};

const iconOnlyClasses: Record<ButtonSize, string> = { xs: 'w-7 h-7', sm: 'w-7 h-7', md: 'w-8 h-8', lg: 'w-9 h-9' };
const iconSize: Record<ButtonSize, number> = { xs: 16, sm: 15, md: 16, lg: 18 };
const iconOnlySize: Record<ButtonSize, number> = { xs: 16, sm: 18, md: 18, lg: 20 };

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconRight?: string;
  /** Botón cuadrado solo con icono. Requiere aria-label */
  iconOnly?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  iconRight,
  iconOnly = false,
  fullWidth = false,
  loading = false,
  disabled,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  const glyph = iconOnly ? iconOnlySize[size] : iconSize[size];

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-lg whitespace-nowrap transition-colors',
        'disabled:pointer-events-none disabled:opacity-50',
        focusRing,
        variantClasses[variant],
        iconOnly ? iconOnlyClasses[size] : sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? <Spinner size="sm" tone="current" /> : icon && <Icon name={icon} size={glyph} />}
      {!iconOnly && children}
      {!iconOnly && iconRight && <Icon name={iconRight} size={glyph} />}
    </button>
  );
}
