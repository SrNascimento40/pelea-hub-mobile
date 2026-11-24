import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { LoadingView } from '@/components/ui/LoadingView';
import { colors } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { homeRouteForRole } from '@/utils/navigation';

export default function Index() {
  const { user, isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingView />
      </View>
    );
  }

  if (!user) return <Redirect href="/(auth)/login" />;
  return <Redirect href={homeRouteForRole(user.role)} />;
}
