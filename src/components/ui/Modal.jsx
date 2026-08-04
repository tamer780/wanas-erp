import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

const EASE_OUT = [0.22, 1, 0.36, 1];
export const MODAL_EXIT_MS = 220;

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "lg",
  closeOnBackdrop = true,
  preventClose = false,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef(null);
  const openRef = useRef(open);
  openRef.current = open;
  const reduceMotion = useReducedMotion();

  const duration = reduceMotion ? 0.01 : 0.22;
  const backdropDuration = reduceMotion ? 0.01 : 0.18;

  const panelInitial = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 12, scale: 0.96 };

  const panelAnimate = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, scale: 1 };

  const panelExit = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 8, scale: 0.98 };

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !preventClose) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, preventClose]);

  const focusFirstElement = () => {
    const focusable = panelRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus?.();
  };

  const handleBackdropClick = () => {
    if (closeOnBackdrop && !preventClose) {
      onClose?.();
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: backdropDuration }}
        >
          <motion.button
            type="button"
            aria-label="Close dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: backdropDuration }}
            className="absolute inset-0 bg-wanas-dark/45 backdrop-blur-[2px]"
            onClick={handleBackdropClick}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            initial={panelInitial}
            animate={panelAnimate}
            exit={panelExit}
            transition={{ duration, ease: EASE_OUT }}
            onAnimationComplete={() => {
              if (openRef.current) {
                focusFirstElement();
              }
            }}
            className={`
              relative z-10 flex max-h-[min(90vh,880px)] w-full flex-col overflow-hidden
              rounded-2xl border border-border bg-surface shadow-dropdown
              ${sizeClasses[size] ?? sizeClasses.lg}
            `.trim()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div className="min-w-0 space-y-1">
                <h2
                  id={titleId}
                  className="text-lg font-semibold tracking-tight text-text-primary sm:text-xl"
                >
                  {title}
                </h2>
                {description ? (
                  <p
                    id={descriptionId}
                    className="text-sm text-text-secondary"
                  >
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!preventClose) onClose?.();
                }}
                disabled={preventClose}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-surface-soft hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wanas-600 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {children}
            </div>

            {footer ? (
              <div className="flex flex-col-reverse gap-2 border-t border-border bg-surface-soft/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Modal;
