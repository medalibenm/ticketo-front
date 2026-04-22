import { useEffect } from 'react';
import { useAdminNotifications } from '../../hooks/admin/useAdminNotifications';
import { useMarkAdminNotificationRead } from '../../hooks/admin/useMarkAdminNotificationRead';
import { useToast } from '../../context/ToastContext';
import { X } from 'lucide-react';
import clsx from 'clsx';

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function NotificationDrawer({ open, onClose }) {
  const { data: notifications = [], isLoading: loading, refetch } = useAdminNotifications({ enabled: open });
  const { mutateAsync: markAsRead } = useMarkAdminNotificationRead();
  const toast = useToast();

  useEffect(() => {
    if (open) refetch();
  }, [open, refetch]);

  const markRead = async (id) => {
    try {
      await markAsRead(id);
    } catch {
      toast.error('Error updating.');
    }
  };

  const markAllRead = async () => {
    try {
      const waitlist = notifications.filter((n) => !n.is_read).map((n) => markAsRead(n.id));
      if (waitlist.length === 0) return;
      await Promise.all(waitlist);
      toast.success('All notifications marked as read.');
    } catch {
      toast.error('Error updating.');
    }
  };

  return (
    <>
      {/* backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/10 animate-fade-in" onClick={onClose} />
      )}

      {/* drawer */}
      <div
        className={clsx(
          'fixed right-0 top-0 h-full w-[340px] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.08)] z-50 flex flex-col transition-transform duration-250',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-base text-text-primary">Notifications</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllRead}
              className="text-xs text-primary hover:underline font-medium"
            >
              Mark all as read
            </button>
            <button onClick={onClose} className="text-text-muted hover:text-text-secondary transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-16 rounded-btn" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center mb-3">
                <span className="text-2xl">💡</span>
              </div>
              <p className="text-sm font-medium text-text-secondary">No notifications</p>
              <p className="text-xs text-text-muted mt-1">You are up to date!</p>
            </div>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => !n.is_read && markRead(n.id)}
                  className={clsx(
                    'flex gap-3 px-5 py-4 border-b border-divider cursor-pointer transition-colors',
                    n.is_read ? 'hover:bg-surface-muted' : 'hover:bg-primary-light bg-[#FAFCFF]'
                  )}
                >
                  {/* Unread dot */}
                  <div className="flex-shrink-0 mt-1">
                    {!n.is_read
                      ? <span className="block w-2 h-2 rounded-full bg-accent mt-0.5" />
                      : <span className="block w-2 h-2" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-sm', n.is_read ? 'text-text-secondary' : 'text-text-primary font-medium')}>
                      {n.message}
                    </p>
                    <p className="text-xs text-text-muted mt-1">{formatTime(n.created_at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

