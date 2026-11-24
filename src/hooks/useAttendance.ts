import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as attendanceApi from '@/services/api/attendance';
import { useAuth } from '@/hooks/useAuth';

export function useStudentAttendance(studentId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['attendance', 'student', studentId],
    queryFn: () => attendanceApi.listStudentAttendance(user!, studentId!),
    enabled: !!user && !!studentId,
  });
}

export function useTodayAttendance() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['attendance', 'today', user?.academyId],
    queryFn: () => attendanceApi.todayAttendance(user!),
    enabled: !!user && (user.role === 'owner' || user.role === 'trainer'),
  });
}

export function useAttendanceSummary(days = 30) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['attendance', 'summary', user?.academyId, days],
    queryFn: () => attendanceApi.attendanceSummary(user!, days),
    enabled: !!user && (user.role === 'owner' || user.role === 'trainer'),
  });
}

export function useCheckin() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, notes }: { studentId: string; notes?: string }) =>
      attendanceApi.checkin(user!, studentId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
    },
  });
}
