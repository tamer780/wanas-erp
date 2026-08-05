import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, List } from "lucide-react";
import { formatMoney, formatNumber, toNumber } from "../../utils/format";
import { cardEntrance } from "../../utils/listMotion";

const cards = [
  {
    key: "total",
    label: "Transactions",
    icon: List,
    format: (value) => formatNumber(value),
    valueClass: "text-text-primary",
  },
  {
    key: "income",
    label: "Income",
    icon: ArrowDownLeft,
    format: (value) => formatMoney(value),
    valueClass: "text-success-700",
  },
  {
    key: "expense",
    label: "Expense",
    icon: ArrowUpRight,
    format: (value) => formatMoney(value),
    valueClass: "text-danger-700",
  },
];

const FinancialTransactionSummaryCards = ({
  summary,
  animateEntrance = false,
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map(({ key, label, icon: Icon, format, valueClass }, index) => {
        const motionProps = cardEntrance(index, animateEntrance, reduceMotion);
        const raw = toNumber(summary?.[key] ?? 0);

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
                <p
                  className={`mt-2 truncate text-lg font-semibold ${valueClass}`}
                >
                  {format(raw)}
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

export default FinancialTransactionSummaryCards;
