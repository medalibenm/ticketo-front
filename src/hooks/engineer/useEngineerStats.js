import { useQuery } from '@tanstack/react-query';
import { engineerService } from '../../services/engineer.service';

export const useEngineerStats = (options = {}) => {
  return useQuery({
    queryKey: ['engineer', 'stats'],
    queryFn: () => engineerService.getStats(),
    refetchInterval: 10000, // Regular stat updates
    ...options,
  });
};
