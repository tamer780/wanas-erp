import { Loader2 } from "lucide-react";
import UnitSaleRow from "./UnitSaleRow";

const COLUMNS = [
  "Contract",
  "Unit",
  "Client",
  "Type",
  "Total",
  "Paid",
  "Status",
  "Date",
];

const UnitSaleTable = ({
  sales,
  onView,
  animateEntrance = false,
  refreshing = false,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      {refreshing ? (
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary shadow-card">
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            Updating…
          </span>
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface-soft/80">
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <UnitSaleRow
                key={sale.id}
                sale={sale}
                onView={onView}
                index={index}
                animateEntrance={animateEntrance}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnitSaleTable;
