import { Link, Redirect, usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  const pathname = usePathname();

  if (pathname === '/index') {
    return <Redirect href='/' />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Page could not be found.</Text>
      <Link href='/' style={styles.link}>
        Go back home
      </Link>
      <Link href='/_sitemap' style={styles.link}>
        Sitemap
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    backgroundColor: '#14213d',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  link: {
    color: '#9ec4ff',
    fontSize: 16,
  },
});
