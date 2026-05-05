import { useQuery } from '@tanstack/react-query';
import { developerService } from '../../services/developer.service';

export const useDeveloperProfile = (options = {}) => {
  return useQuery({
    queryKey: ['developer', 'profile'],
    queryFn: () => developerService.getProfile(),
    ...options,
  });
};
