import type { KeyboardEvent, ReactNode } from 'react';
import { Icon } from './Icon';
import { cn, focusRing } from './utils';

export interface ButtonGroupOption<T extends string> {
  value: T;
  label: ReactNode;
  icon?: string;
  disabled?: boolean;
}

export interface ButtonGroupProps<T extends string> {
  options: ButtonGroupOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Describe el grupo para lectores de pantalla ("Categoría de clima") */
  'aria-label': string;
  fullWidth?: boolean;
  className?: string;
}

/** Control segmentado de selección única ("Todos / Soleado / Nublado...") */
export function ButtonGroup<T extends string>({
  options,
  value,
  onChange,
  fullWidth = false,
  className,
  ...aria
}: ButtonGroupProps<T>) {
  // Flechas para moverse entre opciones (patrón radiogroup)
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();

    const enabled = options.filter((o) => !o.disabled);
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    const index = enabled.findIndex((o) => o.value === value);
    const next = enabled[(index + step + enabled.length) % enabled.length];
    onChange(next.value);
    e.currentTarget.querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`)?.focus();
  };

  return (
    <div
      role="radiogroup"
      onKeyDown={onKeyDown}
      className={cn(
        'flex max-w-full items-center gap-1 overflow-x-auto rounded-lg bg-surface-container-lowest p-1',
        fullWidth && 'w-full',
        className,
      )}
      {...aria}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            data-value={option.value}
            tabIndex={active ? 0 : -1}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex items-center justify-center gap-1 whitespace-nowrap rounded px-space-sm py-1 font-label-md text-label-md transition-colors',
              'disabled:pointer-events-none disabled:opacity-50',
              focusRing,
              fullWidth && 'flex-1',
              active
                ? 'bg-surface-container-high text-primary'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
            )}
          >
            {option.icon && <Icon name={option.icon} size={15} />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
