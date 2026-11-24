import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { AppNotification } from '@/types';
import { formatDateTime } from '@/utils/format';

const ICON: Record<AppNotification['type'], keyof typeof Ionicons.glyphMap> = {
  fee_due: 'cash-outline',
  fee_overdue: 'alert-circle-outline',
  announcement: 'megaphone-outline',
  system: 'settings-outline',
};

export function NotificationItem({ notification, onPress }: { notification: AppNotification; onPress: () => void }) {
  const unread = !notification.readAt;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.iconWrap, unread && styles.iconWrapUnread]}>
        <Ionicons name={ICON[notification.type]} size={18} color={unread ? colors.primary : colors.textMuted} />
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, unread && styles.titleUnread]}>{notification.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {notification.body}
        </Text>
        <Text style={styles.date}>{formatDateTime(notification.sentAt)}</Text>
      </View>
      {unread ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapUnread: {
    backgroundColor: colors.primaryMuted,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  titleUnread: {
    color: colors.text,
  },
  description: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  date: {
    color: colors.textFaint,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
});
