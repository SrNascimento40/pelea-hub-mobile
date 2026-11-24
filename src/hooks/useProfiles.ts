import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as profilesApi from '@/services/api/profiles';
import { useAuth } from '@/hooks/useAuth';

export function usePhysicalProfiles(studentId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['physical', studentId],
    queryFn: () => profilesApi.listPhysicalProfiles(user!, studentId!),
    enabled: !!user && !!studentId,
  });
}

export function useTechnicalProfiles(studentId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['technical', studentId],
    queryFn: () => profilesApi.listTechnicalProfiles(user!, studentId!),
    enabled: !!user && !!studentId,
  });
}

export function useCreatePhysicalProfile(studentId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: profilesApi.PhysicalProfileInput) => profilesApi.createPhysicalProfile(user!, studentId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['physical', studentId] }),
  });
}

export function useCreateTechnicalProfile(studentId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: profilesApi.TechnicalProfileInput) =>
      profilesApi.createTechnicalProfile(user!, studentId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['technical', studentId] }),
  });
}
