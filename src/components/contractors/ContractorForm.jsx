import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Checkbox from "../ui/Checkbox";

const ContractorForm = ({
  id = "contractor-form",
  values,
  errors = {},
  disabled = false,
  onChange,
  onSubmit,
}) => {
  const updateField = (field) => (event) => {
    onChange(field, event.target.value);
  };

  return (
    <form id={id} className="space-y-5" onSubmit={onSubmit} noValidate>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Names</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="contractor-name-ar"
            label="Arabic Name"
            value={values.name_ar}
            onChange={updateField("name_ar")}
            error={errors.name_ar}
            disabled={disabled}
            dir="rtl"
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="contractor-name-en"
            label="English Name"
            value={values.name_en}
            onChange={updateField("name_en")}
            error={errors.name_en}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Notes</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Textarea
            id="contractor-notes-ar"
            label="Arabic Notes"
            value={values.notes_ar}
            onChange={updateField("notes_ar")}
            error={errors.notes_ar}
            disabled={disabled}
            dir="rtl"
            rows={3}
          />
          <Textarea
            id="contractor-notes-en"
            label="English Notes"
            value={values.notes_en}
            onChange={updateField("notes_en")}
            error={errors.notes_en}
            disabled={disabled}
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Contact</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="contractor-email"
            label="Email"
            type="email"
            value={values.email}
            onChange={updateField("email")}
            error={errors.email}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="contractor-phone"
            label="Phone"
            value={values.phone}
            onChange={updateField("phone")}
            error={errors.phone}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="contractor-address"
            label="Address"
            value={values.address}
            onChange={updateField("address")}
            error={errors.address}
            disabled={disabled}
            className="sm:col-span-2 [&_input]:h-11 [&_input]:text-sm"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Identity</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="contractor-tax-id"
            label="Tax ID"
            value={values.tax_id}
            onChange={updateField("tax_id")}
            error={errors.tax_id}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <div className="flex items-end pb-2">
            <Checkbox
              id="contractor-is-active"
              label="Active contractor"
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

export default ContractorForm;
