import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../api/admin.service';

export function useAllUsers(params) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminService.getAllUsers(params),
    keepPreviousData: true,
  });
}
