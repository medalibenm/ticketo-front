import { useMutation, useQueryClient } from '@tanstack/react-query';
import { engineerService } from '../../services/engineer.service';

export const useEngineerEditResponse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, response_text }) =>
      engineerService.updateResponse(ticketId, { response_text }),
    onSuccess: (response, { ticketId }) => {
      qc.setQueryData(['developer', 'tickets', ticketId], (old) => {
        if (!old) return old;
        return {
          ...old,
          engineer_response: response ?? old.engineer_response,
        };
      });
      qc.invalidateQueries({ queryKey: ['developer', 'tickets', String(ticketId)] });
      qc.invalidateQueries({ queryKey: ['developer', 'tickets'] });
      qc.invalidateQueries({ queryKey: ['engineer', 'ticket', String(ticketId)] });
    },
  });
};
