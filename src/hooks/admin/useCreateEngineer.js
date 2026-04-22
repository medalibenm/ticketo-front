import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/admin.service';

export function useCreateEngineer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (body) => adminService.createEngineer(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
