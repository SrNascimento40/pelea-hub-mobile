import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { useStudentAttendance } from '@/hooks/useAttendance';
import { useCreateProgressCheckin } from '@/hooks/useProfiles';
import { ProgressCheckin, ProgressScoreKey, ProgressScores } from '@/types';
import { formatDate } from '@/utils/format';
import { maskDate, parseBrDate } from '@/utils/masks';

// Colunas do "Fighter Progress & Stats" (Boxing Kids Group Classes), na mesma ordem.
export const PROGRESS_SKILLS: { key: ProgressScoreKey; label: string; group: 'technique' | 'physical' }[] = [
  { key: 'stanceGuard', label: 'Base e guarda', group: 'technique' },
  { key: 'footwork', label: 'Deslocamento', group: 'technique' },
  { key: 'jab', label: 'Jab', group: 'technique' },
  { key: 'crossPunch', label: 'Direto', group: 'technique' },
  { key: 'hook', label: 'Cruzado', group: 'technique' },
  { key: 'uppercut', label: 'Gancho', group: 'technique' },
  { key: 'defense', label: 'Defesa', group: 'technique' },
  { key: 'strength', label: 'Força', group: 'physical' },
  { key: 'speed', label: 'Velocidade', group: 'physical' },
  { key: 'endurance', label: 'Resistência', group: 'physical' },
];

const GROUPS = [
  { key: 'technique', label: 'Técnica' },
  { key: 'physical', label: 'Físico' },
] as const;

// Escala simples de técnica da página do Notion.
export const SCORE_LEVELS: Record<number, { name: string; description: string }> = {
  1: { name: 'Aprendendo', description: 'Precisa de lembretes e demonstrações frequentes.' },
  2: { name: 'Desenvolvendo', description: 'Executa medianamente o fundamento.' },
  3: { name: 'Praticando', description: 'Executa corretamente o fundamento/técnica, mas precisa desenvolver a prática.' },
  4: { name: 'Consistente', description: 'Executa corretamente fundamento/técnica e prática, mas pode melhorar.' },
  5: { name: 'Forte', description: 'Perfeito.' },
};

const EMPTY_SCORES = Object.fromEntries(PROGRESS_SKILLS.map((s) => [s.key, null])) as ProgressScores;

function todayBr(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Média das notas preenchidas, ou null se nenhuma foi dada. */
export function averageScore(checkin: ProgressScores): number | null {
  const values = PROGRESS_SKILLS.map((s) => checkin[s.key]).filter((v): v is number => v != null);
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function ScoreBar({ value }: { value: number | null }) {
  return (
    <View style={styles.bar}>
      {[1, 2, 3, 4, 5].map((n) => (
        <View key={n} style={[styles.barSegment, value != null && n <= value && styles.barSegmentFilled]} />
      ))}
    </View>
  );
}

function Delta({ current, previous }: { current: number | null; previous: number | null | undefined }) {
  if (current == null || previous == null || current === previous) return <Text style={styles.delta} />;
  const up = current > previous;
  return (
    <Text style={[styles.delta, { color: up ? colors.success : colors.danger }]}>
      {up ? '▲' : '▼'} {Math.abs(current - previous)}
    </Text>
  );
}

/** Uma avaliação datada; com `previous`, mostra quanto cada nota subiu ou desceu. */
export function ProgressCheckinCard({ checkin, previous }: { checkin: ProgressCheckin; previous?: ProgressCheckin }) {
  const notes = [
    { label: 'Foco de desenvolvimento', value: checkin.developmentFocus },
    { label: 'Pontos fortes', value: checkin.strengths },
    { label: 'Pontos fracos', value: checkin.weaknesses },
  ].filter((n) => n.value);

  return (
    <Card style={styles.card}>
      <View>
        <Text style={styles.cardTitle}>Avaliação de {formatDate(checkin.checkinDate)}</Text>
        <Text style={styles.meta}>
          {checkin.frequency ? `Frequência: ${checkin.frequency} · ` : ''}por {checkin.createdByName}
          {previous ? ` · comparado a ${formatDate(previous.checkinDate)}` : ''}
        </Text>
      </View>

      {GROUPS.map((group) => (
        <View key={group.key} style={styles.group}>
          <Text style={styles.groupLabel}>{group.label}</Text>
          {PROGRESS_SKILLS.filter((s) => s.group === group.key).map((skill) => {
            const value = checkin[skill.key];
            return (
              <View key={skill.key} style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>{skill.label}</Text>
                <ScoreBar value={value} />
                <Text style={styles.scoreValue}>{value ?? '—'}</Text>
                <Delta current={value} previous={previous?.[skill.key]} />
              </View>
            );
          })}
        </View>
      ))}

      {notes.map((n) => (
        <View key={n.label} style={styles.noteBlock}>
          <Text style={styles.groupLabel}>{n.label}</Text>
          <Text style={styles.noteText}>{n.value}</Text>
        </View>
      ))}
    </Card>
  );
}

function ScorePicker({ value, onChange }: { value: number | null; onChange: (v: number | null) => void }) {
  return (
    <View style={styles.picker}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = value === n;
        return (
          <Pressable
            key={n}
            accessibilityRole="button"
            accessibilityLabel={`Nota ${n} — ${SCORE_LEVELS[n].name}`}
            onPress={() => onChange(active ? null : n)}
            style={[styles.pickerOption, active && styles.pickerOptionActive]}
          >
            <Text style={[styles.pickerText, active && styles.pickerTextActive]}>{n}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ProgressCheckinForm({ studentId, onClose }: { studentId: string; onClose: () => void }) {
  const create = useCreateProgressCheckin(studentId);
  const { data: attendance } = useStudentAttendance(studentId);

  const [date, setDate] = useState(todayBr);
  const [frequency, setFrequency] = useState('');
  const [scores, setScores] = useState<ProgressScores>(EMPTY_SCORES);
  const [developmentFocus, setDevelopmentFocus] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [error, setError] = useState('');

  // Sugestão para o campo Frequência: presenças registradas nos 30 dias até a data da avaliação.
  const attendanceSuggestion = useMemo(() => {
    const iso = parseBrDate(date);
    if (!attendance || !iso) return null;
    const end = new Date(iso).getTime() + 24 * 60 * 60 * 1000;
    const start = end - 30 * 24 * 60 * 60 * 1000;
    const count = attendance.filter((a) => {
      const t = new Date(a.checkedInAt).getTime();
      return t >= start && t < end;
    }).length;
    return `${count} ${count === 1 ? 'aula' : 'aulas'} em 30 dias`;
  }, [attendance, date]);

  async function handleSave() {
    setError('');
    const checkinDate = parseBrDate(date);
    if (!checkinDate) {
      setError('Informe uma data de avaliação válida (DD/MM/AAAA), que não esteja no futuro.');
      return;
    }
    const hasContent =
      PROGRESS_SKILLS.some((s) => scores[s.key] != null) || developmentFocus.trim() || strengths.trim() || weaknesses.trim();
    if (!hasContent) {
      setError('Dê nota a pelo menos um item ou escreva uma observação.');
      return;
    }
    try {
      await create.mutateAsync({ checkinDate, frequency: frequency.trim(), ...scores, developmentFocus, strengths, weaknesses });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível salvar a avaliação.');
    }
  }

  return (
    <Card style={styles.card}>
      <Text style={styles.cardTitle}>Nova avaliação</Text>
      <TextField
        label="Data da avaliação"
        value={date}
        onChangeText={(t) => setDate(maskDate(t))}
        keyboardType="number-pad"
        placeholder="DD/MM/AAAA"
        maxLength={10}
      />
      <TextField label="Frequência" value={frequency} onChangeText={setFrequency} placeholder="Ex.: 8 de 10 aulas" maxLength={60} />
      {attendanceSuggestion ? (
        <Pressable onPress={() => setFrequency(attendanceSuggestion)} hitSlop={6}>
          <Text style={styles.suggestion}>
            Presenças registradas: {attendanceSuggestion} · <Text style={styles.suggestionAction}>usar</Text>
          </Text>
        </Pressable>
      ) : null}

      <View style={styles.legend}>
        <Text style={styles.groupLabel}>Escala</Text>
        {[1, 2, 3, 4, 5].map((n) => (
          <Text key={n} style={styles.legendText}>
            <Text style={styles.legendNumber}>{n} — {SCORE_LEVELS[n].name}:</Text> {SCORE_LEVELS[n].description}
          </Text>
        ))}
        <Text style={styles.legendHint}>Toque de novo na nota para deixar o item sem avaliação.</Text>
      </View>

      {GROUPS.map((group) => (
        <View key={group.key} style={styles.group}>
          <Text style={styles.groupLabel}>{group.label}</Text>
          {PROGRESS_SKILLS.filter((s) => s.group === group.key).map((skill) => {
            const value = scores[skill.key];
            return (
              <View key={skill.key} style={styles.pickerRow}>
                <View style={styles.pickerTexts}>
                  <Text style={styles.scoreLabel}>{skill.label}</Text>
                  <Text style={styles.pickerLevel}>{value ? SCORE_LEVELS[value].name : 'Não avaliado'}</Text>
                </View>
                <ScorePicker value={value} onChange={(v) => setScores((prev) => ({ ...prev, [skill.key]: v }))} />
              </View>
            );
          })}
        </View>
      ))}

      <TextField label="Foco de desenvolvimento" value={developmentFocus} onChangeText={setDevelopmentFocus} multiline style={styles.textarea} />
      <TextField label="Pontos fortes" value={strengths} onChangeText={setStrengths} multiline style={styles.textarea} />
      <TextField label="Pontos fracos" value={weaknesses} onChangeText={setWeaknesses} multiline style={styles.textarea} />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.actions}>
        <Button label="Cancelar" variant="secondary" onPress={onClose} style={styles.flex1} />
        <Button label="Salvar avaliação" loading={create.isPending} onPress={handleSave} style={styles.flex1} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  meta: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  group: {
    gap: spacing.sm,
  },
  groupLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scoreLabel: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
    flex: 1,
  },
  bar: {
    flexDirection: 'row',
    gap: 3,
  },
  barSegment: {
    width: 16,
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.surfaceAlt,
  },
  barSegmentFilled: {
    backgroundColor: colors.primary,
  },
  scoreValue: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '700',
    width: 14,
    textAlign: 'right',
  },
  delta: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    width: 30,
    textAlign: 'right',
  },
  noteBlock: {
    gap: 2,
  },
  noteText: {
    color: colors.text,
    fontSize: fontSize.sm,
  },
  suggestion: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: -spacing.xs,
  },
  suggestionAction: {
    color: colors.primary,
    fontWeight: '700',
  },
  legend: {
    gap: 2,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  legendText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  legendNumber: {
    color: colors.text,
    fontWeight: '700',
  },
  legendHint: {
    color: colors.textFaint,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pickerTexts: {
    flex: 1,
  },
  pickerLevel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  picker: {
    flexDirection: 'row',
    gap: 4,
  },
  pickerOption: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pickerText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  pickerTextActive: {
    color: colors.white,
  },
  textarea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  error: {
    color: colors.danger,
    fontSize: fontSize.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex1: {
    flex: 1,
  },
});
