import { useId, useRef, useState, type ReactNode } from 'react';
import { useDismiss } from './useDismiss';
import { cn, focusRing } from './utils';

export interface PopoverProps {
  /** Contenido visual del disparador (icono, avatar, texto). Se envuelve en un <button> */
  trigger: ReactNode;
  /** Etiqueta accesible del disparador si solo contiene un icono */
  triggerLabel?: string;
  triggerClassName?: string;
  /** Título del panel (también lo nombra para lectores de pantalla) */
  title?: ReactNode;
  children: ReactNode;
  side?: 'bottom' | 'top';
  align?: 'start' | 'end';
  /** Modo controlado opcional */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** Panel flotante con contenido libre (filtros, detalle de un sensor, perfil...) */
export function Popover({
  trigger,
  triggerLabel,
  triggerClassName,
  title,
  children,
  side = 'bottom',
  align = 'start',
  open: openProp,
  onOpenChange,
  className,
}: PopoverProps) {
  const [internal, setInternal] = useState(false);
  const open = openProp ?? internal;
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const titleId = useId();

  const setOpen = (next: boolean) => {
    setInternal(next);
    onOpenChange?.(next);
  };

  useDismiss(rootRef, open, () => setOpen(false));

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        aria-label={triggerLabel}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen(!open)}
        className={cn('inline-flex items-center rounded-lg', focusRing, triggerClassName)}
      >
        {trigger}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-labelledby={title ? titleId : undefined}
          className={cn(
            'absolute z-50 w-72 rounded-xl bg-surface-container-high p-space-md text-on-surface shadow-elevated',
            side === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2',
            align === 'end' ? 'right-0' : 'left-0',
            className,
          )}
        >
          {title && (
            <h3 id={titleId} className="mb-space-sm font-label-md text-label-md font-semibold text-on-surface">
              {title}
            </h3>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
