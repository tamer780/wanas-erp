export const PAYABLE_TYPE_OPTIONS = [
  { value: "supplier", label: "Supplier" },
  { value: "contractor", label: "Contractor" },
];

export const REFERENCE_TYPE_OPTIONS = [
  { value: "material_purchase", label: "Material Purchase" },
  { value: "work_item", label: "Work Item" },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
  { value: "cheque", label: "Cheque" },
  { value: "card", label: "Card" },
];

const toDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const raw = String(value);
    return raw.length >= 10 ? raw.slice(0, 10) : raw;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const defaultReferenceType = (payableType) =>
  payableType === "contractor" ? "work_item" : "material_purchase";

export const emptyPayablePaymentForm = () => ({
  payable_type: "supplier",
  payable_id: "",
  reference_type: "material_purchase",
  reference_id: "",
  amount: "",
  payment_method: "bank_transfer",
  receipt_number: "",
  paid_at: toDateInput(new Date().toISOString()),
  notes: "",
  payment_schedule_id: "",
});

const isPositiveNumber = (value) => {
  if (value === "" || value === null || value === undefined) return false;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0;
};

export const validatePayablePaymentForm = (
  values,
  { scheduleIds = [] } = {},
) => {
  const errors = {};

  if (!values.payable_type) {
    errors.payable_type = "Payable type is required.";
  }

  if (!values.payable_id) {
    errors.payable_id = "Payable is required.";
  }

  if (!isPositiveNumber(values.amount)) {
    errors.amount = "Amount must be greater than 0.";
  }

  // reference_type is auto-defaulted for UX; only enforce pairing when a
  // concrete reference_id is chosen (payload omits reference unless both set).
  if (values.reference_id && !values.reference_type) {
    errors.reference_type =
      "Reference type is required when a reference is selected.";
  }

  if (values.payment_schedule_id) {
    const validIds = scheduleIds.map(String);
    if (!validIds.includes(String(values.payment_schedule_id))) {
      errors.payment_schedule_id = "Select a valid payment schedule.";
    }
  }

  return errors;
};

export const formValuesToPayload = (values) => {
  const payload = {
    payable_type: values.payable_type,
    payable_id: Number(values.payable_id),
    amount: Number(values.amount),
  };

  if (values.reference_type && values.reference_id) {
    payload.reference_type = values.reference_type;
    payload.reference_id = Number(values.reference_id);
  }

  if (values.payment_method?.trim()) {
    payload.payment_method = values.payment_method.trim();
  }

  if (values.receipt_number?.trim()) {
    payload.receipt_number = values.receipt_number.trim();
  }

  if (values.paid_at) {
    payload.paid_at = values.paid_at;
  }

  if (values.notes?.trim()) {
    payload.notes = values.notes.trim();
  }

  if (values.payment_schedule_id) {
    payload.payment_schedule_id = Number(values.payment_schedule_id);
  }

  return payload;
};
