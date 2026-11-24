import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '@/constants/theme';

export default function NotFoundScreen() {
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
