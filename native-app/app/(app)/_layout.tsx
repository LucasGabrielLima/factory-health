import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack, router } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useSession } from '../../contexts/authContext';
import { Text } from '../../components/Themed';
import { Logs } from 'expo'
import { useEffect } from 'react';



export default function RootLayoutNav() {
  Logs.enableExpoCliLogging()

  const colorScheme = useColorScheme();

  const { session, isLoading } = useSession();


  useEffect(() => {
    if (session) {
      router.replace('/')
    }
  }, [session])

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  console.log('session', session)

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
