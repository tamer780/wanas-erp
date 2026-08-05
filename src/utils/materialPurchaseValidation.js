export const PURCHASE_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "paid", label: "Paid" },
  { value: "cancelled", label: "Cancelled" },
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

export const emptyMaterialPurchaseForm = () => ({
  supplier_id: "",
  land_id: "",
  building_id: "",
  title_en: "",
  title_ar: "",
  notes_en: "",
  notes_ar: "",
  invoice_number: "",
  total_amount: "",
  status: "pending",
  purchase_date: "",
});

export const materialPurchaseToFormValues = (item) => {
  if (!item) return emptyMaterialPurchaseForm();

  return {
    supplier_id:
      item.supplier_id != null
        ? String(item.supplier_id)
        : item.supplier?.id != null
          ? String(item.supplier.id)
          : "",
    land_id:
      item.land_id != null
        ? String(item.land_id)
        : item.land?.id != null
          ? String(item.land.id)
          : "",
    building_id:
      item.building_id != null
        ? String(item.building_id)
        : item.building?.id != null
          ? String(item.building.id)
          : "",
    title_en: item.title?.en ?? "",
    title_ar: item.title?.ar ?? "",
    notes_en: item.notes?.en ?? "",
    notes_ar: item.notes?.ar ?? "",
    invoice_number: item.invoice_number ?? "",
    total_amount: item.total_amount != null ? String(item.total_amount) : "",
    status: item.status || "pending",
    purchase_date: toDateInput(item.purchase_date),
  };
};

const isPositiveNumber = (value) => {
  if (value === "" || value === null || value === undefined) return false;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0;
};

export const validateMaterialPurchaseForm = (values) => {
  const errors = {};

  if (!values.supplier_id) errors.supplier_id = "Supplier is required.";
  if (!values.land_id) errors.land_id = "Land is required.";
  if (!values.building_id) errors.building_id = "Building is required.";

  if (!values.title_ar?.trim()) errors.title_ar = "Arabic title is required.";
  if (!values.title_en?.trim()) errors.title_en = "English title is required.";

  if (!values.invoice_number?.trim()) {
    errors.invoice_number = "Invoice number is required.";
  }

  if (!isPositiveNumber(values.total_amount)) {
    errors.total_amount = "Total amount must be greater than 0.";
  }

  if (!values.status) errors.status = "Status is required.";
  if (!values.purchase_date) errors.purchase_date = "Purchase date is required.";

  return errors;
};

export const formValuesToPayload = (values) => ({
  supplier_id: Number(values.supplier_id),
  land_id: Number(values.land_id),
  building_id: Number(values.building_id),
  title: {
    en: values.title_en.trim(),
    ar: values.title_ar.trim(),
  },
  notes: {
    en: values.notes_en.trim(),
    ar: values.notes_ar.trim(),
  },
  invoice_number: values.invoice_number.trim(),
  total_amount: Number(values.total_amount),
  status: values.status,
  purchase_date: values.purchase_date,
});
