import { motion, useReducedMotion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import {
  formatArea,
  formatDate,
  formatMoney,
  translationText,
} from "../../utils/format";
import { rowEntrance } from "../../utils/listMotion";

const BuildingRow = ({
  building,
  onView,
  index = 0,
  animateEntrance = false,
}) => {
  const reduceMotion = useReducedMotion();
  const unitsCount = building.units?.length ?? 0;
  const land = building.land;
  const motionProps = rowEntrance(index, animateEntrance, reduceMotion);

  const handleActivate = () => {
    onView?.(building);
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
      aria-label={`View details for ${building.code || "building"}`}
    >
      <td className="min-w-[180px] px-4 py-3.5">
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-text-primary">
            {translationText(building.name, "en")}
          </p>
          <p className="text-xs text-text-secondary" dir="rtl">
            {translationText(building.name, "ar")}
          </p>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-text-primary">
        {building.code || "—"}
      </td>
      <td className="min-w-[160px] px-4 py-3.5">
        <div className="space-y-0.5">
          <p className="text-sm text-text-primary">
            {translationText(land?.name, "en")}
          </p>
          <p className="text-xs text-text-secondary" dir="rtl">
            {translationText(land?.name, "ar")}
          </p>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {land?.city || "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {building.floors ?? "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatArea(building.area_sqm)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm font-medium text-text-primary">
        {formatMoney(building.construction_cost)}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {unitsCount}
      </td>
      <td className="whitespace-nowrap px-4 py-3.5">
        <StatusBadge status={building.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-text-secondary">
        {formatDate(building.completion_date)}
      </td>
    </motion.tr>
  );
};

export default BuildingRow;
