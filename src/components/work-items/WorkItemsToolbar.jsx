import { RotateCcw, Search } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import {
  WORK_ITEM_STATUS_OPTIONS,
  WORKABLE_TYPE_OPTIONS,
} from "../../utils/workItemValidation";

const WorkItemsToolbar = ({
  search,
  status,
  workableType,
  onSearchChange,
  onStatusChange,
  onWorkableTypeChange,
  onReset,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-card">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
        <Input
          id="work-items-search"
          label="Search"
          placeholder="Title, contractor, building/land..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          leadingIcon={Search}
          className="[&_input]:h-11 [&_input]:text-sm"
        />

        <Select
          id="work-items-status"
          label="Status"
          size="sm"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option value="">All statuses</option>
          {WORK_ITEM_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select
          id="work-items-type"
          label="Workable Type"
          size="sm"
          value={workableType}
          onChange={(event) => onWorkableTypeChange(event.target.value)}
        >
          <option value="">All types</option>
          {WORKABLE_TYPE_OPTIONS.map((option) => (
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

export default WorkItemsToolbar;
