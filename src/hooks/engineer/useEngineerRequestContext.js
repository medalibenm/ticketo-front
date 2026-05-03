import { useMutation, useQueryClient } from '@tanstack/react-query';
import { engineerService } from '../../services/engineer.service';

export const useEngineerRequestContext = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, message }) => engineerService.requestContext(ticketId, { message }),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ['engineer', 'ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['engineer', 'tickets'] });
    },
  });
};
