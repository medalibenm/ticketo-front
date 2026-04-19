import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../api/admin.service'
import { useToast } from '../../context/ToastContext'
import { getErrorMessage } from '../../api/errors'

export function useUpdateAdminProfile() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: adminService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'profile'] })
      showToast('Profil mis à jour avec succès', 'success')
    },
    onError: (error) => {
      showToast(getErrorMessage(error), 'error')
    },
  })
}
