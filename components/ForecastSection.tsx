import type { ForecastItem } from '@/types/openWeather';
import { groupForecastByDayLabel } from '@/utils/forecast';

import { FlatList, StyleSheet, Text, View } from 'react-native';
import ForecastListItem from './ForecastListItem';

type Props = {
  items: ForecastItem[];
  timezone: number;
  tempUnitLabel?: string;
};

type Section = {
  key: string;
  title: string;
  data: ForecastItem[];
};

function titleFromKey(key: string) {
  if (key === 'today') return 'TODAY';
  return key.toUpperCase();
}

export default function ForecastSection({
  items,
  timezone,
  tempUnitLabel,
}: Props) {
  const grouped = groupForecastByDayLabel(items, timezone);
  const sections: Section[] = Object.keys(grouped).map((key) => ({
    key,
    title: titleFromKey(key),
    data: grouped[key],
  }));

  sections.sort((a, b) => {
    if (a.key === 'today') return -1;
    if (b.key === 'today') return 1;
    return 0;
  });

  return (
    <View style={styles.container}>
      {sections.map((section) => {
        return (
          <View key={section.key} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <FlatList
              data={section.data}
              horizontal
              keyExtractor={(item) => String(item.dt)}
              renderItem={({ item }) => (
                <ForecastListItem
                  item={item}
                  timezone={timezone}
                  tempUnitLabel={tempUnitLabel}
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: 'white',
    fontWeight: '700',
    marginBottom: 8,
    fontSize: 16,
  },
});
