import { createContext, useContext } from 'react';
import type { AlertTone } from './Alert';

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: AlertTone;
  icon?: string;
  /** Milisegundos antes de cerrarse; 0 = no se cierra solo */
  duration?: number;
  action?: { label: string; onClick: () => void };
}

export interface ToastItem extends ToastOptions {
  id: string;
}

export interface ToastContextValue {
  /** Muestra un toast y devuelve su id */
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

/** const { toast } = useToast(); toast({ title: 'CSV exportado', tone: 'success' }) */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return ctx;
}
