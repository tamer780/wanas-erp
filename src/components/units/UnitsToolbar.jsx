import { RotateCcw, Search } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { UNIT_STATUS_OPTIONS } from "../../utils/unitValidation";
import { translationText } from "../../utils/format";

const UnitsToolbar = ({
  search,
  status,
  buildingId,
  buildings = [],
  onSearchChange,
  onStatusChange,
  onBuildingChange,
  onReset,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-card">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))_auto]">
        <Input
          id="units-search"
          label="Search"
          placeholder="Search by unit name, code, or building name..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          leadingIcon={Search}
          className="[&_input]:h-11 [&_input]:text-sm"
        />

        <Select
          id="units-status"
          label="Status"
          size="sm"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option value="">All statuses</option>
          {UNIT_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select
          id="units-building"
          label="Building"
          size="sm"
          value={buildingId}
          onChange={(event) => onBuildingChange(event.target.value)}
        >
          <option value="">All buildings</option>
          {buildings.map((building) => (
            <option key={building.id} value={String(building.id)}>
              {translationText(building.name, "en") !== "—"
                ? translationText(building.name, "en")
                : building.code || `Building #${building.id}`}
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

export default UnitsToolbar;
