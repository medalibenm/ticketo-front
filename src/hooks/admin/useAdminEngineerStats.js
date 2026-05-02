import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../api/admin.service';

export function useAdminEngineerStats(engineerId, options = {}) {
  return useQuery({
    queryKey: ['admin', 'engineer-stats', engineerId],
    queryFn: () => adminService.getEngineerStats(engineerId),
    enabled: !!engineerId,
    ...options,
  });
}
