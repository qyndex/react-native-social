import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile/[id]"
          options={{ title: 'Profile', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="post/[id]"
          options={{ title: 'Post', headerBackTitle: 'Back' }}
        />
      </Stack>
    </>
  );
}
