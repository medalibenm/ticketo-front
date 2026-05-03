import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import clsx from 'clsx';
import {
  LayoutDashboard, Ticket, Users, Flag,
  BookOpen, Bot, ClipboardList, UserCircle,
} from 'lucide-react';

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
  { to: '/developer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/developer/tickets', label: 'My Tickets', icon: Ticket },
];

const engineerLinks = [
  { to: '/engineer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/engineer/tickets', label: 'Mes tickets', icon: Ticket },
  { to: '/engineer/profile', label: 'Profil', icon: UserCircle },
];

const roleLinks = { ADMIN: adminLinks, DEVELOPER: developerLinks, ENGINEER: engineerLinks };

const rolePanelLabel = {
  ADMIN: 'Panneau Admin',
  ENGINEER: 'Espace Ingénieur',
  DEVELOPER: 'Portail Développeur',
};

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
        {links.map(({ to, label, icon: Icon }) => (
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
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

