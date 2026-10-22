import { useState, type ReactNode } from "react";
import { CITIES, DEFAULT_CITY, type City } from "../constans/cities";
import { CityContext } from "./city-context";

// src/context/CityContext.tsx
const STORAGE_KEY = 'observatorio:city';

const readStoredCity = (): City => {
  try {
    const id = localStorage.getItem(STORAGE_KEY);
    return CITIES.find((c) => c.id === id) ?? DEFAULT_CITY; // valida lo guardado
  } catch {
    return DEFAULT_CITY;
  }
};

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCityState] = useState<City>(readStoredCity);
  const setCity = (next: City) => {
    setCityState(next);
    try { localStorage.setItem(STORAGE_KEY, next.id); } catch { /* sin storage */ }
  };
  return <CityContext.Provider value={{ city, setCity }}>{children}</CityContext.Provider>;
}
