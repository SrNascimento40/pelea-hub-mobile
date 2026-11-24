import { apiClient } from '@/services/apiClient';
import { AppNotification, NotificationType, User } from '@/types';

export async function listNotifications(_actingUser: User): Promise<AppNotification[]> {
  const { data } = await apiClient.get('/notifications');
  return data;
}

export async function unreadCount(_actingUser: User): Promise<number> {
  const { data } = await apiClient.get('/notifications/unread-count');
  return data;
}

export async function markAsRead(_actingUser: User, notificationId: string): Promise<AppNotification> {
  const { data } = await apiClient.patch(`/notifications/${notificationId}/read`);
  return data;
}

export interface SendNotificationInput {
  target: 'all' | string;
  title: string;
  body: string;
  type?: NotificationType;
}

export async function sendNotification(_actingUser: User, input: SendNotificationInput): Promise<AppNotification> {
  const { data } = await apiClient.post('/notifications/send', input);
  return data;
}
