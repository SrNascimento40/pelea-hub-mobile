import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as notificationsApi from '@/services/api/notifications';
import { useAuth } from '@/hooks/useAuth';

export function useNotifications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => notificationsApi.listNotifications(user!),
    enabled: !!user,
    refetchInterval: 30000,
  });
}

export function useUnreadCount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['notifications-unread', user?.id],
    queryFn: () => notificationsApi.unreadCount(user!),
    enabled: !!user,
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => notificationsApi.markAsRead(user!, notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });
}

export function useSendNotification() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: notificationsApi.SendNotificationInput) => notificationsApi.sendNotification(user!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });
}
