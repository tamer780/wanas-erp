import { motion, useReducedMotion } from "framer-motion";
import { Ban } from "lucide-react";
import TypeBadge from "../reports/TypeBadge";
import Button from "../ui/Button";
import { formatDate, formatMoney } from "../../utils/format";
import { categoryLabel } from "../../utils/reportConstants";
import { rowEntrance } from "../../utils/listMotion";

const idOrDash = (value) => (value == null || value === "" ? "—" : `#${value}`);

const FinancialTransactionRow = ({
  transaction,
  onVoid,
  index = 0,
  animateEntrance = false,
}) => {
  const reduceMotion = useReducedMotion();
  const motionProps = rowEntrance(index, animateEntrance, reduceMotion);
  const isIncome = String(transaction.type || "").toLowerCase() === "income";
  const canVoid = !transaction.is_reversal;

  const stopRow = (event) => {
    event.stopPropagation();
  };

  return (
    <motion.tr
      {...motionProps}
      className="border-b border-border last:border-b-0 transition-colors hover:bg-surface-soft/70"
    >
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatDate(transaction.occurred_at)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <TypeBadge type={transaction.type} />
          {transaction.is_reversal ? (
            <span className="inline-flex items-center rounded-lg bg-surface-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
              Reversal
            </span>
          ) : null}
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {categoryLabel(transaction.category)}
      </td>
      <td className="min-w-[180px] max-w-[280px] truncate px-4 py-3.5 text-sm text-text-primary">
        {transaction.description || "—"}
      </td>
      <td
        className={`whitespace-nowrap px-4 py-3.5 text-sm font-medium ${
          isIncome ? "text-success-700" : "text-danger-700"
        }`}
      >
        {formatMoney(transaction.amount)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {transaction.currency || "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {idOrDash(transaction.land_id)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {idOrDash(transaction.building_id)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {idOrDash(transaction.unit_id)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5" onClick={stopRow}>
        {canVoid ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={`Void transaction #${transaction.id}`}
            onClick={() => onVoid?.(transaction)}
          >
            <Ban className="size-4 text-danger-600" aria-hidden="true" />
            Void
          </Button>
        ) : (
          <span className="text-xs text-text-muted">—</span>
        )}
      </td>
    </motion.tr>
  );
};

export default FinancialTransactionRow;
