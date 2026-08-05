import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import {
  emptyPaymentForm,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  paymentFormToPayload,
  validatePaymentForm,
} from "../../utils/unitSaleValidation";
import { formatDate, formatMoney } from "../../utils/format";

const RecordPaymentModal = ({
  open,
  saleId,
  installments = [],
  initialValues = null,
  submitting = false,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState(emptyPaymentForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!open) return;
    setValues({
      ...emptyPaymentForm(),
      ...(initialValues || {}),
    });
    setErrors({});
    setSubmitError("");
  }, [open, initialValues]);

  const updateField = (field) => (event) => {
    const value = event.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const unpaidInstallments = installments.filter(
    (item) =>
      String(item.status).toLowerCase() !== "paid" ||
      Number(item.paid_amount || 0) < Number(item.amount || 0),
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    const nextErrors = validatePaymentForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await onSubmit?.(paymentFormToPayload(values), saleId);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to record payment.",
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      preventClose={submitting}
      size="md"
      title="Record Payment"
      description="Add a down payment or installment payment for this sale."
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
            type="submit"
            form="record-payment-form"
            size="md"
            loading={submitting}
          >
            Save Payment
          </Button>
        </>
      }
    >
      <form
        id="record-payment-form"
        className="space-y-4"
        onSubmit={handleSubmit}
        noValidate
      >
        {submitError ? (
          <div
            role="alert"
            className="rounded-xl border border-danger-100 bg-danger-50 px-4 py-3 text-sm text-danger-700"
          >
            {submitError}
          </div>
        ) : null}

        <Select
          id="payment-type"
          label="Payment Type"
          size="sm"
          value={values.payment_type}
          onChange={updateField("payment_type")}
          error={errors.payment_type}
          disabled={submitting}
        >
          {PAYMENT_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        {values.payment_type === "installment" ? (
          <Select
            id="payment-installment"
            label="Installment"
            size="sm"
            value={values.installment_id}
            onChange={updateField("installment_id")}
            error={errors.installment_id}
            disabled={submitting}
          >
            <option value="">Select installment</option>
            {unpaidInstallments.map((item) => (
              <option key={item.id} value={String(item.id)}>
                #{item.sequence} · {formatDate(item.due_date)} ·{" "}
                {formatMoney(item.amount)}
              </option>
            ))}
          </Select>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="payment-amount"
            label="Amount"
            type="number"
            min="0"
            step="0.01"
            value={values.amount}
            onChange={updateField("amount")}
            error={errors.amount}
            disabled={submitting}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="payment-paid-at"
            label="Paid At"
            type="date"
            value={values.paid_at}
            onChange={updateField("paid_at")}
            error={errors.paid_at}
            disabled={submitting}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Select
            id="payment-method"
            label="Payment Method"
            size="sm"
            value={values.payment_method}
            onChange={updateField("payment_method")}
            error={errors.payment_method}
            disabled={submitting}
          >
            {PAYMENT_METHOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Input
            id="payment-receipt"
            label="Receipt Number"
            value={values.receipt_number}
            onChange={updateField("receipt_number")}
            error={errors.receipt_number}
            disabled={submitting}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
        </div>

        <Textarea
          id="payment-notes"
          label="Notes"
          value={values.notes}
          onChange={updateField("notes")}
          error={errors.notes}
          disabled={submitting}
          rows={3}
        />
      </form>
    </Modal>
  );
};

export default RecordPaymentModal;
