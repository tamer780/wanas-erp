import Input from "../ui/Input";
import Select from "../ui/Select";
import Checkbox from "../ui/Checkbox";
import { USER_ROLE_OPTIONS } from "../../utils/userValidation";

const UserForm = ({
  id = "user-form",
  values,
  errors = {},
  disabled = false,
  mode = "create",
  onChange,
  onSubmit,
}) => {
  const updateField = (field) => (event) => {
    onChange(field, event.target.value);
  };

  const isEdit = mode === "edit";

  return (
    <form id={id} className="space-y-5" onSubmit={onSubmit} noValidate>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Profile</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="user-name"
            label="Name"
            value={values.name}
            onChange={updateField("name")}
            error={errors.name}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="user-email"
            label="Email"
            type="email"
            value={values.email}
            onChange={updateField("email")}
            error={errors.email}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Access</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="user-password"
            label={isEdit ? "Password (optional)" : "Password"}
            type="password"
            value={values.password}
            onChange={updateField("password")}
            error={errors.password}
            disabled={disabled}
            placeholder={isEdit ? "Leave blank to keep current" : undefined}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Select
            id="user-role"
            label="Role"
            size="sm"
            value={values.role}
            onChange={updateField("role")}
            error={errors.role}
            disabled={disabled}
          >
            <option value="">Select a role</option>
            {USER_ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <div className="flex items-end pb-2 sm:col-span-2">
            <Checkbox
              id="user-is-active"
              label="Active user"
              checked={Boolean(values.is_active)}
              disabled={disabled}
              onChange={(event) => onChange("is_active", event.target.checked)}
            />
          </div>
        </div>
      </section>
    </form>
  );
};

export default UserForm;
