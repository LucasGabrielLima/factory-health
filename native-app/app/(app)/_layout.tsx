import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useSession } from '../../contexts/authContext';
import { Text } from '../../components/Themed';
import { Logs } from 'expo'



export default function RootLayoutNav() {
  Logs.enableExpoCliLogging()

  const colorScheme = useColorScheme();

  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

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
