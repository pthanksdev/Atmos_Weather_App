import ForecastListItem from '@/components/ForecastListItem';
import ForecastSection from '@/components/ForecastSection';
import { WEATHER_BACKGROUNDS } from '@/constants/weatherBackgrounds';
import {
  buildLocationId,
  useWeatherApp,
  type LocationSelection,
} from '@/contexts/weatherApp';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import {
  fetchCitySuggestions,
  fetchCurrentWeather,
  fetchForecast,
} from '@/services/openWeather';
import type {
  CurrentWeatherResponse,
  ForecastItem,
  GeocodeResult,
} from '@/types/openWeather';
import { formatTimeFromUnixWithOffset } from '@/utils/time';
import { getBgKeyFromOpenWeather } from '@/utils/weatherBackground';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Coords = { lat: number; lon: number };
type ViewMode = 'now' | 'hourly' | 'daily';

const VIEW_TABS: ViewMode[] = ['now', 'hourly', 'daily'];
const AUTOCOMPLETE_MIN_CHARS = 2;
const AUTOCOMPLETE_DEBOUNCE_MS = 300;

function formatPlaceName(item: GeocodeResult) {
  if (item.state) {
    return `${item.name}, ${item.state}, ${item.country}`;
  }
  return `${item.name}, ${item.country}`;
}

export default function WeatherHomeScreen() {
  const {
    location,
    loading: locationLoading,
    errorMsg: locationError,
    refreshLocation,
  } = useCurrentLocation();

  const {
    unit,
    selectedLocation,
    setSelectedLocation,
    toggleSavedLocation,
    isSavedLocation,
  } = useWeatherApp();

  const [current, setCurrent] = useState<CurrentWeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [activeCoords, setActiveCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('now');
  const searchRequestIdRef = useRef(0);
  const suppressAutocompleteRef = useRef(false);

  const weatherId = current?.weather[0]?.id;
  const pod = current?.weather[0]?.icon.slice(-1) === 'n' ? 'n' : 'd';
  const iconKey = weatherId ? getBgKeyFromOpenWeather(weatherId, pod) : 'clear';
  const bgSource = WEATHER_BACKGROUNDS[iconKey];

  const tempUnitLabel = unit === 'metric' ? 'C' : 'F';
  const windUnitLabel = unit === 'metric' ? 'm/s' : 'mph';

  const hourlyItems = useMemo(() => forecast.slice(0, 16), [forecast]);

  const activeSaveLocation = useMemo<LocationSelection | null>(() => {
    if (!current || !activeCoords) return null;

    if (selectedLocation) {
      return selectedLocation;
    }

    return {
      id: buildLocationId(activeCoords.lat, activeCoords.lon, current.name),
      name: current.name,
      lat: activeCoords.lat,
      lon: activeCoords.lon,
      country: current.sys.country,
    };
  }, [current, activeCoords, selectedLocation]);

  const loadWeather = useCallback(async (coords: Coords) => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const [currentData, forecastData] = await Promise.all([
        fetchCurrentWeather(coords, unit),
        fetchForecast(coords, unit),
      ]);

      setCurrent(currentData);
      setForecast(forecastData.list);
      setActiveCoords(coords);
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    if (selectedLocation) {
      loadWeather({ lat: selectedLocation.lat, lon: selectedLocation.lon });
      return;
    }

    if (location) {
      const { latitude, longitude } = location.coords;
      loadWeather({ lat: latitude, lon: longitude });
    }
  }, [location, selectedLocation, loadWeather]);

  const searchCities = useCallback(async (query: string, showEmptyError = false) => {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < AUTOCOMPLETE_MIN_CHARS) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    const requestId = ++searchRequestIdRef.current;
    try {
      setSearching(true);
      setErrorMsg(null);
      const results = await fetchCitySuggestions(normalizedQuery, 6);
      if (requestId !== searchRequestIdRef.current) return;

      if (results.length === 0) {
        setSuggestions([]);
        if (showEmptyError) {
          setErrorMsg('No cities found. Try a different search.');
        }
        return;
      }

      setSuggestions(results);
    } catch (e: any) {
      if (requestId !== searchRequestIdRef.current) return;
      setSuggestions([]);
      setErrorMsg(e?.message ?? 'Search failed');
    } finally {
      if (requestId === searchRequestIdRef.current) {
        setSearching(false);
      }
    }
  }, []);

  useEffect(() => {
    if (suppressAutocompleteRef.current) {
      suppressAutocompleteRef.current = false;
      return;
    }

    const query = searchText.trim();
    if (!query) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    const handle = setTimeout(() => {
      void searchCities(query);
    }, AUTOCOMPLETE_DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [searchText, searchCities]);

  function onSearchSubmit() {
    void searchCities(searchText, true);
  }

  function onSelectSuggestion(item: GeocodeResult) {
    const locationItem: LocationSelection = {
      id: buildLocationId(item.lat, item.lon, item.name),
      name: item.name,
      state: item.state,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
    };

    setSelectedLocation(locationItem);
    suppressAutocompleteRef.current = true;
    setSearchText(formatPlaceName(item));
    setSuggestions([]);
  }

  async function onUseMyLocation() {
    setSelectedLocation(null);
    setSuggestions([]);
    setErrorMsg(null);

    const freshLocation = await refreshLocation();
    if (freshLocation) {
      const { latitude, longitude } = freshLocation.coords;
      loadWeather({ lat: latitude, lon: longitude });
      return;
    }

    if (location) {
      const { latitude, longitude } = location.coords;
      loadWeather({ lat: latitude, lon: longitude });
      return;
    }

    setErrorMsg('Unable to get your location. Check permissions and try again.');
  }

  function onRefresh() {
    if (selectedLocation) {
      loadWeather({ lat: selectedLocation.lat, lon: selectedLocation.lon });
      return;
    }

    if (location) {
      const { latitude, longitude } = location.coords;
      loadWeather({ lat: latitude, lon: longitude });
      return;
    }

    if (activeCoords) {
      loadWeather(activeCoords);
    }
  }

  function onToggleSave() {
    if (!activeSaveLocation) return;
    toggleSavedLocation(activeSaveLocation);
  }

  async function onOpenLocationSettings() {
    if (typeof Linking.openSettings === 'function') {
      await Linking.openSettings();
      return;
    }

    if (Platform.OS === 'web') {
      setErrorMsg(
        'Enable location permission in your browser for this site, then refresh.'
      );
      return;
    }

    setErrorMsg('Unable to open system settings on this device.');
  }

  function renderCurrentCard() {
    if (!current) return null;

    return (
      <>
        <BlurView intensity={30} style={styles.currentMain}>
          <Text style={styles.location}>{current.name}</Text>
          <View style={styles.currentDivider} />
          <Text style={styles.temp}>
            {Math.round(current.main.temp)} {tempUnitLabel}
          </Text>
          <View style={styles.currentDivider} />
          <Text style={styles.desc}>{current.weather[0].description}</Text>
        </BlurView>

        <BlurView intensity={30} style={styles.currentDetails}>
          <View style={styles.currentDetailsRow}>
            <Ionicons name='water-outline' size={22} color='white' />
            <Text style={styles.currentDetailsText}>{current.main.humidity}%</Text>
          </View>

          <View style={styles.currentDetailsRow}>
            <Ionicons name='speedometer-outline' size={22} color='white' />
            <Text style={styles.currentDetailsText}>
              {current.wind.speed} {windUnitLabel}
            </Text>
          </View>

          <View style={styles.currentDetailsRow}>
            <Ionicons name='sunny-outline' size={22} color='white' />
            {current.sys.sunrise && (
              <Text style={styles.currentDetailsText}>
                {formatTimeFromUnixWithOffset(current.sys.sunrise, current.timezone)}
              </Text>
            )}
          </View>
        </BlurView>
      </>
    );
  }

  function renderBody() {
    if (loading && !current) {
      return (
        <View style={styles.messageInline}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Loading weather...</Text>
        </View>
      );
    }

    if (!current) {
      return (
        <View style={styles.messageInline}>
          <Text style={styles.error}>Search for a city to get weather data.</Text>
        </View>
      );
    }

    if (viewMode === 'daily') {
      return (
        <ForecastSection
          items={forecast}
          timezone={current.timezone}
          tempUnitLabel={tempUnitLabel}
        />
      );
    }

    if (viewMode === 'hourly') {
      return (
        <FlatList
          data={hourlyItems}
          horizontal
          keyExtractor={(item) => String(item.dt)}
          renderItem={({ item }) => (
            <ForecastListItem
              item={item}
              timezone={current.timezone}
              tempUnitLabel={tempUnitLabel}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hourlyList}
        />
      );
    }

    return (
      <>
        {renderCurrentCard()}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>NEXT HOURS</Text>
        </View>

        <FlatList
          data={hourlyItems.slice(0, 6)}
          horizontal
          keyExtractor={(item) => String(item.dt)}
          renderItem={({ item }) => (
            <ForecastListItem
              item={item}
              timezone={current.timezone}
              tempUnitLabel={tempUnitLabel}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hourlyList}
        />
      </>
    );
  }

  return (
    <ImageBackground source={bgSource} style={styles.bg}>
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <View style={styles.searchRow}>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder='Search city'
              placeholderTextColor='#d3dbef'
              style={styles.searchInput}
              returnKeyType='search'
              onSubmitEditing={onSearchSubmit}
            />
            <Pressable style={styles.iconButton} onPress={onSearchSubmit}>
              {searching ? (
                <ActivityIndicator size='small' color='white' />
              ) : (
                <Ionicons name='search' size={20} color='white' />
              )}
            </Pressable>
            <Pressable style={styles.iconButton} onPress={onUseMyLocation}>
              <Ionicons name='locate-outline' size={20} color='white' />
            </Pressable>
          </View>

          {suggestions.length > 0 && (
            <View style={styles.suggestions}>
              {suggestions.map((item) => {
                const key = `${item.lat}-${item.lon}`;
                return (
                  <Pressable
                    key={key}
                    style={styles.suggestionItem}
                    onPress={() => onSelectSuggestion(item)}
                  >
                    <Text style={styles.suggestionText}>{formatPlaceName(item)}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <View style={styles.actionsRow}>
            <Pressable style={styles.actionButton} onPress={onRefresh}>
              <Ionicons name='refresh-outline' size={16} color='white' />
              <Text style={styles.actionText}>Refresh</Text>
            </Pressable>

            <Pressable
              style={styles.actionButton}
              onPress={onToggleSave}
              disabled={!activeSaveLocation}
            >
              <Ionicons
                name={
                  activeSaveLocation && isSavedLocation(activeSaveLocation.id)
                    ? 'bookmark'
                    : 'bookmark-outline'
                }
                size={16}
                color='white'
              />
              <Text style={styles.actionText}>Save</Text>
            </Pressable>

            <View style={styles.unitPill}>
              <Text style={styles.unitText}>{tempUnitLabel}</Text>
            </View>
          </View>

          <View style={styles.topTabs}>
            {VIEW_TABS.map((tab) => (
              <Pressable
                key={tab}
                style={[styles.tabButton, viewMode === tab && styles.tabButtonActive]}
                onPress={() => setViewMode(tab)}
              >
                <Text style={styles.tabText}>{tab.toUpperCase()}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {locationLoading && !current && (
          <View style={styles.messageInline}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Getting location...</Text>
          </View>
        )}

        {locationError && !selectedLocation && !current && (
          <View style={styles.messageInline}>
            <Text style={styles.error}>{locationError}</Text>
            <Pressable onPress={onOpenLocationSettings} style={styles.settingsButton}>
              <Text style={styles.settingsButtonText}>Settings</Text>
            </Pressable>
          </View>
        )}

        {errorMsg && <Text style={styles.errorBanner}>{errorMsg}</Text>}

        <ScrollView
          contentContainerStyle={styles.scrollBody}
          keyboardShouldPersistTaps='handled'
        >
          {renderBody()}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#4379dd',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  topBar: {
    marginBottom: 12,
    zIndex: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(26,35,56,0.45)',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26,35,56,0.6)',
  },
  suggestions: {
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(11,18,33,0.86)',
    overflow: 'hidden',
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomColor: 'rgba(255,255,255,0.12)',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  suggestionText: {
    color: 'white',
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(26,35,56,0.45)',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  unitPill: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  unitText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  topTabs: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 8,
    backgroundColor: 'rgba(26,35,56,0.45)',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  tabText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  scrollBody: {
    paddingBottom: 18,
  },
  messageInline: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    color: 'white',
  },
  error: {
    color: '#ffd0d0',
    textAlign: 'center',
  },
  errorBanner: {
    color: '#ffe1e1',
    backgroundColor: 'rgba(118, 24, 24, 0.45)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  settingsButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#111',
  },
  settingsButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  currentMain: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    overflow: 'hidden',
    borderRadius: 12,
  },
  location: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  temp: {
    fontSize: 58,
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
  currentDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'white',
    marginVertical: 8,
    width: '50%',
  },
  currentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    overflow: 'hidden',
    borderRadius: 12,
    padding: 12,
  },
  currentDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentDetailsText: {
    fontSize: 14,
    marginLeft: 6,
    color: 'white',
  },
  sectionHeaderRow: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  hourlyList: {
    gap: 10,
  },
});
