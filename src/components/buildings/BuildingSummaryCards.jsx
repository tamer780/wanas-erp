import { motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  Layers,
  MapPinned,
  PlayCircle,
  Ruler,
  SquareStack,
  Wallet,
} from "lucide-react";
import { formatArea, formatMoney, formatNumber } from "../../utils/format";
import { cardEntrance } from "../../utils/listMotion";

const cards = [
  {
    key: "totalBuildings",
    label: "Total Buildings",
    icon: Building2,
    format: (v) => formatNumber(v),
  },
  {
    key: "totalUnits",
    label: "Total Units",
    icon: SquareStack,
    format: (v) => formatNumber(v),
  },
  {
    key: "totalFloors",
    label: "Total Floors",
    icon: Layers,
    format: (v) => formatNumber(v),
  },
  {
    key: "totalArea",
    label: "Total Area",
    icon: MapPinned,
    format: (v) => formatArea(v),
  },
  {
    key: "totalConstructionCost",
    label: "Total Construction Cost",
    icon: Wallet,
    format: (v) => formatMoney(v),
  },
  {
    key: "averageFloors",
    label: "Average Floors",
    icon: Ruler,
    format: (v) => formatNumber(v),
  },
  {
    key: "planningBuildings",
    label: "Planning Buildings",
    icon: Layers,
    format: (v) => formatNumber(v),
  },
  {
    key: "activeBuildings",
    label: "Active Buildings",
    icon: PlayCircle,
    format: (v) => formatNumber(v),
  },
  {
    key: "completedBuildings",
    label: "Completed Buildings",
    icon: CheckCircle2,
    format: (v) => formatNumber(v),
  },
];

const BuildingSummaryCards = ({ summary, animateEntrance = false }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

export default BuildingSummaryCards;
