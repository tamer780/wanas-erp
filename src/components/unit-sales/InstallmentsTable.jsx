import Button from "../ui/Button";
import InstallmentStatusBadge from "./InstallmentStatusBadge";
import { formatDate, formatMoney } from "../../utils/format";

const InstallmentsTable = ({ installments = [], onPay }) => {
  if (!installments.length) {
    return (
      <p className="rounded-xl border border-border bg-surface-soft/50 px-4 py-6 text-center text-sm text-text-muted">
        No installments for this sale.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="max-h-[28rem] overflow-auto">
        <table className="min-w-full border-collapse text-left">
          <thead className="sticky top-0 z-[1] bg-surface-soft/95 backdrop-blur">
            <tr className="border-b border-border">
              {["#", "Due Date", "Amount", "Paid", "Status", ""].map((col) => (
                <th
                  key={col || "actions"}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {installments.map((item) => {
              const unpaid =
                String(item.status).toLowerCase() !== "paid" &&
                Number(item.paid_amount || 0) < Number(item.amount || 0);

              return (
                <tr
                  key={item.id}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-text-primary">
                    {item.sequence}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                    {formatDate(item.due_date)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                    {formatMoney(item.amount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                    {formatMoney(item.paid_amount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <InstallmentStatusBadge status={item.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {unpaid ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onPay?.(item)}
                      >
                        Pay
                      </Button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstallmentsTable;
