import { motion, useReducedMotion } from "framer-motion";
import {
  Banknote,
  CircleCheck,
  CircleDashed,
  Handshake,
  Wallet,
} from "lucide-react";
import { formatMoney, formatNumber } from "../../utils/format";
import { cardEntrance } from "../../utils/listMotion";

const cards = [
  {
    key: "totalSales",
    label: "Total Sales",
    icon: Handshake,
    format: (v) => formatNumber(v),
  },
  {
    key: "totalPrice",
    label: "Total Price",
    icon: Wallet,
    format: (v) => formatMoney(v),
  },
  {
    key: "paidAmount",
    label: "Paid Amount",
    icon: Banknote,
    format: (v) => formatMoney(v),
  },
  {
    key: "remainingAmount",
    label: "Remaining",
    icon: CircleDashed,
    format: (v) => formatMoney(v),
  },
  {
    key: "activeSales",
    label: "Active",
    icon: CircleCheck,
    format: (v) => formatNumber(v),
  },
];

const UnitSaleSummaryCards = ({ summary, animateEntrance = false }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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

export default UnitSaleSummaryCards;
