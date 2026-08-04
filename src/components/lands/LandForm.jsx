import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import { LAND_STATUS_OPTIONS } from "../../utils/landValidation";

const LandForm = ({
  id = "land-form",
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
            id="land-name-ar"
            label="Arabic Name"
            value={values.name_ar}
            onChange={updateField("name_ar")}
            error={errors.name_ar}
            disabled={disabled}
            dir="rtl"
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="land-name-en"
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
            id="land-notes-ar"
            label="Arabic Notes"
            value={values.notes_ar}
            onChange={updateField("notes_ar")}
            error={errors.notes_ar}
            disabled={disabled}
            dir="rtl"
            rows={3}
          />
          <Textarea
            id="land-notes-en"
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
        <h3 className="text-sm font-semibold text-text-primary">
          Property Details
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="land-code"
            label="Code"
            value={values.code}
            onChange={updateField("code")}
            error={errors.code}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="land-deed"
            label="Deed Number"
            value={values.deed_number}
            onChange={updateField("deed_number")}
            error={errors.deed_number}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="land-city"
            label="City"
            value={values.city}
            onChange={updateField("city")}
            error={errors.city}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="land-location"
            label="Location"
            value={values.location}
            onChange={updateField("location")}
            error={errors.location}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="land-area"
            label="Area (sqm)"
            type="number"
            min="0"
            step="any"
            value={values.area_sqm}
            onChange={updateField("area_sqm")}
            error={errors.area_sqm}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Select
            id="land-status"
            label="Status"
            size="sm"
            value={values.status}
            onChange={updateField("status")}
            error={errors.status}
            disabled={disabled}
          >
            {LAND_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Financial</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="land-purchase-price"
            label="Purchase Price"
            type="number"
            min="0"
            step="any"
            value={values.purchase_price}
            onChange={updateField("purchase_price")}
            error={errors.purchase_price}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="land-fees"
            label="Fees"
            type="number"
            min="0"
            step="any"
            value={values.fees}
            onChange={updateField("fees")}
            error={errors.fees}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="land-taxes"
            label="Taxes"
            type="number"
            min="0"
            step="any"
            value={values.taxes}
            onChange={updateField("taxes")}
            error={errors.taxes}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="land-purchase-date"
            label="Purchase Date"
            type="date"
            value={values.purchase_date}
            onChange={updateField("purchase_date")}
            error={errors.purchase_date}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
        </div>
      </section>
    </form>
  );
};

export default LandForm;
