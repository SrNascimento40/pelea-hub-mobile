import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/constants/config';
import { getTokens, notifyTokensRefreshed, triggerLogout } from '@/services/tokenStore';
import { ApiError } from '@/utils/id';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const { accessToken } = getTokens();
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken } = getTokens();
  if (!refreshToken) return null;

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    notifyTokensRefreshed(accessToken, newRefreshToken);
    return accessToken;
  } catch {
    triggerLogout();
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    const status = error.response?.status;

    const isAuthEndpoint = original?.url?.includes('/auth/login') || original?.url?.includes('/auth/refresh');

    if (status === 401 && original && !original._retried && !isAuthEndpoint) {
      original._retried = true;
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;
      if (newToken) {
        original.headers.set('Authorization', `Bearer ${newToken}`);
        return apiClient(original);
      }
    }

    const detail = (error.response?.data as { detail?: string } | undefined)?.detail;
    const message = detail || error.message || 'Erro inesperado ao comunicar com o servidor.';
    throw new ApiError(message, status ?? 500);
  }
);
