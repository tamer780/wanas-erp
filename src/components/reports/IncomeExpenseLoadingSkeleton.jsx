const IncomeExpenseLoadingSkeleton = () => {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl border border-border bg-surface"
          >
            <div className="m-4 h-3 w-24 rounded bg-surface-muted" />
            <div className="mx-4 mt-4 h-6 w-32 rounded bg-surface-muted" />
          </div>
        ))}
      </div>

      <div className="h-36 animate-pulse rounded-2xl border border-border bg-surface" />

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="h-12 border-b border-border bg-surface-soft" />
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-border px-4 py-4 last:border-b-0"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-surface-muted" />
            <div className="h-4 w-16 animate-pulse rounded bg-surface-muted" />
            <div className="h-4 w-28 animate-pulse rounded bg-surface-muted" />
            <div className="h-4 flex-1 animate-pulse rounded bg-surface-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-surface-muted" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomeExpenseLoadingSkeleton;
