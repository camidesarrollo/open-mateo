import { useId, type SelectHTMLAttributes } from 'react';
import { Icon } from './Icon';
import { cn, focusRing } from './utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  /** Etiqueta del campo; con hideLabel queda solo para lectores de pantalla */
  label?: string;
  hideLabel?: boolean;
  /** high: selector de estación · subtle: "Ordenar por" de la barra de filtros */
  variant?: 'high' | 'subtle';
  /** Icono a la derecha: expand_more o unfold_more */
  chevron?: string;
}

/** Select nativo con el estilo del observatorio (accesible y con teclado del sistema) */
export function Select({
  options,
  label,
  hideLabel = false,
  variant = 'high',
  chevron = 'expand_more',
  id,
  className,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;

  return (
    <div className={cn('inline-flex flex-col gap-1', className)}>
      {label && (
        <label
          htmlFor={selectId}
          className={hideLabel ? 'sr-only' : 'font-label-sm text-label-sm text-on-surface-variant'}
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={selectId}
          className={cn(
            'w-full cursor-pointer appearance-none rounded-lg py-1.5 pl-space-sm pr-8 font-label-md text-label-md text-on-surface transition-colors',
            'disabled:cursor-not-allowed disabled:opacity-50',
            variant === 'high'
              ? 'bg-surface-container-high hover:bg-surface-container-highest'
              : 'bg-surface-container hover:bg-surface-container-high',
            focusRing,
          )}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled} className="bg-surface-container-high">
              {o.label}
            </option>
          ))}
        </select>
        <Icon name={chevron} size={16} className="pointer-events-none absolute right-2 text-on-surface-variant" />
      </div>
    </div>
  );
}
