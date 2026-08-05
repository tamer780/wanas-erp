import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import {
  WORK_ITEM_STATUS_OPTIONS,
  WORKABLE_TYPE_OPTIONS,
} from "../../utils/workItemValidation";
import { translationText } from "../../utils/format";

const optionLabel = (entity) => {
  const name = translationText(entity.name, "en");
  if (name !== "—") {
    return entity.code ? `${name} (${entity.code})` : name;
  }
  return entity.code || `#${entity.id}`;
};

const WorkItemForm = ({
  id = "work-item-form",
  values,
  errors = {},
  disabled = false,
  contractorOptions = [],
  buildingOptions = [],
  landOptions = [],
  onChange,
  onSubmit,
}) => {
  const updateField = (field) => (event) => {
    onChange(field, event.target.value);
  };

  const handleTypeChange = (event) => {
    const nextType = event.target.value;
    onChange("workable_type", nextType);
    onChange("workable_id", "");
  };

  const workableOptions =
    values.workable_type === "land" ? landOptions : buildingOptions;
  const workableLabel =
    values.workable_type === "land" ? "Land" : "Building";

  return (
    <form id={id} className="space-y-5" onSubmit={onSubmit} noValidate>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Assignment</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            id="work-item-contractor"
            label="Contractor"
            size="sm"
            value={values.contractor_id}
            onChange={updateField("contractor_id")}
            error={errors.contractor_id}
            disabled={disabled}
          >
            <option value="">Select a contractor</option>
            {contractorOptions.map((contractor) => (
              <option key={contractor.id} value={String(contractor.id)}>
                {optionLabel(contractor)}
              </option>
            ))}
          </Select>

          <Select
            id="work-item-workable-type"
            label="Workable Type"
            size="sm"
            value={values.workable_type}
            onChange={handleTypeChange}
            error={errors.workable_type}
            disabled={disabled}
          >
            {WORKABLE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            id="work-item-workable"
            label={workableLabel}
            size="sm"
            value={values.workable_id}
            onChange={updateField("workable_id")}
            error={errors.workable_id}
            disabled={disabled}
            className="sm:col-span-2"
          >
            <option value="">Select a {workableLabel.toLowerCase()}</option>
            {workableOptions.map((entity) => (
              <option key={entity.id} value={String(entity.id)}>
                {optionLabel(entity)}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Title</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="work-item-title-ar"
            label="Arabic Title"
            value={values.title_ar}
            onChange={updateField("title_ar")}
            error={errors.title_ar}
            disabled={disabled}
            dir="rtl"
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="work-item-title-en"
            label="English Title"
            value={values.title_en}
            onChange={updateField("title_en")}
            error={errors.title_en}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Description</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Textarea
            id="work-item-description-ar"
            label="Arabic Description"
            value={values.description_ar}
            onChange={updateField("description_ar")}
            error={errors.description_ar}
            disabled={disabled}
            dir="rtl"
            rows={3}
          />
          <Textarea
            id="work-item-description-en"
            label="English Description"
            value={values.description_en}
            onChange={updateField("description_en")}
            error={errors.description_en}
            disabled={disabled}
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Details</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="work-item-agreed-amount"
            label="Agreed Amount"
            type="number"
            min="0"
            step="0.01"
            value={values.agreed_amount}
            onChange={updateField("agreed_amount")}
            error={errors.agreed_amount}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Select
            id="work-item-status"
            label="Status"
            size="sm"
            value={values.status}
            onChange={updateField("status")}
            error={errors.status}
            disabled={disabled}
          >
            {WORK_ITEM_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Input
            id="work-item-start-date"
            label="Start Date"
            type="date"
            value={values.start_date}
            onChange={updateField("start_date")}
            error={errors.start_date}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="work-item-end-date"
            label="End Date"
            type="date"
            value={values.end_date}
            onChange={updateField("end_date")}
            error={errors.end_date}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
        </div>
      </section>
    </form>
  );
};

export default WorkItemForm;
