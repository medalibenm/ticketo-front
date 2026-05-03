import { useQuery } from '@tanstack/react-query';
import { engineerService } from '../../services/engineer.service';

export const useEngineerTickets = ({ skip = 0, limit = 10, status } = {}, options = {}) => {
  return useQuery({
    queryKey: ['engineer', 'tickets', { skip, limit, status }],
    queryFn: () => engineerService.getTickets({ skip, limit, status }),
    refetchInterval: 10000, // Update tickets every 10s
    ...options,
  });
};
