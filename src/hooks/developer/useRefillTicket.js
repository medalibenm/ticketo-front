import { useMutation, useQueryClient } from '@tanstack/react-query';
import { developerService } from '../../services/developer.service';

export const useRefillTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, description }) =>
      developerService.refillTicket(ticketId, { description }),
    onSuccess: (_, { ticketId }) => {
      qc.invalidateQueries({ queryKey: ['developer', 'tickets', ticketId] });
    },
  });
};
