import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../api/admin.service'

export function useAllTickets(params) {
  return useQuery({
    queryKey: ['admin', 'tickets', params],
    queryFn: () => adminService.getAllTickets(params),
    keepPreviousData: true,
  })
}
