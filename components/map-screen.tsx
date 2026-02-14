import { useWeatherApp } from '@/contexts/weatherApp';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MapScreen() {
  const router = useRouter();
  const { selectedLocation, savedLocations, setSelectedLocation } = useWeatherApp();

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
      <Text style={styles.title}>Map markers</Text>
      <Text style={styles.subtitle}>Interactive map is limited on web preview.</Text>
      <ScrollView contentContainerStyle={styles.listBody}>
        {markers.length === 0 ? (
          <Text style={styles.emptyText}>No saved or selected locations yet.</Text>
        ) : (
          markers.map((item) => (
            <Pressable
              key={item.id}
              style={styles.item}
              onPress={() => openLocationFromMarker(item.id)}
            >
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemCoords}>
                {item.lat.toFixed(3)}, {item.lon.toFixed(3)}
              </Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14213d',
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 24,
    marginHorizontal: 16,
  },
  subtitle: {
    color: '#d7e1ff',
    fontSize: 14,
    marginTop: 6,
    marginHorizontal: 16,
  },
  listBody: {
    padding: 16,
    gap: 10,
  },
  item: {
    backgroundColor: '#1e2c4a',
    borderRadius: 10,
    padding: 12,
  },
  itemTitle: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  itemCoords: {
    color: '#d7e1ff',
    marginTop: 4,
    fontSize: 13,
  },
  emptyText: {
    color: '#d7e1ff',
    fontSize: 14,
  },
});
