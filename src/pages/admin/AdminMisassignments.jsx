import { useEffect, useState } from 'react';
import { useMisassignments } from '../../hooks/admin/useMisassignments';
import { useMisassignmentDetail } from '../../hooks/admin/useMisassignmentDetail';
import { useReassignTicket } from '../../hooks/admin/useReassignTicket';
import { getErrorMessage } from '../../api/errors';
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
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const TABS = ['ALL', 'PENDING', 'REVIEWED', 'REASSIGNED'];
const TAB_LABELS = {
  ALL: 'All',
  PENDING: 'Pending',
  REVIEWED: 'Reviewed',
  REASSIGNED: 'Reassigned',
};

export default function AdminMisassignments() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('ALL');
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data, isLoading: loading } = useMisassignments({ skip: 0, limit: 1000 });

  const { mutateAsync: reassignTicket } = useReassignTicket();

  const allItems = data?.items || [];
  const filteredItems = activeTab === 'ALL'
    ? allItems
    : allItems.filter((item) => item.status === activeTab);

  const total = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    setPage(0);
  }, [activeTab]);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

  const start = page * limit;
  const end = start + limit;
  const displayItems = filteredItems.slice(start, end);

  const [detailModalId, setDetailModalId] = useState(null);
  const [reassignModal, setReassignModal] = useState(null);
  const [newEngId, setNewEngId] = useState('');
  const [reassigning, setReassigning] = useState(false);
  const [reassignError, setReassignError] = useState('');

  const { data: detailData, isLoading: detailLoading } = useMisassignmentDetail(detailModalId);
  const selectedDetail = detailData || allItems.find((item) => item.id === detailModalId) || null;

  const handleReassign = async () => {
    setReassignError('');
    if (!newEngId) return;

    const parsedId = Number(newEngId);
    if (parsedId === reassignModal.reporting_engineer_id) {
      setReassignError('You cannot reassign to the same engineer.');
      return;
    }

    setReassigning(true);
    try {
      await reassignTicket({ reportId: reassignModal.id, new_engineer_id: parsedId });
      toast.success(`Ticket #${reassignModal.ticket_id} reassigned to engineer ${parsedId}.`);
      setReassignModal(null);
      setDetailModalId(null);
    } catch (error) {
      if (error?.response?.status === 409) {
        const detail = error?.response?.data?.detail;
        setReassignError(typeof detail === 'string' ? detail : 'Conflict while reassigning ticket.');
      } else {
        toast.error(getErrorMessage(error));
      }
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
                {['#', 'Ticket ID', 'Reporting Engineer ID', 'Reason', 'Status', 'Created At', 'Actions'].map((h) => (
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
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">#{m.reporting_engineer_id}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary max-w-[240px]">
                    <span className="line-clamp-1">{m.reason.slice(0, 60)}{m.reason.length > 60 ? '…' : ''}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">{formatDate(m.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDetailModalId(m.id)}
                        className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-primary hover:bg-primary-light transition-colors"
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>
                      {m.status !== 'REASSIGNED' && (
                        <Button variant="secondary" size="sm" onClick={() => { setReassignModal(m); setNewEngId(''); setReassignError(''); }}>
                          Reassign
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {displayItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-text-muted">
                    No misassignments found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="px-4 border-t border-divider">
            <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={setPage} loading={loading} />
          </div>
        </div>
      )}

      {/* Detail modal */}
      <Modal
        open={Boolean(detailModalId)}
        onClose={() => setDetailModalId(null)}
        title={`Misassignment #${detailModalId ?? ''}`}
        maxWidth="max-w-[560px]"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDetailModalId(null)}>Close</Button>
            {selectedDetail?.status !== 'REASSIGNED' && (
              <Button variant="accent" onClick={() => { setReassignModal(selectedDetail); setNewEngId(''); setReassignError(''); }}>
                Reassign Ticket
              </Button>
            )}
          </>
        }
      >
        {detailLoading && (
          <p className="text-sm text-text-secondary">Loading details...</p>
        )}
        {selectedDetail && !detailLoading && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div>
                <p className="text-xs text-text-muted">Ticket ID</p>
                <p className="text-sm font-mono font-medium text-text-primary">#{selectedDetail.ticket_id}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Reporting Engineer ID</p>
                <p className="text-sm font-medium text-text-primary">#{selectedDetail.reporting_engineer_id}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Status</p>
                <StatusBadge status={selectedDetail.status} className="mt-0.5" />
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-2">Reason</p>
              <blockquote className="bg-surface-muted rounded-btn px-4 py-3 text-sm text-text-secondary leading-relaxed border-l-4 border-primary-light">
                {selectedDetail.reason}
              </blockquote>
            </div>
          </div>
        )}
      </Modal>

      {/* Reassign modal */}
      <Modal
        open={!!reassignModal}
        onClose={() => setReassignModal(null)}
        title="Reassign Engineer"
        footer={
          <>
            <Button variant="secondary" onClick={() => setReassignModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleReassign} loading={reassigning}>Confirm</Button>
          </>
        }
      >
        {reassignModal && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Ticket <span className="font-mono font-medium">#{reassignModal.ticket_id}</span> is currently assigned to engineer ID <span className="font-medium">#{reassignModal.reporting_engineer_id}</span>.
            </p>
            <Input
              label="New Engineer ID"
              type="number"
              value={newEngId}
              onChange={(e) => setNewEngId(e.target.value)}
              placeholder="Enter the new engineer ID"
              error={reassignError}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
