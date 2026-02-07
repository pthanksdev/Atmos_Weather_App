import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export function useCurrentLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          if (isMounted) {
            setErrorMsg('Permission to access location was denied');
          }
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});

        if (isMounted) {
          setLocation(loc);
        }
      } catch (e: any) {
        if (isMounted) {
          setErrorMsg(e?.message ?? 'Failed to get location');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return { location, errorMsg, loading };
}
