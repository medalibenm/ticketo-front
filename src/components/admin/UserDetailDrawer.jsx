import {
  X, Mail, Wrench, Shield, Calendar, Hash,
  CheckCircle2, Clock, AlertTriangle, Activity, Star,
} from 'lucide-react';
import { RoleBadge } from '../ui/Badge';
import { useAdminEngineerStats } from '../../hooks/admin/useAdminEngineerStats';
import clsx from 'clsx';

const NIVEAU_COLORS = {
  JUNIOR: { bg: '#EEF2FF', color: '#4F46E5', label: 'Junior' },
  SENIOR: { bg: '#D1FAE5', color: '#059669', label: 'Senior' },
  LEAD:   { bg: '#FEF3C7', color: '#D97706', label: 'Lead' },
};

function StatCard({ label, value, sub, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="bg-surface-muted rounded-card p-4 flex items-start justify-between">
      <div>
        <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold text-text-primary leading-none">{value ?? '—'}</p>
        {sub && <p className="text-[11px] text-text-muted mt-1">{sub}</p>}
      </div>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={15} style={{ color: iconColor }} />
      </div>
    </div>
  );
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function formatTime(mins) {
  if (!mins) return '—';
  if (mins < 60) return `${Math.round(mins)} min`;
  return `${(mins / 60).toFixed(1)} h`;
}

export default function UserDetailDrawer({ user, open, onClose }) {
  const isEngineer = user?.role === 'ENGINEER';

  const { data: stats, isLoading: statsLoading } = useAdminEngineerStats(
    isEngineer && open ? user?.id : null
  );

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const niveauCfg = NIVEAU_COLORS[user.niveau] || null;
  const isAvailable = user.disponibilite !== false;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/10 animate-fade-in"
          onClick={onClose}
        />
      )}

      <div
        className={clsx(
          'fixed right-0 top-0 h-full w-[400px] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.08)] z-50 flex flex-col transition-transform duration-250',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <h3 className="font-semibold text-base text-text-primary">Détails utilisateur</h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-secondary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* Profile identity */}
          <div className="px-5 py-5 border-b border-divider">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-white">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-text-primary leading-tight truncate">
                  {user.name}
                </h4>
                <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                  <Mail size={11} /> {user.email}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <RoleBadge role={user.role} />
                  {niveauCfg && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                      style={{ backgroundColor: niveauCfg.bg, color: niveauCfg.color }}
                    >
                      <Shield size={10} /> {niveauCfg.label}
                    </span>
                  )}
                  {isEngineer && (
                    <span className={clsx(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium',
                      isAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    )}>
                      <span className={clsx(
                        'w-1.5 h-1.5 rounded-full',
                        isAvailable ? 'bg-green-500' : 'bg-gray-400'
                      )} />
                      {isAvailable ? 'Disponible' : 'Indisponible'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Engineer stats */}
          {isEngineer && (
            <div className="px-5 py-5 border-b border-divider">
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">
                Statistiques
              </p>

              {statsLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="skeleton h-20 rounded-card" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    label="Tickets résolus"
                    value={stats?.tickets_resolved}
                    icon={CheckCircle2}
                    iconBg="#D1FAE5"
                    iconColor="#059669"
                  />
                  <StatCard
                    label="Tickets actifs"
                    value={stats?.active_tickets}
                    icon={Activity}
                    iconBg="#EEF2FF"
                    iconColor="#4F46E5"
                  />
                  <StatCard
                    label="Temps moyen"
                    value={formatTime(stats?.avg_resolution_time)}
                    sub="par ticket"
                    icon={Clock}
                    iconBg="#FEF3C7"
                    iconColor="#D97706"
                  />
                  <StatCard
                    label="Signalements"
                    value={stats?.misassignments_signaled}
                    icon={AlertTriangle}
                    iconBg="#FEF2F2"
                    iconColor="#EF4444"
                  />
                </div>
              )}

              {/* Performance bar */}
              {!statsLoading && stats && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider">
                      Score de performance
                    </span>
                    <span className="text-xs font-bold text-text-primary">
                      {stats.performance_score.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-400 transition-all duration-700"
                      style={{ width: `${Math.min(100, stats.performance_score * 5)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile info */}
          <div className="px-5 py-5 space-y-4">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Informations
            </p>

            {isEngineer && user.specialite && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center flex-shrink-0">
                  <Wrench size={13} className="text-text-muted" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted">Spécialité</p>
                  <p className="text-sm text-text-primary font-medium">{user.specialite}</p>
                </div>
              </div>
            )}

            {user.entreprise && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center flex-shrink-0">
                  <Star size={13} className="text-text-muted" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted">Entreprise</p>
                  <p className="text-sm text-text-primary font-medium">{user.entreprise}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center flex-shrink-0">
                <Calendar size={13} className="text-text-muted" />
              </div>
              <div>
                <p className="text-[10px] text-text-muted">Membre depuis</p>
                <p className="text-sm text-text-primary font-medium">{formatDate(user.created_at)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center flex-shrink-0">
                <Hash size={13} className="text-text-muted" />
              </div>
              <div>
                <p className="text-[10px] text-text-muted">Identifiant système</p>
                <p className="text-sm font-mono text-text-secondary">
                  AT-{user.role.slice(0, 3)}-{String(user.id).padStart(4, '0')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
