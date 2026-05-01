import { useMutation, useQueryClient } from '@tanstack/react-query';
import { developerService } from '../../services/developer.service';

export const useDeveloperReplyClarification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, message }) => developerService.replyClarification(ticketId, { message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};
