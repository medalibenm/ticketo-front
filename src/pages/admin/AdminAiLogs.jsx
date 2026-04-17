import { adminAiLogsService } from '../../services/api';
import { usePaginated } from '../../hooks/useAsync';
import { DecisionBadge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { useState, Fragment } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

function formatDate(d) {
  return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function ScoreBar({ value }) {
  const pct = Math.min(100, value * 100);
  const color = value >= 0.7 ? '#2F855A' : value >= 0.4 ? '#B7791F' : '#C53030';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden flex-shrink-0">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-text-secondary font-mono">{value.toFixed(2)}</span>
    </div>
  );
}

export default function AdminAiLogs() {
  const { items, total, loading, page, totalPages, limit, goToPage } = usePaginated(
    adminAiLogsService.getLogs.bind(adminAiLogsService)
  );
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-5">
      {loading ? (
        <SkeletonTable rows={5} cols={8} />
      ) : (
        <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-muted">
              <tr>
                <th className="px-4 py-3 w-[40px]"></th>
                {['#', 'Ticket ID', 'Décision', 'Raison', 'Score richesse', 'Score similarité', 'Durée (ms)', 'Créé le'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-medium text-text-muted uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((log) => (
                <Fragment key={log.id}>
                  <tr 
                    onClick={() => toggleRow(log.id)}
                    className="border-t border-divider hover:bg-surface-muted h-[52px] transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-text-muted">
                      {expandedRows[log.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </td>
                    <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">{log.id}</td>
                    <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">#{log.ticket_id}</td>
                    <td className="px-4 py-3"><DecisionBadge decision={log.decision} /></td>
                    <td className="px-4 py-3 text-sm text-text-secondary max-w-[220px]">
                      <span className="line-clamp-1">{log.reason}</span>
                    </td>
                    <td className="px-4 py-3"><ScoreBar value={log.richesse_score} /></td>
                    <td className="px-4 py-3"><ScoreBar value={log.similarite_score} /></td>
                    <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">{log.duration_ms}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">{formatDate(log.created_at)}</td>
                  </tr>
                  {expandedRows[log.id] && (
                    <tr className="bg-surface-muted/50 border-t border-divider">
                      <td colSpan={9} className="px-12 py-4">
                        <div className="text-sm text-text-secondary">
                          <strong className="block text-text-primary mb-1">Raison complète :</strong>
                          <p className="whitespace-pre-wrap">{log.reason}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-text-muted">
                    Aucun log IA disponible.
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
    </div>
  );
}
