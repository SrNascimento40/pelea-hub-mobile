import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as studentsApi from '@/services/api/students';
import { useAuth } from '@/hooks/useAuth';
import { StudentStatus } from '@/types';

export function useStudents(filters: studentsApi.StudentFilters = {}) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['students', user?.academyId, filters],
    queryFn: () => studentsApi.listStudents(user!, filters),
    enabled: !!user,
  });
}

export function useStudent(studentId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['student', studentId],
    queryFn: () => studentsApi.getStudent(user!, studentId!),
    enabled: !!user && !!studentId,
  });
}

export function useMyStudentProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-student-profile', user?.id],
    queryFn: () => studentsApi.getStudentByUserId(user!.id),
    enabled: !!user && user.role === 'student',
  });
}

export function useCreateStudent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: studentsApi.CreateStudentInput) => studentsApi.createStudent(user!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

export function useUpdateStudent(studentId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: studentsApi.UpdateStudentInput) => studentsApi.updateStudent(user!, studentId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', studentId] });
    },
  });
}

export function useSetStudentStatus(studentId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: StudentStatus) => studentsApi.setStudentStatus(user!, studentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', studentId] });
    },
  });
}

export function useUploadStudentPhoto(studentId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (localUri: string) => studentsApi.uploadStudentPhoto(user!, studentId, localUri),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', studentId] });
    },
  });
}
