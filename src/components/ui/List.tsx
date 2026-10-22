import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { cn, textTone, type TextTone } from './utils';

export interface ListItem {
  id?: string;
  label: ReactNode;
  value: ReactNode;
  icon?: string;
  /** Color del valor (p. ej. 'secondary' para lluvia, 'tertiary' para viento) */
  tone?: TextTone;
}

export type ListVariant = 'compact' | 'rows';
export type ListSurface = 'none' | 'container' | 'low' | 'lowest';

const surfaceClasses: Record<ListSurface, string> = {
  none: '',
  container: 'bg-surface-container',
  low: 'bg-surface-container-low',
  lowest: 'bg-surface-container-lowest/80',
};

export interface ListProps {
  items: ListItem[];
  /** compact: bloque "Pluv / Viento" de las cápsulas · rows: filas de 36px del README */
  variant?: ListVariant;
  surface?: ListSurface;
  striped?: boolean;
  className?: string;
}

/** Lista de pares etiqueta → valor con cifras alineadas a la derecha */
export function List({ items, variant = 'compact', surface = 'low', striped = false, className }: ListProps) {
  const compact = variant === 'compact';

  return (
    <dl
      className={cn(
        'flex flex-col font-mono-data text-on-surface-variant',
        compact ? 'gap-0.5 rounded p-1.5 text-[11px]' : 'overflow-hidden rounded-lg text-mono-data',
        surfaceClasses[surface],
        className,
      )}
    >
      {items.map((item, i) => (
        <div
          key={item.id ?? i}
          className={cn(
            'flex items-center justify-between gap-2',
            !compact &&
              'h-9 border-b border-white/5 px-space-sm transition-colors duration-100 last:border-b-0 hover:bg-surface-container-high',
            !compact && striped && 'even:bg-white/[0.015]',
          )}
        >
          <dt className="flex min-w-0 items-center gap-1.5 truncate">
            {item.icon && <Icon name={item.icon} size={compact ? 13 : 15} />}
            {item.label}
          </dt>
          <dd className={cn('text-right tabular-nums', textTone[item.tone ?? 'default'])}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
