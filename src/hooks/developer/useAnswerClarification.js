import { useMutation, useQueryClient } from '@tanstack/react-query';
import { developerService } from '../../services/developer.service';

export const useAnswerClarification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, content }) =>
      developerService.answerClarification(ticketId, {
        content,
        message: content,
      }),
    onSuccess: (newMsg, { ticketId }) => {
      const patchTicket = (old) => {
        if (!old) return old;
        const updated = { ...old };
        const currentSession = updated.clarification_session || {};
        updated.clarification_session = {
          ...currentSession,
          messages: [...(currentSession.messages || []), newMsg],
        };
        return updated;
      };

      // Keep both sides aligned with the same conversation thread.
      qc.setQueryData(['developer', 'tickets', ticketId], patchTicket);
      qc.setQueryData(['engineer', 'ticket', ticketId], patchTicket);
    },
  });
};
