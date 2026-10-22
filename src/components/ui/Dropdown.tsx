import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Button, type ButtonSize, type ButtonVariant } from './Button';
import { Icon } from './Icon';
import { useDismiss } from './useDismiss';
import { cn } from './utils';

export type DropdownItem =
  | {
      id: string;
      label: ReactNode;
      icon?: string;
      onSelect: () => void;
      danger?: boolean;
      disabled?: boolean;
      /** Atajo mostrado a la derecha ("Ctrl E") */
      shortcut?: string;
    }
  | { id: string; separator: true };

export interface DropdownProps {
  items: DropdownItem[];
  label?: ReactNode;
  icon?: string;
  /** Botón disparador solo con icono; necesita aria-label */
  iconOnly?: boolean;
  'aria-label'?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  align?: 'start' | 'end';
  className?: string;
}

/** Menú de acciones desplegable con navegación por teclado */
export function Dropdown({
  items,
  label,
  icon,
  iconOnly = false,
  variant = 'secondary',
  size = 'md',
  align = 'start',
  className,
  ...aria
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = () => setOpen(false);
  useDismiss(rootRef, open, close);

  // Al abrir, el foco pasa a la primera opción
  useEffect(() => {
    if (open) menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus();
  }, [open]);

  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const options = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)'),
    );
    const index = options.indexOf(document.activeElement as HTMLButtonElement);
    const targets: Record<string, number> = {
      ArrowDown: (index + 1) % options.length,
      ArrowUp: (index - 1 + options.length) % options.length,
      Home: 0,
      End: options.length - 1,
    };
    if (e.key in targets) {
      e.preventDefault();
      options[targets[e.key]]?.focus();
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      close();
      rootRef.current?.querySelector<HTMLButtonElement>('[aria-haspopup]')?.focus();
    }
  };

  return (
    <div ref={rootRef} className={cn('relative inline-flex', className)}>
      <Button
        variant={variant}
        size={size}
        icon={icon}
        iconOnly={iconOnly}
        iconRight={iconOnly ? undefined : 'expand_more'}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
        {...aria}
      >
        {label}
      </Button>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          onKeyDown={onMenuKeyDown}
          className={cn(
            'absolute top-full z-50 mt-1 flex min-w-48 flex-col rounded-lg bg-surface-container-high p-1 shadow-elevated',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item) =>
            'separator' in item ? (
              <div key={item.id} role="separator" className="my-1 h-px bg-outline-variant/40" />
            ) : (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  item.onSelect();
                  close();
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded px-space-sm py-1.5 text-left font-label-md text-label-md transition-colors',
                  'hover:bg-surface-container-highest focus:bg-surface-container-highest focus:outline-none',
                  'disabled:pointer-events-none disabled:opacity-50',
                  item.danger ? 'text-error' : 'text-on-surface',
                )}
              >
                {item.icon && <Icon name={item.icon} size={16} className={item.danger ? undefined : 'text-on-surface-variant'} />}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span className="font-mono-badge text-[10px] text-on-surface-variant">{item.shortcut}</span>
                )}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
