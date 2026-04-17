import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTickets from './pages/admin/AdminTickets';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMisassignments from './pages/admin/AdminMisassignments';
import AdminKnowledgeBase from './pages/admin/AdminKnowledgeBase';
import AdminAiLogs from './pages/admin/AdminAiLogs';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminProfile from './pages/admin/AdminProfile';

// Developer pages
import DeveloperDashboard from './pages/developer/DeveloperDashboard';

// Engineer pages
import EngineerDashboard from './pages/engineer/EngineerDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Admin-only routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route element={<AppShell />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/tickets" element={<AdminTickets />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/misassignments" element={<AdminMisassignments />} />
                <Route path="/admin/kb" element={<AdminKnowledgeBase />} />
                <Route path="/admin/logs/ai" element={<AdminAiLogs />} />
                <Route path="/admin/logs/audit" element={<AdminAuditLogs />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
              </Route>
            </Route>

            {/* Developer routes */}
            <Route element={<ProtectedRoute allowedRoles={['DEVELOPER']} />}>
              <Route element={<AppShell />}>
                <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
                <Route path="/developer/tickets" element={<AdminTickets />} />
                <Route path="/developer/profile" element={<AdminProfile />} />
              </Route>
            </Route>

            {/* Engineer routes */}
            <Route element={<ProtectedRoute allowedRoles={['ENGINEER']} />}>
              <Route element={<AppShell />}>
                <Route path="/engineer/dashboard" element={<EngineerDashboard />} />
                <Route path="/engineer/tickets" element={<AdminTickets />} />
                <Route path="/engineer/profile" element={<AdminProfile />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
