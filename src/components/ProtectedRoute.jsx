import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { ShieldAlert } from 'lucide-react';
import { Button } from './ui/Button';

export function ProtectedRoute({ allowedRoles }) {
  const { accessToken, role } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-muted">
        <div className="text-center bg-white border border-border rounded-card p-12 shadow-card max-w-sm">
          <div className="w-14 h-14 rounded-full bg-red-50 text-danger flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">Accès refusé</h2>
          <p className="text-sm text-text-muted mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <Button variant="secondary" onClick={() => window.history.back()}>
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

