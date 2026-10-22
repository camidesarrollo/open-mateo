import { useId, useState, type ReactNode } from 'react';
import { Icon } from './Icon';
import { cn, focusRing } from './utils';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  icon?: string;
  /** Dato a la derecha del título (badge, contador...) */
  meta?: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** single: solo una sección abierta a la vez · multiple: varias */
  type?: 'single' | 'multiple';
  defaultOpen?: string[];
  /** separated: bloques independientes · flush: lista con divisores */
  variant?: 'separated' | 'flush';
  className?: string;
}

export function Accordion({
  items,
  type = 'single',
  defaultOpen = [],
  variant = 'separated',
  className,
}: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const baseId = useId();

  const toggle = (id: string) =>
    setOpen((current) => {
      if (current.includes(id)) return current.filter((x) => x !== id);
      return type === 'single' ? [id] : [...current, id];
    });

  return (
    <div
      className={cn(
        'flex flex-col',
        variant === 'separated' ? 'gap-2' : 'divide-y divide-outline-variant/40',
        className,
      )}
    >
      {items.map((item) => {
        const expanded = open.includes(item.id);
        const headerId = `${baseId}-h-${item.id}`;
        const panelId = `${baseId}-p-${item.id}`;

        return (
          <div key={item.id} className={cn(variant === 'separated' && 'rounded-lg bg-surface-container-low')}>
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={expanded}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
                className={cn(
                  'flex w-full items-center justify-between gap-2 rounded-lg px-space-sm py-2.5 text-left transition-colors',
                  'font-label-md text-label-md text-on-surface hover:bg-surface-container-high',
                  'disabled:pointer-events-none disabled:opacity-50',
                  focusRing,
                )}
              >
                <span className="flex min-w-0 items-center gap-space-sm">
                  {item.icon && <Icon name={item.icon} size={18} className="text-primary" />}
                  <span className="truncate">{item.title}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  {item.meta}
                  <Icon
                    name="expand_more"
                    size={18}
                    className={cn('text-on-surface-variant transition-transform duration-200', expanded && 'rotate-180')}
                  />
                </span>
              </button>
            </h3>
            {/* grid-rows 0fr → 1fr anima la altura sin medir el contenido */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              inert={!expanded}
              className={cn(
                'grid transition-[grid-template-rows] duration-200 ease-out',
                expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div className="px-space-sm pb-space-sm pt-1 font-body-md text-body-md text-on-surface-variant">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
