import { useMutation, useQueryClient } from '@tanstack/react-query';
import { engineerService } from '../../services/engineer.service';

export const useEngineerRequestContext = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, message }) => engineerService.requestContext(ticketId, { message }),
    onSuccess: (response, { ticketId, message }) => {
      const engineerMessage =
        response?.clarification_session?.messages?.at(-1) ||
        response?.message ||
        response?.content ||
        {
          id: Date.now(),
          sender: 'ENGINEER',
          content: message,
          created_at: new Date().toISOString(),
        };

      const patchTicket = (old) => {
        if (!old) return old;
        const updated = { ...old };
        const existingMessages = updated.clarification_session?.messages || [];
        const nextMessages = response?.clarification_session?.messages
          ? response.clarification_session.messages
          : [...existingMessages, engineerMessage];

        updated.status = response?.status || 'AWAITING_CLARIFICATION';
        updated.clarification_session = {
          ...(updated.clarification_session || {}),
          status: response?.clarification_session?.status || 'OPEN',
          summary: response?.clarification_session?.summary ?? updated.clarification_session?.summary ?? null,
          messages: nextMessages,
        };
        return updated;
      };

      queryClient.setQueryData(['engineer', 'ticket', ticketId], patchTicket);
      queryClient.setQueryData(['developer', 'tickets', ticketId], patchTicket);
      queryClient.invalidateQueries({ queryKey: ['engineer', 'ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['engineer', 'tickets'] });
    },
  });
};
