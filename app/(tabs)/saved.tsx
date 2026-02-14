import { useWeatherApp } from '@/contexts/weatherApp';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export default function SavedScreen() {
  const router = useRouter();
  const { savedLocations, setSelectedLocation, removeSavedLocation } = useWeatherApp();

  function openLocation(id: string) {
    const match = savedLocations.find((item) => item.id === id);
    if (!match) return;
    setSelectedLocation(match);
    router.push('/');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved locations</Text>
        <Text style={styles.subtitle}>Tap to load weather in Home.</Text>
      </View>

      <FlatList
        data={savedLocations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No saved locations yet.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable style={styles.locationBody} onPress={() => openLocation(item.id)}>
              <Text style={styles.locationName}>{item.name}</Text>
              <Text style={styles.locationMeta}>
                {[item.state, item.country].filter(Boolean).join(', ') || 'Saved location'}
              </Text>
              <Text style={styles.locationMeta}>
                {item.lat.toFixed(3)}, {item.lon.toFixed(3)}
              </Text>
            </Pressable>

            <Pressable
              style={styles.removeButton}
              onPress={() => removeSavedLocation(item.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14213d',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#d7e1ff',
    marginTop: 4,
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    gap: 10,
    paddingBottom: 28,
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#1e2c4a',
    overflow: 'hidden',
  },
  locationBody: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },
  locationName: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },
  locationMeta: {
    color: '#d7e1ff',
    marginTop: 4,
    fontSize: 13,
  },
  removeButton: {
    borderTopColor: 'rgba(255,255,255,0.12)',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#24365b',
  },
  removeButtonText: {
    color: '#ffd5d5',
    fontWeight: '600',
  },
  emptyWrap: {
    borderRadius: 12,
    backgroundColor: '#1e2c4a',
    padding: 16,
  },
  emptyText: {
    color: '#d7e1ff',
    fontSize: 14,
  },
});
