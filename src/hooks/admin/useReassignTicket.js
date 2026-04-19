import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/admin.service';

export const useReassignTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, new_engineer_id }) =>
      adminService.reassignTicket(reportId, { new_engineer_id }),
    onSuccess: (_, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'misassignments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'misassignments', reportId] });
    },
  });
};
