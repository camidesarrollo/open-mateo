import type { ReactNode } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { cn } from './utils';

/** info: primary · success: secondary · insight: tertiary (modelos/proyecciones) · error */
export type AlertTone = 'info' | 'success' | 'insight' | 'error';

const toneConfig: Record<AlertTone, { icon: string; iconClass: string; tinted: string }> = {
  info: { icon: 'info', iconClass: 'text-primary', tinted: 'bg-primary/10' },
  success: { icon: 'verified_user', iconClass: 'text-secondary', tinted: 'bg-secondary/10' },
  insight: { icon: 'auto_awesome', iconClass: 'text-tertiary', tinted: 'bg-tertiary/10' },
  error: { icon: 'error', iconClass: 'text-error', tinted: 'bg-error-container/30' },
};

export interface AlertProps {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  icon?: string;
  /** subtle: fondo neutro (como el aviso del Sello Copernicus) · tinted: fondo del color del tono */
  variant?: 'subtle' | 'tinted';
  action?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

/** Mensaje contextual dentro de una tarjeta o sección */
export function Alert({
  tone = 'info',
  title,
  children,
  icon,
  variant = 'subtle',
  action,
  onDismiss,
  className,
}: AlertProps) {
  const config = toneConfig[tone];

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-2 rounded-lg p-space-sm',
        variant === 'subtle' ? 'bg-surface-container-low' : config.tinted,
        className,
      )}
    >
      <Icon name={icon ?? config.icon} size={18} className={cn('mt-0.5 shrink-0', config.iconClass)} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title && <span className="font-label-md text-label-md font-semibold text-on-surface">{title}</span>}
        {children && (
          <div className="font-body-md text-[12px] leading-relaxed text-on-surface-variant [&_strong]:text-on-surface">
            {children}
          </div>
        )}
        {action && <div className="pt-1">{action}</div>}
      </div>
      {onDismiss && (
        <Button variant="ghost" size="sm" iconOnly icon="close" aria-label="Descartar aviso" onClick={onDismiss} className="-m-1" />
      )}
    </div>
  );
}
