import { useMutation, useQueryClient } from '@tanstack/react-query';
import { developerService } from '../../services/developer.service';

export const useMarkDeveloperNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationId) => developerService.markNotificationRead(notificationId),

    // Optimistic update: flip is_read immediately so the dot disappears without waiting for the server
    onMutate: async (notificationId) => {
      await qc.cancelQueries({ queryKey: ['developer', 'notifications'] });
      const previous = qc.getQueryData(['developer', 'notifications']);

      const patch = (old) => {
        if (!old) return old;
        const patchItem = (item) =>
          item.id === notificationId ? { ...item, is_read: true } : item;
        if (Array.isArray(old)) return old.map(patchItem);
        for (const key of ['items', 'notifications', 'data', 'results']) {
          if (Array.isArray(old[key])) return { ...old, [key]: old[key].map(patchItem) };
        }
        return old;
      };

      qc.setQueryData(['developer', 'notifications'], patch);
      return { previous };
    },

    // Roll back on error
    onError: (_err, _id, ctx) => {
      if (ctx?.previous !== undefined) {
        qc.setQueryData(['developer', 'notifications'], ctx.previous);
      }
    },

    // Always sync after settle
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['developer', 'notifications'] });
    },
  });
};
