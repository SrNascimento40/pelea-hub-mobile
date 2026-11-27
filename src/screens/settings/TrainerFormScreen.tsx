import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useAddTrainer } from '@/hooks/useAcademy';
import { maskPhone } from '@/utils/masks';

export function TrainerFormScreen() {
  const router = useRouter();
  const addTrainer = useAddTrainer();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  async function handleSubmit() {
    setFormError('');
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setFormError('Preencha nome, email e telefone.');
      return;
    }
    if (password.length < 8) {
      setFormError('A senha de acesso do treinador precisa ter ao menos 8 caracteres.');
      return;
    }
    try {
      await addTrainer.mutateAsync({ fullName: fullName.trim(), email: email.trim(), phone, password });
      router.back();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Não foi possível cadastrar o treinador.');
    }
  }

  return (
    <Screen>
      <Text style={styles.title}>Novo treinador</Text>
      <View style={styles.form}>
        <TextField label="Nome completo" value={fullName} onChangeText={setFullName} placeholder="Nome do treinador" />
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="treinador@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextField
          label="Telefone"
          value={phone}
          onChangeText={(v) => setPhone(maskPhone(v))}
          placeholder="(11) 99999-9999"
          keyboardType="phone-pad"
        />
        <TextField
          label="Senha de acesso do treinador"
          value={password}
          onChangeText={setPassword}
          placeholder="Mínimo 8 caracteres — repasse ao treinador"
          autoCapitalize="none"
          secureTextEntry
        />
        {formError ? <Text style={styles.error}>{formError}</Text> : null}
        <Button label="Cadastrar treinador" onPress={handleSubmit} loading={addTrainer.isPending} fullWidth />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.md,
  },
  error: {
    color: colors.danger,
    fontSize: fontSize.sm,
  },
});
