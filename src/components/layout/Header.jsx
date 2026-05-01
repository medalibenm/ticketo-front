import { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router-dom';
import NotificationDrawer from '../admin/NotificationDrawer';
import EngineerNotificationDrawer from '../engineer/EngineerNotificationDrawer';
import { useAdminNotifications } from '../../hooks/admin/useAdminNotifications';
import { useEngineerNotifications } from '../../hooks/engineer/useEngineerNotifications';
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

  const { data: adminNotifications } = useAdminNotifications({ enabled: isAdmin });
  const { data: engineerNotifications } = useEngineerNotifications({ enabled: isEngineer });

  const queryClient = useQueryClient();
  const toast = useToast();

  useWebSocket((payload) => {
    // Some backends wrap the event in a 'data' property.
    const actualNotif = payload?.data ? payload.data : payload;

    // Ensure the notification has the required fields for the UI
    const newNotif = {
      ...actualNotif,
      id: actualNotif?.id || Date.now(),
      is_read: false,
      message: actualNotif?.message || actualNotif?.content || actualNotif?.text || JSON.stringify(payload),
      created_at: actualNotif?.created_at || new Date().toISOString()
    };

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
    }
    
    const title = newNotif.title || newNotif.message || 'Nouvelle notification';
    toast.info(title);
  });

  // Extract arrays safely depending on backend response shape (Array vs { items: Array })
  const adminNotifsArray = Array.isArray(adminNotifications) ? adminNotifications : (adminNotifications?.items || []);
  const engNotifsArray = Array.isArray(engineerNotifications) ? engineerNotifications : (engineerNotifications?.items || []);

  const unreadCount = isAdmin
    ? adminNotifsArray.filter(n => !n.is_read).length
    : isEngineer
      ? engNotifsArray.filter(n => !n.is_read).length
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
      ) : (
        <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      )}
    </>
  );
}
