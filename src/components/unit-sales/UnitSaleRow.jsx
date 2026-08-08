import { motion, useReducedMotion } from "framer-motion";
import UnitSaleStatusBadge from "./UnitSaleStatusBadge";
import {
  formatDate,
  formatMoney,
  translationText,
} from "../../utils/format";
import { rowEntrance } from "../../utils/listMotion";

const UnitSaleRow = ({
  sale,
  onView,
  index = 0,
  animateEntrance = false,
}) => {
  const reduceMotion = useReducedMotion();
  const motionProps = rowEntrance(index, animateEntrance, reduceMotion);

  const unitLabel =
    translationText(sale.unit?.name, "en") !== "—"
      ? translationText(sale.unit?.name, "en")
      : sale.unit?.code || `Unit #${sale.unit_id}`;

  const clientLabel =
    translationText(sale.client?.name, "en") !== "—"
      ? translationText(sale.client?.name, "en")
      : `Client #${sale.client_id}`;

  const handleActivate = () => {
    onView?.(sale);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleActivate();
    }
  };

  return (
    <motion.tr
      {...motionProps}
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      className="cursor-pointer border-b border-border last:border-b-0 transition-colors hover:bg-surface-soft/70 focus-visible:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-wanas-600"
      aria-label={`View details for ${sale.contract_number || "unit sale"}`}
    >
      <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-text-primary">
        {sale.contract_number || "—"}
      </td>
      <td className="min-w-[140px] px-4 py-3.5 text-sm text-text-secondary">
        <div className="font-medium text-text-primary">{unitLabel}</div>
        {sale.unit?.code ? (
          <div className="mt-0.5 text-xs text-text-muted">{sale.unit.code}</div>
        ) : null}
      </td>
      <td className="min-w-[140px] px-4 py-3.5 text-sm text-text-secondary">
        {clientLabel}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm capitalize text-text-secondary">
        {sale.sale_type || "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatMoney(sale.total_price)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatMoney(sale.paid_amount)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <UnitSaleStatusBadge status={sale.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatDate(sale.contract_date)}
      </td>
    </motion.tr>
  );
};

export default UnitSaleRow;
