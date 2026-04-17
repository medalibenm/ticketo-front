import { useEffect, useState } from 'react';
import { adminNotificationsService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { X } from 'lucide-react';
import clsx from 'clsx';

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function NotificationDrawer({ open, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    adminNotificationsService.getNotifications()
      .then(setNotifications)
      .finally(() => setLoading(false));
  }, [open]);

  const markRead = async (id) => {
    await adminNotificationsService.markRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    await Promise.all(notifications.filter((n) => !n.read).map((n) => adminNotificationsService.markRead(n.id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('Toutes les notifications marquées comme lues.');
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
          'fixed right-0 top-0 h-full w-[340px] bg-white shadow-[−4px_0_24px_rgba(0,0,0,0.08)] z-50 flex flex-col transition-transform duration-250',
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
              Tout marquer comme lu
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
                <span className="text-2xl">🔔</span>
              </div>
              <p className="text-sm font-medium text-text-secondary">Aucune notification</p>
              <p className="text-xs text-text-muted mt-1">Vous êtes à jour !</p>
            </div>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => !n.read && markRead(n.id)}
                  className={clsx(
                    'flex gap-3 px-5 py-4 border-b border-divider cursor-pointer transition-colors',
                    n.read ? 'hover:bg-surface-muted' : 'hover:bg-primary-light bg-[#FAFCFF]'
                  )}
                >
                  {/* Unread dot */}
                  <div className="flex-shrink-0 mt-1">
                    {!n.read
                      ? <span className="block w-2 h-2 rounded-full bg-accent mt-0.5" />
                      : <span className="block w-2 h-2" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-sm', n.read ? 'text-text-secondary' : 'text-text-primary font-medium')}>
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
