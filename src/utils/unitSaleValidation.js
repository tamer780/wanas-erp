export const SALE_TYPE_OPTIONS = [
  { value: "installment", label: "Installment" },
  { value: "cash", label: "Cash" },
];

export const SALE_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const PAYMENT_TYPE_OPTIONS = [
  { value: "down_payment", label: "Down Payment" },
  { value: "installment", label: "Installment" },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: "Bank Transfer", label: "Bank Transfer" },
  { value: "Cash", label: "Cash" },
  { value: "Cheque", label: "Cheque" },
  { value: "Card", label: "Card" },
];

const localeValueToString = (value) => {
  if (value == null) return "";
  if (Array.isArray(value)) return value.filter(Boolean).join("\n");
  if (typeof value === "string") return value;
  return String(value);
};

/** Normalize API notes (string or string[]) into display/form strings. */
export const notesToForm = (notes) => ({
  notes_en: localeValueToString(notes?.en),
  notes_ar: localeValueToString(notes?.ar),
});

export const normalizeNotesText = (notes, locale = "en") => {
  if (!notes) return "—";
  if (typeof notes === "string") return notes || "—";
  const primary = localeValueToString(notes[locale]);
  if (primary) return primary;
  const fallback = localeValueToString(notes.en) || localeValueToString(notes.ar);
  return fallback || "—";
};

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

export const emptyUnitSaleForm = () => ({
  unit_id: "",
  client_id: "",
  sale_type: "installment",
  total_price: "",
  down_payment: "",
  contract_number: "",
  contract_date: "",
  contract_pdf: null,
  notes_en: "",
  notes_ar: "",
  status: "draft",
  months: "",
  monthly_amount: "",
  installment_start_date: "",
  record_down_payment: false,
  down_payment_method: "Bank Transfer",
  down_payment_receipt: "",
});

export const unitSaleToFormValues = (sale) => {
  if (!sale) return emptyUnitSaleForm();

  const notes = notesToForm(sale.notes);
  const plan = sale.installment_plan;

  return {
    unit_id:
      sale.unit_id != null
        ? String(sale.unit_id)
        : sale.unit?.id != null
          ? String(sale.unit.id)
          : "",
    client_id:
      sale.client_id != null
        ? String(sale.client_id)
        : sale.client?.id != null
          ? String(sale.client.id)
          : "",
    sale_type: sale.sale_type || "installment",
    total_price: sale.total_price != null ? String(sale.total_price) : "",
    down_payment: sale.down_payment != null ? String(sale.down_payment) : "",
    contract_number: sale.contract_number ?? "",
    contract_date: toDateInput(sale.contract_date),
    contract_pdf: null,
    notes_en: notes.notes_en,
    notes_ar: notes.notes_ar,
    status: sale.status || "draft",
    months: plan?.months != null ? String(plan.months) : "",
    monthly_amount:
      plan?.monthly_amount != null ? String(plan.monthly_amount) : "",
    installment_start_date: toDateInput(plan?.start_date),
    record_down_payment: false,
    down_payment_method: "Bank Transfer",
    down_payment_receipt: "",
  };
};

const isNonNegativeNumber = (value) => {
  if (value === "" || value === null || value === undefined) return false;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0;
};

const isPositiveNumber = (value) => {
  if (value === "" || value === null || value === undefined) return false;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0;
};

export const validateUnitSaleForm = (values, { mode = "create" } = {}) => {
  const errors = {};

  if (!values.unit_id) errors.unit_id = "Unit is required.";
  if (!values.client_id) errors.client_id = "Client is required.";
  if (!values.sale_type) errors.sale_type = "Sale type is required.";
  if (!values.status) errors.status = "Status is required.";

  if (!isPositiveNumber(values.total_price)) {
    errors.total_price = "Total price must be greater than 0.";
  }

  if (!isNonNegativeNumber(values.down_payment)) {
    errors.down_payment = "Down payment must be 0 or greater.";
  }

  if (!values.contract_number?.trim()) {
    errors.contract_number = "Contract number is required.";
  }

  if (!values.contract_date) {
    errors.contract_date = "Contract date is required.";
  }

  if (values.sale_type === "installment" && mode === "create") {
    if (!isPositiveNumber(values.months)) {
      errors.months = "Months must be greater than 0.";
    }
    if (!isPositiveNumber(values.monthly_amount)) {
      errors.monthly_amount = "Monthly amount must be greater than 0.";
    }
    if (!values.installment_start_date) {
      errors.installment_start_date = "Installment start date is required.";
    }
  }

  if (mode === "create" && values.record_down_payment) {
    if (!values.down_payment_method?.trim()) {
      errors.down_payment_method = "Payment method is required.";
    }
    if (!values.down_payment_receipt?.trim()) {
      errors.down_payment_receipt = "Receipt number is required.";
    }
  }

  return errors;
};

const buildCorePayload = (values) => ({
  unit_id: Number(values.unit_id),
  client_id: Number(values.client_id),
  sale_type: values.sale_type,
  total_price: Number(values.total_price),
  down_payment: Number(values.down_payment),
  contract_number: values.contract_number.trim(),
  contract_date: values.contract_date,
  notes: {
    en: values.notes_en.trim(),
    ar: values.notes_ar.trim(),
  },
  status: values.status,
});

export const formValuesToPayload = (values, { mode = "create" } = {}) => {
  const payload = buildCorePayload(values);

  if (mode === "create" && values.sale_type === "installment") {
    payload.months = Number(values.months);
    payload.monthly_amount = Number(values.monthly_amount);
    payload.installment_start_date = values.installment_start_date;
  }

  if (mode === "create") {
    payload.record_down_payment = Boolean(values.record_down_payment);
    if (values.record_down_payment) {
      payload.down_payment_method = values.down_payment_method.trim();
      payload.down_payment_receipt = values.down_payment_receipt.trim();
    }
  }

  return payload;
};

const appendNotes = (formData, notes) => {
  formData.append("notes[en]", notes.en);
  formData.append("notes[ar]", notes.ar);
};

export const formValuesToFormData = (values, { mode = "create" } = {}) => {
  const payload = formValuesToPayload(values, { mode });
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (key === "notes") {
      appendNotes(formData, value);
      return;
    }
    if (typeof value === "boolean") {
      formData.append(key, value ? "1" : "0");
      return;
    }
    if (value == null) return;
    formData.append(key, String(value));
  });

  if (values.contract_pdf instanceof File) {
    formData.append("contract_pdf", values.contract_pdf);
  }

  return formData;
};

export const shouldUseFormData = (values) =>
  values.contract_pdf instanceof File;

export const emptyPaymentForm = () => ({
  payment_type: "down_payment",
  amount: "",
  installment_id: "",
  payment_method: "Bank Transfer",
  receipt_number: "",
  paid_at: toDateInput(new Date().toISOString()),
  notes: "",
});

export const validatePaymentForm = (values) => {
  const errors = {};

  if (!values.payment_type) {
    errors.payment_type = "Payment type is required.";
  }

  if (!isPositiveNumber(values.amount)) {
    errors.amount = "Amount must be greater than 0.";
  }

  if (values.payment_type === "installment" && !values.installment_id) {
    errors.installment_id = "Installment is required.";
  }

  if (!values.payment_method?.trim()) {
    errors.payment_method = "Payment method is required.";
  }

  if (!values.receipt_number?.trim()) {
    errors.receipt_number = "Receipt number is required.";
  }

  if (!values.paid_at) {
    errors.paid_at = "Paid date is required.";
  }

  return errors;
};

export const paymentFormToPayload = (values) => {
  const payload = {
    payment_type: values.payment_type,
    amount: Number(values.amount),
    payment_method: values.payment_method.trim(),
    receipt_number: values.receipt_number.trim(),
    paid_at: values.paid_at,
    notes: values.notes.trim() || null,
  };

  if (values.payment_type === "installment") {
    payload.installment_id = Number(values.installment_id);
  } else {
    payload.installment_id = 0;
  }

  return payload;
};
