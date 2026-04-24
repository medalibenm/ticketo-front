import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../api/admin.service'

export function useAILogs(params) {
  return useQuery({
    queryKey: ['admin', 'logs', 'ai', params],
    queryFn: () => adminService.getAILogs(params),
    keepPreviousData: true,
  })
}
