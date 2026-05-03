import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEngineerTickets } from '../../hooks/engineer/useEngineerTickets';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { Eye, LayoutDashboard, Ticket as TicketIcon, User } from 'lucide-react';
import clsx from 'clsx';

const LIMIT = 10;

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'OPEN', label: 'Ouvert' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'AWAITING_CLARIFICATION', label: 'En attente' },
  { value: 'RESOLVED', label: 'Résolu' },
  { value: 'AUTO_RESOLVED', label: 'Résolu (IA)' },
];

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

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function EngineerTickets() {
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [appliedStatus, setAppliedStatus] = useState('');
  const navigate = useNavigate();

  const { data, isLoading } = useEngineerTickets({
    skip: page * LIMIT,
    limit: LIMIT,
    status: appliedStatus || undefined,
  });

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / LIMIT);

  const handleFilter = () => {
    setAppliedStatus(statusFilter);
    setPage(0);
  };

  const handleReset = () => {
    setStatusFilter('');
    setAppliedStatus('');
    setPage(0);
  };

  const getRowBorderClass = (status) => {
    switch (status) {
      case 'IN_PROGRESS': return 'border-l-[3px] border-l-primary';
      case 'AWAITING_CLARIFICATION': return 'border-l-[3px] border-l-amber-400';
      default: return 'border-l-[3px] border-l-transparent';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Liste des Tickets</h1>
        <p className="text-sm text-text-muted mt-1">
          Gestion centralisée des requêtes de maintenance et des anomalies système du réseau AT.
        </p>
      </div>

      {/* Result count + Active filter info */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">
          Affichage de <span className="font-medium text-text-secondary">{items.length > 0 ? page * LIMIT + 1 : 0}</span> à{' '}
          <span className="font-medium text-text-secondary">{Math.min((page + 1) * LIMIT, total)}</span> sur{' '}
          <span className="font-medium text-text-secondary">{total}</span> tickets
        </p>
        {appliedStatus && (
          <button
            onClick={handleReset}
            className="text-xs text-primary hover:underline font-medium"
          >
            Réinitialiser le filtre
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-border rounded-card p-4 shadow-card flex flex-wrap items-end gap-4" style={{ animation: 'slideUp 0.3s ease-out 0.05s both' }}>
        <Select
          label="Statut"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          wrapperClassName="w-48"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
        <Button onClick={handleFilter} size="md">Filtrer</Button>
        <Button variant="secondary" onClick={handleReset} size="md">Réinitialiser</Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={5} cols={7} />
      ) : items.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-border rounded-card p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-4">
            <TicketIcon size={28} className="text-primary" />
          </div>
          <p className="text-base font-semibold text-text-primary">Aucun ticket assigné pour le moment.</p>
          <p className="text-sm text-text-muted mt-1">Les tickets qui vous seront assignés apparaîtront ici.</p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-card overflow-hidden shadow-card" style={{ animation: 'slideUp 0.3s ease-out 0.1s both' }}>
          <table className="w-full">
            <thead>
              <tr className="bg-surface-muted">
                <th className="text-left px-4 py-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">#</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">Titre</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">Catégorie</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">Statut</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">Développeur</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">Créé le</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((ticket, idx) => (
                <tr
                  key={ticket.id}
                  onClick={() => navigate(`/engineer/tickets/${ticket.id}`)}
                  className={clsx(
                    'h-[52px] hover:bg-surface-muted transition-all duration-200 cursor-pointer border-b border-divider',
                    getRowBorderClass(ticket.status)
                  )}
                  style={{ animation: `fadeIn 0.15s ease-out ${idx * 0.04}s both` }}
                >
                  <td className="px-4 py-3 text-xs font-mono text-text-muted">{ticket.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-text-primary truncate max-w-[260px]">
                      {ticket.title}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">
                    {CATEGORY_LABELS[ticket.category] || ticket.category}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">
                    {ticket.developer_name || `Dev #${ticket.developer_id}`}
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted">
                    {formatDate(ticket.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/engineer/tickets/${ticket.id}`}
                      className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye size={13} /> Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-4 border-t border-divider">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={LIMIT}
              onPageChange={setPage}
              loading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
