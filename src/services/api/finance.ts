import { apiClient } from '@/services/apiClient';
import { FinanceSummary, MonthlyFee, PaymentHistoryEntry, User } from '@/types';

export async function listFeesByStudent(_actingUser: User, studentId: string): Promise<MonthlyFee[]> {
  const { data } = await apiClient.get(`/students/${studentId}/fees`);
  return data;
}

export async function getFee(_actingUser: User, feeId: string): Promise<MonthlyFee> {
  const { data } = await apiClient.get(`/fees/${feeId}`);
  return data;
}

export interface CreateFeeInput {
  amount: number;
  dueDate: string;
  referenceMonth: string;
  recurring: boolean;
}

export async function createFee(_actingUser: User, studentId: string, input: CreateFeeInput): Promise<MonthlyFee> {
  const { data } = await apiClient.post(`/students/${studentId}/fees`, input);
  return data;
}

export async function payFee(_actingUser: User, feeId: string, notes = ''): Promise<MonthlyFee> {
  const { data } = await apiClient.patch(`/fees/${feeId}/pay`, { notes });
  return data;
}

export async function cancelFee(_actingUser: User, feeId: string, notes = ''): Promise<MonthlyFee> {
  const { data } = await apiClient.patch(`/fees/${feeId}/cancel`, { notes });
  return data;
}

export async function getFeeHistory(_actingUser: User, feeId: string): Promise<PaymentHistoryEntry[]> {
  const { data } = await apiClient.get(`/fees/${feeId}/history`);
  return data;
}

export async function financeSummary(_actingUser: User): Promise<FinanceSummary> {
  const { data } = await apiClient.get('/finance/summary');
  return data;
}

export interface OverdueEntry {
  fee: MonthlyFee;
  studentName: string;
  studentPhotoUrl: string | null;
}

export async function listOverdue(_actingUser: User): Promise<OverdueEntry[]> {
  const { data } = await apiClient.get('/finance/overdue');
  return data;
}

export async function listAllFees(_actingUser: User): Promise<(MonthlyFee & { studentName: string })[]> {
  const { data } = await apiClient.get('/finance/fees');
  return data;
}
