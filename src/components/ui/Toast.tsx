import { useEffect, useState, type ReactNode } from 'react';
import type { AlertTone } from './Alert';
import { Button } from './Button';
import { Icon } from './Icon';
import { ToastContext, type ToastItem, type ToastOptions } from './toast-context';
import { cn } from './utils';

const toneConfig: Record<AlertTone, { icon: string; className: string; bar: string }> = {
  info: { icon: 'info', className: 'text-primary', bar: 'bg-primary' },
  success: { icon: 'check_circle', className: 'text-secondary', bar: 'bg-secondary' },
  insight: { icon: 'auto_awesome', className: 'text-tertiary', bar: 'bg-tertiary' },
  error: { icon: 'error', className: 'text-error', bar: 'bg-error' },
};

export interface ToastProps extends ToastItem {
  onDismiss: (id: string) => void;
}

/** Tarjeta individual; normalmente se usa a través de useToast() */
export function Toast({ id, title, description, tone = 'info', icon, duration = 5000, action, onDismiss }: ToastProps) {
  const config = toneConfig[tone];

  useEffect(() => {
    if (!duration) return;
    const timer = window.setTimeout(() => onDismiss(id), duration);
    return () => window.clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className="pointer-events-auto relative flex w-full items-start gap-2 overflow-hidden rounded-xl bg-surface-container-high p-space-sm pl-space-md shadow-elevated"
    >
      <span className={cn('absolute inset-y-0 left-0 w-1', config.bar)} aria-hidden />
      <Icon name={icon ?? config.icon} size={18} filled className={cn('mt-0.5 shrink-0', config.className)} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-label-md text-label-md font-semibold text-on-surface">{title}</span>
        {description && <span className="font-mono-data text-[11px] text-on-surface-variant">{description}</span>}
        {action && (
          <button
            type="button"
            onClick={() => {
              action.onClick();
              onDismiss(id);
            }}
            className={cn('self-start pt-1 font-label-sm text-label-sm hover:underline', config.className)}
          >
            {action.label}
          </button>
        )}
      </div>
      <Button variant="ghost" size="sm" iconOnly icon="close" aria-label="Cerrar aviso" onClick={() => onDismiss(id)} className="-m-1" />
    </div>
  );
}

export interface ToastProviderProps {
  children: ReactNode;
  position?: 'bottom-right' | 'top-right' | 'bottom-center';
}

const positionClasses = {
  'bottom-right': 'bottom-space-lg right-space-lg',
  'top-right': 'top-20 right-space-lg',
  'bottom-center': 'bottom-space-lg left-1/2 -translate-x-1/2',
};

/** Envuelve la app (en main.tsx) para poder usar useToast() en cualquier componente */
export function ToastProvider({ children, position = 'bottom-right' }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = (id: string) => setToasts((list) => list.filter((t) => t.id !== id));

  const toast = (options: ToastOptions) => {
    const id = crypto.randomUUID();
    setToasts((list) => [...list, { ...options, id }]);
    return id;
  };

  return (
    <ToastContext value={{ toast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        className={cn(
          'pointer-events-none fixed z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2',
          positionClasses[position],
        )}
      >
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext>
  );
}
