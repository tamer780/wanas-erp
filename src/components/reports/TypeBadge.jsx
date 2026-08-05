const TYPE_STYLES = {
  income: "bg-success-100 text-success-700",
  expense: "bg-danger-100 text-danger-700",
};

const TYPE_LABELS = {
  income: "Income",
  expense: "Expense",
};

const TypeBadge = ({ type }) => {
  const key = String(type || "").toLowerCase();
  const styles = TYPE_STYLES[key] || "bg-surface-muted text-text-secondary";
  const label = TYPE_LABELS[key] || type || "Unknown";

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      {label}
    </span>
  );
};

export default TypeBadge;
