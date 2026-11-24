import { useMutation } from '@tanstack/react-query';
import * as usersApi from '@/services/api/users';
import { useAuthStore } from '@/store/authStore';

export function useUpdateMe() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (input: usersApi.UpdateMeInput) => usersApi.updateMe(input),
    onSuccess: (user) => setUser(user),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      usersApi.changePassword(currentPassword, newPassword),
  });
}
