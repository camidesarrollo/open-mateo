import type { HTMLAttributes } from 'react';
import { cn } from './utils';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Nombre del glifo de Material Symbols: 'thermostat', 'rainy', 'air'... */
  name: string;
  /** Tamaño en px (equivale a text-[Npx] del HTML) */
  size?: number;
  /** Variante rellena (FILL 1), como los check_circle de los hitos */
  filled?: boolean;
  /** Si se indica, el icono deja de ser decorativo y se anuncia con este texto */
  label?: string;
}

export function Icon({ name, size = 18, filled = false, label, className, style, ...rest }: IconProps) {
  return (
    <span
      className={cn('material-symbols-outlined select-none', className)}
      style={{ fontSize: size, fontVariationSettings: `'FILL' ${filled ? 1 : 0}`, ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...rest}
    >
      {name}
    </span>
  );
}
