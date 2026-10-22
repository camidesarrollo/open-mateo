import { useEffect, useRef, type InputHTMLAttributes } from 'react';
import { Icon } from './Icon';
import { cn } from './utils';

export interface CommandInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  icon?: string;
  /** Tecla que, con Ctrl/⌘, enfoca el campo desde cualquier parte ('k' → Ctrl+K) */
  hotkey?: string;
  /** Muestra una "x" para limpiar cuando hay texto */
  onClear?: () => void;
  /** Etiqueta accesible (el placeholder no sustituye a una etiqueta) */
  label?: string;
}

/** Campo de búsqueda / comandos con estilo de input del README */
export function CommandInput({
  icon = 'search',
  hotkey,
  onClear,
  label = 'Buscar',
  value,
  className,
  ...rest
}: CommandInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hotkey) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === hotkey.toLowerCase()) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [hotkey]);

  const hasValue = value !== undefined && value !== '';

  return (
    <div className={cn('relative flex items-center', className)}>
      <Icon name={icon} size={16} className="pointer-events-none absolute left-2.5 text-outline" />
      <input
        ref={inputRef}
        type="search"
        aria-label={label}
        value={value}
        className={cn(
          'w-full rounded-lg border border-outline-variant/60 bg-surface-container-lowest py-1.5 pl-8 pr-14',
          'font-body-md text-body-md text-on-surface placeholder:text-outline',
          'transition-shadow focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/40',
          '[&::-webkit-search-cancel-button]:hidden',
        )}
        {...rest}
      />
      <div className="absolute right-2 flex items-center gap-1">
        {onClear && hasValue && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Limpiar búsqueda"
            className="flex rounded text-on-surface-variant hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Icon name="close" size={14} />
          </button>
        )}
        {hotkey && !hasValue && (
          <kbd className="rounded border border-outline-variant/60 bg-surface-container-high px-1.5 py-0.5 font-mono-badge text-[10px] text-on-surface-variant">
            Ctrl {hotkey.toUpperCase()}
          </kbd>
        )}
      </div>
    </div>
  );
}
