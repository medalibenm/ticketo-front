import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/admin.service';

export function useUpdateDeveloper() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, body }) => adminService.updateDeveloper(userId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
