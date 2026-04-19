import { useState } from 'react';
import { useMisassignments } from '../../hooks/admin/useMisassignments';
import { useReassignTicket } from '../../hooks/admin/useReassignTicket';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';
import { Eye } from 'lucide-react';
import clsx from 'clsx';

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

const TABS = ['Tous', 'PENDING', 'REVIEWED', 'REASSIGNED'];
const TAB_LABELS = { Tous: 'Tous', PENDING: 'En attente', REVIEWED: 'Examiné', REASSIGNED: 'Réassigné' };

export default function AdminMisassignments() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('Tous');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading: loading } = useMisassignments({ 
    skip: (page - 1) * limit, 
    limit,
    status: activeTab === 'Tous' ? undefined : activeTab,
  });

  const { mutateAsync: reassignTicket } = useReassignTicket();

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const goToPage = (p) => setPage(p);

  const [detailModal, setDetailModal] = useState(null);
  const [reassignModal, setReassignModal] = useState(null);
  const [newEngId, setNewEngId] = useState('');
  const [reassigning, setReassigning] = useState(false);
  const [reassignError, setReassignError] = useState('');

  const displayItems = items;

  const handleReassign = async () => {
    setReassignError('');
    if (!newEngId) return;
    if (parseInt(newEngId) === reassignModal.engineer_id) {
      setReassignError('⚠️ Vous ne pouvez pas réassigner au même ingénieur.');
      return;
    }
    setReassigning(true);
    try {
      await reassignTicket({ reportId: reassignModal.id, new_engineer_id: parseInt(newEngId) });
      toast.success(`Ticket #${reassignModal.ticket_id} rÃ©assignÃ© Ã  l'ingÃ©nieur ${newEngId}.`);
      setReassignModal(null);
      setDetailModal(null);
    } catch {
      toast.error('Erreur lors de la réassignation.');
    } finally {
      setReassigning(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Pill tabs */}
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              activeTab === tab ? 'bg-primary text-white' : 'bg-white border border-border text-text-secondary hover:border-primary hover:text-primary'
            )}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={4} cols={7} />
      ) : (
        <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-muted">
              <tr>
                {['#', 'Ticket ID', 'Ingénieur', 'Raison', 'Statut', 'Signalé le', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-medium text-text-muted uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayItems.map((m) => (
                <tr
                  key={m.id}
                  className={clsx(
                    'border-t border-divider hover:bg-surface-muted h-[52px] transition-colors',
                    m.status === 'PENDING' && 'border-l-[3px] border-l-accent'
                  )}
                >
                  <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">{m.id}</td>
                  <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">#{m.ticket_id}</td>
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">{m.engineer_name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary max-w-[240px]">
                    <span className="line-clamp-1">{m.reason.slice(0, 60)}{m.reason.length > 60 ? '…' : ''}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">{formatDate(m.reported_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDetailModal(m)}
                        className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-primary hover:bg-primary-light transition-colors"
                        title="Voir le détail"
                      >
                        <Eye size={14} />
                      </button>
                      {m.status !== 'REASSIGNED' && (
                        <Button variant="secondary" size="sm" onClick={() => { setReassignModal(m); setNewEngId(''); setReassignError(''); }}>
                          Réassigner
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {displayItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-text-muted">
                    Aucun signalement pour ce filtre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="px-4 border-t border-divider">
            <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={goToPage} loading={loading} />
          </div>
        </div>
      )}

      {/* Detail modal */}
      <Modal
        open={!!detailModal}
        onClose={() => setDetailModal(null)}
        title={`Signalement #${detailModal?.id}`}
        maxWidth="max-w-[560px]"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDetailModal(null)}>Fermer</Button>
            {detailModal?.status !== 'REASSIGNED' && (
              <Button variant="accent" onClick={() => { setReassignModal(detailModal); setNewEngId(''); setReassignError(''); }}>
                Réassigner le ticket
              </Button>
            )}
          </>
        }
      >
        {detailModal && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div>
                <p className="text-xs text-text-muted">Ticket ID</p>
                <p className="text-sm font-mono font-medium text-text-primary">#{detailModal.ticket_id}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Ingénieur</p>
                <p className="text-sm font-medium text-text-primary">{detailModal.engineer_name}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Statut</p>
                <StatusBadge status={detailModal.status} className="mt-0.5" />
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-2">Raison du signalement</p>
              <blockquote className="bg-surface-muted rounded-btn px-4 py-3 text-sm text-text-secondary leading-relaxed border-l-4 border-primary-light">
                {detailModal.reason}
              </blockquote>
            </div>
          </div>
        )}
      </Modal>

      {/* Reassign modal */}
      <Modal
        open={!!reassignModal}
        onClose={() => setReassignModal(null)}
        title="Réassigner l'ingénieur"
        footer={
          <>
            <Button variant="secondary" onClick={() => setReassignModal(null)}>Annuler</Button>
            <Button variant="primary" onClick={handleReassign} loading={reassigning}>Confirmer</Button>
          </>
        }
      >
        {reassignModal && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Ticket <span className="font-mono font-medium">#{reassignModal.ticket_id}</span> actuellement assigné à <span className="font-medium">{reassignModal.engineer_name}</span>.
            </p>
            <Input
              label="Nouvel ID ingénieur"
              type="number"
              value={newEngId}
              onChange={(e) => setNewEngId(e.target.value)}
              placeholder="Entrez l'ID du nouvel ingénieur"
              error={reassignError}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
