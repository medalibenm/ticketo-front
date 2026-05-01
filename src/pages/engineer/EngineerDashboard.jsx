import { Link } from 'react-router-dom';
import { useEngineerStats } from '../../hooks/engineer/useEngineerStats';
import { useEngineerTickets } from '../../hooks/engineer/useEngineerTickets';
import { StatusBadge } from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import {
  Ticket, CheckCircle2, AlertTriangle, Clock,
  ChevronRight, TrendingUp,
} from 'lucide-react';
import clsx from 'clsx';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

const CATEGORY_LABELS = {
  NETWORK: 'Réseau',
  DATABASE: 'Base de données',
  SERVER_OS: 'Serveur / OS',
  DEPLOYMENT: 'Déploiement',
  SECURITY: 'Sécurité',
  API_GATEWAY: 'API Gateway',
  STORAGE: 'Stockage',
  OTHER: 'Autre',
};

export default function EngineerDashboard() {
  const { data: stats, isLoading: statsLoading } = useEngineerStats();
  const { data: ticketsData, isLoading: ticketsLoading } = useEngineerTickets({ skip: 0, limit: 5 });

  const aiPrecisionVal = stats?.ai_precision || 0;
  const aiPrecisionDash = aiPrecisionVal / 100;

  const kpis = [
    {
      label: 'Tickets Assignés',
      value: stats?.total_assigned ?? '—',
      icon: Ticket,
      color: 'text-primary',
      bg: 'bg-primary-light',
    },
    {
      label: 'Tickets Résolus',
      value: stats?.resolved ?? '—',
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Mauvaises Assignations',
      value: stats?.misassigned ?? '—',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'En Attente de Clarification',
      value: stats?.awaiting_clarification ?? '—',
      icon: Clock,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header — fade in */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Tableau de bord</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-text-muted font-medium">En ligne</span>
          </div>
        </div>
      </div>

      {/* KPI Row — staggered slide-up */}
      {statsLoading ? (
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
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                    {kpi.label}
                  </p>
                  <p className="text-3xl font-bold text-text-primary tracking-tight">
                    {kpi.value}
                  </p>
                </div>
                <div className={clsx(
                  'w-10 h-10 rounded-card flex items-center justify-center transition-transform duration-300 group-hover:scale-110',
                  kpi.bg
                )}>
                  <kpi.icon size={20} className={kpi.color} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Precision Index + Recent Tickets — staggered entry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Precision Index */}
        <Link 
          to="/engineer/tickets" 
          className="bg-white border border-border rounded-card p-6 shadow-card flex flex-col items-center justify-center hover:shadow-[0_4px_20px_rgba(0,86,179,0.10)] transition-shadow duration-300"
          style={{ animation: 'slideUp 0.4s ease-out 0.35s both' }}
        >
          <h3 className="text-sm font-semibold text-text-primary mb-4">Index de Précision IA</h3>
          {/* Circular Gauge */}
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              {/* Background circle */}
              <circle cx="60" cy="60" r="50" fill="none" stroke="#EEF2FF" strokeWidth="10" />
              {/* Progress arc — animated dash */}
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${aiPrecisionDash * 314} ${(1 - aiPrecisionDash) * 314}`}
                style={{
                  animation: 'gaugeReveal 1.2s ease-out 0.6s both',
                }}
              />
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-text-primary">{aiPrecisionVal}%</span>
              <span className="text-[10px] text-text-muted font-medium">PRÉCISION</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs text-green-600 font-medium">
            <TrendingUp size={13} />
            <span>Reflète les résolutions IA</span>
          </div>
        </Link>

        {/* Recent Tickets */}
        <div
          className="lg:col-span-2 bg-white border border-border rounded-card shadow-card overflow-hidden hover:shadow-[0_4px_20px_rgba(0,86,179,0.10)] transition-shadow duration-300"
          style={{ animation: 'slideUp 0.4s ease-out 0.42s both' }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
            <h3 className="text-sm font-semibold text-text-primary">Mes Tickets Récents</h3>
            <Link
              to="/engineer/tickets"
              className="flex items-center gap-1 text-xs text-primary font-medium hover:underline group/link"
            >
              Voir plus <ChevronRight size={14} className="transition-transform group-hover/link:translate-x-0.5" />
            </Link>
          </div>

          {ticketsLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-14 rounded-btn" />)}
            </div>
          ) : (
            <div className="divide-y divide-divider">
              {ticketsData?.items?.slice(0, 5).map((ticket, idx) => (
                <Link
                  key={ticket.id}
                  to={`/engineer/tickets/${ticket.id}`}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-surface-muted transition-all duration-200 group"
                  style={{ animation: `fadeSlideIn 0.3s ease-out ${0.5 + idx * 0.06}s both` }}
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
                  <span className="text-xs text-text-muted hidden sm:block">
                    {formatDate(ticket.created_at)}
                  </span>
                  <ChevronRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inline keyframes for dashboard-specific animations */}
      <style>{`
        @keyframes gaugeReveal {
          from { stroke-dasharray: 0 314; }
          to { stroke-dasharray: ${0.92 * 314} ${(1 - 0.92) * 314}; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
