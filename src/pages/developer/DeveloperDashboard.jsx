import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function DeveloperDashboard() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-4">
        <span className="text-3xl">💻</span>
      </div>
      <h2 className="text-xl font-semibold text-text-primary">Bienvenue, {user?.name}</h2>
      <p className="text-sm text-text-muted mt-1 max-w-sm">
        Votre espace développeur est en cours de développement. Les tickets sont disponibles ci-dessous.
      </p>
      <Link to="/developer/tickets" className="mt-5 inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-btn text-sm font-medium hover:bg-primary-dark transition-colors">
        Voir mes tickets →
      </Link>
    </div>
  );
}
