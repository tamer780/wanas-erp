export const CLIENT_STATUS_OPTIONS = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export const emptyClientForm = () => ({
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

export const clientToFormValues = (client) => {
  if (!client) return emptyClientForm();

  return {
    name_ar: client.name?.ar ?? "",
    name_en: client.name?.en ?? "",
    notes_ar: client.notes?.ar ?? "",
    notes_en: client.notes?.en ?? "",
    email: client.email ?? "",
    phone: client.phone ?? "",
    tax_id: client.tax_id ?? client.national_id ?? "",
    address: client.address ?? "",
    is_active: Boolean(client.is_active),
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

export const validateClientForm = (values) => {
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
