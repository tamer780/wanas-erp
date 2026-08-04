export const LAND_STATUS_OPTIONS = [
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "sold", label: "Sold" },
  { value: "archived", label: "Archived" },
];

export const emptyLandForm = () => ({
  name_ar: "",
  name_en: "",
  notes_ar: "",
  notes_en: "",
  code: "",
  location: "",
  city: "",
  deed_number: "",
  area_sqm: "",
  purchase_price: "",
  fees: "",
  taxes: "",
  purchase_date: "",
  status: "planning",
});

export const landToFormValues = (land) => {
  if (!land) return emptyLandForm();

  return {
    name_ar: land.name?.ar ?? "",
    name_en: land.name?.en ?? "",
    notes_ar: land.notes?.ar ?? "",
    notes_en: land.notes?.en ?? "",
    code: land.code ?? "",
    location: land.location ?? "",
    city: land.city ?? "",
    deed_number: land.deed_number ?? "",
    area_sqm: land.area_sqm != null ? String(land.area_sqm) : "",
    purchase_price:
      land.purchase_price != null ? String(land.purchase_price) : "",
    fees: land.fees != null ? String(land.fees) : "",
    taxes: land.taxes != null ? String(land.taxes) : "",
    purchase_date: land.purchase_date
      ? String(land.purchase_date).slice(0, 10)
      : "",
    status: land.status || "planning",
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
  code: values.code.trim(),
  location: values.location.trim(),
  city: values.city.trim(),
  deed_number: values.deed_number.trim(),
  area_sqm: Number(values.area_sqm),
  purchase_price: Number(values.purchase_price),
  fees: Number(values.fees || 0),
  taxes: Number(values.taxes || 0),
  purchase_date: values.purchase_date,
  status: values.status,
});

const isNonNegativeNumber = (value) => {
  if (value === "" || value === null || value === undefined) return false;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0;
};

export const validateLandForm = (values) => {
  const errors = {};

  if (!values.name_ar.trim()) {
    errors.name_ar = "Arabic name is required.";
  }

  if (!values.name_en.trim()) {
    errors.name_en = "English name is required.";
  }

  if (!values.code.trim()) {
    errors.code = "Code is required.";
  }

  if (!values.location.trim()) {
    errors.location = "Location is required.";
  }

  if (!values.city.trim()) {
    errors.city = "City is required.";
  }

  if (!values.deed_number.trim()) {
    errors.deed_number = "Deed number is required.";
  }

  if (!isNonNegativeNumber(values.area_sqm) || Number(values.area_sqm) <= 0) {
    errors.area_sqm = "Area must be greater than 0.";
  }

  if (!isNonNegativeNumber(values.purchase_price)) {
    errors.purchase_price = "Purchase price must be 0 or greater.";
  }

  if (values.fees !== "" && !isNonNegativeNumber(values.fees)) {
    errors.fees = "Fees must be 0 or greater.";
  }

  if (values.taxes !== "" && !isNonNegativeNumber(values.taxes)) {
    errors.taxes = "Taxes must be 0 or greater.";
  }

  if (!values.purchase_date) {
    errors.purchase_date = "Purchase date is required.";
  }

  if (!values.status) {
    errors.status = "Status is required.";
  }

  return errors;
};
