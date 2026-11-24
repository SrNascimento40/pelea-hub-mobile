import { apiClient } from '@/services/apiClient';
import { User } from '@/types';

export interface UpdateMeInput {
  fullName?: string;
  phone?: string;
}

export async function updateMe(input: UpdateMeInput): Promise<User> {
  const { data } = await apiClient.put('/users/me', input);
  return data;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiClient.put('/users/me/password', { currentPassword, newPassword });
}
