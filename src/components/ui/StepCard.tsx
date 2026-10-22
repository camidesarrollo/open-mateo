import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { ProgressBar } from './ProgressBar';
import { cn, textTone, type Tone } from './utils';

export type StepStatus = 'done' | 'progress' | 'locked';

export interface StepCardProps {
  title: ReactNode;
  description?: ReactNode;
  /** Icono del paso; si no hay, se muestra el número de `step` */
  icon?: string;
  step?: number;
  iconTone?: Tone;
  status?: StepStatus;
  /** Avance 0-100 cuando status = 'progress' */
  progress?: number;
  className?: string;
}

/** Hito / paso con estado, como los "Hitos del Investigador" */
export function StepCard({
  title,
  description,
  icon,
  step,
  iconTone = 'primary',
  status = 'progress',
  progress,
  className,
}: StepCardProps) {
  const locked = status === 'locked';

  const trailing = {
    done: <Icon name="check_circle" filled size={20} className="text-secondary" label="Completado" />,
    progress: <Icon name="lock_open" size={18} className="text-outline" label="En curso" />,
    locked: <Icon name="lock" size={18} className="text-outline" label="Bloqueado" />,
  }[status];

  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 rounded-lg bg-surface-container-low p-space-sm',
        locked ? 'opacity-50' : 'transition-colors hover:bg-surface-container-high',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-space-sm">
        <div className="flex min-w-0 items-center gap-space-sm">
          <div
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-high',
              locked ? 'text-outline' : textTone[iconTone],
            )}
          >
            {icon ? (
              <Icon name={icon} size={18} />
            ) : (
              <span className="font-mono-data text-mono-data font-semibold">{step}</span>
            )}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-label-md text-label-md font-medium text-on-surface">{title}</span>
            {description && (
              <span className="truncate font-mono-data text-[11px] text-on-surface-variant">{description}</span>
            )}
          </div>
        </div>
        {trailing}
      </div>
      {status === 'progress' && progress !== undefined && <ProgressBar value={progress} tone="primary" />}
    </div>
  );
}
