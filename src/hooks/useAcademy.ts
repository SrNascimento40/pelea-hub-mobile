import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as academyApi from '@/services/api/academy';
import { useAuth } from '@/hooks/useAuth';

export function useAcademy() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['academy', user?.academyId],
    queryFn: () => academyApi.getAcademy(user!),
    enabled: !!user,
  });
}

export function useUpdateAcademy() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: academyApi.UpdateAcademyInput) => academyApi.updateAcademy(user!, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['academy'] }),
  });
}

export function useTrainers() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['trainers', user?.academyId],
    queryFn: () => academyApi.listTrainers(user!),
    enabled: !!user && user.role === 'owner',
  });
}

export function useAddTrainer() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: academyApi.CreateTrainerInput) => academyApi.addTrainer(user!, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trainers'] }),
  });
}

export function useRemoveTrainer() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trainerId: string) => academyApi.removeTrainer(user!, trainerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trainers'] }),
  });
}
