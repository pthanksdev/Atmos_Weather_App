import { WEATHER_ICONS } from '@/constants/weatherIcons';
import type { ForecastItem } from '@/types/openWeather';
import { formatTimeFromUnixWithOffset } from '@/utils/time';
import { getIconKeyFromOpenWeather } from '@/utils/weatherIcon';
import { BlurView } from 'expo-blur';
import { Image, StyleSheet, Text } from 'react-native';

type Props = {
  item: ForecastItem;
  timezone: number;
};

export default function ForecastListItem({ item, timezone }: Props) {
  const weatherId = item.weather[0].id;
  const pod = item.sys?.pod;
  const iconKey = getIconKeyFromOpenWeather(weatherId, pod);
  const iconSource = WEATHER_ICONS[iconKey];

  return (
    <BlurView intensity={30} style={styles.item}>
      <Text style={styles.time}>
        {formatTimeFromUnixWithOffset(item.dt, timezone)}
      </Text>
      <Image source={iconSource} style={styles.icon} />
      <Text style={styles.temp}>{Math.round(item.main.temp)}°</Text>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    overflow: 'hidden',
    borderRadius: 10,
  },
  time: {
    color: 'white',
    fontSize: 14,
    marginBottom: 6,
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 6,
  },
  temp: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
