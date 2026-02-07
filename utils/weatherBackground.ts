import type { WeatherBackgroundKey } from '@/constants/weatherBackgrounds';

export function getBgKeyFromOpenWeather(
  weatherId: number,
  pod?: 'd' | 'n'
): WeatherBackgroundKey {
  const isNight = pod === 'n';

  //thunderstorm
  if (weatherId >= 200 && weatherId <= 232) {
    return isNight ? 'thunderstormnight' : 'thunderstorm';
  }
  //rain
  if (weatherId >= 300 && weatherId <= 531) {
    return isNight ? 'rainnight' : 'rain';
  }
  //snow
  if (weatherId >= 600 && weatherId <= 622) {
    return isNight ? 'snownight' : 'snow';
  }
  //fog
  if (weatherId >= 701 && weatherId <= 781) {
    return isNight ? 'fognight' : 'fog';
  }
  //clear
  if (weatherId === 800) {
    return isNight ? 'clearnight' : 'clear';
  }
  //clouds
  if (weatherId >= 801 && weatherId <= 804) {
    return isNight ? 'cloudynight' : 'cloudy';
  }
  return isNight ? 'cloudynight' : 'cloudy';
}
