import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import {
  PAYABLE_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  REFERENCE_TYPE_OPTIONS,
} from "../../utils/payablePaymentValidation";
import { formatDate, formatMoney, translationText } from "../../utils/format";

const entityLabel = (entity) => {
  if (!entity) return "";
  const name = translationText(entity.name ?? entity.title, "en");
  if (name !== "—") {
    return entity.code ? `${name} (${entity.code})` : name;
  }
  return entity.code || entity.invoice_number || `#${entity.id}`;
};

const scheduleLabel = (schedule) => {
  const amount = formatMoney(schedule.amount ?? schedule.total_amount);
  const due = formatDate(schedule.due_date ?? schedule.payment_date);
  const status = schedule.status ? ` · ${schedule.status}` : "";
  const duePart = due !== "—" ? ` · due ${due}` : "";
  return `#${schedule.id} · ${amount}${duePart}${status}`;
};

const PayablePaymentForm = ({
  id = "payable-payment-form",
  values,
  errors = {},
  disabled = false,
  payableOptions = [],
  referenceOptions = [],
  scheduleOptions = [],
  schedulesLoading = false,
  onChange,
  onSubmit,
}) => {
  const updateField = (field) => (event) => {
    onChange(field, event.target.value);
  };

  const payableLabel =
    values.payable_type === "contractor" ? "Contractor" : "Supplier";

  const referenceLabel =
    values.reference_type === "work_item"
      ? "Work Item"
      : values.reference_type === "material_purchase"
        ? "Material Purchase"
        : "Reference";

  return (
    <form id={id} className="space-y-6" onSubmit={onSubmit} noValidate>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Payable</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            id="payable-payment-type"
            label="Payable Type"
            size="sm"
            value={values.payable_type}
            onChange={updateField("payable_type")}
            error={errors.payable_type}
            disabled={disabled}
          >
            {PAYABLE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            id="payable-payment-payable"
            label={payableLabel}
            size="sm"
            value={values.payable_id}
            onChange={updateField("payable_id")}
            error={errors.payable_id}
            disabled={disabled || !values.payable_type}
          >
            <option value="">Select a {payableLabel.toLowerCase()}</option>
            {payableOptions.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {entityLabel(item)}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Reference</h3>
        <p className="text-xs text-text-muted">
          Optionally link this payment to a material purchase or work item.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            id="payable-payment-reference-type"
            label="Reference Type"
            size="sm"
            value={values.reference_type}
            onChange={updateField("reference_type")}
            error={errors.reference_type}
            disabled={disabled}
          >
            <option value="">None</option>
            {REFERENCE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            id="payable-payment-reference"
            label={referenceLabel}
            size="sm"
            value={values.reference_id}
            onChange={updateField("reference_id")}
            error={errors.reference_id}
            disabled={disabled || !values.reference_type}
          >
            <option value="">
              {values.reference_type
                ? `Select a ${referenceLabel.toLowerCase()}`
                : "Select a reference type first"}
            </option>
            {referenceOptions.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {entityLabel(item)}
              </option>
            ))}
          </Select>

          <Select
            id="payable-payment-schedule"
            label="Payment Schedule"
            size="sm"
            value={values.payment_schedule_id}
            onChange={updateField("payment_schedule_id")}
            error={errors.payment_schedule_id}
            disabled={
              disabled || !values.reference_id || schedulesLoading
            }
            className="sm:col-span-2"
          >
            <option value="">
              {schedulesLoading
                ? "Loading schedules…"
                : values.reference_id
                  ? "None (optional)"
                  : "Select a reference first"}
            </option>
            {scheduleOptions.map((schedule) => (
              <option key={schedule.id} value={String(schedule.id)}>
                {scheduleLabel(schedule)}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Payment</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            id="payable-payment-amount"
            label="Amount"
            type="number"
            min="0"
            step="0.01"
            value={values.amount}
            onChange={updateField("amount")}
            error={errors.amount}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />

          <Select
            id="payable-payment-method"
            label="Payment Method"
            size="sm"
            value={values.payment_method}
            onChange={updateField("payment_method")}
            error={errors.payment_method}
            disabled={disabled}
          >
            <option value="">Select a method</option>
            {PAYMENT_METHOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Input
            id="payable-payment-receipt"
            label="Receipt Number"
            value={values.receipt_number}
            onChange={updateField("receipt_number")}
            error={errors.receipt_number}
            disabled={disabled}
            placeholder="TRX-20260807-001"
            className="[&_input]:h-11 [&_input]:text-sm"
          />

          <Input
            id="payable-payment-paid-at"
            label="Paid At"
            type="date"
            value={values.paid_at}
            onChange={updateField("paid_at")}
            error={errors.paid_at}
            disabled={disabled}
            className="[&_input]:h-11 [&_input]:text-sm"
          />

          <Textarea
            id="payable-payment-notes"
            label="Notes"
            value={values.notes}
            onChange={updateField("notes")}
            error={errors.notes}
            disabled={disabled}
            rows={3}
            className="sm:col-span-2"
          />
        </div>
      </section>
    </form>
  );
};

export default PayablePaymentForm;
