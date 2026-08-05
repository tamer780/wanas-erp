import { formatDate, formatMoney } from "../../utils/format";

const PaymentsTable = ({ payments = [] }) => {
  if (!payments.length) {
    return (
      <p className="rounded-xl border border-border bg-surface-soft/50 px-4 py-6 text-center text-sm text-text-muted">
        No payments recorded yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface-soft/80">
              {[
                "Type",
                "Amount",
                "Method",
                "Receipt",
                "Paid At",
                "Notes",
              ].map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-text-primary">
                  {String(payment.payment_type || "—").replaceAll("_", " ")}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                  {formatMoney(payment.amount)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                  {payment.payment_method || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                  {payment.receipt_number || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                  {formatDate(payment.paid_at)}
                </td>
                <td className="min-w-[160px] max-w-[240px] truncate px-4 py-3 text-sm text-text-secondary">
                  {payment.notes || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsTable;
