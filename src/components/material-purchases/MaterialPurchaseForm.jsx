import { useMemo } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import { PURCHASE_STATUS_OPTIONS } from "../../utils/materialPurchaseValidation";
import { translationText } from "../../utils/format";

const optionLabel = (entity) => {
  const name = translationText(entity.name, "en");
  if (name !== "—") {
    return entity.code ? `${name} (${entity.code})` : name;
  }
  return entity.code || `#${entity.id}`;
};

const MaterialPurchaseForm = ({
  id = "material-purchase-form",
  values,
  errors = {},
  disabled = false,
  supplierOptions = [],
  landOptions = [],
  buildingOptions = [],
  onChange,
  onSubmit,
}) => {
  const updateField = (field) => (event) => {
    onChange(field, event.target.value);
  };

  const handleLandChange = (event) => {
    onChange("land_id", event.target.value);
    onChange("building_id", "");
  };

  const filteredBuildings = useMemo(() => {
    if (!values.land_id) return buildingOptions;
    const matched = buildingOptions.filter(
      (building) => String(building.land_id) === String(values.land_id),
    );
    return matched.length > 0 ? matched : buildingOptions;
  }, [buildingOptions, values.land_id]);

  return (
    <form id={id} className="space-y-5" onSubmit={onSubmit} noValidate>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Assignment</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            id="mp-supplier"
            label="Supplier"
            size="sm"
            value={values.supplier_id}
            onChange={updateField("supplier_id")}
            error={errors.supplier_id}
            disabled={disabled}
            className="sm:col-span-2"
          >
            <option value="">Select a supplier</option>
            {supplierOptions.map((supplier) => (
              <option key={supplier.id} value={String(supplier.id)}>
                {optionLabel(supplier)}
              </option>
            ))}
          </Select>

          <Select
            id="mp-land"
            label="Land"
            size="sm"
            value={values.land_id}
            onChange={handleLandChange}
            error={errors.land_id}
            disabled={disabled}
          >
            <option value="">Select a land</option>
            {landOptions.map((land) => (
              <option key={land.id} value={String(land.id)}>
                {optionLabel(land)}
              </option>
            ))}
          </Select>

          <Select
            id="mp-building"
            label="Building"
            size="sm"
            value={values.building_id}
            onChange={updateField("building_id")}
            error={errors.building_id}
            disabled={disabled}
          >
            <option value="">Select a building</option>
            {filteredBuildings.map((building) => (
              <option key={building.id} value={String(building.id)}>
                {optionLabel(building)}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Title</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="mp-title-ar"
            label="Arabic Title"
            value={values.title_ar}
            onChange={updateField("title_ar")}
            error={errors.title_ar}
            disabled={disabled}
            dir="rtl"
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="mp-title-en"
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
        <h3 className="text-sm font-semibold text-text-primary">Notes</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Textarea
            id="mp-notes-ar"
            label="Arabic Notes"
            value={values.notes_ar}
            onChange={updateField("notes_ar")}
            error={errors.notes_ar}
            disabled={disabled}
            dir="rtl"
            rows={3}
          />
          <Textarea
            id="mp-notes-en"
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
        <h3 className="text-sm font-semibold text-text-primary">Details</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="mp-invoice"
            label="Invoice Number"
            value={values.invoice_number}
            onChange={updateField("invoice_number")}
            error={errors.invoice_number}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Input
            id="mp-total"
            label="Total Amount"
            type="number"
            min="0"
            step="0.01"
            value={values.total_amount}
            onChange={updateField("total_amount")}
            error={errors.total_amount}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
          <Select
            id="mp-status"
            label="Status"
            size="sm"
            value={values.status}
            onChange={updateField("status")}
            error={errors.status}
            disabled={disabled}
          >
            {PURCHASE_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Input
            id="mp-purchase-date"
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

export default MaterialPurchaseForm;
