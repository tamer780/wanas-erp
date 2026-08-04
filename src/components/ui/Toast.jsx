import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
};

const toneClasses = {
  success: "border-emerald-200 bg-white text-emerald-800",
  error: "border-danger-100 bg-white text-danger-700",
};

const iconClasses = {
  success: "text-emerald-600",
  error: "text-danger-600",
};

const ToastItem = ({ toast, onDismiss }) => {
  const reduceMotion = useReducedMotion();
  const Icon = icons[toast.type] ?? CheckCircle2;

  return (
    <motion.div
      layout
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.2, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
      className={`
        pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-dropdown
        ${toneClasses[toast.type] ?? toneClasses.success}
      `.trim()}
    >
      <Icon
        className={`mt-0.5 size-5 shrink-0 ${iconClasses[toast.type] ?? iconClasses.success}`}
        aria-hidden="true"
      />
      <p className="min-w-0 flex-1 text-sm font-medium text-text-primary">
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-soft hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600"
        aria-label="Dismiss notification"
      >
        <X className="size-4" />
      </button>
    </motion.div>
  );
};

const ToastViewport = ({ toasts, onDismiss }) => {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastViewport;
