const StatusBadge = ({ isActive }) => {
  const active = Boolean(isActive);
  const styles = active
    ? "bg-success-100 text-success-700"
    : "bg-surface-muted text-text-secondary";

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
};

export default StatusBadge;
