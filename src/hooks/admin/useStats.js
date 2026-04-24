import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../api/admin.service'

export function useStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminService.getStats(),
  })
}
