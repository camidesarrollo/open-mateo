export type ClassValue = string | false | null | undefined | 0;

/** Une clases ignorando valores falsy: cn('a', cond && 'b') */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Anillo de foco del README: 0 0 0 2px primary al 40%, sin blur */
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40';

/** Acentos del espectro científico del sistema */
export type Tone = 'neutral' | 'primary' | 'secondary' | 'tertiary' | 'error';

/** Tonos de texto: acentos + niveles de contraste */
export type TextTone = Tone | 'default' | 'muted' | 'outline';

export const textTone: Record<TextTone, string> = {
  default: 'text-on-surface',
  muted: 'text-on-surface-variant',
  outline: 'text-outline',
  neutral: 'text-on-surface-variant',
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
  error: 'text-error',
};

export const bgTone: Record<Tone, string> = {
  neutral: 'bg-outline',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
  error: 'bg-error',
};
