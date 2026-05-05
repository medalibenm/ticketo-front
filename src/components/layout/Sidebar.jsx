import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import clsx from 'clsx';
import {
  LayoutDashboard, Ticket, Users, Flag,
  BookOpen, Bot, ClipboardList, UserCircle, Bell,
} from 'lucide-react';
import { useEngineerNotifications } from '../../hooks/engineer/useEngineerNotifications';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/tickets', label: 'All Tickets', icon: Ticket },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/misassignments', label: 'Misassignments', icon: Flag },
  { to: '/admin/kb', label: 'Knowledge Base', icon: BookOpen },
  { to: '/admin/logs/ai', label: 'AI Logs', icon: Bot },
  { to: '/admin/logs/audit', label: 'Audit Logs', icon: ClipboardList },
];

const developerLinks = [
  { to: '/developer/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/developer/tickets', label: 'Mes tickets', icon: Ticket },
  { to: '/developer/profile', label: 'Profil', icon: UserCircle },
];

const engineerLinks = [
  { to: '/engineer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/engineer/tickets', label: 'Mes tickets', icon: Ticket },
  { to: '/engineer/notifications', label: 'Notifications', icon: Bell, badgeKey: 'notifications' },
  { to: '/engineer/profile', label: 'Profil', icon: UserCircle },
];

const roleLinks = { ADMIN: adminLinks, DEVELOPER: developerLinks, ENGINEER: engineerLinks };

const rolePanelLabel = {
  ADMIN: 'Panneau Admin',
  ENGINEER: 'Espace Ingénieur',
  DEVELOPER: 'Portail Développeur',
};

// Live unread badge rendered inside the Sidebar for the engineer Notifications link
function EngineerSidebarBadge() {
  const { data } = useEngineerNotifications({ enabled: true });
  const toArray = (d) => {
    if (!d) return [];
    if (Array.isArray(d)) return d;
    for (const key of ['items', 'notifications', 'data', 'results']) {
      if (Array.isArray(d[key])) return d[key];
    }
    return [];
  };
  const unread = toArray(data).filter(
    (n) =>
      !n.is_read &&
      n.type?.toLowerCase() !== 'ping' &&
      !/^(test[\s:_-]*)?ping$/i.test((n.message || '').trim())
  ).length;

  if (!unread) return null;
  return (
    <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-accent text-white">
      {unread > 9 ? '9+' : unread}
    </span>
  );
}

export default function Sidebar() {
  const { role } = useAuthStore();
  const links = (role && roleLinks[role]) || adminLinks;
  const panelLabel = (role && rolePanelLabel[role]) || 'Panneau Admin';

  return (
    <aside className="w-[230px] h-full flex flex-col flex-shrink-0" style={{ backgroundColor: '#002D72' }}>
      {/* Branding */}
      <div className="px-5 pt-6 pb-5 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3 mb-3">
          <img src="/at-logo.svg" alt="AT" className="w-9 h-9 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-white font-bold text-[15px] leading-tight tracking-wide">Algérie Télécom</p>
            <p className="text-[11px] leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Hosting Ticket Management
            </p>
          </div>
        </div>
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
          {panelLabel}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, badgeKey }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'text-white bg-white/[0.15]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.08]'
              )
            }
          >
            <Icon size={16} strokeWidth={2} />
            <span className="flex-1">{label}</span>
            {/* Live unread badge — engineer notifications only */}
            {badgeKey === 'notifications' && role === 'ENGINEER' && <EngineerSidebarBadge />}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
