import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useAddTrainer } from '@/hooks/useAcademy';
import { maskDate, maskPhone, parseBrDate } from '@/utils/masks';

const COMMON_MODALITIES = [
  'Jiu-Jitsu',
  'Muay Thai',
  'Boxe',
  'MMA',
  'Judô',
  'Karatê',
  'Kickboxing',
  'Wrestling',
  'Taekwondo',
  'Capoeira',
];

export function TrainerFormScreen() {
  const router = useRouter();
  const addTrainer = useAddTrainer();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [modalities, setModalities] = useState<string[]>([]);
  const [customModality, setCustomModality] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const customSelected = modalities.filter((m) => !COMMON_MODALITIES.includes(m));

  function toggleModality(name: string) {
    setModalities((current) => (current.includes(name) ? current.filter((m) => m !== name) : [...current, name]));
  }

  function addCustomModality() {
    const name = customModality.trim();
    if (!name) return;
    if (!modalities.some((m) => m.toLowerCase() === name.toLowerCase())) {
      setModalities((current) => [...current, name]);
    }
    setCustomModality('');
  }

  async function handleSubmit() {
    setFormError('');
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setFormError('Preencha nome, email e telefone.');
      return;
    }
    const birthIso = birthDate ? parseBrDate(birthDate) : null;
    if (birthDate && !birthIso) {
      setFormError('Data de nascimento inválida. Confira dia, mês e ano.');
      return;
    }
    if (password.length < 8) {
      setFormError('A senha de acesso do treinador precisa ter ao menos 8 caracteres.');
      return;
    }
    try {
      await addTrainer.mutateAsync({
        fullName: fullName.trim(),
        email: email.trim(),
        phone,
        birthDate: birthIso,
        modalities,
        password,
      });
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
          label="Data de nascimento (opcional)"
          value={birthDate}
          onChangeText={(v) => setBirthDate(maskDate(v))}
          placeholder="DD/MM/AAAA"
          keyboardType="number-pad"
          maxLength={10}
        />

        <View style={styles.modalities}>
          <Text style={styles.label}>Modalidades</Text>
          <View style={styles.chips}>
            {[...COMMON_MODALITIES, ...customSelected].map((name) => (
              <Chip key={name} label={name} active={modalities.includes(name)} onPress={() => toggleModality(name)} />
            ))}
          </View>
          <View style={styles.customRow}>
            <View style={styles.flex1}>
              <TextField
                label="Outra modalidade"
                value={customModality}
                onChangeText={setCustomModality}
                placeholder="Ex.: Krav Maga"
                onSubmitEditing={addCustomModality}
                returnKeyType="done"
              />
            </View>
            <Button label="Adicionar" variant="secondary" onPress={addCustomModality} disabled={!customModality.trim()} />
          </View>
        </View>

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
  modalities: {
    gap: spacing.sm,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  flex1: {
    flex: 1,
  },
  error: {
    color: colors.danger,
    fontSize: fontSize.sm,
  },
});
