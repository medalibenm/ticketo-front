import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom';

const breadcrumbMap = {
  '/admin/dashboard': 'Admin / Dashboard',
  '/admin/tickets': 'Admin / Tous les tickets',
  '/admin/users': 'Admin / Gestion des utilisateurs',
  '/admin/misassignments': 'Admin / Signalements',
  '/admin/kb': 'Admin / Base de connaissances',
  '/admin/logs/ai': 'Admin / Logs IA',
  '/admin/logs/audit': "Admin / Logs d'audit",
  '/admin/profile': 'Admin / Profil',
};

const titleMap = {
  '/admin/dashboard': 'Dashboard',
  '/admin/tickets': 'Tous les tickets',
  '/admin/users': 'Gestion des utilisateurs',
  '/admin/misassignments': 'Signalements',
  '/admin/kb': 'Base de connaissances',
  '/admin/logs/ai': 'Logs IA',
  '/admin/logs/audit': "Logs d'audit",
  '/admin/profile': 'Profil',
};

export default function AppShell() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          breadcrumb={breadcrumbMap[pathname]}
          title={titleMap[pathname]}
        />
        <main className="flex-1 p-8 max-w-[1240px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
