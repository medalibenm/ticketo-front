import { useQuery } from '@tanstack/react-query';
import { engineerService } from '../../services/engineer.service';

export const useEngineerTicketDetail = (ticketId, options = {}) => {
  return useQuery({
    queryKey: ['engineer', 'ticket', ticketId],
    queryFn: () => engineerService.getTicketDetail(ticketId),
    enabled: !!ticketId,
    ...options,
  });
};
