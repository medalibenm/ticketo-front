import { useQuery } from '@tanstack/react-query';
import { engineerService } from '../../services/engineer.service';

export const useEngineerProfile = (options = {}) => {
  return useQuery({
    queryKey: ['engineer', 'profile'],
    queryFn: () => engineerService.getProfile(),
    ...options,
  });
};
