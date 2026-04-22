import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../api/admin.service';

export const useAdminNotifications = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'notifications'],
    queryFn: () => adminService.getNotifications(),
    ...options
  });
};
