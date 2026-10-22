import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';
import { cn, textTone, type Tone } from './utils';

export type PanelTone = 'container' | 'low' | 'lowest';

const toneClasses: Record<PanelTone, string> = {
  container: 'bg-surface-container',
  low: 'bg-surface-container-low',
  lowest: 'bg-surface-container-lowest',
};

export interface PanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Nivel tonal: los paneles van "hundidos" dentro de una Card */
  tone?: PanelTone;
  padding?: 'sm' | 'md';
  title?: ReactNode;
  icon?: string;
  iconTone?: Tone;
  /** Contenido a la derecha del título ("2/5 Jornadas") */
  aside?: ReactNode;
  as?: ElementType;
}

/** Bloque interior (rounded-lg) como "Expedición" o "Logros analíticos" del sidebar */
export function Panel({
  tone = 'low',
  padding = 'sm',
  title,
  icon,
  iconTone = 'primary',
  aside,
  as: Component = 'div',
  className,
  children,
  ...rest
}: PanelProps) {
  const hasHeader = title || icon || aside;

  return (
    <Component
      className={cn(
        'flex flex-col gap-1.5 rounded-lg',
        toneClasses[tone],
        padding === 'sm' ? 'p-space-sm' : 'p-space-md',
        className,
      )}
      {...rest}
    >
      {hasHeader && (
        <div className="flex items-center justify-between gap-space-sm">
          <div className="flex min-w-0 items-center gap-space-xs">
            {icon && <Icon name={icon} size={18} className={textTone[iconTone]} />}
            {title && <span className="truncate font-label-sm text-label-sm text-on-surface-variant">{title}</span>}
          </div>
          {aside}
        </div>
      )}
      {children}
    </Component>
  );
}
