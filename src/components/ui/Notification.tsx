import type { ReactNode } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { StatusDot } from './StatusDot';
import { cn, textTone, type Tone } from './utils';

export interface NotificationProps {
  title: ReactNode;
  message?: ReactNode;
  /** Marca temporal en mono ("14 Oct · 17:15h") */
  time?: ReactNode;
  icon?: string;
  tone?: Tone;
  /** Sustituye el icono por un avatar u otra miniatura */
  media?: ReactNode;
  unread?: boolean;
  actions?: ReactNode;
  onClick?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/** Elemento del centro de notificaciones (campana de la cabecera) */
export function Notification({
  title,
  message,
  time,
  icon = 'notifications',
  tone = 'primary',
  media,
  unread = false,
  actions,
  onClick,
  onDismiss,
  className,
}: NotificationProps) {
  return (
    <div
      className={cn(
        'group relative flex gap-space-sm rounded-lg p-space-sm transition-colors hover:bg-surface-container-high',
        unread && 'bg-surface-container-low',
        className,
      )}
    >
      {media ?? (
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-high',
            textTone[tone],
          )}
        >
          <Icon name={icon} size={18} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          {onClick ? (
            // El ::after extiende el área clicable a toda la notificación
            <button
              type="button"
              onClick={onClick}
              className="truncate text-left font-label-md text-label-md text-on-surface after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary/40"
            >
              {title}
            </button>
          ) : (
            <span className="truncate font-label-md text-label-md text-on-surface">{title}</span>
          )}
          <div className="flex shrink-0 items-center gap-1.5">
            {time && <span className="font-mono-badge text-[11px] text-on-surface-variant">{time}</span>}
            {unread && <StatusDot tone={tone} size="sm" label="Sin leer" />}
          </div>
        </div>
        {message && <p className="font-body-md text-[12px] leading-relaxed text-on-surface-variant">{message}</p>}
        {actions && <div className="relative z-10 flex gap-space-xs pt-1">{actions}</div>}
      </div>

      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          icon="close"
          aria-label="Descartar notificación"
          onClick={onDismiss}
          className="relative z-10 -m-1 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
        />
      )}
    </div>
  );
}
