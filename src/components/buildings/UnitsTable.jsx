import StatusBadge from "./StatusBadge";
import {
  formatArea,
  formatMoney,
  translationText,
} from "../../utils/format";

const UnitsTable = ({ units = [] }) => {
  if (!units.length) {
    return <p className="text-sm text-text-secondary">No Units Found</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-soft text-xs uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-3 py-2 font-semibold">Code</th>
              <th className="px-3 py-2 font-semibold">English Name</th>
              <th className="px-3 py-2 font-semibold">Arabic Name</th>
              <th className="px-3 py-2 font-semibold">Type</th>
              <th className="px-3 py-2 font-semibold">Floor</th>
              <th className="px-3 py-2 font-semibold">Area</th>
              <th className="px-3 py-2 font-semibold">Base Cost</th>
              <th className="px-3 py-2 font-semibold">Sale Price</th>
              <th className="px-3 py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => (
              <tr key={unit.id} className="border-t border-border">
                <td className="px-3 py-2.5">{unit.code || "—"}</td>
                <td className="px-3 py-2.5">
                  {translationText(unit.name, "en")}
                </td>
                <td className="px-3 py-2.5" dir="rtl">
                  {translationText(unit.name, "ar")}
                </td>
                <td className="px-3 py-2.5 capitalize">
                  {unit.unit_type || "—"}
                </td>
                <td className="px-3 py-2.5">{unit.floor ?? "—"}</td>
                <td className="px-3 py-2.5">{formatArea(unit.area_sqm)}</td>
                <td className="px-3 py-2.5">{formatMoney(unit.base_cost)}</td>
                <td className="px-3 py-2.5">{formatMoney(unit.sale_price)}</td>
                <td className="px-3 py-2.5">
                  <StatusBadge status={unit.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnitsTable;
