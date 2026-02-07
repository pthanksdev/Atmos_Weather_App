export type MainWeather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
};

export type WeatherCondition = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type WindCondition = {
  speed: number;
  deg: number;
  gust: number;
};

export type SysInfo = {
  country: string;
  sunrise?: number;
  sunset?: number;
};

export type CurrentWeatherResponse = {
  name: string;
  main: MainWeather;
  weather: WeatherCondition[];
  sys: SysInfo;
  wind: WindCondition;
  timezone: number;
};

export type ForecastItem = {
  dt: number;
  main: MainWeather;
  weather: WeatherCondition[];
  pop?: number;
  sys?: {
    pod?: 'd' | 'n';
  };
};

export type ForecastResponse = {
  list: ForecastItem[];
};
