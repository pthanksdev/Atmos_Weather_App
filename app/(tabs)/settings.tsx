import { useWeatherApp } from '@/contexts/weatherApp';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  const {
    unit,
    setUnit,
    selectedLocation,
    setSelectedLocation,
    savedLocations,
    clearSavedLocations,
  } = useWeatherApp();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Units</Text>
        <View style={styles.row}>
          <Pressable
            style={[styles.toggleButton, unit === 'metric' && styles.toggleButtonActive]}
            onPress={() => setUnit('metric')}
          >
            <Text style={styles.toggleText}>Celsius</Text>
          </Pressable>

          <Pressable
            style={[styles.toggleButton, unit === 'imperial' && styles.toggleButtonActive]}
            onPress={() => setUnit('imperial')}
          >
            <Text style={styles.toggleText}>Fahrenheit</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selection</Text>
        <Text style={styles.valueText}>
          {selectedLocation ? selectedLocation.name : 'Using device location'}
        </Text>
        <Pressable style={styles.actionButton} onPress={() => setSelectedLocation(null)}>
          <Text style={styles.actionText}>Reset to current location</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saved</Text>
        <Text style={styles.valueText}>{savedLocations.length} locations saved</Text>
        <Pressable style={styles.dangerButton} onPress={clearSavedLocations}>
          <Text style={styles.dangerText}>Clear saved locations</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14213d',
    padding: 16,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 14,
  },
  section: {
    backgroundColor: '#1e2c4a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#27375a',
  },
  toggleButtonActive: {
    backgroundColor: '#5d84d8',
  },
  toggleText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
  valueText: {
    color: '#d7e1ff',
    fontSize: 14,
    marginBottom: 10,
  },
  actionButton: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#2c4270',
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
  },
  dangerButton: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#5e1f2d',
  },
  dangerText: {
    color: '#ffe5ea',
    fontWeight: '600',
  },
});
