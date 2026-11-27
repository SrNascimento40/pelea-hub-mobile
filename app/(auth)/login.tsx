import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    clearError();
    try {
      await login(email, password);
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
          <Button label="Entrar" onPress={handleSubmit} loading={isLoading} fullWidth style={styles.submit} />
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
});
