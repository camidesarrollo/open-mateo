import { Icon } from './Icon';
import { cn, focusRing } from './utils';

/** Páginas a mostrar con '…' en los huecos: [1, '…', 4, 5, 6, '…', 20] */
function pageRange(page: number, total: number, siblings: number): (number | 'gap')[] {
  const start = Math.max(2, page - siblings);
  const end = Math.min(total - 1, page + siblings);
  const pages: (number | 'gap')[] = [1];
  if (start > 2) pages.push('gap');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push('gap');
  if (total > 1) pages.push(total);
  return pages;
}

export interface PaginationProps {
  /** Página actual (empieza en 1) */
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  /** Páginas visibles a cada lado de la actual */
  siblings?: number;
  /** Muestra "Página X de Y" a la izquierda */
  showSummary?: boolean;
  className?: string;
}

export function Pagination({ page, totalPages, onChange, siblings = 1, showSummary = false, className }: PaginationProps) {
  const itemClass = cn(
    'flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-mono-data text-mono-data transition-colors',
    'disabled:pointer-events-none disabled:opacity-40',
    focusRing,
  );
  const idle = 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface';

  return (
    <nav aria-label="Paginación" className={cn('flex items-center justify-between gap-space-sm', className)}>
      {showSummary && (
        <span className="font-mono-data text-mono-data text-on-surface-variant">
          Página <strong className="font-medium text-on-surface">{page}</strong> de {totalPages}
        </span>
      )}
      <ul className="flex items-center gap-1">
        <li>
          <button
            type="button"
            className={cn(itemClass, idle)}
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            aria-label="Página anterior"
          >
            <Icon name="chevron_left" size={18} />
          </button>
        </li>
        {pageRange(page, totalPages, siblings).map((p, i) =>
          p === 'gap' ? (
            <li key={`gap-${i}`} aria-hidden className="px-1 font-mono-data text-mono-data text-outline">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                className={cn(itemClass, p === page ? 'bg-surface-container-high text-primary' : idle)}
                aria-current={p === page ? 'page' : undefined}
                onClick={() => onChange(p)}
              >
                {p}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            className={cn(itemClass, idle)}
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
            aria-label="Página siguiente"
          >
            <Icon name="chevron_right" size={18} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
