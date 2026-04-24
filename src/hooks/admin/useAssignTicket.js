import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../api/admin.service'

export function useAssignTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ticketId, body }) => adminService.assignTicket(ticketId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets'] })
    },
  })
}
