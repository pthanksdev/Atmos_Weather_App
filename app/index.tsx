import ForecastSection from '@/components/ForecastSection';
import { WEATHER_BACKGROUNDS } from '@/constants/weatherBackgrounds';
import { WEATHER_ICONS } from '@/constants/weatherIcons';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { fetchCurrentWeather, fetchForecast } from '@/services/openWeather';
import type { CurrentWeatherResponse, ForecastItem } from '@/types/openWeather';
import { formatTimeFromUnixWithOffset } from '@/utils/time';
import { getBgKeyFromOpenWeather } from '@/utils/weatherBackground';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const {
    location,
    loading: locationLoading,
    errorMsg: locationError,
  } = useCurrentLocation();

  const [current, setCurrent] = useState<CurrentWeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;

    const { latitude, longitude } = location.coords;

    async function loadWeather() {
      try {
        setLoading(true);
        setErrorMsg(null);

        const currentData = await fetchCurrentWeather({
          lat: latitude,
          lon: longitude,
        });

        const forecastData = await fetchForecast({
          lat: latitude,
          lon: longitude,
        });

        setCurrent(currentData);
        setForecast(forecastData.list);
      } catch {
        setErrorMsg('Failed to fetch weather');
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, [location]);

  if (locationLoading) {
    return (
      <View style={styles.message}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Getting location…</Text>
      </View>
    );
  }

  if (locationError) {
    return (
      <View style={styles.message}>
        <Text style={styles.error}>{locationError}</Text>
        <Pressable
          onPress={() => Linking.openSettings()}
          style={styles.settingsButton}
        >
          <Text style={styles.settingsButtonText}>Settings</Text>
        </Pressable>
      </View>
    );
  }

  if (loading || !current) {
    return (
      <View style={styles.message}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Loading weather…</Text>
      </View>
    );
  }

  const weatherId = current.weather[0].id;
  const pod = current.weather[0].icon.slice(-1) === 'n' ? 'n' : 'd';
  const iconKey = getBgKeyFromOpenWeather(weatherId, pod);
  const bgSource = WEATHER_BACKGROUNDS[iconKey];

  return (
    <ImageBackground source={bgSource} style={styles.bg}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
      />
      <SafeAreaView style={styles.safeArea}>
        <BlurView intensity={30} style={styles.currentMain}>
          <Text style={styles.location}>{current.name}</Text>
          <View style={styles.currentDivider} />
          <Text style={styles.temp}>{Math.round(current.main.temp)}°</Text>
          <View style={styles.currentDivider} />
          <Text style={styles.desc}>{current.weather[0].description}</Text>
        </BlurView>

        <BlurView intensity={30} style={styles.currentDetails}>
          <View style={styles.currentDetailsRow}>
            <Ionicons name='water-outline' size={24} color='white' />
            <Text style={styles.currentDetailsText}>
              {current.main.humidity}%
            </Text>
          </View>

          <View style={styles.currentDetailsRow}>
            <Image source={WEATHER_ICONS.windy} style={styles.icon} />
            <Text style={styles.currentDetailsText}>
              {current.wind.speed} m/s
            </Text>
          </View>

          <View style={styles.currentDetailsRow}>
            <Image source={WEATHER_ICONS.sunrise} style={styles.icon} />
            {current.sys.sunrise && (
              <Text style={styles.currentDetailsText}>
                {formatTimeFromUnixWithOffset(
                  current.sys.sunrise,
                  current.timezone
                )}
              </Text>
            )}
          </View>
        </BlurView>

        {current && (
          <ScrollView>
            <ForecastSection items={forecast} timezone={current.timezone} />
          </ScrollView>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#4379dd',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  currentMain: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    overflow: 'hidden',
    borderRadius: 12,
  },
  location: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  temp: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
  },
  desc: {
    fontSize: 18,
    marginTop: 8,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    color: 'white',
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 6,
  },
  currentDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'white',
    marginVertical: 8,
    width: '50%',
  },
  currentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    overflow: 'hidden',
    borderRadius: 12,
    padding: 12,
  },
  currentDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentDetailsText: {
    fontSize: 16,
    marginLeft: 6,
    color: 'white',
  },
  forecastContainer: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 10,
    overflow: 'hidden',
  },
  forecastRow: {
    paddingHorizontal: 10,
  },
  message: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    marginTop: 8,
    color: 'white',
  },
  error: {
    color: 'tomato',
    fontSize: 16,
    textAlign: 'center',
  },
  settingsButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#111',
  },
  settingsButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
