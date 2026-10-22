import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { cn, focusRing, type Tone } from './utils';

// Chips del README: 22px de alto, radio 6px, borde fino y texto mono
const toneClasses: Record<Tone, string> = {
  neutral: 'bg-surface-container-high/60 text-on-surface-variant border-outline-variant',
  primary: 'bg-primary/10 text-primary border-primary/25',
  secondary: 'bg-secondary/10 text-secondary border-secondary/25',
  tertiary: 'bg-tertiary/10 text-tertiary border-tertiary/25',
  error: 'bg-error/10 text-error border-error/30',
};

export interface TagProps {
  tone?: Tone;
  icon?: string;
  children: ReactNode;
  /** Convierte el tag en un filtro conmutable */
  onClick?: () => void;
  selected?: boolean;
  /** Muestra una "x" para quitar el tag */
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
}

export function Tag({
  tone = 'neutral',
  icon,
  children,
  onClick,
  selected,
  onRemove,
  removeLabel = 'Quitar',
  className,
}: TagProps) {
  const classes = cn(
    'inline-flex h-[22px] items-center gap-1 rounded-md border px-2 font-mono-badge text-mono-badge whitespace-nowrap',
    toneClasses[tone],
    selected && 'ring-1 ring-current',
    className,
  );

  const content = (
    <>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={selected} className={cn(classes, focusRing, 'transition-colors hover:brightness-125')}>
        {content}
      </button>
    );
  }

  return (
    <span className={classes}>
      {content}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className={cn('-mr-1 inline-flex rounded-sm opacity-70 hover:opacity-100', focusRing)}
        >
          <Icon name="close" size={12} />
        </button>
      )}
    </span>
  );
}
