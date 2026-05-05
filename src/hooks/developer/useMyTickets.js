import { useQuery } from '@tanstack/react-query';
import { developerService } from '../../services/developer.service';

export const useMyTickets = ({ skip = 0, limit = 10, status } = {}, options = {}) => {
  return useQuery({
    queryKey: ['developer', 'tickets', { skip, limit, status }],
    queryFn: () => developerService.getMyTickets({ skip, limit, status }),
    ...options,
  });
};
