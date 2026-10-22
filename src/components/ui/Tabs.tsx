import { useId, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Icon } from './Icon';
import { cn, focusRing } from './utils';

export interface TabItem<T extends string> {
  value: T;
  label: ReactNode;
  icon?: string;
  /** Contador o badge al lado del texto */
  badge?: ReactNode;
  /** Contenido del panel; si ninguna pestaña lo tiene, Tabs solo pinta la barra */
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps<T extends string> {
  items: TabItem<T>[];
  /** Modo controlado */
  value?: T;
  /** Modo no controlado */
  defaultValue?: T;
  onChange?: (value: T) => void;
  variant?: 'underline' | 'pill';
  'aria-label'?: string;
  className?: string;
}

export function Tabs<T extends string>({
  items,
  value,
  defaultValue,
  onChange,
  variant = 'underline',
  className,
  ...aria
}: TabsProps<T>) {
  const baseId = useId();
  const [internal, setInternal] = useState<T | undefined>(defaultValue ?? items[0]?.value);
  const current = value ?? internal;
  const active = items.find((i) => i.value === current);

  const select = (next: T) => {
    setInternal(next);
    onChange?.(next);
  };

  // Flechas, Inicio y Fin según el patrón WAI-ARIA de pestañas
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((i) => !i.disabled);
    const index = enabled.findIndex((i) => i.value === current);
    const targets: Record<string, number> = {
      ArrowRight: (index + 1) % enabled.length,
      ArrowLeft: (index - 1 + enabled.length) % enabled.length,
      Home: 0,
      End: enabled.length - 1,
    };
    if (!(e.key in targets)) return;
    e.preventDefault();
    const next = enabled[targets[e.key]];
    select(next.value);
    e.currentTarget.querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`)?.focus();
  };

  const pill = variant === 'pill';

  return (
    <div className={cn('flex flex-col gap-space-md', className)}>
      <div
        role="tablist"
        onKeyDown={onKeyDown}
        className={cn(
          'flex max-w-full items-center overflow-x-auto',
          pill ? 'gap-1 self-start rounded-lg bg-surface-container-lowest p-1' : 'gap-space-sm border-b border-outline-variant/40',
        )}
        {...aria}
      >
        {items.map((item) => {
          const selected = item.value === current;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.value}`}
              aria-selected={selected}
              aria-controls={item.content ? `${baseId}-panel-${item.value}` : undefined}
              tabIndex={selected ? 0 : -1}
              data-value={item.value}
              disabled={item.disabled}
              onClick={() => select(item.value)}
              className={cn(
                'relative flex items-center gap-1.5 whitespace-nowrap font-label-md text-label-md transition-colors',
                'disabled:pointer-events-none disabled:opacity-50',
                focusRing,
                pill ? 'rounded px-space-sm py-1' : 'rounded-t px-space-sm py-2',
                selected
                  ? pill
                    ? 'bg-surface-container-high text-primary'
                    : 'text-primary after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary'
                  : 'text-on-surface-variant hover:text-on-surface',
                !selected && pill && 'hover:bg-surface-container',
              )}
            >
              {item.icon && <Icon name={item.icon} size={16} />}
              {item.label}
              {item.badge !== undefined && (
                <span className="rounded bg-surface-container-highest px-1.5 font-mono-badge text-[10px] text-on-surface-variant">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {active?.content && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${active.value}`}
          aria-labelledby={`${baseId}-tab-${active.value}`}
          tabIndex={0}
          className="focus-visible:outline-none"
        >
          {active.content}
        </div>
      )}
    </div>
  );
}
