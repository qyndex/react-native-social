import { useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { session, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Not signed in and not on auth screen -- redirect to sign in
      router.replace('/(auth)/sign-in');
    } else if (session && inAuthGroup) {
      // Signed in and on auth screen -- redirect to feed
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile/[id]"
          options={{ title: 'Profile', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="post/[id]"
          options={{ title: 'Post', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="compose"
          options={{ title: 'New Post', presentation: 'modal', headerShown: false }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
