import { useMutation, useQueryClient } from '@tanstack/react-query';
import { developerService } from '../../services/developer.service';

export const useCreateTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => developerService.createTicket(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['developer', 'tickets'] });
    },
  });
};
