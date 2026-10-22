import { cloneElement, useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { cn } from './utils';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

const sideClasses: Record<TooltipSide, string> = {
  top: 'bottom-full left-1/2 mb-1.5 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-1.5 -translate-x-1/2',
  left: 'right-full top-1/2 mr-1.5 -translate-y-1/2',
  right: 'left-full top-1/2 ml-1.5 -translate-y-1/2',
};

export interface TooltipProps {
  content: ReactNode;
  /** Un único elemento enfocable (botón, enlace...) */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  side?: TooltipSide;
  /** Retardo antes de mostrarse, en ms */
  delay?: number;
}

/** Texto de ayuda al pasar el ratón o enfocar con teclado */
export function Tooltip({ content, children, side = 'top', delay = 200 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();

  const show = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setVisible(true), delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setVisible(false);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => e.key === 'Escape' && hide()}
    >
      {cloneElement(children, { 'aria-describedby': visible ? id : undefined })}
      <span
        role="tooltip"
        id={id}
        className={cn(
          'pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-surface-container-highest px-2 py-1',
          'font-mono-badge text-mono-badge text-on-surface shadow-elevated transition-opacity duration-100',
          sideClasses[side],
          visible ? 'opacity-100' : 'invisible opacity-0',
        )}
      >
        {content}
      </span>
    </span>
  );
}
