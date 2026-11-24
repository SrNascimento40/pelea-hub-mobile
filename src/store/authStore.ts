import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as authApi from '@/services/api/auth';
import { setLogoutHandler, setTokens as syncTokens, setTokensRefreshedHandler } from '@/services/tokenStore';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isHydrated: false,
      isLoading: false,
      error: null,
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authApi.login(email, password);
          syncTokens(result.accessToken, result.refreshToken);
          set({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            isLoading: false,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Não foi possível entrar.';
          set({ isLoading: false, error: message });
          throw err;
        }
      },
      logout: async () => {
        await authApi.logout();
        syncTokens(null, null);
        set({ user: null, accessToken: null, refreshToken: null });
      },
      setUser: (user: User) => set({ user }),
      setTokens: (accessToken: string, refreshToken: string) => {
        syncTokens(accessToken, refreshToken);
        set({ accessToken, refreshToken });
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: 'pelea-hub-auth-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, refreshToken: state.refreshToken }),
      onRehydrateStorage: () => (state) => {
        if (state) syncTokens(state.accessToken, state.refreshToken);
        useAuthStore.setState({ isHydrated: true });
      },
    }
  )
);

setLogoutHandler(() => {
  useAuthStore.setState({ user: null, accessToken: null, refreshToken: null });
});

setTokensRefreshedHandler((accessToken, refreshToken) => {
  useAuthStore.setState({ accessToken, refreshToken });
});
