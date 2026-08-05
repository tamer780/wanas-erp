import { RotateCcw } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { TRANSACTION_CATEGORY_OPTIONS } from "../../utils/reportConstants";
import { translationText } from "../../utils/format";

const entityLabel = (entity, fallbackPrefix) => {
  const name = translationText(entity?.name, "en");
  if (name && name !== "—") return name;
  return entity?.code || `${fallbackPrefix} #${entity?.id}`;
};

const IncomeExpenseToolbar = ({
  from,
  to,
  landId,
  buildingId,
  unitId,
  category,
  lands = [],
  buildings = [],
  units = [],
  onFromChange,
  onToChange,
  onLandChange,
  onBuildingChange,
  onUnitChange,
  onCategoryChange,
  onReset,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-card">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[repeat(6,minmax(0,1fr))_auto]">
        <Input
          id="income-expense-from"
          label="From"
          type="date"
          value={from}
          onChange={(event) => onFromChange(event.target.value)}
          className="[&_input]:h-11 [&_input]:text-sm"
        />

        <Input
          id="income-expense-to"
          label="To"
          type="date"
          value={to}
          onChange={(event) => onToChange(event.target.value)}
          className="[&_input]:h-11 [&_input]:text-sm"
        />

        <Select
          id="income-expense-land"
          label="Land"
          size="sm"
          value={landId}
          onChange={(event) => onLandChange(event.target.value)}
        >
          <option value="">All lands</option>
          {lands.map((land) => (
            <option key={land.id} value={String(land.id)}>
              {entityLabel(land, "Land")}
            </option>
          ))}
        </Select>

        <Select
          id="income-expense-building"
          label="Building"
          size="sm"
          value={buildingId}
          onChange={(event) => onBuildingChange(event.target.value)}
          disabled={!landId && buildings.length === 0}
        >
          <option value="">All buildings</option>
          {buildings.map((building) => (
            <option key={building.id} value={String(building.id)}>
              {entityLabel(building, "Building")}
            </option>
          ))}
        </Select>

        <Select
          id="income-expense-unit"
          label="Unit"
          size="sm"
          value={unitId}
          onChange={(event) => onUnitChange(event.target.value)}
          disabled={!buildingId && units.length === 0}
        >
          <option value="">All units</option>
          {units.map((unit) => (
            <option key={unit.id} value={String(unit.id)}>
              {entityLabel(unit, "Unit")}
            </option>
          ))}
        </Select>

        <Select
          id="income-expense-category"
          label="Category"
          size="sm"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">All categories</option>
          {TRANSACTION_CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <div className="flex items-end sm:col-span-2 xl:col-span-3 2xl:col-span-1">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onReset}
            className="w-full 2xl:w-auto"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenseToolbar;
