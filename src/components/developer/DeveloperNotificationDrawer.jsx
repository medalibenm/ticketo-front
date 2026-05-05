import { useDeveloperNotifications } from '../../hooks/developer/useDeveloperNotifications';
import { useMarkDeveloperNotificationRead } from '../../hooks/developer/useMarkDeveloperNotificationRead';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import clsx from 'clsx';

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export default function DeveloperNotificationDrawer({ open, onClose }) {
  const { data, isLoading } = useDeveloperNotifications({ enabled: open });
  const toArray = (d) => {
    if (!d) return [];
    if (Array.isArray(d)) return d;
    for (const key of ['items', 'notifications', 'data', 'results']) {
      if (Array.isArray(d[key])) return d[key];
    }
    return [];
  };
  const notifications = toArray(data);
  const { mutateAsync: markAsRead } = useMarkDeveloperNotificationRead();
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = async (n) => {
    if (!n.is_read) {
      try { await markAsRead(n.id); } catch { toast.error('Erreur lors de la mise à jour.'); }
    }
    const match = n.message.match(/(?:#|numéro\s*|ticket\s*)(\d+)/i);
    if (match?.[1]) {
      navigate(`/developer/tickets/${match[1]}`);
      onClose();
    }
  };

  const markAllRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.is_read);
      if (!unread.length) return;
      await Promise.all(unread.map((n) => markAsRead(n.id)));
      toast.success('Toutes les notifications marquées comme lues.');
    } catch {
      toast.error('Erreur lors de la mise à jour.');
    }
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/10 animate-fade-in" onClick={onClose} />}
      <div
        className={clsx(
          'fixed right-0 top-0 h-full w-[340px] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.08)] z-50 flex flex-col transition-transform duration-250',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-base text-text-primary">Notifications</h3>
          <div className="flex items-center gap-3">
            <button onClick={markAllRead} className="text-xs text-primary hover:underline font-medium">
              Tout marquer comme lu
            </button>
            <button onClick={onClose} className="text-text-muted hover:text-text-secondary transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-16 rounded-btn" />)}
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
                  onClick={() => handleClick(n)}
                  className={clsx(
                    'flex gap-3 px-5 py-4 border-b border-divider cursor-pointer transition-colors',
                    n.is_read ? 'hover:bg-surface-muted' : 'hover:bg-primary-light bg-[#FAFCFF]'
                  )}
                >
                  <div className="flex-shrink-0 mt-1">
                    {!n.is_read
                      ? <span className="block w-2 h-2 rounded-full bg-accent mt-0.5" />
                      : <span className="block w-2 h-2" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-sm line-clamp-2', n.is_read ? 'text-text-secondary' : 'text-text-primary font-medium')}>
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
