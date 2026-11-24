import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '@/constants/demoAccounts';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(overrideEmail?: string) {
    clearError();
    const targetEmail = overrideEmail ?? email;
    const targetPassword = overrideEmail ? DEMO_PASSWORD : password;
    try {
      await login(targetEmail, targetPassword);
    } catch {
      // error is surfaced via store; (auth)/_layout redirects automatically on success
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="flame" size={28} color={colors.primary} />
          </View>
          <Text style={styles.appName}>Pelea Hub</Text>
          <Text style={styles.tagline}>Gestão para academias de artes marciais</Text>
        </View>

        <View style={styles.form}>
          <TextField
            label="Email"
            placeholder="seu@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            label="Senha"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button label="Entrar" onPress={() => handleSubmit()} loading={isLoading} fullWidth style={styles.submit} />
        </View>

        <View style={styles.demoSection}>
          <Text style={styles.demoLabel}>Acesso rápido de demonstração</Text>
          {DEMO_ACCOUNTS.map((account) => (
            <Pressable
              key={account.email}
              style={({ pressed }) => [styles.demoCard, pressed && styles.demoCardPressed]}
              onPress={() => handleSubmit(account.email)}
              disabled={isLoading}
            >
              <View>
                <Text style={styles.demoName}>{account.name}</Text>
                <Text style={styles.demoEmail}>{account.email}</Text>
              </View>
              <Ionicons name="arrow-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
          <Text style={styles.demoHint}>Senha de demonstração: {DEMO_PASSWORD}</Text>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  appName: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '800',
  },
  tagline: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  form: {
    gap: spacing.md,
  },
  submit: {
    marginTop: spacing.sm,
  },
  error: {
    color: colors.danger,
    fontSize: fontSize.sm,
  },
  demoSection: {
    marginTop: spacing.xxl,
    gap: spacing.sm,
  },
  demoLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  demoCardPressed: {
    opacity: 0.7,
  },
  demoName: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  demoEmail: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  demoHint: {
    color: colors.textFaint,
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
