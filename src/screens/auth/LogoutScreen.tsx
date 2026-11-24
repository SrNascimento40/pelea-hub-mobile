import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { LoadingView } from '@/components/ui/LoadingView';
import { colors } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

/**
 * Encerra a sessão (se houver) e envia para a tela de login.
 * Usada pela rota /logout e por qualquer variação de maiúsculas (/Logout etc.).
 */
export function LogoutScreen() {
  const { user, isHydrated, logout } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    // Espera o estado persistido carregar; senão a sessão salva seria
    // restaurada depois do logout.
    if (!isHydrated || !user || started.current) return;
    started.current = true;
    logout();
  }, [isHydrated, user, logout]);

  if (isHydrated && !user) return <Redirect href="/(auth)" />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LoadingView />
    </View>
  );
}
