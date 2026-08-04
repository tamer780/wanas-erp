import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import { BUILDING_STATUS_OPTIONS } from "../../utils/buildingValidation";
import { translationText } from "../../utils/format";

const BuildingForm = ({
  id = "building-form",
  values,
  errors = {},
  disabled = false,
  landOptions = [],
  onChange,
  onSubmit,
}) => {
  const updateField = (field) => (event) => {
    onChange(field, event.target.value);
  };

  return (
    <form id={id} className="space-y-5" onSubmit={onSubmit} noValidate>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Land</h3>
        <Select
          id="building-land"
          label="Land"
          size="sm"
          value={values.land_id}
          onChange={updateField("land_id")}
          error={errors.land_id}
          disabled={disabled}
        >
          <option value="">Select a land</option>
          {landOptions.map((land) => (
            <option key={land.id} value={String(land.id)}>
              {translationText(land.name, "en") !== "—"
                ? `${translationText(land.name, "en")}${land.code ? ` (${land.code})` : ""}`
                : land.code || `Land #${land.id}`}
            </option>
          ))}
        </Select>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Names</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="building-name-ar"
            label="Arabic Name"
            value={values.name_ar}
            onChange={updateField("name_ar")}
            error={errors.name_ar}
            disabled={disabled}
            dir="rtl"
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="building-name-en"
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
            id="building-notes-ar"
            label="Arabic Notes"
            value={values.notes_ar}
            onChange={updateField("notes_ar")}
            error={errors.notes_ar}
            disabled={disabled}
            dir="rtl"
            rows={3}
          />
          <Textarea
            id="building-notes-en"
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
          Building Details
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="building-code"
            label="Code"
            value={values.code}
            onChange={updateField("code")}
            error={errors.code}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="building-floors"
            label="Floors"
            type="number"
            min="1"
            step="1"
            value={values.floors}
            onChange={updateField("floors")}
            error={errors.floors}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="building-area"
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
            id="building-status"
            label="Status"
            size="sm"
            value={values.status}
            onChange={updateField("status")}
            error={errors.status}
            disabled={disabled}
          >
            {BUILDING_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Input
            id="building-start-date"
            label="Start Date"
            type="date"
            value={values.start_date}
            onChange={updateField("start_date")}
            error={errors.start_date}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="building-completion-date"
            label="Completion Date"
            type="date"
            value={values.completion_date}
            onChange={updateField("completion_date")}
            error={errors.completion_date}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Financial</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="building-construction-cost"
            label="Construction Cost"
            type="number"
            min="0"
            step="any"
            value={values.construction_cost}
            onChange={updateField("construction_cost")}
            error={errors.construction_cost}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="building-other-costs"
            label="Other Costs"
            type="number"
            min="0"
            step="any"
            value={values.other_costs}
            onChange={updateField("other_costs")}
            error={errors.other_costs}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
        </div>
      </section>
    </form>
  );
};

export default BuildingForm;
