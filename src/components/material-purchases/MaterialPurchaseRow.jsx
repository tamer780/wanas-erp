import { motion, useReducedMotion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import {
  formatDate,
  formatMoney,
  translationText,
} from "../../utils/format";
import { rowEntrance } from "../../utils/listMotion";

const MaterialPurchaseRow = ({
  item,
  onView,
  index = 0,
  animateEntrance = false,
}) => {
  const reduceMotion = useReducedMotion();
  const motionProps = rowEntrance(index, animateEntrance, reduceMotion);

  const title = translationText(item.title, "en");
  const supplier =
    translationText(item.supplier?.name, "en") !== "—"
      ? translationText(item.supplier?.name, "en")
      : "—";
  const building =
    translationText(item.building?.name, "en") !== "—"
      ? translationText(item.building?.name, "en")
      : item.building?.code || "—";

  const handleActivate = () => {
    onView?.(item);
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
      aria-label={`View details for ${title}`}
    >
      <td className="min-w-[180px] px-4 py-3.5 text-sm font-medium text-text-primary">
        <div>{title}</div>
        <div className="mt-0.5 text-xs font-normal text-text-muted" dir="rtl">
          {translationText(item.title, "ar")}
        </div>
      </td>
      <td className="min-w-[140px] px-4 py-3.5 text-sm text-text-secondary">
        {supplier}
      </td>
      <td className="min-w-[140px] px-4 py-3.5 text-sm text-text-secondary">
        <div>{building}</div>
        {item.building?.code ? (
          <div className="mt-0.5 text-xs text-text-muted">{item.building.code}</div>
        ) : null}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {item.invoice_number || "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatMoney(item.total_amount)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatMoney(item.paid_amount)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <StatusBadge status={item.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatDate(item.purchase_date)}
      </td>
    </motion.tr>
  );
};

export default MaterialPurchaseRow;
