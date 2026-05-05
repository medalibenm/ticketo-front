import { useMutation, useQueryClient } from '@tanstack/react-query';
import { developerService } from '../../services/developer.service';

export const useUpdateDeveloperProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => developerService.updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['developer', 'profile'] });
    },
  });
};
