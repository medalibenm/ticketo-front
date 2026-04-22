export function SkeletonRow({ cols = 6 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="skeleton h-4 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white border border-border rounded-card p-6 shadow-card ${className}`}>
      <div className="skeleton h-3 w-1/3 rounded mb-3" />
      <div className="skeleton h-8 w-1/2 rounded mb-2" />
      <div className="skeleton h-3 w-2/3 rounded" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 6 }) {
  return (
    <div className="bg-white border border-border rounded-card overflow-hidden shadow-card">
      {/* Header skeleton */}
      <div className="bg-surface-muted px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="skeleton h-3 rounded flex-1" />
        ))}
      </div>
      {/* Rows */}
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

