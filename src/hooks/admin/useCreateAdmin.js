import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/admin.service';

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (body) => adminService.createAdmin(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
