import { useQuery } from '@tanstack/react-query';
import { developerService } from '../../services/developer.service';

export const useDeveloperNotifications = (options = {}) => {
  return useQuery({
    queryKey: ['developer', 'notifications'],
    queryFn: () => developerService.getNotifications(),
    refetchInterval: options.enabled === false ? false : 5000,
    ...options,
  });
};
