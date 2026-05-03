import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../api/admin.service';

export const useAdminNotifications = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'notifications'],
    queryFn: () => adminService.getNotifications(),
    refetchInterval: options.enabled === false ? false : 5000,
    ...options
  });
};
