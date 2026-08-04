import { motion, useReducedMotion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import {
  formatArea,
  formatDate,
  formatMoney,
  translationText,
} from "../../utils/format";
import { rowEntrance } from "../../utils/listMotion";

const LandRow = ({ land, onView, index = 0, animateEntrance = false }) => {
  const reduceMotion = useReducedMotion();
  const buildingsCount = land.buildings?.length ?? 0;
  const costsCount = land.costs?.length ?? 0;
  const motionProps = rowEntrance(index, animateEntrance, reduceMotion);

  const handleActivate = () => {
    onView?.(land);
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
      aria-label={`View details for ${land.code || "land"}`}
    >
      <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-text-primary">
        {land.code || "—"}
      </td>
      <td className="min-w-[160px] px-4 py-3.5 text-sm text-text-primary">
        {translationText(land.name, "ar")}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {land.city || "—"}
      </td>
      <td className="min-w-[160px] max-w-[220px] truncate px-4 py-3.5 text-sm text-text-secondary">
        {land.location || "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatArea(land.area_sqm)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-text-primary">
        {formatMoney(land.purchase_price)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {buildingsCount}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {costsCount}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <StatusBadge status={land.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatDate(land.purchase_date)}
      </td>
    </motion.tr>
  );
};

export default LandRow;
