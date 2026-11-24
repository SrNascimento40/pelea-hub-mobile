import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingView } from '@/components/ui/LoadingView';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { NotificationItem } from '@/components/NotificationItem';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useMarkNotificationRead, useNotifications, useSendNotification } from '@/hooks/useNotifications';
import { permissions } from '@/utils/permissions';

export function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: notifications, isLoading, refetch, isRefetching } = useNotifications();
  const markRead = useMarkNotificationRead();
  const sendNotification = useSendNotification();

  const [showCompose, setShowCompose] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  if (!user) return null;
  const canSend = permissions.sendNotifications(user.role);

  async function handleSend() {
    if (!title.trim() || !body.trim()) return;
    await sendNotification.mutateAsync({ target: 'all', title: title.trim(), body: body.trim() });
    setTitle('');
    setBody('');
    setShowCompose(false);
  }

  return (
    <Screen onRefresh={refetch} refreshing={isRefetching} contentStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={colors.textMuted} />
        </Pressable>
        <Text style={styles.title}>Notificações</Text>
        <View style={{ width: 22 }} />
      </View>

      {canSend ? (
        showCompose ? (
          <View style={styles.composeCard}>
            <TextField label="Título" value={title} onChangeText={setTitle} placeholder="Ex: Aula extra de sábado" />
            <TextField
              label="Mensagem"
              value={body}
              onChangeText={setBody}
              placeholder="Escreva o comunicado para todos os alunos"
              multiline
              numberOfLines={3}
              style={styles.textarea}
            />
            <View style={styles.composeActions}>
              <Button label="Cancelar" variant="secondary" onPress={() => setShowCompose(false)} style={styles.flex1} />
              <Button label="Enviar para todos" onPress={handleSend} loading={sendNotification.isPending} style={styles.flex1} />
            </View>
          </View>
        ) : (
          <Button label="Enviar comunicado" variant="secondary" onPress={() => setShowCompose(true)} />
        )
      ) : null}

      {isLoading ? (
        <LoadingView />
      ) : notifications && notifications.length > 0 ? (
        <View>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onPress={() => {
                if (!notification.readAt) markRead.mutate(notification.id);
              }}
            />
          ))}
        </View>
      ) : (
        <EmptyState icon="notifications-outline" title="Nenhuma notificação" />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  composeCard: {
    gap: spacing.sm,
  },
  composeActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex1: {
    flex: 1,
  },
  textarea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
});
