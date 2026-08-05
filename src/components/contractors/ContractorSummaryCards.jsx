import { motion, useReducedMotion } from "framer-motion";
import { HardHat, UserCheck, UserX } from "lucide-react";
import { formatNumber } from "../../utils/format";
import { cardEntrance } from "../../utils/listMotion";

const cards = [
  {
    key: "totalContractors",
    label: "Total Contractors",
    icon: HardHat,
  },
  {
    key: "activeContractors",
    label: "Active",
    icon: UserCheck,
  },
  {
    key: "inactiveContractors",
    label: "Inactive",
    icon: UserX,
  },
];

const ContractorSummaryCards = ({ summary, animateEntrance = false }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map(({ key, label, icon: Icon }, index) => {
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
                  {formatNumber(summary?.[key] ?? 0)}
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

export default ContractorSummaryCards;
