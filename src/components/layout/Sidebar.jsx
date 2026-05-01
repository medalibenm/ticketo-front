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
  { to: '/admin/logs/audit', label: "Audit Logs", icon: ClipboardList },
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

export default function Sidebar() {
  const { role } = useAuthStore();
  const links = (role && roleLinks[role]) || adminLinks;

  return (
    <aside className="w-[220px] min-h-screen bg-surface border-r border-border flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-divider">
        <div className="flex items-center gap-2.5">
          <div>
            <p className="text-text-primary font-bold text-xl tracking-wide leading-tight">Ticketo</p>
          </div>
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
                  ? 'bg-primary-light text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-muted'
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

