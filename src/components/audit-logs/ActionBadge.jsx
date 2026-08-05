const ACTION_STYLES = {
  created: "bg-success-100 text-success-700",
  updated: "bg-wanas-50 text-wanas-800",
  deleted: "bg-danger-100 text-danger-700",
};

const ACTION_LABELS = {
  created: "Created",
  updated: "Updated",
  deleted: "Deleted",
};

const ActionBadge = ({ action }) => {
  const key = String(action || "").toLowerCase();
  const styles = ACTION_STYLES[key] || "bg-surface-muted text-text-secondary";
  const label = ACTION_LABELS[key] || action || "Unknown";

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold capitalize ${styles}`}
    >
      {label}
    </span>
  );
};

export default ActionBadge;
