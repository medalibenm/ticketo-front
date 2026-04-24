import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../api/admin.service';

export const useMisassignments = (params) => {
  return useQuery({
    queryKey: ['admin', 'misassignments', params],
    queryFn: () => adminService.getMisassignments(params),
    keepPreviousData: true,
  });
};
