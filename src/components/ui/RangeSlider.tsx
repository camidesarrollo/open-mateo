import { useState, type CSSProperties, type ReactNode } from 'react';
import { bgTone, cn, textTone, type Tone } from './utils';

/** Diámetro de la manija en px (w-3.5) */
const THUMB = 14;

export type RangeValue = [number, number];

export interface RangeSliderProps {
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Texto a la izquierda ("Rango térmico") */
  label?: string;
  /** Da formato a los valores mostrados y anunciados (v => `${v}°C`) */
  format?: (value: number) => ReactNode;
  /** Marcas bajo la pista ([0, 22, 45]) */
  ticks?: number[];
  tone?: Tone;
  disabled?: boolean;
  className?: string;
}

/** Selector de rango con dos manijas (mínimo y máximo) */
export function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  format = String,
  ticks,
  tone = 'secondary',
  disabled = false,
  className,
}: RangeSliderProps) {
  const [low, high] = value;
  // La última manija usada queda encima, para poder separarlas si se juntan
  const [active, setActive] = useState<0 | 1>(1);
  const [focused, setFocused] = useState<0 | 1 | null>(null);

  const percent = (v: number) => ((Math.min(max, Math.max(min, v)) - min) / (max - min)) * 100;
  // Alinea con el centro de la manija nativa, que recorre de THUMB/2 a ancho - THUMB/2
  const at = (v: number) => `calc(${percent(v)}% + ${THUMB / 2 - (percent(v) * THUMB) / 100}px)`;

  const text = (v: number) => {
    const formatted = format(v);
    return typeof formatted === 'string' || typeof formatted === 'number' ? String(formatted) : String(v);
  };

  const inputs = [
    { index: 0 as const, v: low, name: 'mínimo', set: (v: number) => onChange([Math.min(v, high), high]) },
    { index: 1 as const, v: high, name: 'máximo', set: (v: number) => onChange([low, Math.max(v, low)]) },
  ];

  const thumbStyle = (v: number): CSSProperties => ({ left: at(v) });

  return (
    <div className={cn('flex flex-col gap-1', disabled && 'opacity-50', className)}>
      {label && (
        <div className="flex items-center justify-between font-mono-data text-mono-data text-on-surface-variant">
          <span>{label}:</span>
          <span className={cn('font-medium', textTone[tone])}>
            {format(low)} — {format(high)}
          </span>
        </div>
      )}

      <div className="relative flex h-3.5 items-center">
        <div className="absolute inset-x-0 h-2 rounded-full bg-surface-container-highest" />
        <div
          className={cn('absolute h-2 rounded-full', bgTone[tone])}
          style={{ left: at(low), right: `calc(100% - ${at(high)})` }}
        />
        {inputs.map(({ index, v }) => (
          <span
            key={index}
            aria-hidden
            className={cn(
              'pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-on-surface shadow-md transition-shadow',
              focused === index && 'ring-2 ring-primary/40',
            )}
            style={thumbStyle(v)}
          />
        ))}

        {/* Inputs nativos invisibles: dan teclado, táctil y lectores de pantalla */}
        {inputs.map(({ index, v, name, set }) => (
          <input
            key={index}
            type="range"
            min={min}
            max={max}
            step={step}
            value={v}
            disabled={disabled}
            aria-label={label ? `${label} ${name}` : name}
            aria-valuetext={text(v)}
            onChange={(e) => set(Number(e.target.value))}
            onPointerDown={() => setActive(index)}
            onFocus={() => {
              setActive(index);
              setFocused(index);
            }}
            onBlur={() => setFocused(null)}
            className={cn(
              'pointer-events-none absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0',
              '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none',
              '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:border-0',
              disabled && 'cursor-not-allowed',
              active === index ? 'z-20' : 'z-10',
            )}
          />
        ))}
      </div>

      {ticks && ticks.length > 0 && (
        <div className="flex items-center justify-between font-mono-badge text-[10px] text-outline">
          {ticks.map((t) => (
            <span key={t}>{format(t)}</span>
          ))}
        </div>
      )}
    </div>
  );
}
