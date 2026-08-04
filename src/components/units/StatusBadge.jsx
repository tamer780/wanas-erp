const STATUS_STYLES = {
  available: "bg-success-100 text-success-700",
  reserved: "bg-info-100 text-info-700",
  sold: "bg-[#f3e8ff] text-[#6b21a8]",
};

const STATUS_LABELS = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
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
