import { RotateCcw, Search } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import {
  SALE_STATUS_OPTIONS,
  SALE_TYPE_OPTIONS,
} from "../../utils/unitSaleValidation";

const UnitSalesToolbar = ({
  search,
  saleType,
  status,
  onSearchChange,
  onSaleTypeChange,
  onStatusChange,
  onReset,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-card">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
        <Input
          id="unit-sales-search"
          label="Search"
          placeholder="Contract #, unit, client..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          leadingIcon={Search}
          className="[&_input]:h-11 [&_input]:text-sm"
        />

        <Select
          id="unit-sales-type"
          label="Sale Type"
          size="sm"
          value={saleType}
          onChange={(event) => onSaleTypeChange(event.target.value)}
        >
          <option value="">All types</option>
          {SALE_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select
          id="unit-sales-status"
          label="Status"
          size="sm"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option value="">All statuses</option>
          {SALE_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
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

export default UnitSalesToolbar;
