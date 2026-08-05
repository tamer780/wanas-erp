export const TRANSACTION_CATEGORY_OPTIONS = [
  { value: "land_purchase", label: "Land Purchase" },
  { value: "land_cost", label: "Land Cost" },
  { value: "building_cost", label: "Building Cost" },
  { value: "unit_cost", label: "Unit Cost" },
  { value: "supplier_payment", label: "Supplier Payment" },
  { value: "contractor_payment", label: "Contractor Payment" },
  { value: "client_payment", label: "Client Payment" },
  { value: "other_income", label: "Other Income" },
  { value: "other_expense", label: "Other Expense" },
  { value: "void_reversal", label: "Void Reversal" },
];

const CATEGORY_LABELS = Object.fromEntries(
  TRANSACTION_CATEGORY_OPTIONS.map(({ value, label }) => [value, label]),
);

export const categoryLabel = (category) =>
  CATEGORY_LABELS[category] ||
  String(category || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase()) ||
  "—";
