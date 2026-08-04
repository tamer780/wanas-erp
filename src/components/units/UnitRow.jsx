import { motion, useReducedMotion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import {
  formatArea,
  formatDate,
  formatMoney,
  translationText,
} from "../../utils/format";
import { rowEntrance } from "../../utils/listMotion";

const UnitRow = ({ unit, onView, index = 0, animateEntrance = false }) => {
  const reduceMotion = useReducedMotion();
  const building = unit.building;
  const motionProps = rowEntrance(index, animateEntrance, reduceMotion);

  const handleActivate = () => {
    onView?.(unit);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleActivate();
    }
  };

  const buildingLabel =
    translationText(building?.name, "en") !== "—"
      ? translationText(building?.name, "en")
      : building?.code || (unit.building_id ? `Building #${unit.building_id}` : "—");

  return (
    <motion.tr
      {...motionProps}
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      className="cursor-pointer border-b border-border last:border-b-0 transition-colors hover:bg-surface-soft/70 focus-visible:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-wanas-600"
      aria-label={`View details for ${unit.code || "unit"}`}
    >
      <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-text-primary">
        {unit.code || "—"}
      </td>
      <td
        className="min-w-[140px] px-4 py-3.5 text-sm text-text-primary"
        dir="rtl"
      >
        {translationText(unit.name, "ar")}
      </td>
      <td className="min-w-[160px] px-4 py-3.5 text-sm text-text-secondary">
        {buildingLabel}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {unit.unit_type || "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {unit.floor ?? "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatArea(unit.area_sqm)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-text-primary">
        {formatMoney(unit.base_cost)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-text-primary">
        {formatMoney(unit.sale_price)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <StatusBadge status={unit.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatDate(unit.created_at)}
      </td>
    </motion.tr>
  );
};

export default UnitRow;
