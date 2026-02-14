import type {
  CurrentWeatherResponse,
  ForecastResponse,
  GeocodeResult,
} from '@/types/openWeather';
import { apiCall } from '@/utils/http';
import { buildUrl } from '@/utils/url';

const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEOCODING_BASE_URL = 'https://api.openweathermap.org/geo/1.0';

const OPEN_WEATHER_KEY = process.env.EXPO_PUBLIC_OPEN_WEATHER_KEY;
if (!OPEN_WEATHER_KEY) {
  throw new Error('Missing EXPO_PUBLIC_OPEN_WEATHER_KEY');
}

const API_KEY: string = OPEN_WEATHER_KEY;

type Coords = { lat: number; lon: number };
type Units = 'metric' | 'imperial';

export function fetchCurrentWeather({ lat, lon }: Coords, units: Units = 'metric') {
  const url = buildUrl(WEATHER_BASE_URL, '/weather', {
    lat,
    lon,
    appid: API_KEY,
    units,
  });

  return apiCall<CurrentWeatherResponse>(url);
}

export function fetchForecast({ lat, lon }: Coords, units: Units = 'metric') {
  const url = buildUrl(WEATHER_BASE_URL, '/forecast', {
    lat,
    lon,
    appid: API_KEY,
    units,
  });

  return apiCall<ForecastResponse>(url);
}

export function fetchCitySuggestions(query: string, limit = 5) {
  const url = buildUrl(GEOCODING_BASE_URL, '/direct', {
    q: query,
    limit,
    appid: API_KEY,
  });

  return apiCall<GeocodeResult[]>(url);
}
