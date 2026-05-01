import { useMutation, useQueryClient } from '@tanstack/react-query';
import { engineerService } from '../../services/engineer.service';

export const useUpdateEngineerProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => engineerService.updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['engineer', 'profile'] });
    },
  });
};
