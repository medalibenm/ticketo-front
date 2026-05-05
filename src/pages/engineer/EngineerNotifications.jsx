import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEngineerNotifications } from '../../hooks/engineer/useEngineerNotifications';
import { useMarkEngineerNotificationRead } from '../../hooks/engineer/useMarkEngineerNotificationRead';
import { useToast } from '../../context/ToastContext';
import { Bell, BellOff, CheckCheck, Filter, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getNotifTypeLabel(n) {
  if (!n.type || n.type === 'ping') return null;
  const map = {
    TICKET_ASSIGNED: { label: 'Assignation', color: '#0056B3', bg: '#EEF4FF' },
    TICKET_RESOLVED: { label: 'Résolu', color: '#059669', bg: '#D1FAE5' },
    CLARIFICATION_REQUESTED: { label: 'Clarification', color: '#D97706', bg: '#FEF3C7' },
    TICKET_UPDATED: { label: 'Mise à jour', color: '#7C3AED', bg: '#EDE9FE' },
  };
  return map[n.type] || { label: n.type, color: '#64748B', bg: '#F1F5F9' };
}

export default function EngineerNotifications() {
  const navigate = useNavigate();
  const toast = useToast();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'

  const { data, isLoading } = useEngineerNotifications({ enabled: true });
  const { mutateAsync: markAsRead, isPending: marking } = useMarkEngineerNotificationRead();

  const toArray = (d) => {
    if (!d) return [];
    if (Array.isArray(d)) return d;
    for (const key of ['items', 'notifications', 'data', 'results']) {
      if (Array.isArray(d[key])) return d[key];
    }
    return [];
  };

  const allNotifications = toArray(data).filter(
    (n) =>
      n.type?.toLowerCase() !== 'ping' &&
      !/^(test[\s:_-]*)?ping$/i.test((n.message || '').trim())
  );

  const filtered = allNotifications.filter((n) => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'read') return n.is_read;
    return true;
  });

  const unreadCount = allNotifications.filter((n) => !n.is_read).length;

  const handleNotificationClick = async (n) => {
    if (!n.is_read) {
      try {
        await markAsRead(n.id);
      } catch {
        // silent
      }
    }
    const match = n.message?.match(/(?:#|numéro\s*|ticket\s*)(\d+)/i);
    if (match && match[1]) {
      navigate(`/engineer/tickets/${match[1]}`);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = allNotifications.filter((n) => !n.is_read);
    if (!unread.length) return;
    try {
      await Promise.all(unread.map((n) => markAsRead(n.id)));
      toast.success('Toutes les notifications ont été marquées comme lues.');
    } catch {
      toast.error('Erreur lors de la mise à jour.');
    }
  };

  const handleMarkOne = async (e, n) => {
    e.stopPropagation();
    if (n.is_read) return;
    try {
      await markAsRead(n.id);
    } catch {
      toast.error('Erreur.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Notifications</h1>
          <p className="text-sm text-text-muted mt-1">
            {unreadCount > 0
              ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
              : 'Vous êtes à jour'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={marking}
            className="flex items-center gap-2 px-4 py-2 rounded-btn bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            <CheckCheck size={15} />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div
        className="bg-white border border-border rounded-card p-1 shadow-card inline-flex gap-1"
        style={{ animation: 'slideUp 0.3s ease-out 0.05s both' }}
      >
        {[
          { key: 'all', label: 'Toutes' },
          { key: 'unread', label: 'Non lues' },
          { key: 'read', label: 'Lues' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={clsx(
              'flex items-center gap-1.5 px-4 py-1.5 rounded-[6px] text-sm font-medium transition-all duration-150',
              filter === tab.key
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-muted hover:text-text-secondary hover:bg-surface-muted'
            )}
          >
            <Filter size={12} />
            {tab.label}
            {tab.key === 'unread' && unreadCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-accent text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div
        className="bg-white border border-border rounded-card shadow-card overflow-hidden"
        style={{ animation: 'slideUp 0.3s ease-out 0.1s both' }}
      >
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton h-[72px] rounded-btn" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center mb-4">
              {filter === 'unread' ? (
                <BellOff size={26} className="text-text-muted" />
              ) : (
                <Bell size={26} className="text-text-muted" />
              )}
            </div>
            <p className="text-base font-semibold text-text-primary">
              {filter === 'unread'
                ? 'Aucune notification non lue'
                : filter === 'read'
                ? 'Aucune notification lue'
                : 'Aucune notification'}
            </p>
            <p className="text-sm text-text-muted mt-1">
              {filter === 'unread'
                ? 'Vous êtes à jour — aucun nouveau message.'
                : 'Les notifications apparaîtront ici une fois reçues.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-divider">
            {filtered.map((n, idx) => {
              const typeInfo = getNotifTypeLabel(n);
              const hasTicketLink = /(?:#|numéro\s*|ticket\s*)\d+/i.test(n.message || '');

              return (
                <li
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={clsx(
                    'flex items-start gap-4 px-6 py-4 transition-all duration-200 group',
                    hasTicketLink ? 'cursor-pointer' : 'cursor-default',
                    n.is_read
                      ? 'hover:bg-surface-muted'
                      : 'bg-[#FAFCFF] hover:bg-blue-50/60'
                  )}
                  style={{ animation: `fadeSlideIn 0.25s ease-out ${idx * 0.04}s both` }}
                >
                  {/* Unread indicator */}
                  <div className="flex-shrink-0 mt-1.5">
                    {n.is_read ? (
                      <span className="block w-2 h-2 rounded-full bg-transparent" />
                    ) : (
                      <span className="block w-2 h-2 rounded-full bg-accent" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {typeInfo && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold mb-1.5"
                        style={{ backgroundColor: typeInfo.bg, color: typeInfo.color }}
                      >
                        {typeInfo.label}
                      </span>
                    )}
                    <p
                      className={clsx(
                        'text-sm leading-snug',
                        n.is_read ? 'text-text-secondary' : 'text-text-primary font-medium'
                      )}
                    >
                      {n.message}
                    </p>
                    <p className="text-xs text-text-muted mt-1">{formatDate(n.created_at)}</p>
                  </div>

                  {/* Right side actions */}
                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    {!n.is_read && (
                      <button
                        onClick={(e) => handleMarkOne(e, n)}
                        title="Marquer comme lu"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-primary hover:underline font-medium"
                      >
                        Marquer lu
                      </button>
                    )}
                    {hasTicketLink && (
                      <ChevronRight
                        size={16}
                        className="text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
