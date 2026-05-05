import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyTickets } from '../../hooks/developer/useMyTickets';
import { useDeveloperProfile } from '../../hooks/developer/useDeveloperProfile';
import { useCreateTicket } from '../../hooks/developer/useCreateTicket';
import { useAuthStore } from '../../store/auth.store';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SkeletonCard } from '../../components/ui/Skeleton';
import CreateTicketModal from '../../components/developer/CreateTicketModal';
import AiAnalysisModal from '../../components/developer/AiAnalysisModal';
import OnboardingFlow from '../../components/developer/OnboardingFlow';
import { useToast } from '../../context/ToastContext';
import {
  Ticket, CheckCircle2, Clock, ChevronRight, Plus, AlertCircle,
} from 'lucide-react';
import clsx from 'clsx';

const CATEGORY_LABELS = {
  NETWORK: 'Réseau', DATABASE: 'Base de données', SERVER_OS: 'Serveur / OS',
  DEPLOYMENT: 'Déploiement', SECURITY: 'Sécurité', API_GATEWAY: 'API Gateway',
  STORAGE: 'Stockage', OTHER: 'Autre',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function DeveloperDashboard() {
  const [showCreate, setShowCreate] = useState(false);
  const [analyzingTicketId, setAnalyzingTicketId] = useState(null);
  const { data: profile } = useDeveloperProfile();
  const { data: ticketsData, isLoading: ticketsLoading } = useMyTickets({ skip: 0, limit: 100 });
  const createTicket = useCreateTicket();
  const toast = useToast();
  const { userId } = useAuthStore();

  const onboardingKey = userId ? `ticketo_onboarded_dev_${userId}` : null;
  const [showOnboarding, setShowOnboarding] = useState(
    () => !!onboardingKey && !localStorage.getItem(onboardingKey)
  );

  const handleOnboardingComplete = () => {
    if (onboardingKey) localStorage.setItem(onboardingKey, '1');
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <OnboardingFlow name={profile?.name} onComplete={handleOnboardingComplete} />;
  }

  const allTickets = ticketsData?.items || [];
  const recentTickets = allTickets.slice(0, 5);

  const stats = {
    total: allTickets.length,
    open: allTickets.filter((t) => t.status === 'OPEN').length,
    inProgress: allTickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'AWAITING_CLARIFICATION').length,
    resolved: allTickets.filter((t) => t.status === 'RESOLVED' || t.status === 'AUTO_RESOLVED').length,
  };

  const kpis = [
    { label: 'Tickets soumis', value: stats.total, icon: Ticket, color: 'text-primary', bg: 'bg-primary-light' },
    { label: 'En cours', value: stats.inProgress, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'En attente', value: stats.open, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Résolus', value: stats.resolved, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const handleCreate = async (data) => {
    try {
      const newTicket = await createTicket.mutateAsync(data);
      setShowCreate(false);
      if (newTicket?.id) {
        setAnalyzingTicketId(newTicket.id);
      } else {
        toast.success('Ticket soumis avec succès — l\'IA va l\'analyser.');
      }
    } catch {
      toast.error('Erreur lors de la création du ticket.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Tableau de bord</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Bienvenue, <span className="font-medium text-text-secondary">{profile?.name || '...'}</span>
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={15} /> Nouveau ticket
        </Button>
      </div>

      {/* KPI cards */}
      {ticketsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpis.map((kpi, idx) => (
            <div
              key={kpi.label}
              className="bg-white border border-border rounded-card p-5 shadow-card hover:shadow-[0_4px_20px_rgba(0,86,179,0.10)] hover:-translate-y-0.5 transition-all duration-300 group"
              style={{ animation: `slideUp 0.35s ease-out ${idx * 0.08}s both` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">{kpi.label}</p>
                  <p className="text-3xl font-bold text-text-primary tracking-tight">{kpi.value}</p>
                </div>
                <div className={clsx('w-10 h-10 rounded-card flex items-center justify-center transition-transform duration-300 group-hover:scale-110', kpi.bg)}>
                  <kpi.icon size={20} className={kpi.color} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent tickets */}
      <div
        className="bg-white border border-border rounded-card shadow-card overflow-hidden hover:shadow-[0_4px_20px_rgba(0,86,179,0.10)] transition-shadow duration-300"
        style={{ animation: 'slideUp 0.4s ease-out 0.36s both' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <h3 className="text-sm font-semibold text-text-primary">Mes Tickets Récents</h3>
          <Link
            to="/developer/tickets"
            className="flex items-center gap-1 text-xs text-primary font-medium hover:underline group/link"
          >
            Voir tous <ChevronRight size={14} className="transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>

        {ticketsLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-14 rounded-btn" />)}
          </div>
        ) : recentTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mb-3">
              <Ticket size={24} className="text-primary" />
            </div>
            <p className="text-sm font-medium text-text-primary">Aucun ticket pour le moment</p>
            <p className="text-xs text-text-muted mt-1">Créez votre premier ticket ci-dessus.</p>
          </div>
        ) : (
          <div className="divide-y divide-divider">
            {recentTickets.map((ticket, idx) => (
              <Link
                key={ticket.id}
                to={`/developer/tickets/${ticket.id}`}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-surface-muted transition-all duration-200 group"
                style={{ animation: `fadeSlideIn 0.3s ease-out ${0.44 + idx * 0.06}s both` }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate group-hover:text-primary transition-colors duration-200">
                    {ticket.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] font-mono text-text-muted">#{ticket.id}</span>
                    <span className="text-[11px] text-text-muted">{CATEGORY_LABELS[ticket.category] || ticket.category}</span>
                  </div>
                </div>
                <StatusBadge status={ticket.status} />
                <span className="text-xs text-text-muted hidden sm:block">{formatDate(ticket.created_at)}</span>
                <ChevronRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <CreateTicketModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        loading={createTicket.isPending}
      />

      <AiAnalysisModal
        open={!!analyzingTicketId}
        ticketId={analyzingTicketId}
        onClose={() => setAnalyzingTicketId(null)}
      />

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
