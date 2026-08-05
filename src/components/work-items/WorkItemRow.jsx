import { motion, useReducedMotion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import {
  formatDate,
  formatMoney,
  translationText,
} from "../../utils/format";
import { rowEntrance } from "../../utils/listMotion";

const WorkItemRow = ({
  item,
  onView,
  index = 0,
  animateEntrance = false,
}) => {
  const reduceMotion = useReducedMotion();
  const motionProps = rowEntrance(index, animateEntrance, reduceMotion);

  const title = translationText(item.title, "en");
  const contractor =
    translationText(item.contractor?.name, "en") !== "—"
      ? translationText(item.contractor?.name, "en")
      : "—";
  const workable =
    translationText(item.workable?.name, "en") !== "—"
      ? translationText(item.workable?.name, "en")
      : item.workable?.code || "—";

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
        {contractor}
      </td>
      <td className="min-w-[140px] px-4 py-3.5 text-sm text-text-secondary">
        <div>{workable}</div>
        <div className="mt-0.5 text-xs capitalize text-text-muted">
          {item.workable_type || "—"}
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatMoney(item.agreed_amount)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatMoney(item.paid_amount)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <StatusBadge status={item.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatDate(item.start_date)}
      </td>
    </motion.tr>
  );
};

export default WorkItemRow;
