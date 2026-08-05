import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Checkbox from "../ui/Checkbox";
import {
  PAYMENT_METHOD_OPTIONS,
  SALE_STATUS_OPTIONS,
  SALE_TYPE_OPTIONS,
} from "../../utils/unitSaleValidation";
import { translationText } from "../../utils/format";

const UnitSaleForm = ({
  id = "unit-sale-form",
  mode = "create",
  values,
  errors = {},
  disabled = false,
  unitOptions = [],
  clientOptions = [],
  lockUnitAndClient = false,
  onChange,
  onSubmit,
}) => {
  const updateField = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    onChange(field, value);
  };

  const updateFile = (event) => {
    const file = event.target.files?.[0] ?? null;
    onChange("contract_pdf", file);
  };

  const isInstallment = values.sale_type === "installment";
  const showInstallmentFields = mode === "create" && isInstallment;
  const showDownPaymentRecord = mode === "create";

  return (
    <form id={id} className="space-y-6" onSubmit={onSubmit} noValidate>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Parties</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            id="unit-sale-unit"
            label="Unit"
            size="sm"
            value={values.unit_id}
            onChange={updateField("unit_id")}
            error={errors.unit_id}
            disabled={disabled || lockUnitAndClient}
          >
            <option value="">Select a unit</option>
            {unitOptions.map((unit) => (
              <option key={unit.id} value={String(unit.id)}>
                {translationText(unit.name, "en") !== "—"
                  ? `${translationText(unit.name, "en")}${unit.code ? ` (${unit.code})` : ""}`
                  : unit.code || `Unit #${unit.id}`}
                {unit.status ? ` · ${unit.status}` : ""}
              </option>
            ))}
          </Select>

          <Select
            id="unit-sale-client"
            label="Client"
            size="sm"
            value={values.client_id}
            onChange={updateField("client_id")}
            error={errors.client_id}
            disabled={disabled || lockUnitAndClient}
          >
            <option value="">Select a client</option>
            {clientOptions.map((client) => (
              <option key={client.id} value={String(client.id)}>
                {translationText(client.name, "en") !== "—"
                  ? translationText(client.name, "en")
                  : `Client #${client.id}`}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Sale Details</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            id="unit-sale-type"
            label="Sale Type"
            size="sm"
            value={values.sale_type}
            onChange={updateField("sale_type")}
            error={errors.sale_type}
            disabled={disabled}
          >
            {SALE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            id="unit-sale-status"
            label="Status"
            size="sm"
            value={values.status}
            onChange={updateField("status")}
            error={errors.status}
            disabled={disabled}
          >
            {SALE_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Input
            id="unit-sale-total-price"
            label="Total Price"
            type="number"
            min="0"
            step="0.01"
            value={values.total_price}
            onChange={updateField("total_price")}
            error={errors.total_price}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />

          <Input
            id="unit-sale-down-payment"
            label="Down Payment"
            type="number"
            min="0"
            step="0.01"
            value={values.down_payment}
            onChange={updateField("down_payment")}
            error={errors.down_payment}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />

          <Input
            id="unit-sale-contract-number"
            label="Contract Number"
            value={values.contract_number}
            onChange={updateField("contract_number")}
            error={errors.contract_number}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />

          <Input
            id="unit-sale-contract-date"
            label="Contract Date"
            type="date"
            value={values.contract_date}
            onChange={updateField("contract_date")}
            error={errors.contract_date}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Contract PDF</h3>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="unit-sale-contract-pdf"
            className="text-sm font-semibold text-text-primary"
          >
            {mode === "edit" ? "Replace PDF (optional)" : "Upload PDF (optional)"}
          </label>
          <input
            id="unit-sale-contract-pdf"
            type="file"
            accept="application/pdf,.pdf"
            disabled={disabled}
            onChange={updateFile}
            className="block w-full text-sm text-text-secondary file:mr-4 file:rounded-lg file:border-0 file:bg-wanas-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-wanas-700 hover:file:bg-wanas-100"
          />
          {values.contract_pdf?.name ? (
            <p className="text-xs text-text-muted">
              Selected: {values.contract_pdf.name}
            </p>
          ) : null}
          {errors.contract_pdf ? (
            <p role="alert" className="text-sm text-danger-600">
              {errors.contract_pdf}
            </p>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Notes</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Textarea
            id="unit-sale-notes-ar"
            label="Arabic Notes"
            value={values.notes_ar}
            onChange={updateField("notes_ar")}
            error={errors.notes_ar}
            disabled={disabled}
            dir="rtl"
            rows={3}
          />
          <Textarea
            id="unit-sale-notes-en"
            label="English Notes"
            value={values.notes_en}
            onChange={updateField("notes_en")}
            error={errors.notes_en}
            disabled={disabled}
            rows={3}
          />
        </div>
      </section>

      {showInstallmentFields ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">
            Installment Plan
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              id="unit-sale-months"
              label="Months"
              type="number"
              min="1"
              step="1"
              value={values.months}
              onChange={updateField("months")}
              error={errors.months}
              disabled={disabled}
              className="[&_input]:h-11 [&_input]:text-sm"
            />
            <Input
              id="unit-sale-monthly-amount"
              label="Monthly Amount"
              type="number"
              min="0"
              step="0.01"
              value={values.monthly_amount}
              onChange={updateField("monthly_amount")}
              error={errors.monthly_amount}
              disabled={disabled}
              className="[&_input]:h-11 [&_input]:text-sm"
            />
            <Input
              id="unit-sale-installment-start"
              label="Start Date"
              type="date"
              value={values.installment_start_date}
              onChange={updateField("installment_start_date")}
              error={errors.installment_start_date}
              disabled={disabled}
              className="[&_input]:h-11 [&_input]:text-sm"
            />
          </div>
        </section>
      ) : null}

      {showDownPaymentRecord ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">
            Record Down Payment
          </h3>
          <Checkbox
            id="unit-sale-record-down-payment"
            label="Record down payment on create"
            checked={Boolean(values.record_down_payment)}
            onChange={updateField("record_down_payment")}
            disabled={disabled}
          />
          {values.record_down_payment ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Select
                id="unit-sale-down-payment-method"
                label="Payment Method"
                size="sm"
                value={values.down_payment_method}
                onChange={updateField("down_payment_method")}
                error={errors.down_payment_method}
                disabled={disabled}
              >
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Input
                id="unit-sale-down-payment-receipt"
                label="Receipt Number"
                value={values.down_payment_receipt}
                onChange={updateField("down_payment_receipt")}
                error={errors.down_payment_receipt}
                disabled={disabled}
                className="[&_input]:h-11 [&_input]:text-sm"
              />
            </div>
          ) : null}
        </section>
      ) : null}
    </form>
  );
};

export default UnitSaleForm;
