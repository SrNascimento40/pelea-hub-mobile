import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useCreateStudent, useUpdateStudent } from '@/hooks/useStudents';
import { Student } from '@/types';

interface StudentFormScreenProps {
  mode: 'create' | 'edit';
  basePath: string;
  student?: Student;
}

export function StudentFormScreen({ mode, basePath, student }: StudentFormScreenProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(student?.fullName ?? '');
  const [email, setEmail] = useState(student?.email ?? '');
  const [phone, setPhone] = useState(student?.phone ?? '');
  const [birthDate, setBirthDate] = useState(student ? student.birthDate.slice(0, 10) : '');
  const [address, setAddress] = useState(student?.address ?? '');
  const [observations, setObservations] = useState(student?.observations ?? '');
  const [formError, setFormError] = useState('');

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent(student?.id ?? '');
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit() {
    setFormError('');
    if (!fullName.trim() || !email.trim() || !phone.trim() || !birthDate.trim()) {
      setFormError('Preencha nome, email, telefone e data de nascimento.');
      return;
    }
    const birthIso = new Date(birthDate).toISOString();
    if (Number.isNaN(new Date(birthDate).getTime())) {
      setFormError('Data de nascimento inválida. Use o formato AAAA-MM-DD.');
      return;
    }

    try {
      if (mode === 'create') {
        const created = await createMutation.mutateAsync({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          birthDate: birthIso,
          address: address.trim(),
          observations: observations.trim(),
        });
        router.replace({ pathname: `${basePath}/students/[id]`, params: { id: created.id } });
      } else if (student) {
        await updateMutation.mutateAsync({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          birthDate: birthIso,
          address: address.trim(),
          observations: observations.trim(),
        });
        router.back();
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Não foi possível salvar o aluno.');
    }
  }

  return (
    <Screen>
      <Text style={styles.title}>{mode === 'create' ? 'Novo aluno' : 'Editar aluno'}</Text>
      <View style={styles.form}>
        <TextField label="Nome completo" value={fullName} onChangeText={setFullName} placeholder="Nome do aluno" />
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="aluno@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextField label="Telefone" value={phone} onChangeText={setPhone} placeholder="(11) 99999-9999" keyboardType="phone-pad" />
        <TextField
          label="Data de nascimento"
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="AAAA-MM-DD"
        />
        <TextField label="Endereço" value={address} onChangeText={setAddress} placeholder="Endereço completo" />
        <TextField
          label="Observações"
          value={observations}
          onChangeText={setObservations}
          placeholder="Restrições médicas, observações gerais..."
          multiline
          numberOfLines={3}
          style={styles.textarea}
        />
        {formError ? <Text style={styles.error}>{formError}</Text> : null}
        <Button
          label={mode === 'create' ? 'Cadastrar aluno' : 'Salvar alterações'}
          onPress={handleSubmit}
          loading={isSubmitting}
          fullWidth
        />
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
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  error: {
    color: colors.danger,
    fontSize: fontSize.sm,
  },
});
