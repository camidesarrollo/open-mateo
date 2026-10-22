import type { ElementType, HTMLAttributes } from 'react';
import { cn } from './utils';

type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';
type Columns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type Responsive = Columns | Partial<Record<Breakpoint, Columns>>;

export type GridGap = 'xs' | 'sm' | 'md' | 'lg';

const gapClasses: Record<GridGap, string> = {
  xs: 'gap-space-xs',
  sm: 'gap-space-sm',
  md: 'gap-space-md',
  lg: 'gap-space-lg',
};

// Las clases grid-cols-* y col-span-* están en el @source inline de index.css
function responsive(prefix: 'grid-cols' | 'col-span', value: Responsive): string {
  const map = typeof value === 'number' ? { base: value } : value;
  return Object.entries(map)
    .map(([bp, n]) => (bp === 'base' ? `${prefix}-${n}` : `${bp}:${prefix}-${n}`))
    .join(' ');
}

export interface GridProps extends HTMLAttributes<HTMLElement> {
  /** cols={4} o cols={{ base: 2, sm: 3, md: 4, lg: 7 }} */
  cols?: Responsive;
  gap?: GridGap;
  as?: ElementType;
}

export function Grid({ cols = 1, gap = 'md', as: Component = 'div', className, ...rest }: GridProps) {
  return <Component className={cn('grid', responsive('grid-cols', cols), gapClasses[gap], className)} {...rest} />;
}

export interface GridItemProps extends HTMLAttributes<HTMLElement> {
  /** span={{ base: 1, xl: 9 }} */
  span?: Responsive;
  as?: ElementType;
}

export function GridItem({ span = 1, as: Component = 'div', className, ...rest }: GridItemProps) {
  return <Component className={cn(responsive('col-span', span), className)} {...rest} />;
}
