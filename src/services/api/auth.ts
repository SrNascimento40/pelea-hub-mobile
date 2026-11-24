import { apiClient } from '@/services/apiClient';
import { User } from '@/types';

export interface LoginResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const { data } = await apiClient.post('/auth/login', { email: email.trim(), password });
  return { user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken };
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout').catch(() => undefined);
}

export async function registerFcmToken(fcmToken: string): Promise<void> {
  await apiClient.post('/auth/fcm-token', { fcmToken });
}
