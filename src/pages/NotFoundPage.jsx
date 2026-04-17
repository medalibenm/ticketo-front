import { Navigate } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted">
      <div className="text-center bg-white rounded-card border border-border p-12 shadow-card">
        <p className="text-5xl font-bold text-text-primary mb-3">404</p>
        <p className="text-lg font-semibold text-text-primary mb-2">Page introuvable</p>
        <p className="text-sm text-text-muted mb-6">La page que vous cherchez n'existe pas.</p>
        <a href="/login" className="text-primary text-sm font-medium hover:underline">
          ← Retour à l'accueil
        </a>
      </div>
    </div>
  );
}
