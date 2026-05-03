import { useMutation, useQueryClient } from '@tanstack/react-query';
import { engineerService } from '../../services/engineer.service';

export const useEngineerResolveTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ticketId) => engineerService.resolveTicket(ticketId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['engineer', 'tickets'] });
      qc.invalidateQueries({ queryKey: ['engineer', 'stats'] });
      qc.invalidateQueries({ queryKey: ['engineer', 'profile'] });
    },
  });
};
