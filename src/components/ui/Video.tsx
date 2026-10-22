import type { ReactNode, VideoHTMLAttributes } from 'react';
import { StatusDot } from './StatusDot';
import { cn } from './utils';

export type VideoAspect = 'video' | 'wide' | 'square';

const aspectClasses: Record<VideoAspect, string> = {
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
  square: 'aspect-square',
};

export interface VideoProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'title'> {
  /** Título bajo el vídeo ("Radar Doppler · Sector NO") */
  title?: ReactNode;
  /** Metadato a la derecha del título ("UTC 16:40") */
  meta?: ReactNode;
  /** Etiqueta sobre la imagen; con live se acompaña de un punto rojo */
  badge?: ReactNode;
  live?: boolean;
  aspect?: VideoAspect;
}

/** Reproductor para animaciones satelitales o cámaras de estación */
export function Video({
  title,
  meta,
  badge,
  live = false,
  aspect = 'video',
  controls = true,
  className,
  children,
  ...rest
}: VideoProps) {
  const label = badge ?? (live ? 'EN VIVO' : null);

  return (
    <figure className={cn('overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm', className)}>
      <div className={cn('relative w-full', aspectClasses[aspect])}>
        <video className="h-full w-full object-cover" controls={controls} playsInline {...rest}>
          {children}
        </video>
        {label && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded bg-surface-container-lowest/80 px-2 py-0.5 font-mono-badge text-mono-badge text-on-surface backdrop-blur">
            {live && <StatusDot tone="error" size="sm" animation="ping" />}
            {label}
          </span>
        )}
      </div>
      {(title || meta) && (
        <figcaption className="flex items-center justify-between gap-2 px-space-sm py-2">
          {title && <span className="truncate font-label-md text-label-md text-on-surface">{title}</span>}
          {meta && <span className="shrink-0 font-mono-data text-[11px] text-on-surface-variant">{meta}</span>}
        </figcaption>
      )}
    </figure>
  );
}
