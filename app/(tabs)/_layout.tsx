import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { WeatherAppProvider } from '@/contexts/weatherApp';

export default function TabsLayout() {
  return (
    <WeatherAppProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#c9d6ff',
          tabBarStyle: {
            backgroundColor: '#1f2a44',
            borderTopColor: '#2f3a54',
          },
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='home-outline' color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name='map'
          options={{
            title: 'Map',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='map-outline' color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name='saved'
          options={{
            title: 'Saved',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='bookmark-outline' color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name='settings'
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='settings-outline' color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </WeatherAppProvider>
  );
}
