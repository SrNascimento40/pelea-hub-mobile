import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as rankingApi from '@/services/api/ranking';
import { useAuth } from '@/hooks/useAuth';

export function useMonthlyRanking(month: number, year: number) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['ranking', 'monthly', user?.academyId, month, year],
    queryFn: () => rankingApi.monthlyRanking(user!, month, year),
    enabled: !!user,
  });
}

export function useOverallRanking() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['ranking', 'overall', user?.academyId],
    queryFn: () => rankingApi.overallRanking(user!),
    enabled: !!user,
  });
}

export function useStudentRanking(studentId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['ranking', 'student', studentId],
    queryFn: () => rankingApi.studentRanking(user!, studentId!),
    enabled: !!user && !!studentId,
  });
}

export function useAdjustRankingPoints() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, points }: { studentId: string; points: number }) =>
      rankingApi.adjustPointsManually(user!, studentId, points),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
    },
  });
}
