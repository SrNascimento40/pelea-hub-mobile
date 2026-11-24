import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { LoadingView } from '@/components/ui/LoadingView';
import { colors } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { queryClient } from '@/services/queryClient';

// react-native-screens defaults to disabled on web (screensEnabled() is only
// true by default on iOS/Android/Windows). Without it, react-navigation's web
// fallback for inactive tab/stack screens skips its `display: none` styling,
// leaving them fully interactive and overlapping the active screen.
enableScreens(true);

function RootNavigator() {
  const { user, isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingView />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={user?.role === 'owner'}>
        <Stack.Screen name="(owner)" />
      </Stack.Protected>
      <Stack.Protected guard={user?.role === 'trainer'}>
        <Stack.Screen name="(trainer)" />
      </Stack.Protected>
      <Stack.Protected guard={user?.role === 'student'}>
        <Stack.Screen name="(student)" />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <RootNavigator />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
