import { Button } from './Button';

export function Pagination({ page, totalPages, total, limit, onPageChange, loading }) {
  const start = page * limit + 1;
  const end = Math.min((page + 1) * limit, total);

  return (
    <div className="flex items-center justify-between px-1 py-3">
      <Button
        variant="secondary"
        size="sm"
        disabled={page >= totalPages - 1 || loading}
        onClick={() => onPageChange(page + 1)}
      >
        ← Précédent
      </Button>

      <p className="text-sm text-text-muted">
        Page <span className="text-text-secondary font-medium">{page + 1}</span>
        {totalPages > 0 && (
          <> — <span className="text-text-secondary font-medium">{start} à {end}</span> sur <span className="text-text-secondary font-medium">{total}</span> résultats</>
        )}
      </p>

      <Button
        variant="secondary"
        size="sm"
        disabled={page === 0 || loading}
        onClick={() => onPageChange(page - 1)}
      >
        Suivant →
      </Button>
    </div>
  );
}

