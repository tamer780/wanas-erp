import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";
import { formatMoney } from "../../utils/format";
import { categoryLabel } from "../../utils/reportConstants";

const VoidTransactionDialog = ({
  open,
  transaction,
  submitting = false,
  error = "",
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!open) return;
    setReason("");
    setLocalError("");
  }, [open, transaction?.id]);

  const handleConfirm = () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      setLocalError("Please enter a reason for voiding this transaction.");
      return;
    }
    setLocalError("");
    onConfirm?.(trimmed);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      preventClose={submitting}
      size="sm"
      title="Void Transaction"
      description="This creates a reversing transaction and cannot be undone."
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            loading={submitting}
            onClick={handleConfirm}
          >
            Void Transaction
          </Button>
        </>
      }
    >
      {transaction ? (
        <div className="mb-4 space-y-1 rounded-xl border border-border bg-surface-soft/60 px-4 py-3 text-sm">
          <p className="font-medium text-text-primary">
            #{transaction.id} · {categoryLabel(transaction.category)}
          </p>
          <p className="text-text-secondary">
            {formatMoney(transaction.amount)} {transaction.currency || ""}
            {transaction.description
              ? ` · ${transaction.description}`
              : ""}
          </p>
        </div>
      ) : null}

      <Textarea
        id="void-transaction-reason"
        label="Reason"
        rows={3}
        value={reason}
        disabled={submitting}
        placeholder="Why is this transaction being voided?"
        error={localError || undefined}
        onChange={(event) => {
          setReason(event.target.value);
          if (localError) setLocalError("");
        }}
      />

      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-danger-100 bg-danger-50 px-4 py-3 text-sm text-danger-700"
        >
          {error}
        </div>
      ) : null}
    </Modal>
  );
};

export default VoidTransactionDialog;
