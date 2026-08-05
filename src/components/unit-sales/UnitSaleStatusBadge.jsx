const SALE_STATUS_STYLES = {
  draft: "bg-surface-muted text-text-secondary",
  active: "bg-success-100 text-success-700",
  completed: "bg-wanas-50 text-wanas-800",
  cancelled: "bg-danger-100 text-danger-700",
};

const SALE_STATUS_LABELS = {
  draft: "Draft",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

const UnitSaleStatusBadge = ({ status }) => {
  const key = String(status || "").toLowerCase();
  const styles = SALE_STATUS_STYLES[key] || "bg-surface-muted text-text-secondary";
  const label = SALE_STATUS_LABELS[key] || status || "Unknown";

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold capitalize ${styles}`}
    >
      {label}
    </span>
  );
};

export default UnitSaleStatusBadge;
