import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../api/admin.service'

export function useAuditLogs(params) {
  return useQuery({
    queryKey: ['admin', 'logs', 'audit', params],
    queryFn: () => adminService.getAuditLogs(params),
    keepPreviousData: true,
  })
}
