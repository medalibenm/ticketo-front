import { useState } from 'react';
import { adminTicketsService } from '../../services/api';
import { usePaginated } from '../../hooks/useAsync';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminTickets() {
  const toast = useToast();
  const [filters, setFilters] = useState({ status: '', developer_id: '', engineer_id: '' });
  const [pending, setPending] = useState(filters);
  const { items, total, loading, page, totalPages, limit, goToPage } = usePaginated(
    (params) => adminTicketsService.getTickets(params),
    filters
  );

  const [assignModal, setAssignModal] = useState(null); // ticket obj
  const [engineerId, setEngineerId] = useState('');
  const [assigning, setAssigning] = useState(false);

  const handleFilter = () => { setFilters(pending); goToPage(0, pending); };
  const handleReset = () => {
    const empty = { status: '', developer_id: '', engineer_id: '' };
    setPending(empty); setFilters(empty); goToPage(0, empty);
  };

  const handleAssign = async () => {
    if (!engineerId) return;
    setAssigning(true);
    try {
      await adminTicketsService.assignEngineer(assignModal.id, parseInt(engineerId));
      toast.success(`Ticket #${assignModal.id} assigné à l'ingénieur ${engineerId}.`);
      setAssignModal(null);
      setEngineerId('');
      goToPage(page, filters);
    } catch {
      toast.error("Erreur lors de l'assignation.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="bg-white border border-border rounded-card shadow-card px-5 py-4">
        <div className="flex flex-wrap items-end gap-3">
          <Select
            label="Statut"
            value={pending.status}
            onChange={(e) => setPending((p) => ({ ...p, status: e.target.value }))}
            wrapperClassName="min-w-[180px]"
          >
            <option value="">Tous les statuts</option>
            <option value="OPEN">Ouvert</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="AWAITING_CLARIFICATION">En attente</option>
            <option value="RESOLVED">Résolu</option>
            <option value="AUTO_RESOLVED">Auto-résolu</option>
          </Select>

          <Input
            label="ID Développeur"
            value={pending.developer_id}
            onChange={(e) => setPending((p) => ({ ...p, developer_id: e.target.value }))}
            placeholder="ex: 2"
            wrapperClassName="min-w-[140px]"
          />

          <Input
            label="ID Ingénieur"
            value={pending.engineer_id}
            onChange={(e) => setPending((p) => ({ ...p, engineer_id: e.target.value }))}
            placeholder="ex: 3"
            wrapperClassName="min-w-[140px]"
          />

          <div className="flex gap-2 pb-0.5">
            <Button variant="primary" size="sm" onClick={handleFilter}>Filtrer</Button>
            <Button variant="secondary" size="sm" onClick={handleReset}>Réinitialiser</Button>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={5} cols={8} />
      ) : (
        <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-muted">
              <tr>
                {['#', 'Titre', 'Catégorie', 'Statut', 'Dév. ID', 'Ing. ID', 'Créé le', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-medium text-text-muted uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((ticket, idx) => (
                <tr
                  key={ticket.id}
                  className="border-t border-divider hover:bg-surface-muted transition-colors h-[52px]"
                >
                  <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">#{ticket.id}</td>
                  <td className="px-4 py-3 font-medium text-sm text-text-primary max-w-[220px] truncate">{ticket.title}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{ticket.category}</td>
                  <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
                  <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">{ticket.developer_id ?? '—'}</td>
                  <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">{ticket.engineer_id ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">{formatDate(ticket.created_at)}</td>
                  <td className="px-4 py-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => { setAssignModal(ticket); setEngineerId(''); }}
                    >
                      Assigner
                    </Button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-text-muted">
                    Aucun ticket trouvé pour ces filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="px-4 border-t border-divider">
            <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={(p) => goToPage(p, filters)} loading={loading} />
          </div>
        </div>
      )}

      {/* Assign Modal */}
      <Modal
        open={!!assignModal}
        onClose={() => setAssignModal(null)}
        title="Assigner un ingénieur"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAssignModal(null)}>Annuler</Button>
            <Button variant="primary" onClick={handleAssign} loading={assigning}>
              Confirmer l'assignation
            </Button>
          </>
        }
      >
        {assignModal && (
          <div className="space-y-4">
            <div className="bg-surface-muted rounded-btn px-4 py-3">
              <p className="text-xs text-text-muted">Ticket</p>
              <p className="text-sm font-medium text-text-primary mt-0.5">#{assignModal.id} — {assignModal.title}</p>
            </div>
            <Input
              label="ID de l'ingénieur"
              type="number"
              value={engineerId}
              onChange={(e) => setEngineerId(e.target.value)}
              placeholder="Entrez l'ID ingénieur"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
