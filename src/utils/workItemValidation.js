export const WORKABLE_TYPE_OPTIONS = [
  { value: "building", label: "Building" },
  { value: "land", label: "Land" },
];

export const WORK_ITEM_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
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

export const emptyWorkItemForm = () => ({
  contractor_id: "",
  workable_type: "building",
  workable_id: "",
  title_en: "",
  title_ar: "",
  description_en: "",
  description_ar: "",
  agreed_amount: "",
  status: "pending",
  start_date: "",
  end_date: "",
});

export const workItemToFormValues = (item) => {
  if (!item) return emptyWorkItemForm();

  return {
    contractor_id:
      item.contractor_id != null
        ? String(item.contractor_id)
        : item.contractor?.id != null
          ? String(item.contractor.id)
          : "",
    workable_type: item.workable_type || "building",
    workable_id:
      item.workable_id != null
        ? String(item.workable_id)
        : item.workable?.id != null
          ? String(item.workable.id)
          : "",
    title_en: item.title?.en ?? "",
    title_ar: item.title?.ar ?? "",
    description_en: item.description?.en ?? "",
    description_ar: item.description?.ar ?? "",
    agreed_amount: item.agreed_amount != null ? String(item.agreed_amount) : "",
    status: item.status || "pending",
    start_date: toDateInput(item.start_date),
    end_date: toDateInput(item.end_date),
  };
};

const isPositiveNumber = (value) => {
  if (value === "" || value === null || value === undefined) return false;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0;
};

export const validateWorkItemForm = (values) => {
  const errors = {};

  if (!values.contractor_id) {
    errors.contractor_id = "Contractor is required.";
  }

  if (!values.workable_type) {
    errors.workable_type = "Workable type is required.";
  }

  if (!values.workable_id) {
    errors.workable_id = "Workable target is required.";
  }

  if (!values.title_ar?.trim()) {
    errors.title_ar = "Arabic title is required.";
  }

  if (!values.title_en?.trim()) {
    errors.title_en = "English title is required.";
  }

  if (!isPositiveNumber(values.agreed_amount)) {
    errors.agreed_amount = "Agreed amount must be greater than 0.";
  }

  if (!values.status) {
    errors.status = "Status is required.";
  }

  if (!values.start_date) {
    errors.start_date = "Start date is required.";
  }

  if (values.start_date && values.end_date) {
    const start = new Date(values.start_date);
    const end = new Date(values.end_date);
    if (
      !Number.isNaN(start.getTime()) &&
      !Number.isNaN(end.getTime()) &&
      end < start
    ) {
      errors.end_date = "End date must be on or after start date.";
    }
  }

  return errors;
};

export const formValuesToPayload = (values) => {
  const payload = {
    contractor_id: Number(values.contractor_id),
    workable_type: values.workable_type,
    workable_id: Number(values.workable_id),
    title: {
      en: values.title_en.trim(),
      ar: values.title_ar.trim(),
    },
    description: {
      en: values.description_en.trim(),
      ar: values.description_ar.trim(),
    },
    agreed_amount: Number(values.agreed_amount),
    status: values.status,
    start_date: values.start_date,
  };

  if (values.end_date) {
    payload.end_date = values.end_date;
  }

  return payload;
};
