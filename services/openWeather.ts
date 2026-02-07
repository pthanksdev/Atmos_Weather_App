import type {
  CurrentWeatherResponse,
  ForecastResponse,
} from '@/types/openWeather';
import { apiCall } from '@/utils/http';
import { buildUrl } from '@/utils/url';

const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const OPEN_WEATHER_KEY = process.env.EXPO_PUBLIC_OPEN_WEATHER_KEY;
if (!OPEN_WEATHER_KEY) {
  throw new Error('Missing EXPO_PUBLIC_OPEN_WEATHER_KEY');
}

const API_KEY: string = OPEN_WEATHER_KEY;

type Coords = { lat: number; lon: number };

export function fetchCurrentWeather({ lat, lon }: Coords) {
  const url = buildUrl(WEATHER_BASE_URL, '/weather', {
    lat,
    lon,
    appid: API_KEY,
    units: 'metric',
  });

  return apiCall<CurrentWeatherResponse>(url);
}

export function fetchForecast({ lat, lon }: Coords) {
  const url = buildUrl(WEATHER_BASE_URL, '/forecast', {
    lat,
    lon,
    appid: API_KEY,
    units: 'metric',
  });

  return apiCall<ForecastResponse>(url);
}
