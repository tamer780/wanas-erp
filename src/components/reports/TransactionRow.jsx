import { motion, useReducedMotion } from "framer-motion";
import TypeBadge from "./TypeBadge";
import { formatDate, formatMoney } from "../../utils/format";
import { categoryLabel } from "../../utils/reportConstants";
import { rowEntrance } from "../../utils/listMotion";

const idOrDash = (value) => (value == null || value === "" ? "—" : `#${value}`);

const TransactionRow = ({
  transaction,
  index = 0,
  animateEntrance = false,
}) => {
  const reduceMotion = useReducedMotion();
  const motionProps = rowEntrance(index, animateEntrance, reduceMotion);
  const isIncome = String(transaction.type || "").toLowerCase() === "income";

  return (
    <motion.tr
      {...motionProps}
      className="border-b border-border last:border-b-0 transition-colors hover:bg-surface-soft/70"
    >
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatDate(transaction.occurred_at)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <TypeBadge type={transaction.type} />
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
    </motion.tr>
  );
};

export default TransactionRow;
