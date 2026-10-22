import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { cn, textTone, type Tone } from './utils';

export type ModalSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: string;
  iconTone?: Tone;
  children?: ReactNode;
  /** Botones de acción al pie */
  footer?: ReactNode;
  size?: ModalSize;
}

/**
 * Diálogo modal sobre <dialog> nativo: atrapa el foco, cierra con Escape
 * y devuelve el foco al elemento que lo abrió.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  icon,
  iconTone = 'primary',
  children,
  footer,
  size = 'md',
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={onClose}
      // Clic en el fondo (fuera del contenido) cierra el modal
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={cn(
        'm-auto w-[calc(100%-2rem)] overflow-hidden rounded-xl bg-surface-container p-0 text-on-surface shadow-elevated',
        'backdrop:bg-surface-container-lowest/70 backdrop:backdrop-blur-sm',
        sizeClasses[size],
      )}
    >
      <div className="flex items-start justify-between gap-space-sm p-space-md">
        <div className="flex items-start gap-space-sm">
          {icon && (
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high',
                textTone[iconTone],
              )}
            >
              <Icon name={icon} size={22} />
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <h2 id={titleId} className="font-headline-md text-headline-md text-on-surface">
              {title}
            </h2>
            {description && (
              <p id={descId} className="font-mono-data text-mono-data text-on-surface-variant">
                {description}
              </p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" iconOnly icon="close" aria-label="Cerrar" onClick={onClose} />
      </div>

      {children && <div className="px-space-md pb-space-md font-body-md text-body-md">{children}</div>}

      {footer && (
        <div className="flex flex-wrap justify-end gap-space-sm bg-surface-container-low px-space-md py-space-sm">
          {footer}
        </div>
      )}
    </dialog>
  );
}
