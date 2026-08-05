import { RotateCcw, Search } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { PURCHASE_STATUS_OPTIONS } from "../../utils/materialPurchaseValidation";
import { translationText } from "../../utils/format";

const MaterialPurchasesToolbar = ({
  search,
  status,
  supplierId,
  supplierOptions = [],
  onSearchChange,
  onStatusChange,
  onSupplierChange,
  onReset,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-card">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
        <Input
          id="material-purchases-search"
          label="Search"
          placeholder="Title, invoice, supplier, building..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          leadingIcon={Search}
          className="[&_input]:h-11 [&_input]:text-sm"
        />

        <Select
          id="material-purchases-status"
          label="Status"
          size="sm"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option value="">All statuses</option>
          {PURCHASE_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select
          id="material-purchases-supplier"
          label="Supplier"
          size="sm"
          value={supplierId}
          onChange={(event) => onSupplierChange(event.target.value)}
        >
          <option value="">All suppliers</option>
          {supplierOptions.map((supplier) => (
            <option key={supplier.id} value={String(supplier.id)}>
              {translationText(supplier.name, "en") !== "—"
                ? translationText(supplier.name, "en")
                : `Supplier #${supplier.id}`}
            </option>
          ))}
        </Select>

        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onReset}
            className="w-full lg:w-auto"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MaterialPurchasesToolbar;
