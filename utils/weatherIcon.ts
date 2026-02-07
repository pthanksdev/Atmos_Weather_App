import type { WeatherIconKey } from '@/constants/weatherIcons';

export function getIconKeyFromOpenWeather(
  weatherId: number,
  pod?: 'd' | 'n'
): WeatherIconKey {
  const isNight = pod === 'n';

  //thunderstorm
  if (weatherId >= 200 && weatherId <= 232) {
    return 'thunderstorm';
  }
  //drizzle
  if (weatherId >= 300 && weatherId <= 321) {
    return isNight ? 'drizzlenight' : 'drizzle';
  }
  //rain
  if (weatherId >= 500 && weatherId <= 531) {
    if (weatherId === 511) return 'freezingrain';
    if (weatherId >= 520) return 'heavyrain';
    return 'rain';
  }
  //snow
  if (weatherId >= 600 && weatherId <= 622) {
    if (weatherId >= 612 || weatherId >= 620) return 'heavysnow';
    return 'snow';
  }
  //mist/fog/haze/dust...
  if (weatherId >= 701 && weatherId <= 781) {
    if (weatherId === 741) return 'fog';
    if (weatherId === 721) return 'haze';
    return 'fog';
  }
  //clear
  if (weatherId === 800) {
    return isNight ? 'clearnight' : 'clear';
  }
  //clouds
  if (weatherId >= 801 && weatherId <= 804) {
    if (weatherId <= 802) {
      return isNight ? 'partlycloudynight' : 'partlycloud';
    }
    return 'cloudy';
  }
  return 'cloudy';
}
