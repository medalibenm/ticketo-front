import { useMutation } from '@tanstack/react-query'
import { authService } from '../../api/auth.service'
import { useAuthStore } from '../../store/auth.store'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { getErrorMessage } from '../../api/errors'

export function useLogin() {
  const setTokens = useAuthStore((state) => state.setTokens)
  const navigate = useNavigate()
  const toast = useToast()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token)
      
      const role = useAuthStore.getState().role
      if (role === 'ADMIN') navigate('/admin/dashboard')
      else if (role === 'DEVELOPER') navigate('/developer/dashboard')
      else if (role === 'ENGINEER') navigate('/engineer/dashboard')
      else navigate('/')
    },
    onError: (error) => {
      toast.error('Mot de passe ou email incorrect')
    },
  })
}
