import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../api/admin.service'

export function useAdminProfile() {
  return useQuery({
    queryKey: ['admin', 'profile'],
    queryFn: adminService.getProfile,
  })
}
