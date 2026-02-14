import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type WeatherUnit = 'metric' | 'imperial';

export type LocationSelection = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
};

type WeatherAppContextValue = {
  unit: WeatherUnit;
  setUnit: (unit: WeatherUnit) => void;
  selectedLocation: LocationSelection | null;
  setSelectedLocation: (location: LocationSelection | null) => void;
  savedLocations: LocationSelection[];
  toggleSavedLocation: (location: LocationSelection) => void;
  removeSavedLocation: (id: string) => void;
  clearSavedLocations: () => void;
  isSavedLocation: (id: string) => boolean;
};

const WeatherAppContext = createContext<WeatherAppContextValue | null>(null);

export function WeatherAppProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<WeatherUnit>('metric');
  const [selectedLocation, setSelectedLocation] = useState<LocationSelection | null>(null);
  const [savedLocations, setSavedLocations] = useState<LocationSelection[]>([]);

  function toggleSavedLocation(location: LocationSelection) {
    setSavedLocations((prev) => {
      const exists = prev.some((item) => item.id === location.id);
      if (exists) {
        return prev.filter((item) => item.id !== location.id);
      }
      return [location, ...prev];
    });
  }

  function removeSavedLocation(id: string) {
    setSavedLocations((prev) => prev.filter((item) => item.id !== id));
  }

  function clearSavedLocations() {
    setSavedLocations([]);
  }

  function isSavedLocation(id: string) {
    return savedLocations.some((item) => item.id === id);
  }

  const value = useMemo(
    () => ({
      unit,
      setUnit,
      selectedLocation,
      setSelectedLocation,
      savedLocations,
      toggleSavedLocation,
      removeSavedLocation,
      clearSavedLocations,
      isSavedLocation,
    }),
    [unit, selectedLocation, savedLocations]
  );

  return <WeatherAppContext.Provider value={value}>{children}</WeatherAppContext.Provider>;
}

export function useWeatherApp() {
  const context = useContext(WeatherAppContext);
  if (!context) {
    throw new Error('useWeatherApp must be used within a WeatherAppProvider');
  }
  return context;
}

export function buildLocationId(lat: number, lon: number, name: string) {
  return `${name.toLowerCase()}-${lat.toFixed(4)}-${lon.toFixed(4)}`;
}
