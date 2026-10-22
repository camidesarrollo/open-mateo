import { Children, useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from './Button';
import { cn } from './utils';

export interface CarouselProps {
  children: ReactNode;
  /** Nombre accesible del carrusel ("Línea temporal climática") */
  label: string;
  /** Contenido a la izquierda de los controles */
  header?: ReactNode;
  /** Ancho de cada diapositiva, p. ej. 'w-40' o 'w-full sm:w-1/2' */
  itemClassName?: string;
  showControls?: boolean;
  className?: string;
}

/** Carrusel horizontal con scroll-snap; funciona con rueda, táctil y botones */
export function Carousel({
  children,
  label,
  header,
  itemClassName = 'w-40',
  showControls = true,
  className,
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const slides = Children.toArray(children);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 1,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
    });
  };

  // Recalcula los extremos cuando cambia el tamaño del carrusel
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scroll = (direction: 1 | -1) => {
    const el = trackRef.current;
    el?.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section aria-roledescription="carrusel" aria-label={label} className={cn('flex flex-col gap-space-sm', className)}>
      {(header || showControls) && (
        <div className="flex items-center justify-between gap-space-sm">
          <div className="min-w-0">{header}</div>
          {showControls && (
            <div className="flex gap-1">
              <Button variant="subtle" size="sm" iconOnly icon="chevron_left" aria-label="Anterior" disabled={edges.start} onClick={() => scroll(-1)} />
              <Button variant="subtle" size="sm" iconOnly icon="chevron_right" aria-label="Siguiente" disabled={edges.end} onClick={() => scroll(1)} />
            </div>
          )}
        </div>
      )}
      <div
        ref={trackRef}
        onScroll={updateEdges}
        className="flex snap-x snap-mandatory gap-space-sm overflow-x-auto scroll-smooth pb-1"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${slides.length}`}
            className={cn('shrink-0 snap-start', itemClassName)}
          >
            {slide}
          </div>
        ))}
      </div>
    </section>
  );
}
