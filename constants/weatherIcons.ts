export const WEATHER_ICONS = {
  clear: require('@/assets/weather-icons/clear.png'),
  clearnight: require('@/assets/weather-icons/clearnight.png'),
  cloudy: require('@/assets/weather-icons/cloudy.png'),
  partlycloud: require('@/assets/weather-icons/partlycloud.png'),
  partlycloudynight: require('@/assets/weather-icons/partlycloudynight.png'),
  drizzle: require('@/assets/weather-icons/drizzle.png'),
  drizzlenight: require('@/assets/weather-icons/drizzlenight.png'),
  rain: require('@/assets/weather-icons/rain.png'),
  heavyrain: require('@/assets/weather-icons/heavyrain.png'),
  freezingrain: require('@/assets/weather-icons/freezingrain.png'),
  snow: require('@/assets/weather-icons/snow.png'),
  heavysnow: require('@/assets/weather-icons/heavysnow.png'),
  thunderstorm: require('@/assets/weather-icons/thunderstorm.png'),
  fog: require('@/assets/weather-icons/fog.png'),
  haze: require('@/assets/weather-icons/haze.png'),
  windy: require('@/assets/weather-icons/windy.png'),
  sunrise: require('@/assets/weather-icons/sunrise.png'),
  sunset: require('@/assets/weather-icons/sunset.png'),
} as const;

export type WeatherIconKey = keyof typeof WEATHER_ICONS;
