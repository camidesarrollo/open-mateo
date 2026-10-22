import type { ElementType, ReactNode } from 'react';
import { Icon } from './Icon';
import { cn, textTone, type Tone } from './utils';

export interface SectionHeaderProps {
  title: ReactNode;
  icon?: string;
  iconTone?: Tone;
  /** Resumen junto al título ("14 jornadas · 7 ant. · Hoy · 6 post.") */
  badge?: ReactNode;
  description?: ReactNode;
  /** Botones a la derecha ("Ir a Hoy", "Compacta"...) */
  actions?: ReactNode;
  as?: ElementType;
  className?: string;
}

export function SectionHeader({
  title,
  icon,
  iconTone = 'primary',
  badge,
  description,
  actions,
  as: Heading = 'h2',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-space-sm', className)}>
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex flex-wrap items-center gap-space-sm">
          {icon && <Icon name={icon} size={22} className={textTone[iconTone]} />}
          <Heading className="font-headline-md text-headline-md text-on-surface">{title}</Heading>
          {badge &&
            (typeof badge === 'string' ? (
              <span className="rounded bg-surface-container-low px-2 py-0.5 font-mono-badge text-mono-badge text-on-surface-variant">
                {badge}
              </span>
            ) : (
              badge
            ))}
        </div>
        {description && <p className="font-mono-data text-mono-data text-on-surface-variant">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-space-xs">{actions}</div>}
    </div>
  );
}
