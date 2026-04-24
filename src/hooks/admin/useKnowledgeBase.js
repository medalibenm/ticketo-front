import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../api/admin.service'

export function useKnowledgeBase(params) {
  return useQuery({
    queryKey: ['admin', 'kb', params],
    queryFn: () => adminService.getKnowledgeBase(params),
    keepPreviousData: true,
  })
}
