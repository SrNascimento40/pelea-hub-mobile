import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as financeApi from '@/services/api/finance';
import { useAuth } from '@/hooks/useAuth';

export function useStudentFees(studentId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['fees', 'student', studentId],
    queryFn: () => financeApi.listFeesByStudent(user!, studentId!),
    enabled: !!user && !!studentId,
  });
}

export function useAllFees() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['fees', 'all', user?.academyId],
    queryFn: () => financeApi.listAllFees(user!),
    enabled: !!user && (user.role === 'owner' || user.role === 'trainer'),
  });
}

export function useFeeHistory(feeId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['fee-history', feeId],
    queryFn: () => financeApi.getFeeHistory(user!, feeId!),
    enabled: !!user && !!feeId,
  });
}

export function useFinanceSummary() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['finance-summary', user?.academyId],
    queryFn: () => financeApi.financeSummary(user!),
    enabled: !!user && (user.role === 'owner' || user.role === 'trainer'),
  });
}

export function useOverdueFees() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['fees-overdue', user?.academyId],
    queryFn: () => financeApi.listOverdue(user!),
    enabled: !!user && (user.role === 'owner' || user.role === 'trainer'),
  });
}

function useFinanceInvalidate() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['fees'] });
    queryClient.invalidateQueries({ queryKey: ['fee-history'] });
    queryClient.invalidateQueries({ queryKey: ['finance-summary'] });
    queryClient.invalidateQueries({ queryKey: ['fees-overdue'] });
  };
}

export function useCreateFee(studentId: string) {
  const { user } = useAuth();
  const invalidate = useFinanceInvalidate();
  return useMutation({
    mutationFn: (input: financeApi.CreateFeeInput) => financeApi.createFee(user!, studentId, input),
    onSuccess: invalidate,
  });
}

export function usePayFee() {
  const { user } = useAuth();
  const invalidate = useFinanceInvalidate();
  return useMutation({
    mutationFn: ({ feeId, notes }: { feeId: string; notes?: string }) => financeApi.payFee(user!, feeId, notes),
    onSuccess: invalidate,
  });
}

export function useCancelFee() {
  const { user } = useAuth();
  const invalidate = useFinanceInvalidate();
  return useMutation({
    mutationFn: ({ feeId, notes }: { feeId: string; notes?: string }) => financeApi.cancelFee(user!, feeId, notes),
    onSuccess: invalidate,
  });
}
