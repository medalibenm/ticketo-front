import { useMutation, useQueryClient } from '@tanstack/react-query';
import { engineerService } from '../../services/engineer.service';

export const useMarkEngineerNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationId) => engineerService.markNotificationRead(notificationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['engineer', 'notifications'] });
    },
  });
};
