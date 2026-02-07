export const WEATHER_BACKGROUNDS = {
  clear: require('@/assets/weather-backgrounds/clear.png'),
  clearnight: require('@/assets/weather-backgrounds/clearnight.png'),
  cloudy: require('@/assets/weather-backgrounds/cloudy.png'),
  cloudynight: require('@/assets/weather-backgrounds/cloudynight.png'),
  fog: require('@/assets/weather-backgrounds/fog.png'),
  fognight: require('@/assets/weather-backgrounds/fognight.png'),
  rain: require('@/assets/weather-backgrounds/rain.png'),
  rainnight: require('@/assets/weather-backgrounds/rainnight.png'),
  snow: require('@/assets/weather-backgrounds/snow.png'),
  snownight: require('@/assets/weather-backgrounds/snownight.png'),
  thunderstorm: require('@/assets/weather-backgrounds/thunderstorm.png'),
  thunderstormnight: require('@/assets/weather-backgrounds/thunderstormnight.png'),
} as const;

export type WeatherBackgroundKey = keyof typeof WEATHER_BACKGROUNDS;
