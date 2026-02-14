import { useWeatherApp } from '@/contexts/weatherApp';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';

const DEFAULT_REGION: Region = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 12,
  longitudeDelta: 12,
};

export default function MapScreen() {
  const router = useRouter();
  const { selectedLocation, savedLocations, setSelectedLocation } = useWeatherApp();
  const { location } = useCurrentLocation();

  const region = useMemo<Region>(() => {
    if (selectedLocation) {
      return {
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lon,
        latitudeDelta: 2,
        longitudeDelta: 2,
      };
    }

    if (location) {
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 2,
        longitudeDelta: 2,
      };
    }

    return DEFAULT_REGION;
  }, [selectedLocation, location]);

  const markers = useMemo(() => {
    const byId = new Map<string, (typeof savedLocations)[number]>();
    for (const item of savedLocations) {
      byId.set(item.id, item);
    }
    if (selectedLocation) {
      byId.set(selectedLocation.id, selectedLocation);
    }
    return Array.from(byId.values());
  }, [savedLocations, selectedLocation]);

  function openLocationFromMarker(id: string) {
    const match = markers.find((item) => item.id === id);
    if (!match) return;
    setSelectedLocation(match);
    router.push('/');
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region} region={region}>
        {markers.map((item) => (
          <Marker
            key={item.id}
            coordinate={{ latitude: item.lat, longitude: item.lon }}
            title={item.name}
            description={[item.state, item.country].filter(Boolean).join(', ')}
            onCalloutPress={() => openLocationFromMarker(item.id)}
          />
        ))}
      </MapView>
      <View style={styles.footerPanel}>
        <Text style={styles.footerText}>Tap a marker callout to open it in Home.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14213d',
  },
  map: {
    flex: 1,
  },
  footerPanel: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#0f1a2e',
  },
  footerText: {
    color: '#d7e1ff',
    fontSize: 13,
  },
});
