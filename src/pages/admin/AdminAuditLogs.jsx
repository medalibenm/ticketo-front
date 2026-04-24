import { useState } from 'react';
import { useAuditLogs } from '../../hooks/admin/useAuditLogs';
import { RoleBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';

function formatDate(d) {
  return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminAuditLogs() {
  const [page, setPage] = useState(0);
  const limit = 10;
  const [actorType, setActorType] = useState('');
  const [pending, setPending] = useState('');
  const { data, isLoading: loading } = useAuditLogs({
    skip: page * limit,
    limit,
    ...(actorType ? { actor_type: actorType } : {}),
  });

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleFilter = () => {
    setActorType(pending);
    setPage(0);
  };

  const handleReset = () => {
    setPending('');
    setActorType('');
    setPage(0);
  };

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="bg-white border border-border rounded-card shadow-card px-5 py-4">
        <div className="flex items-end gap-3">
          <Select
            label="Actor Type"
            value={pending}
            onChange={(e) => setPending(e.target.value)}
            wrapperClassName="min-w-[180px]"
          >
            <option value="">All</option>
            <option value="ADMIN">Admin</option>
            <option value="ENGINEER">Engineer</option>
            <option value="DEVELOPER">Developer</option>
          </Select>
          <div className="flex gap-2 pb-0.5">
            <Button variant="primary" size="sm" onClick={handleFilter}>Filter</Button>
            <Button variant="secondary" size="sm" onClick={handleReset}>Reset</Button>
          </div>
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={5} cols={7} />
      ) : (
        <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-muted">
              <tr>
                {['#', 'Actor ID', 'Type', 'Action', 'Target Type', 'Target ID', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-medium text-text-muted uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((log) => (
                <tr key={log.id} className="border-t border-divider hover:bg-surface-muted h-[52px] transition-colors">
                  <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">{log.id}</td>
                  <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">{log.actor_id ?? '-'}</td>
                  <td className="px-4 py-3"><RoleBadge role={log.actor_type} /></td>
                  <td className="px-4 py-3 font-mono text-[13px] text-text-primary">{log.action}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{log.target_type}</td>
                  <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">{log.target_id ?? '-'}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">{formatDate(log.created_at)}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-text-muted">
                    No audit logs found.
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
    </div>
  );
}
