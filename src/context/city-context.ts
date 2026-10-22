import { createContext, useContext } from 'react';
import type { City } from '../constans/cities';

export interface CityContextValue {
  city: City;
  setCity: (next: City) => void;
}

export const CityContext = createContext<CityContextValue | null>(null);

/** const { city, setCity } = useCity(); */
export function useCity(): CityContextValue {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error('useCity debe usarse dentro de <CityProvider>');
  return ctx;
}
