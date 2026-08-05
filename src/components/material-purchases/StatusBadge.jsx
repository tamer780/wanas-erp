const STATUS_STYLES = {
  pending: "bg-warning-100 text-warning-700",
  approved: "bg-wanas-50 text-wanas-800",
  paid: "bg-success-100 text-success-700",
  cancelled: "bg-danger-100 text-danger-700",
};

const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  paid: "Paid",
  cancelled: "Cancelled",
};

const StatusBadge = ({ status }) => {
  const key = String(status || "").toLowerCase();
  const styles = STATUS_STYLES[key] || "bg-surface-muted text-text-secondary";
  const label = STATUS_LABELS[key] || status || "Unknown";

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
