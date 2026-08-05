import { motion, useReducedMotion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import { formatDate, translationText } from "../../utils/format";
import { rowEntrance } from "../../utils/listMotion";

const ContractorRow = ({
  contractor,
  onView,
  index = 0,
  animateEntrance = false,
}) => {
  const reduceMotion = useReducedMotion();
  const motionProps = rowEntrance(index, animateEntrance, reduceMotion);
  const displayName = translationText(contractor.name, "en");

  const handleActivate = () => {
    onView?.(contractor);
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
      aria-label={`View details for ${displayName}`}
    >
      <td className="min-w-[160px] px-4 py-3.5 text-sm font-medium text-text-primary">
        <div>{displayName}</div>
        <div className="mt-0.5 text-xs font-normal text-text-muted" dir="rtl">
          {translationText(contractor.name, "ar")}
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {contractor.email || "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {contractor.phone || "—"}
      </td>
      <td className="min-w-[160px] max-w-[220px] truncate px-4 py-3.5 text-sm text-text-secondary">
        {contractor.address || "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <StatusBadge isActive={contractor.is_active} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatDate(contractor.created_at)}
      </td>
    </motion.tr>
  );
};

export default ContractorRow;
