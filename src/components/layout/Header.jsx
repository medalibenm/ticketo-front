import { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router-dom';
import NotificationDrawer from '../admin/NotificationDrawer';

export default function Header({ title, breadcrumb }) {
  const { role, clearTokens } = useAuthStore();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
            onClick={() => setDrawerOpen(true)}
            className="relative w-9 h-9 flex items-center justify-center rounded-full text-text-muted hover:bg-surface-muted hover:text-text-secondary transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {/* Unread dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
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

      <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
