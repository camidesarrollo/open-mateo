import type { ElementType, HTMLAttributes } from 'react';
import { cn, textTone, type TextTone } from './utils';

export type TypographyVariant =
  | 'headline-xl'
  | 'headline-lg'
  | 'headline-md'
  | 'body-lg'
  | 'body-md'
  | 'label-md'
  | 'label-sm'
  | 'overline'
  | 'metric'
  | 'mono-data'
  | 'mono-badge';

const variantClasses: Record<TypographyVariant, string> = {
  'headline-xl': 'font-headline-xl text-headline-xl-mobile md:text-headline-xl tracking-tight',
  'headline-lg': 'font-headline-lg text-headline-lg',
  'headline-md': 'font-headline-md text-headline-md',
  'body-lg': 'font-body-lg text-body-lg',
  'body-md': 'font-body-md text-body-md',
  'label-md': 'font-label-md text-label-md',
  'label-sm': 'font-label-sm text-label-sm',
  overline: 'font-label-sm text-label-sm uppercase tracking-wider',
  metric: 'font-telemetry-metric text-telemetry-metric tracking-tight tabular-nums',
  'mono-data': 'font-mono-data text-mono-data',
  'mono-badge': 'font-mono-badge text-mono-badge',
};

const defaultElement: Record<TypographyVariant, ElementType> = {
  'headline-xl': 'h1',
  'headline-lg': 'h2',
  'headline-md': 'h3',
  'body-lg': 'p',
  'body-md': 'p',
  'label-md': 'span',
  'label-sm': 'span',
  overline: 'span',
  metric: 'span',
  'mono-data': 'span',
  'mono-badge': 'span',
};

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  tone?: TextTone;
  /** Cambia la etiqueta sin perder el estilo: <Typography variant="headline-md" as="h2"> */
  as?: ElementType;
  truncate?: boolean;
}

export function Typography({
  variant = 'body-md',
  tone = 'default',
  as,
  truncate = false,
  className,
  ...rest
}: TypographyProps) {
  const Component = as ?? defaultElement[variant];
  return (
    <Component
      className={cn(variantClasses[variant], textTone[tone], truncate && 'truncate', className)}
      {...rest}
    />
  );
}
