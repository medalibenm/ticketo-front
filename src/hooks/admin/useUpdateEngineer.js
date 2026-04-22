import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/admin.service';

export function useUpdateEngineer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, body }) => adminService.updateEngineer(userId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
