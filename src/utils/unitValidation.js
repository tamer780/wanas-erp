export const UNIT_STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
];

export const emptyUnitForm = () => ({
  building_id: "",
  name_ar: "",
  name_en: "",
  notes_ar: "",
  notes_en: "",
  code: "",
  unit_type: "",
  floor: "",
  area_sqm: "",
  base_cost: "",
  sale_price: "",
  status: "available",
});

export const unitToFormValues = (unit) => {
  if (!unit) return emptyUnitForm();

  return {
    building_id:
      unit.building_id != null
        ? String(unit.building_id)
        : unit.building?.id != null
          ? String(unit.building.id)
          : "",
    name_ar: unit.name?.ar ?? "",
    name_en: unit.name?.en ?? "",
    notes_ar: unit.notes?.ar ?? "",
    notes_en: unit.notes?.en ?? "",
    code: unit.code ?? "",
    unit_type: unit.unit_type ?? "",
    floor: unit.floor != null ? String(unit.floor) : "",
    area_sqm: unit.area_sqm != null ? String(unit.area_sqm) : "",
    base_cost: unit.base_cost != null ? String(unit.base_cost) : "",
    sale_price: unit.sale_price != null ? String(unit.sale_price) : "",
    status: unit.status || "available",
  };
};

export const formValuesToPayload = (values) => ({
  building_id: Number(values.building_id),
  name: {
    en: values.name_en.trim(),
    ar: values.name_ar.trim(),
  },
  notes: {
    en: values.notes_en.trim(),
    ar: values.notes_ar.trim(),
  },
  code: values.code.trim(),
  unit_type: values.unit_type.trim(),
  floor: values.floor.trim(),
  area_sqm: Number(values.area_sqm),
  base_cost: Number(values.base_cost),
  sale_price: Number(values.sale_price),
  status: values.status,
});

const isNonNegativeNumber = (value) => {
  if (value === "" || value === null || value === undefined) return false;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0;
};

export const validateUnitForm = (values) => {
  const errors = {};

  if (!values.building_id) {
    errors.building_id = "Building is required.";
  }

  if (!values.name_ar.trim()) {
    errors.name_ar = "Arabic name is required.";
  }

  if (!values.name_en.trim()) {
    errors.name_en = "English name is required.";
  }

  if (!values.code.trim()) {
    errors.code = "Code is required.";
  }

  if (!values.unit_type.trim()) {
    errors.unit_type = "Unit type is required.";
  }

  if (!values.floor.trim()) {
    errors.floor = "Floor is required.";
  }

  if (!isNonNegativeNumber(values.area_sqm) || Number(values.area_sqm) <= 0) {
    errors.area_sqm = "Area must be greater than 0.";
  }

  if (!isNonNegativeNumber(values.base_cost)) {
    errors.base_cost = "Base cost must be 0 or greater.";
  }

  if (!isNonNegativeNumber(values.sale_price)) {
    errors.sale_price = "Sale price must be 0 or greater.";
  }

  if (!values.status) {
    errors.status = "Status is required.";
  }

  return errors;
};
