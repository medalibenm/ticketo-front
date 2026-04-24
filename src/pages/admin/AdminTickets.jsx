import { useState } from 'react';
import { useAllTickets } from '../../hooks/admin/useAllTickets';
import { useAssignTicket } from '../../hooks/admin/useAssignTicket';
import { getErrorMessage } from '../../api/errors';
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
  const [page, setPage] = useState(0);
  const limit = 10;
  const [filters, setFilters] = useState({ status: '', developer_id: '', engineer_id: '' });
  const [pending, setPending] = useState(filters);

  const params = {
    skip: page * limit,
    limit,
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.developer_id ? { developer_id: Number(filters.developer_id) } : {}),
    ...(filters.engineer_id ? { engineer_id: Number(filters.engineer_id) } : {}),
  };

  const { data, isLoading: loading } = useAllTickets(params);
  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const [assignModal, setAssignModal] = useState(null); // ticket obj
  const [viewModal, setViewModal] = useState(null); // ticket obj
  const [engineerId, setEngineerId] = useState('');
  const { mutateAsync: assignTicket, isPending: assigning } = useAssignTicket();

  const handleFilter = () => {
    setFilters(pending);
    setPage(0);
  };

  const handleReset = () => {
    const empty = { status: '', developer_id: '', engineer_id: '' };
    setPending(empty);
    setFilters(empty);
    setPage(0);
  };

  const handleAssign = async () => {
    if (!engineerId) return;

    try {
      await assignTicket({
        ticketId: assignModal.id,
        body: { engineer_id: Number(engineerId) },
      });

      toast.success(`Ticket #${assignModal.id} assigned to engineer ${engineerId}.`);
      setAssignModal(null);
      setEngineerId('');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="bg-white border border-border rounded-card shadow-card px-5 py-4">
        <div className="flex flex-wrap items-end gap-3">
          <Select
            label="Status"
            value={pending.status}
            onChange={(e) => setPending((p) => ({ ...p, status: e.target.value }))}
            wrapperClassName="min-w-[180px]"
          >
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="AWAITING_CLARIFICATION">Awaiting clarification</option>
            <option value="RESOLVED">Resolved</option>
            <option value="AUTO_RESOLVED">Auto resolved</option>
          </Select>

          <Input
            label="Developer ID"
            value={pending.developer_id}
            onChange={(e) => setPending((p) => ({ ...p, developer_id: e.target.value }))}
            placeholder="e.g. 2"
            wrapperClassName="min-w-[140px]"
          />

          <Input
            label="Engineer ID"
            value={pending.engineer_id}
            onChange={(e) => setPending((p) => ({ ...p, engineer_id: e.target.value }))}
            placeholder="e.g. 3"
            wrapperClassName="min-w-[140px]"
          />

          <div className="flex gap-2 pb-0.5">
            <Button variant="primary" size="sm" onClick={handleFilter}>Filter</Button>
            <Button variant="secondary" size="sm" onClick={handleReset}>Reset</Button>
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
                {['#', 'Title', 'Category', 'Status', 'Dev ID', 'Eng ID', 'Created At', 'Actions'].map((h) => (
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
                  <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">{ticket.developer_id ?? '-'}</td>
                  <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">{ticket.engineer_id ?? '-'}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">{formatDate(ticket.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setViewModal(ticket)}
                      >
                        View
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => { setAssignModal(ticket); setEngineerId(''); }}
                      >
                        Assign
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-text-muted">
                    No tickets found for these filters.
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

      {/* Assign Modal */}
      <Modal
        open={!!assignModal}
        onClose={() => setAssignModal(null)}
        title="Assign Engineer"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAssignModal(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleAssign} loading={assigning}>
              Confirm Assignment
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
              label="Engineer ID"
              type="number"
              value={engineerId}
              onChange={(e) => setEngineerId(e.target.value)}
              placeholder="Enter engineer ID"
            />
          </div>
        )}
      </Modal>

      {/* View Modal */}
      <Modal
        open={!!viewModal}
        onClose={() => setViewModal(null)}
        title={`Ticket #${viewModal?.id} Details`}
        maxWidth="max-w-[640px]"
        footer={
          <Button variant="secondary" onClick={() => setViewModal(null)}>
            Close
          </Button>
        }
      >
        {viewModal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-muted">Title</p>
                <p className="text-sm font-medium text-text-primary">{viewModal.title}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Category</p>
                <p className="text-sm text-text-secondary">{viewModal.category}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Status</p>
                <StatusBadge status={viewModal.status} className="mt-1" />
              </div>
              <div>
                <p className="text-xs text-text-muted">Developer ID</p>
                <p className="text-sm text-text-secondary font-mono">{viewModal.developer_id}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Engineer ID</p>
                <p className="text-sm text-text-secondary font-mono">{viewModal.engineer_id ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Created At</p>
                <p className="text-sm text-text-secondary">{formatDate(viewModal.created_at)}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-text-muted mb-2">Description</p>
              <div className="bg-surface-muted border border-divider rounded-btn px-4 py-3 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {viewModal.description}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
