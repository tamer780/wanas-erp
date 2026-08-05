export const AUDIT_ACTION_OPTIONS = [
  { value: "created", label: "Created" },
  { value: "updated", label: "Updated" },
  { value: "deleted", label: "Deleted" },
];

export const AUDITABLE_TYPE_OPTIONS = [
  { value: "land", label: "Land" },
  { value: "building", label: "Building" },
  { value: "unit", label: "Unit" },
  { value: "client", label: "Client" },
  { value: "supplier", label: "Supplier" },
  { value: "contractor", label: "Contractor" },
  { value: "work_item", label: "Work Item" },
  { value: "material_purchase", label: "Material Purchase" },
  { value: "unit_sale", label: "Unit Sale" },
  { value: "App\\Models\\UnitSale", label: "Unit Sale (model)" },
  { value: "App\\Models\\PaymentSchedule", label: "Payment Schedule" },
  { value: "App\\Models\\PayablePayment", label: "Payable Payment" },
  { value: "App\\Models\\LandCost", label: "Land Cost" },
  { value: "App\\Models\\Unit", label: "Unit (model)" },
  { value: "user", label: "User" },
];

export const shortAuditableType = (type) => {
  if (!type) return "—";
  const raw = String(type);
  if (raw.includes("\\")) {
    const parts = raw.split("\\");
    return parts[parts.length - 1] || raw;
  }
  return raw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
