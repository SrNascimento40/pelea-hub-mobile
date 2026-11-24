import { apiClient } from '@/services/apiClient';
import { RankingRow, User } from '@/types';

export async function monthlyRanking(_actingUser: User, month: number, year: number): Promise<RankingRow[]> {
  const { data } = await apiClient.get('/ranking/monthly', { params: { month, year } });
  return data;
}

export async function overallRanking(_actingUser: User): Promise<RankingRow[]> {
  const { data } = await apiClient.get('/ranking/overall');
  return data;
}

export async function studentRanking(
  _actingUser: User,
  studentId: string
): Promise<{ position: number; points: number; total: number }> {
  const { data } = await apiClient.get(`/students/${studentId}/ranking`);
  return data;
}

export async function adjustPointsManually(_actingUser: User, studentId: string, points: number): Promise<void> {
  await apiClient.patch(`/students/${studentId}/ranking/points`, { points });
}
