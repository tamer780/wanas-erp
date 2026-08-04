import { RotateCcw, Search } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { BUILDING_STATUS_OPTIONS } from "../../utils/buildingValidation";
import { translationText } from "../../utils/format";

const BuildingToolbar = ({
  search,
  status,
  landId,
  lands = [],
  onSearchChange,
  onStatusChange,
  onLandChange,
  onReset,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-card">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))_auto]">
        <Input
          id="buildings-search"
          label="Search"
          placeholder="Search by building name, code, or land name..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          leadingIcon={Search}
          className="[&_input]:h-11 [&_input]:text-sm"
        />

        <Select
          id="buildings-status"
          label="Status"
          size="sm"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option value="">All statuses</option>
          {BUILDING_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select
          id="buildings-land"
          label="Land"
          size="sm"
          value={landId}
          onChange={(event) => onLandChange(event.target.value)}
        >
          <option value="">All lands</option>
          {lands.map((land) => (
            <option key={land.id} value={String(land.id)}>
              {translationText(land.name, "en") !== "—"
                ? translationText(land.name, "en")
                : land.code || `Land #${land.id}`}
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

export default BuildingToolbar;
