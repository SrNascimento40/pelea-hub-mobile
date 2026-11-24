import React from 'react';
import { Platform, RefreshControl, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/constants/theme';

// react-native-web's RefreshControl renders a full-screen overlay that swallows
// all pointer events, so pull-to-refresh is native-only.
const SUPPORTS_REFRESH_CONTROL = Platform.OS !== 'web';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  contentStyle?: ViewStyle;
}

export function Screen({ children, scroll = true, padded = true, onRefresh, refreshing, contentStyle }: ScreenProps) {
  const content = (
    <View style={[padded && styles.padded, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh && SUPPORTS_REFRESH_CONTROL ? (
              <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            ) : undefined
          }
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.flex}>{content}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});
