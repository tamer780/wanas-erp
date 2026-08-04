export const BUILDING_STATUS_OPTIONS = [
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "archived", label: "Archived" },
];

export const emptyBuildingForm = () => ({
  land_id: "",
  name_ar: "",
  name_en: "",
  notes_ar: "",
  notes_en: "",
  code: "",
  floors: "",
  area_sqm: "",
  construction_cost: "",
  other_costs: "",
  status: "planning",
  start_date: "",
  completion_date: "",
});

export const buildingToFormValues = (building) => {
  if (!building) return emptyBuildingForm();

  return {
    land_id:
      building.land_id != null
        ? String(building.land_id)
        : building.land?.id != null
          ? String(building.land.id)
          : "",
    name_ar: building.name?.ar ?? "",
    name_en: building.name?.en ?? "",
    notes_ar: building.notes?.ar ?? "",
    notes_en: building.notes?.en ?? "",
    code: building.code ?? "",
    floors: building.floors != null ? String(building.floors) : "",
    area_sqm: building.area_sqm != null ? String(building.area_sqm) : "",
    construction_cost:
      building.construction_cost != null
        ? String(building.construction_cost)
        : "",
    other_costs:
      building.other_costs != null ? String(building.other_costs) : "",
    status: building.status || "planning",
    start_date: building.start_date
      ? String(building.start_date).slice(0, 10)
      : "",
    completion_date: building.completion_date
      ? String(building.completion_date).slice(0, 10)
      : "",
  };
};

export const formValuesToPayload = (values) => ({
  land_id: Number(values.land_id),
  name: {
    en: values.name_en.trim(),
    ar: values.name_ar.trim(),
  },
  notes: {
    en: values.notes_en.trim(),
    ar: values.notes_ar.trim(),
  },
  code: values.code.trim(),
  floors: Number(values.floors),
  area_sqm: Number(values.area_sqm),
  construction_cost: Number(values.construction_cost),
  other_costs: Number(values.other_costs || 0),
  status: values.status,
  start_date: values.start_date,
  completion_date: values.completion_date || null,
});

const isNonNegativeNumber = (value) => {
  if (value === "" || value === null || value === undefined) return false;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0;
};

const isPositiveInteger = (value) => {
  if (value === "" || value === null || value === undefined) return false;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0;
};

export const validateBuildingForm = (values) => {
  const errors = {};

  if (!values.land_id) {
    errors.land_id = "Land is required.";
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

  if (!isPositiveInteger(values.floors)) {
    errors.floors = "Floors must be a whole number greater than 0.";
  }

  if (!isNonNegativeNumber(values.area_sqm) || Number(values.area_sqm) <= 0) {
    errors.area_sqm = "Area must be greater than 0.";
  }

  if (!isNonNegativeNumber(values.construction_cost)) {
    errors.construction_cost = "Construction cost must be 0 or greater.";
  }

  if (values.other_costs !== "" && !isNonNegativeNumber(values.other_costs)) {
    errors.other_costs = "Other costs must be 0 or greater.";
  }

  if (!values.start_date) {
    errors.start_date = "Start date is required.";
  }

  if (!values.status) {
    errors.status = "Status is required.";
  }

  return errors;
};
