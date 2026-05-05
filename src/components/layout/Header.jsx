import { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router-dom';
import NotificationDrawer from '../admin/NotificationDrawer';
import EngineerNotificationDrawer from '../engineer/EngineerNotificationDrawer';
import DeveloperNotificationDrawer from '../developer/DeveloperNotificationDrawer';
import { useAdminNotifications } from '../../hooks/admin/useAdminNotifications';
import { useEngineerNotifications } from '../../hooks/engineer/useEngineerNotifications';
import { useDeveloperNotifications } from '../../hooks/developer/useDeveloperNotifications';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../context/ToastContext';

export default function Header({ title, breadcrumb }) {
  const { role, clearTokens } = useAuthStore();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isAdmin = role === 'ADMIN';
  const isEngineer = role === 'ENGINEER';
  const isDeveloper = role === 'DEVELOPER';

  const { data: adminNotifications } = useAdminNotifications({ enabled: isAdmin });
  const { data: engineerNotifications } = useEngineerNotifications({ enabled: isEngineer });
  const { data: developerNotifications } = useDeveloperNotifications({ enabled: isDeveloper });

  const queryClient = useQueryClient();
  const toast = useToast();

  const extractTicketId = (notification) => {
    const text = `${notification?.title || ''} ${notification?.message || notification?.content || ''}`;
    const match = text.match(/(?:#|numéro\s*|ticket\s*)(\d+)/i);
    return match?.[1] ? Number(match[1]) : null;
  };

  useWebSocket((payload) => {
    const actualNotif = payload?.data ? payload.data : payload;

    // Drop any ping heartbeat — by type OR by message content (backend test messages)
    const rawMsg = actualNotif?.message || actualNotif?.content || actualNotif?.text || '';
    if (
      actualNotif?.type?.toLowerCase() === 'ping' ||
      /^(test[\s:_-]*)?ping$/i.test(rawMsg.trim())
    ) return;

    const newNotif = {
      ...actualNotif,
      id: actualNotif?.id || Date.now(),
      is_read: false,
      message: rawMsg,
      created_at: actualNotif?.created_at || new Date().toISOString()
    };

    if (!newNotif.message) return;

    if (isAdmin) {
      queryClient.setQueryData(['admin', 'notifications'], (oldData) => {
        if (!oldData) return [newNotif];
        if (Array.isArray(oldData)) return [newNotif, ...oldData];
        if (oldData.items) return { ...oldData, items: [newNotif, ...oldData.items] };
        return [newNotif];
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets'] });
    }

    if (isEngineer) {
      queryClient.setQueryData(['engineer', 'notifications'], (oldData) => {
        if (!oldData) return [newNotif];
        if (Array.isArray(oldData)) return [newNotif, ...oldData];
        if (oldData.items) return { ...oldData, items: [newNotif, ...oldData.items] };
        return [newNotif];
      });
      queryClient.invalidateQueries({ queryKey: ['engineer', 'tickets'] });
      queryClient.invalidateQueries({ queryKey: ['engineer', 'profile'] });
    }

    if (isAdmin) {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }

    if (isDeveloper) {
      const ticketId = extractTicketId(newNotif);
      queryClient.setQueryData(['developer', 'notifications'], (oldData) => {
        if (!oldData) return [newNotif];
        if (Array.isArray(oldData)) return [newNotif, ...oldData];
        if (oldData.items) return { ...oldData, items: [newNotif, ...oldData.items] };
        return [newNotif];
      });
      queryClient.invalidateQueries({ queryKey: ['developer', 'tickets'] });
      if (ticketId) {
        queryClient.invalidateQueries({ queryKey: ['developer', 'tickets', ticketId] });
      }
    }

    toast.info(newNotif.title || newNotif.message);
  });

  // Normalise whatever shape the backend returns into a plain array
  const toArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    for (const key of ['items', 'notifications', 'data', 'results']) {
      if (Array.isArray(data[key])) return data[key];
    }
    return [];
  };

  const isPingNotif = (n) =>
    n.type?.toLowerCase() === 'ping' ||
    /^(test[\s:_-]*)?ping$/i.test((n.message || '').trim());

  const adminNotifsArray = toArray(adminNotifications).filter(n => !isPingNotif(n));
  const engNotifsArray = toArray(engineerNotifications).filter(n => !isPingNotif(n));
  const devNotifsArray = toArray(developerNotifications);

  const unreadCount = isAdmin
    ? adminNotifsArray.filter(n => !n.is_read).length
    : isEngineer
      ? engNotifsArray.filter(n => !n.is_read).length
      : isDeveloper
        ? devNotifsArray.filter(n => !n.is_read).length
        : 0;

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const initials = 'AT';

  const handleLogout = () => {
    setMenuOpen(false);
    clearTokens();
    navigate('/login');
  };

  const handleProfileClick = () => {
    setMenuOpen(false);
    const rolePath = role?.toLowerCase() || 'admin';
    navigate(`/${rolePath}/profile`);
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <>
      <header className="h-[60px] bg-white border-b border-border flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-30">
        {/* Left: breadcrumb */}
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider">
            {breadcrumb || 'AT Ticket System'}
          </p>
          {title && (
            <h1 className="text-[22px] font-semibold text-text-primary leading-tight mt-0.5">
              {title}
            </h1>
          )}
        </div>

        {/* Right: bell + avatar */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDrawer}
            className="relative w-9 h-9 flex items-center justify-center rounded-full text-text-muted hover:bg-surface-muted hover:text-text-secondary transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {/* Unread dot */}
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />}
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 outline-none hover:ring-2 hover:ring-primary/30 transition-all focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="text-white text-xs font-semibold">{initials}</span>
            </button>

            {/* Profile Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-3 w-[220px] bg-white rounded-card shadow-card border border-border py-1 z-50 animate-fade-in origin-top-right">
                <div className="px-4 py-3 border-b border-divider">
                  <p className="text-sm font-semibold text-text-primary capitalize truncate">{role?.toLowerCase() || 'Utilisateur'}</p>
                </div>
                <div className="py-1.5">
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-text-secondary hover:text-primary hover:bg-surface-muted transition-colors text-left"
                  >
                    <User size={15} />
                    <span>Mon profil</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-text-secondary hover:text-danger hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut size={15} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Role-aware notification drawer */}
      {isEngineer ? (
        <EngineerNotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      ) : isDeveloper ? (
        <DeveloperNotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      ) : (
        <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      )}
    </>
  );
}
