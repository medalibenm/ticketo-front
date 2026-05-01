import { useMutation, useQueryClient } from '@tanstack/react-query';
import { engineerService } from '../../services/engineer.service';

export const useEngineerReportMisassignment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, reason }) =>
      engineerService.reportMisassignment(ticketId, { reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['engineer', 'stats'] });
    },
  });
};
