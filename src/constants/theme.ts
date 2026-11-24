export const colors = {
  background: '#0B0B0C',
  surface: '#17181A',
  surfaceAlt: '#1F2023',
  border: '#2A2B2E',
  primary: '#E63946',
  primaryMuted: '#3A1B1E',
  text: '#F5F5F4',
  textMuted: '#9B9CA1',
  textFaint: '#5C5D62',
  success: '#3DD68C',
  successMuted: '#123326',
  warning: '#F4B740',
  warningMuted: '#3A2E10',
  danger: '#EF4444',
  dangerMuted: '#3A1414',
  info: '#4EA1F7',
  infoMuted: '#122A3A',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const fontSize = {
  xs: 12,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  display: 32,
};

export const roleLabels: Record<string, string> = {
  owner: 'Dono',
  trainer: 'Treinador',
  student: 'Aluno',
};

export const statusColors = {
  active: colors.success,
  inactive: colors.textFaint,
  paid: colors.success,
  pending: colors.warning,
  overdue: colors.danger,
};
