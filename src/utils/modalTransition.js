import { MODAL_EXIT_MS } from "../components/ui/Modal";

/**
 * Closes the current modal, waits for exit animation, then runs the next open action.
 */
export const transitionModals = (closeCurrent, openNext, delayMs = MODAL_EXIT_MS) => {
  closeCurrent();
  window.setTimeout(() => {
    openNext();
  }, delayMs);
};
