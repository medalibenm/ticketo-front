import { useMutation, useQueryClient } from '@tanstack/react-query';
import { engineerService } from '../../services/engineer.service';

export const useEngineerSubmitResponse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, response_text }) =>
      engineerService.submitResponse(ticketId, { response_text }),
    onSuccess: (_, { ticketId }) => {
      qc.invalidateQueries({ queryKey: ['engineer', 'ticket', String(ticketId)] });
    },
  });
};
