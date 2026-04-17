import { useState } from 'react';
import { adminKbService } from '../../services/api';
import { usePaginated } from '../../hooks/useAsync';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { ChevronDown, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminKnowledgeBase() {
  const { items, total, loading, page, totalPages, limit, goToPage } = usePaginated(
    adminKbService.getEntries.bind(adminKbService)
  );
  const [expanded, setExpanded] = useState(null);

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="flex items-center gap-3 bg-primary-light border border-blue-200 rounded-card px-5 py-3">
        <span className="text-lg">🧠</span>
        <p className="text-sm font-medium text-primary">
          Ces entrées sont utilisées par le moteur IA pour la résolution automatique des tickets.
        </p>
      </div>

      {loading ? (
        <SkeletonTable rows={5} cols={5} />
      ) : (
        <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-muted">
              <tr>
                {['#', 'Ticket source', 'Description', 'Solution', 'Créé le'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-medium text-text-muted uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((entry) => (
                <>
                  <tr
                    key={entry.id}
                    className="border-t border-divider hover:bg-surface-muted transition-colors cursor-pointer h-[52px]"
                    onClick={() => toggle(entry.id)}
                  >
                    <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">{entry.id}</td>
                    <td className="px-4 py-3 font-mono text-[13px] text-text-secondary">#{entry.source_ticket_id}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary max-w-[220px]">
                      <span className="line-clamp-1">{entry.description.slice(0, 70)}…</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary max-w-[220px]">
                      <span className="line-clamp-1">{entry.solution.slice(0, 70)}…</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {formatDate(entry.created_at)}
                        <span className="text-text-muted">
                          {expanded === entry.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded row */}
                  {expanded === entry.id && (
                    <tr key={`exp-${entry.id}`} className="border-t border-divider bg-primary-light/40">
                      <td colSpan={5} className="px-8 py-5">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Description complète</p>
                            <p className="text-sm text-text-secondary leading-relaxed">{entry.description}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Solution</p>
                            <p className="text-sm text-text-secondary leading-relaxed font-mono whitespace-pre-wrap">{entry.solution}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-text-muted">
                    Aucune entrée dans la base de connaissances.
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
