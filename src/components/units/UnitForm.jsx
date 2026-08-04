import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import { UNIT_STATUS_OPTIONS } from "../../utils/unitValidation";
import { translationText } from "../../utils/format";

const UnitForm = ({
  id = "unit-form",
  values,
  errors = {},
  disabled = false,
  buildingOptions = [],
  onChange,
  onSubmit,
}) => {
  const updateField = (field) => (event) => {
    onChange(field, event.target.value);
  };

  return (
    <form id={id} className="space-y-5" onSubmit={onSubmit} noValidate>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Building</h3>
        <Select
          id="unit-building"
          label="Building"
          size="sm"
          value={values.building_id}
          onChange={updateField("building_id")}
          error={errors.building_id}
          disabled={disabled}
        >
          <option value="">Select a building</option>
          {buildingOptions.map((building) => (
            <option key={building.id} value={String(building.id)}>
              {translationText(building.name, "en") !== "—"
                ? `${translationText(building.name, "en")}${building.code ? ` (${building.code})` : ""}`
                : building.code || `Building #${building.id}`}
            </option>
          ))}
        </Select>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Names</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="unit-name-ar"
            label="Arabic Name"
            value={values.name_ar}
            onChange={updateField("name_ar")}
            error={errors.name_ar}
            disabled={disabled}
            dir="rtl"
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="unit-name-en"
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
            id="unit-notes-ar"
            label="Arabic Notes"
            value={values.notes_ar}
            onChange={updateField("notes_ar")}
            error={errors.notes_ar}
            disabled={disabled}
            dir="rtl"
            rows={3}
          />
          <Textarea
            id="unit-notes-en"
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
        <h3 className="text-sm font-semibold text-text-primary">Unit Details</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="unit-code"
            label="Code"
            value={values.code}
            onChange={updateField("code")}
            error={errors.code}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="unit-type"
            label="Unit Type"
            value={values.unit_type}
            onChange={updateField("unit_type")}
            error={errors.unit_type}
            disabled={disabled}
            placeholder="e.g. Studio"
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="unit-floor"
            label="Floor"
            value={values.floor}
            onChange={updateField("floor")}
            error={errors.floor}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="unit-area"
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
            id="unit-status"
            label="Status"
            size="sm"
            value={values.status}
            onChange={updateField("status")}
            error={errors.status}
            disabled={disabled}
          >
            {UNIT_STATUS_OPTIONS.map((option) => (
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
            id="unit-base-cost"
            label="Base Cost"
            type="number"
            min="0"
            step="any"
            value={values.base_cost}
            onChange={updateField("base_cost")}
            error={errors.base_cost}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="unit-sale-price"
            label="Sale Price"
            type="number"
            min="0"
            step="any"
            value={values.sale_price}
            onChange={updateField("sale_price")}
            error={errors.sale_price}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
        </div>
      </section>
    </form>
  );
};

export default UnitForm;
