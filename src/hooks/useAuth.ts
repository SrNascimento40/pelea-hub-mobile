import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const clearError = useAuthStore((s) => s.clearError);

  return {
    user,
    accessToken,
    isHydrated,
    isLoading,
    error,
    login,
    logout,
    clearError,
    isAuthenticated: !!user,
  };
}
