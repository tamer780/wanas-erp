import { motion, useReducedMotion } from "framer-motion";
import { Building2, Map, MapPinned, Receipt, Wallet } from "lucide-react";
import { formatArea, formatMoney, formatNumber } from "../../utils/format";
import { cardEntrance } from "../../utils/listMotion";

const cards = [
  {
    key: "totalLands",
    label: "Total Lands",
    icon: Map,
    format: (v) => formatNumber(v),
  },
  {
    key: "totalPurchasePrice",
    label: "Total Purchase Price",
    icon: Wallet,
    format: (v) => formatMoney(v),
  },
  {
    key: "totalArea",
    label: "Total Area",
    icon: MapPinned,
    format: (v) => formatArea(v),
  },
  {
    key: "totalBuildings",
    label: "Total Buildings",
    icon: Building2,
    format: (v) => formatNumber(v),
  },
  {
    key: "totalAdditionalCosts",
    label: "Total Additional Costs",
    icon: Receipt,
    format: (v) => formatMoney(v),
  },
];

const LandSummaryCards = ({ summary, animateEntrance = false }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(({ key, label, icon: Icon, format }, index) => {
        const motionProps = cardEntrance(index, animateEntrance, reduceMotion);

        return (
          <motion.div
            key={key}
            {...motionProps}
            className="rounded-2xl border border-border bg-surface p-4 shadow-card transition-shadow duration-200 hover:shadow-card-hover"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  {label}
                </p>
                <p className="mt-2 truncate text-lg font-semibold text-text-primary">
                  {format(summary?.[key] ?? 0)}
                </p>
              </div>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-wanas-50 text-wanas-700">
                <Icon className="size-5" aria-hidden="true" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LandSummaryCards;
