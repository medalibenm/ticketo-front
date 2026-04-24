import { useMemo, useState, Fragment } from 'react';
import { useAILogs } from '../../hooks/admin/useAILogs';
import { DecisionBadge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { Input } from '../../components/ui/Input';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';

function formatDate(d) {
  return new Date(d).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function pickDecision(analysisData) {
  if (!analysisData || typeof analysisData !== 'object') return '-';
  return analysisData.decision || analysisData.predicted_category || analysisData.recommended_team || '-';
}

function pickReason(analysisData) {
  if (!analysisData || typeof analysisData !== 'object') return '-';
  return analysisData.reason || analysisData.decision_reason || analysisData.explanation || '-';
}

function pickConfidence(analysisData) {
  if (!analysisData || typeof analysisData !== 'object') return null;
  return analysisData.confidence_score ?? analysisData.confidence ?? analysisData.score ?? null;
}

function ScoreBar({ value }) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return <span className="text-xs text-text-muted">-</span>;
  }

  const normalized = Math.max(0, Math.min(1, Number(value)));
  const pct = Math.min(100, normalized * 100);
  const color = normalized >= 0.7 ? '#2F855A' : normalized >= 0.4 ? '#B7791F' : '#C53030';

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden flex-shrink-0">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-text-secondary font-mono">{normalized.toFixed(2)}</span>
    </div>
  );
}

export default function AdminAiLogs() {
  const [page, setPage] = useState(0);
  const [q, setQ] = useState('');
  const limit = 10;
  const { data, isLoading: loading } = useAILogs({ skip: page * limit, limit });
  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const [expandedRows, setExpandedRows] = useState({});

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;

    return items.filter((log) => {
      const decision = String(pickDecision(log.analysis_data)).toLowerCase();
      const reason = String(pickReason(log.analysis_data)).toLowerCase();

      return (
        String(log.id).includes(query) ||
        String(log.ticket_id).includes(query) ||
        decision.includes(query) ||
        reason.includes(query)
      );
    });
  }, [items, q]);

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-5">
      {loading ? (
        <SkeletonTable rows={5} cols={8} />
      ) : (
        <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-divider flex items-center gap-2">
            <Search size={16} className="text-text-muted" />
            <Input
              placeholder="Search by ticket, decision, or reason..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <table className="w-full">
            <thead className="bg-surface-muted">
              <tr>
                <th className="px-4 py-3 w-[40px]"></th>
                {['#', 'Ticket ID', 'Decision', 'Reason', 'Confidence', 'Duration (ms)', 'Created At'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-medium text-text-muted uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
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
                    <td className="px-4 py-3"><DecisionBadge decision={pickDecision(log.analysis_data)} /></td>
                    <td className="px-4 py-3 text-sm text-text-secondary max-w-[220px]">
                      <span className="line-clamp-1">{pickReason(log.analysis_data)}</span>
                    </td>
                    <td className="px-4 py-3"><ScoreBar value={pickConfidence(log.analysis_data)} /></td>
                    <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">{log.duration_ms}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">{formatDate(log.created_at)}</td>
                  </tr>
                  {expandedRows[log.id] && (
                    <tr className="bg-surface-muted/50 border-t border-divider">
                      <td colSpan={8} className="px-12 py-4">
                        <div className="text-sm text-text-secondary">
                          <strong className="block text-text-primary mb-1">Full Analysis Data:</strong>
                          <pre className="whitespace-pre-wrap text-xs bg-surface-muted border border-divider rounded p-3 overflow-x-auto">
                            {JSON.stringify(log.analysis_data || {}, null, 2)}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-text-muted">
                    No AI logs found.
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
