// consolidated imports below
import { useMyTickets } from '../../hooks/developer/useMyTickets';
import { useCreateTicket } from '../../hooks/developer/useCreateTicket';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Select } from '../../components/ui/Input';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';
import CreateTicketModal from '../../components/developer/CreateTicketModal';
import AiAnalysisModal from '../../components/developer/AiAnalysisModal';
import { useToast } from '../../context/ToastContext';
import { Eye, Plus, Ticket as TicketIcon } from 'lucide-react';
import clsx from 'clsx';

const LIMIT = 10;

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'OPEN', label: 'Ouvert' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'AWAITING_CLARIFICATION', label: 'En attente de clarification' },
  { value: 'RESOLVED', label: 'Résolu' },
  { value: 'AUTO_RESOLVED', label: 'Résolu (IA)' },
];

const CATEGORY_LABELS = {
  NETWORK: 'Réseau', DATABASE: 'Base de données', SERVER_OS: 'Serveur / OS',
  DEPLOYMENT: 'Déploiement', SECURITY: 'Sécurité', API_GATEWAY: 'API Gateway',
  STORAGE: 'Stockage', OTHER: 'Autre',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

const getRowBorder = (status) => {
  if (status === 'AWAITING_CLARIFICATION' || status === 'OPEN_CLARIFICATION') return 'border-l-[3px] border-l-amber-400';
  if (status === 'IN_PROGRESS') return 'border-l-[3px] border-l-primary';
  if (status === 'RESOLVED' || status === 'AUTO_RESOLVED') return 'border-l-[3px] border-l-green-500';
  return 'border-l-[3px] border-l-transparent';
};

export default function DeveloperTickets() {
  const [showCreate, setShowCreate] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get('page') || 0);
  const initialStatus = searchParams.get('status') || '';

  const navigate = useNavigate();
  const toast = useToast();
  const [analyzingTicketId, setAnalyzingTicketId] = useState(null);

  const [page, setPage] = useState(initialPage);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [appliedStatus, setAppliedStatus] = useState(initialStatus);

  const { data, isLoading } = useMyTickets({
    skip: page * LIMIT,
    limit: LIMIT,
    status: appliedStatus || undefined,
  });

  const createTicket = useCreateTicket();

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / LIMIT);

  const handleFilter = () => {
    setAppliedStatus(statusFilter);
    setPage(0);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    params.page = 0;
    setSearchParams(params);
  };

  const handleReset = () => {
    setStatusFilter('');
    setAppliedStatus('');
    setPage(0);
    setSearchParams({ page: 0 });
  };
  const handleCreate = async (formData) => {
    try {
      const newTicket = await createTicket.mutateAsync(formData);
      setShowCreate(false);
      // Show the AI analysis loading modal with the new ticket's ID
      if (newTicket?.id) {
        setAnalyzingTicketId(newTicket.id);
      } else {
        toast.success('Ticket soumis — l\'IA va l\'analyser et l\'assigner automatiquement.');
      }
    } catch {
      toast.error('Erreur lors de la création du ticket.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Mes Tickets</h1>
          <p className="text-sm text-text-muted mt-1">
            Suivez vos demandes de support et l'avancement des résolutions.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={15} /> Nouveau ticket
        </Button>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">
          Affichage de{' '}
          <span className="font-medium text-text-secondary">{items.length > 0 ? page * LIMIT + 1 : 0}</span> à{' '}
          <span className="font-medium text-text-secondary">{Math.min((page + 1) * LIMIT, total)}</span> sur{' '}
          <span className="font-medium text-text-secondary">{total}</span> tickets
        </p>
        {appliedStatus && (
          <button onClick={handleReset} className="text-xs text-primary hover:underline font-medium">
            Réinitialiser le filtre
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-border rounded-card p-4 shadow-card flex flex-wrap items-end gap-4" style={{ animation: 'slideUp 0.3s ease-out 0.05s both' }}>
        <Select label="Statut" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} wrapperClassName="w-56">
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
        <Button onClick={handleFilter} size="md">Filtrer</Button>
        <Button variant="secondary" onClick={handleReset} size="md">Réinitialiser</Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={5} cols={6} />
      ) : items.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-border rounded-card p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-4">
            <TicketIcon size={28} className="text-primary" />
          </div>
          <p className="text-base font-semibold text-text-primary">Aucun ticket trouvé.</p>
          <p className="text-sm text-text-muted mt-1">
            {appliedStatus ? 'Essayez un autre filtre.' : 'Créez votre premier ticket avec le bouton ci-dessus.'}
          </p>
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
                <th className="text-left px-4 py-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">Ingénieur</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">Créé le</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((ticket, idx) => (
                <tr
                  key={ticket.id}
                  onClick={() => navigate(`/developer/tickets/${ticket.id}`)}
                  className={clsx(
                    'h-[52px] hover:bg-surface-muted transition-all duration-200 cursor-pointer border-b border-divider',
                    getRowBorder(ticket.status)
                  )}
                  style={{ animation: `fadeIn 0.15s ease-out ${idx * 0.04}s both` }}
                >
                  <td className="px-4 py-3 text-xs font-mono text-text-muted">{ticket.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-text-primary truncate max-w-[260px]">{ticket.title}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">
                    {CATEGORY_LABELS[ticket.category] || ticket.category}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
                  <td className="px-4 py-3 text-xs text-text-secondary">
                    {ticket.status === 'AUTO_RESOLVED'
                      ? <span className="inline-flex items-center gap-1 text-green-700 font-medium"><span>🤖</span> IA</span>
                      : (ticket.engineer_name || <span className="text-text-muted italic">Non assigné</span>)}
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted">{formatDate(ticket.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/developer/tickets/${ticket.id}`}
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
          <div className="px-4 border-t border-divider">
            <Pagination page={page} totalPages={totalPages} total={total} limit={LIMIT} onPageChange={setPage} loading={isLoading} />
          </div>
        </div>
      )}

      <CreateTicketModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        loading={createTicket.isPending}
      />

      {/* AI Analysis loading modal — shown immediately after ticket creation */}
      <AiAnalysisModal
        open={!!analyzingTicketId}
        ticketId={analyzingTicketId}
        onClose={() => setAnalyzingTicketId(null)}
      />
    </div>
  );
}
