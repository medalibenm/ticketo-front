import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom';

const breadcrumbMap = {
  '/admin/dashboard': 'Admin / Dashboard',
  '/admin/tickets': 'Admin / All Tickets',
  '/admin/users': 'Admin / Gestion des Users',
  '/admin/misassignments': 'Admin / Misassignments',
  '/admin/kb': 'Admin / Knowledge Base',
  '/admin/logs/ai': 'Admin / AI Logs',
  '/admin/logs/audit': 'Admin / Audit Logs',
  '/admin/profile': 'Admin / Profil',
  // Engineer
  '/engineer/dashboard': 'Ingénieur / Tableau de bord',
  '/engineer/tickets': 'Ingénieur / Tickets assignés',
  '/engineer/profile': 'Ingénieur / Profil',
};

const titleMap = {
  '/admin/dashboard': 'Dashboard',
  '/admin/tickets': 'All Tickets',
  '/admin/users': 'Gestion des Users',
  '/admin/misassignments': 'Misassignments',
  '/admin/kb': 'Knowledge Base',
  '/admin/logs/ai': 'AI Logs',
  '/admin/logs/audit': 'Audit Logs',
  '/admin/profile': 'Profil',
  // Engineer
  '/engineer/dashboard': 'Tableau de bord',
  '/engineer/tickets': 'Tickets assignés',
  '/engineer/profile': 'Mon Profil',
};

export default function AppShell() {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-surface-muted">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header
          breadcrumb={breadcrumbMap[pathname]}
          title={titleMap[pathname]}
        />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1240px] w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

