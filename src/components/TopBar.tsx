import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useUnreadCount } from '@/hooks/useNotifications';

interface TopBarProps {
  title: string;
  subtitle?: string;
  notificationsHref: string;
}

export function TopBar({ title, subtitle, notificationsHref }: TopBarProps) {
  const router = useRouter();
  const { data: unread } = useUnreadCount();

  return (
    <View style={styles.container}>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Pressable onPress={() => router.push(notificationsHref)} style={styles.bell}>
        <Ionicons name="notifications-outline" size={22} color={colors.text} />
        {!!unread && unread > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
