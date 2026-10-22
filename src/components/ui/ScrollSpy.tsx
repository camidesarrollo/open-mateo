import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { Icon } from './Icon';
import { cn, focusRing } from './utils';

export interface ScrollSpySection {
  /** id del elemento de la página al que apunta */
  id: string;
  label: ReactNode;
  icon?: string;
  /** Contenido a la derecha ("3 act.") */
  badge?: ReactNode;
}

export interface ScrollSpyProps {
  sections: ScrollSpySection[];
  /** Encabezado pequeño sobre la lista ("Navegación Táctica") */
  title?: ReactNode;
  /** Alto de la cabecera fija en px, para no quedar tapado (h-16 = 64) */
  offset?: number;
  onChange?: (id: string) => void;
  className?: string;
}

/**
 * Navegación que resalta la sección visible al hacer scroll.
 * Da a cada sección destino `scroll-mt-20` para que no quede bajo la cabecera.
 */
export function ScrollSpy({ sections, title, offset = 64, onChange, className }: ScrollSpyProps) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    // La sección activa es la primera que cruza la franja superior del viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActive(visible[0].target.id);
          onChange?.(visible[0].target.id);
        }
      },
      { rootMargin: `-${offset}px 0px -60% 0px` },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections, offset, onChange]);

  const onClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
    setActive(id);
  };

  return (
    <nav className={cn('flex flex-col gap-space-xs', className)} aria-label={typeof title === 'string' ? title : 'Secciones'}>
      {title && (
        <div className="mb-space-xs px-space-xs font-label-sm text-[10px] uppercase tracking-wider text-outline">{title}</div>
      )}
      {sections.map((section) => {
        const current = section.id === active;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={current ? 'location' : undefined}
            onClick={(e) => onClick(e, section.id)}
            className={cn(
              'flex items-center justify-between rounded-lg px-space-sm py-2 transition-colors',
              focusRing,
              current
                ? 'bg-surface-container-high font-medium text-primary'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
            )}
          >
            <span className="flex items-center gap-space-sm">
              {section.icon && <Icon name={section.icon} size={18} />}
              <span className="font-label-md text-label-md">{section.label}</span>
            </span>
            {section.badge}
          </a>
        );
      })}
    </nav>
  );
}
