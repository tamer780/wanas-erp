const STATUS_STYLES = {
  planning: "bg-info-100 text-info-700",
  active: "bg-success-100 text-success-700",
  completed: "bg-[#f3e8ff] text-[#6b21a8]",
  sold: "bg-danger-100 text-danger-700",
  archived: "bg-surface-muted text-text-secondary",
};

const STATUS_LABELS = {
  planning: "Planning",
  active: "Active",
  completed: "Completed",
  sold: "Sold",
  archived: "Archived",
};

const StatusBadge = ({ status }) => {
  const key = String(status || "").toLowerCase();
  const styles = STATUS_STYLES[key] || "bg-surface-soft text-text-secondary";
  const label = STATUS_LABELS[key] || status || "Unknown";

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold capitalize ${styles}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
