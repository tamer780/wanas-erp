import { formatMoney } from "../../utils/format";

const CostItem = ({ label, value, emphasize = false }) => (
  <div
    className={`rounded-xl border border-border px-4 py-3 ${
      emphasize ? "bg-wanas-50/60" : "bg-surface-soft/50"
    }`}
  >
    <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
      {label}
    </p>
    <p
      className={`mt-1 text-base font-semibold ${
        emphasize ? "text-wanas-800" : "text-text-primary"
      }`}
    >
      {formatMoney(value)}
    </p>
  </div>
);

const UnitCostsCard = ({ costs, loading = false, error = "" }) => {
  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-xl border border-border bg-surface-muted"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-warning-100 bg-warning-50 px-4 py-3 text-sm text-warning-700"
      >
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <CostItem label="Base Cost" value={costs?.base_cost} />
      <CostItem label="Sale Price" value={costs?.sale_price} />
      <CostItem label="Total" value={costs?.total} emphasize />
    </div>
  );
};

export default UnitCostsCard;
