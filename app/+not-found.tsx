import { Link, Stack, usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '@/constants/theme';
import { LogoutScreen } from '@/screens/auth/LogoutScreen';

export default function NotFoundScreen() {
  const pathname = usePathname();

  // As rotas do Expo Router diferenciam maiúsculas; /Logout, /LOGOUT etc.
  // caem aqui e devem se comportar como /logout.
  if (pathname.replace(/\/+$/, '').toLowerCase() === '/logout') {
    return <LogoutScreen />;
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Não encontrado' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Esta tela não existe.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Voltar ao início</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  link: {
    paddingVertical: spacing.sm,
  },
  linkText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
