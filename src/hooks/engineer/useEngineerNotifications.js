import { useQuery } from '@tanstack/react-query';
import { engineerService } from '../../services/engineer.service';

export const useEngineerNotifications = (options = {}) => {
  return useQuery({
    queryKey: ['engineer', 'notifications'],
    queryFn: () => engineerService.getNotifications(),
    refetchInterval: options.enabled === false ? false : 5000,
    ...options,
  });
};
