export const SUPPLIER_STATUS_OPTIONS = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export const emptySupplierForm = () => ({
  name_ar: "",
  name_en: "",
  notes_ar: "",
  notes_en: "",
  email: "",
  phone: "",
  tax_id: "",
  address: "",
  is_active: true,
});

export const supplierToFormValues = (supplier) => {
  if (!supplier) return emptySupplierForm();

  return {
    name_ar: supplier.name?.ar ?? "",
    name_en: supplier.name?.en ?? "",
    notes_ar: supplier.notes?.ar ?? "",
    notes_en: supplier.notes?.en ?? "",
    email: supplier.email ?? "",
    phone: supplier.phone ?? "",
    tax_id: supplier.tax_id ?? "",
    address: supplier.address ?? "",
    is_active: Boolean(supplier.is_active),
  };
};

export const formValuesToPayload = (values) => ({
  name: {
    en: values.name_en.trim(),
    ar: values.name_ar.trim(),
  },
  notes: {
    en: values.notes_en.trim(),
    ar: values.notes_ar.trim(),
  },
  email: values.email.trim() || null,
  phone: values.phone.trim() || null,
  tax_id: values.tax_id.trim() || null,
  address: values.address.trim() || null,
  is_active: Boolean(values.is_active),
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSupplierForm = (values) => {
  const errors = {};

  if (!values.name_ar.trim()) {
    errors.name_ar = "Arabic name is required.";
  }

  if (!values.name_en.trim()) {
    errors.name_en = "English name is required.";
  }

  if (values.email.trim() && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
};
