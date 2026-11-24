// Plain module-level token cache read by apiClient's interceptors. Kept separate
// from the zustand authStore to avoid a require cycle (authStore -> api/auth ->
// apiClient -> authStore); authStore pushes updates here whenever tokens change.
interface Tokens {
  accessToken: string | null;
  refreshToken: string | null;
}

let tokens: Tokens = { accessToken: null, refreshToken: null };
let onLogout: (() => void) | null = null;
let onTokensRefreshed: ((accessToken: string, refreshToken: string) => void) | null = null;

export function setTokens(accessToken: string | null, refreshToken: string | null) {
  tokens = { accessToken, refreshToken };
}

export function getTokens(): Tokens {
  return tokens;
}

export function setLogoutHandler(handler: () => void) {
  onLogout = handler;
}

export function triggerLogout() {
  onLogout?.();
}

export function setTokensRefreshedHandler(handler: (accessToken: string, refreshToken: string) => void) {
  onTokensRefreshed = handler;
}

export function notifyTokensRefreshed(accessToken: string, refreshToken: string) {
  setTokens(accessToken, refreshToken);
  onTokensRefreshed?.(accessToken, refreshToken);
}
