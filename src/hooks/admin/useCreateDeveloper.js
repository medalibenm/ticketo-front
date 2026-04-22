import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/admin.service';

export function useCreateDeveloper() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (body) => adminService.createDeveloper(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
