import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

const MAX_LAST_KNOWN_AGE_MS = 15 * 60 * 1000;
const MAX_LAST_KNOWN_ACCURACY_M = 5000;

export function useCurrentLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshLocation = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      if (Platform.OS === 'web') {
        try {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          setLocation(loc);
          return loc;
        } catch (webErr: any) {
          const webMessage = String(webErr?.message ?? '').toLowerCase();
          if (webMessage.includes('denied') || webMessage.includes('permission')) {
            setErrorMsg(
              'Browser blocked location. Allow location for localhost in site permissions, then reload.'
            );
          } else if (
            webMessage.includes('secure') ||
            webMessage.includes('https')
          ) {
            setErrorMsg(
              'Location on web requires a secure context. Use localhost or HTTPS.'
            );
          } else {
            setErrorMsg(webErr?.message ?? 'Failed to get browser location');
          }
          return null;
        } finally {
          setLoading(false);
        }
      }

      const currentPerm = await Location.getForegroundPermissionsAsync();
      let status = currentPerm.status;

      if (status !== 'granted') {
        const requestedPerm = await Location.requestForegroundPermissionsAsync();
        status = requestedPerm.status;
      }

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return null;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(loc);
        return loc;
      } catch {
        const lastKnown = await Location.getLastKnownPositionAsync();
        const now = Date.now();
        const ageMs = lastKnown ? now - lastKnown.timestamp : Number.POSITIVE_INFINITY;
        const accuracy = lastKnown?.coords.accuracy ?? Number.POSITIVE_INFINITY;

        if (
          lastKnown &&
          ageMs <= MAX_LAST_KNOWN_AGE_MS &&
          accuracy <= MAX_LAST_KNOWN_ACCURACY_M
        ) {
          const normalized: Location.LocationObject = {
            coords: lastKnown.coords,
            timestamp: lastKnown.timestamp,
          };
          setLocation(normalized);
          return normalized;
        }
        setErrorMsg('Could not get a recent location. Please try again.');
        return null;
      }
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'Failed to get location');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  return { location, errorMsg, loading, refreshLocation };
}
