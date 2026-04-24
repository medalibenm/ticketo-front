import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../api/admin.service'

export function useMisassignmentDetail(reportId) {
  return useQuery({
    queryKey: ['admin', 'misassignments', reportId],
    queryFn: () => adminService.getMisassignmentDetail(reportId),
    enabled: Boolean(reportId),
  })
}
