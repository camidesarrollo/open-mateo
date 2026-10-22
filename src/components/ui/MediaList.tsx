import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { cn, focusRing, textTone, type Tone } from './utils';

export interface MediaListMedia {
  icon?: string;
  tone?: Tone;
  /** Imagen (avatar, miniatura de mapa...) */
  src?: string;
  alt?: string;
  /** Círculo (persona) en vez de cuadrado redondeado (sensor, documento) */
  round?: boolean;
}

export interface MediaListItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  media?: MediaListMedia;
  /** Contenido a la derecha: badge, hora, botón... */
  aside?: ReactNode;
  onClick?: () => void;
}

export interface MediaListProps {
  items: MediaListItem[];
  surface?: 'low' | 'lowest' | 'none';
  className?: string;
}

function Media({ icon, tone = 'primary', src, alt = '', round = false }: MediaListMedia) {
  const shape = round ? 'rounded-full' : 'rounded-lg';
  if (src) return <img src={src} alt={alt} className={cn('h-8 w-8 shrink-0 object-cover', shape)} />;
  return (
    <div
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center',
        shape,
        round ? 'bg-primary text-on-primary' : cn('bg-surface-container-high', textTone[tone]),
      )}
    >
      <Icon name={icon ?? (round ? 'person' : 'sensors')} size={18} />
    </div>
  );
}

/** Lista con miniatura + título + metadato, como "Malla de Sensores" o el perfil del sidebar */
export function MediaList({ items, surface = 'low', className }: MediaListProps) {
  const surfaceClass = { low: 'bg-surface-container-low', lowest: 'bg-surface-container-lowest', none: '' }[surface];

  return (
    <ul className={cn('flex flex-col gap-2', className)}>
      {items.map((item) => {
        const body = (
          <>
            <div className="flex min-w-0 items-center gap-space-sm">
              {item.media && <Media {...item.media} />}
              <div className="flex min-w-0 flex-col text-left">
                <span className="truncate font-label-md text-label-md text-on-surface">{item.title}</span>
                {item.description && (
                  <span className="truncate font-mono-data text-[11px] text-on-surface-variant">{item.description}</span>
                )}
              </div>
            </div>
            {item.aside && <div className="shrink-0">{item.aside}</div>}
          </>
        );
        const rowClass = cn('flex w-full items-center justify-between gap-space-sm rounded-lg p-space-sm', surfaceClass);

        return (
          <li key={item.id}>
            {item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className={cn(rowClass, focusRing, 'transition-colors hover:bg-surface-container-high')}
              >
                {body}
              </button>
            ) : (
              <div className={rowClass}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
