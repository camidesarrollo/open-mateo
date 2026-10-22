import { Fragment } from 'react';
import { Icon } from './Icon';
import { cn, focusRing } from './utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/** Ruta de navegación ("Observatorio climático / Estación Terrestre") */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Ruta de navegación" className={className}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          const content = (
            <>
              {item.icon && <Icon name={item.icon} size={15} />}
              {item.label}
            </>
          );
          const linkClass = cn(
            'inline-flex items-center gap-1 rounded font-body-md text-body-md text-on-surface-variant transition-colors hover:text-on-surface',
            focusRing,
          );

          return (
            <Fragment key={`${item.label}-${i}`}>
              <li className="inline-flex items-center">
                {last ? (
                  <span aria-current="page" className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface">
                    {content}
                  </span>
                ) : item.href ? (
                  <a href={item.href} onClick={item.onClick} className={linkClass}>
                    {content}
                  </a>
                ) : (
                  <button type="button" onClick={item.onClick} className={linkClass}>
                    {content}
                  </button>
                )}
              </li>
              {!last && (
                <li aria-hidden className="font-mono-data text-mono-data text-outline">
                  /
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
