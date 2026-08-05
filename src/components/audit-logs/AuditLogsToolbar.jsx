import { RotateCcw } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import {
  AUDIT_ACTION_OPTIONS,
  AUDITABLE_TYPE_OPTIONS,
} from "../../utils/auditLogConstants";

const AuditLogsToolbar = ({
  action,
  userId,
  auditableType,
  from,
  to,
  users = [],
  onActionChange,
  onUserIdChange,
  onAuditableTypeChange,
  onFromChange,
  onToChange,
  onReset,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-card">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[repeat(5,minmax(0,1fr))_auto]">
        <Select
          id="audit-logs-action"
          label="Action"
          size="sm"
          value={action}
          onChange={(event) => onActionChange(event.target.value)}
        >
          <option value="">All actions</option>
          {AUDIT_ACTION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select
          id="audit-logs-user"
          label="User"
          size="sm"
          value={userId}
          onChange={(event) => onUserIdChange(event.target.value)}
        >
          <option value="">All users</option>
          {users.map((user) => (
            <option key={user.id} value={String(user.id)}>
              {user.name || user.email || `User #${user.id}`}
            </option>
          ))}
        </Select>

        <Select
          id="audit-logs-type"
          label="Auditable Type"
          size="sm"
          value={auditableType}
          onChange={(event) => onAuditableTypeChange(event.target.value)}
        >
          <option value="">All types</option>
          {AUDITABLE_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Input
          id="audit-logs-from"
          label="From"
          type="date"
          value={from}
          onChange={(event) => onFromChange(event.target.value)}
          className="[&_input]:h-11 [&_input]:text-sm"
        />

        <Input
          id="audit-logs-to"
          label="To"
          type="date"
          value={to}
          onChange={(event) => onToChange(event.target.value)}
          className="[&_input]:h-11 [&_input]:text-sm"
        />

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

export default AuditLogsToolbar;
