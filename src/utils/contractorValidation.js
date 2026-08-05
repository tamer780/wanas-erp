export const CONTRACTOR_STATUS_OPTIONS = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export const emptyContractorForm = () => ({
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

export const contractorToFormValues = (contractor) => {
  if (!contractor) return emptyContractorForm();

  return {
    name_ar: contractor.name?.ar ?? "",
    name_en: contractor.name?.en ?? "",
    notes_ar: contractor.notes?.ar ?? "",
    notes_en: contractor.notes?.en ?? "",
    email: contractor.email ?? "",
    phone: contractor.phone ?? "",
    tax_id: contractor.tax_id ?? "",
    address: contractor.address ?? "",
    is_active: Boolean(contractor.is_active),
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

export const validateContractorForm = (values) => {
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
