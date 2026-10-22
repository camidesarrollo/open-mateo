import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';
import { cn, textTone, type Tone } from './utils';

export type CardVariant = 'default' | 'low' | 'lowest' | 'highlight' | 'error' | 'anomaly';
export type CardPadding = 'none' | 'sm' | 'md';

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-surface-container shadow-sm',
  low: 'bg-surface-container-low shadow-sm',
  lowest: 'bg-surface-container-lowest shadow-sm',
  // Cápsula "HOY" de la línea temporal
  highlight: 'bg-surface-bright bg-gradient-to-b from-primary/25 via-surface-bright to-tertiary/15 shadow-xl',
  // Cápsula con fallo de telemetría
  error: 'bg-error-container/20 text-error shadow-sm',
  // Cápsula con anomalía térmica
  anomaly: 'bg-surface-container-high shadow-md border-l-4 border-error',
};

const hoverClasses: Record<CardVariant, string> = {
  default: 'hover:bg-surface-container-high',
  low: 'hover:bg-surface-container',
  lowest: 'hover:bg-surface-container-low',
  highlight: '',
  error: '',
  anomaly: 'hover:bg-surface-container-highest',   // ← AÑADIR
};

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-space-sm',
  md: 'p-space-md',
};

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  /** Añade hover; úsalo junto con as="button" o as="a" si la tarjeta es clicable */
  interactive?: boolean;
  /** Marca la tarjeta seleccionada con un anillo primary */
  selected?: boolean;
  as?: ElementType;
}

export function Card({
  variant = 'default',
  padding = 'md',
  interactive = false,
  selected = false,
  as: Component = 'div',
  className,
  ...rest
}: CardProps) {
  return (
    <Component
      className={cn(
        'rounded-xl text-left',
        variantClasses[variant],
        paddingClasses[padding],
        interactive && cn('transition-colors cursor-pointer', hoverClasses[variant]),
        selected && 'ring-1 ring-primary',
        className,
      )}
      {...rest}
    />
  );
}

export interface CardHeaderProps {
  title: ReactNode;
  /** Texto pequeño en mayúsculas sobre el título ("Ciclo Octubre 2024") */
  eyebrow?: ReactNode;
  description?: ReactNode;
  icon?: string;
  iconTone?: Tone;
  /** Contenido a la derecha: badge, botones... */
  actions?: ReactNode;
  /** Línea divisoria inferior (cabecera compacta del README) */
  divider?: boolean;
  className?: string;
}

export function CardHeader({
  title,
  eyebrow,
  description,
  icon,
  iconTone = 'primary',
  actions,
  divider = false,
  className,
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-space-sm',
        divider && 'border-b border-outline-variant/40 pb-space-sm',
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        {eyebrow && (
          <span className="font-mono-badge text-mono-badge uppercase tracking-wider text-secondary">{eyebrow}</span>
        )}
        <div className="flex items-center gap-space-sm">
          {icon && <Icon name={icon} size={18} className={textTone[iconTone]} />}
          <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">{title}</h3>
        </div>
        {description && <span className="font-mono-data text-mono-data text-on-surface-variant">{description}</span>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-space-xs">{actions}</div>}
    </div>
  );
}
