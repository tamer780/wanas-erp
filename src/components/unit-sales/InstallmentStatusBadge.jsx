const INSTALLMENT_STATUS_STYLES = {
  pending: "bg-warning-100 text-warning-700",
  paid: "bg-success-100 text-success-700",
  overdue: "bg-danger-100 text-danger-700",
};

const INSTALLMENT_STATUS_LABELS = {
  pending: "Pending",
  paid: "Paid",
  overdue: "Overdue",
};

const InstallmentStatusBadge = ({ status }) => {
  const key = String(status || "").toLowerCase();
  const styles =
    INSTALLMENT_STATUS_STYLES[key] || "bg-surface-muted text-text-secondary";
  const label = INSTALLMENT_STATUS_LABELS[key] || status || "Unknown";

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold capitalize ${styles}`}
    >
      {label}
    </span>
  );
};

export default InstallmentStatusBadge;
