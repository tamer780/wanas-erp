import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import UnitSaleForm from "./UnitSaleForm";
import {
  emptyUnitSaleForm,
  formValuesToFormData,
  formValuesToPayload,
  shouldUseFormData,
  unitSaleToFormValues,
  validateUnitSaleForm,
} from "../../utils/unitSaleValidation";

const UnitSaleFormModal = ({
  open,
  mode = "create",
  sale = null,
  submitting = false,
  unitOptions = [],
  clientOptions = [],
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState(emptyUnitSaleForm());
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!open) return;
    setValues(mode === "edit" ? unitSaleToFormValues(sale) : emptyUnitSaleForm());
    setErrors({});
    setSubmitError("");
  }, [open, mode, sale]);

  const resolvedUnitOptions = useMemo(() => {
    if (mode === "edit") {
      const units = [...unitOptions];
      if (
        sale?.unit &&
        !units.some((unit) => String(unit.id) === String(sale.unit.id))
      ) {
        units.unshift(sale.unit);
      }
      return units;
    }

    const available = unitOptions.filter(
      (unit) => String(unit.status).toLowerCase() === "available",
    );
    return available.length > 0 ? available : unitOptions;
  }, [mode, sale, unitOptions]);

  const resolvedClientOptions = useMemo(() => {
    if (mode !== "edit") return clientOptions;
    const clients = [...clientOptions];
    if (
      sale?.client &&
      !clients.some((client) => String(client.id) === String(sale.client.id))
    ) {
      clients.unshift(sale.client);
    }
    return clients;
  }, [mode, sale, clientOptions]);

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateUnitSaleForm(values, { mode });
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) return;

    try {
      const payload = shouldUseFormData(values)
        ? formValuesToFormData(values, { mode })
        : formValuesToPayload(values, { mode });
      await onSubmit(payload);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      setSubmitError(message);
    }
  };

  const isEdit = mode === "edit";

  return (
    <Modal
      open={open}
      onClose={onClose}
      preventClose={submitting}
      size="xl"
      title={isEdit ? "Edit Unit Sale" : "Create Unit Sale"}
      description={
        isEdit
          ? "Update contract and sale information."
          : "Add a new unit sale with contract and payment details."
      }
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="unit-sale-form"
            size="md"
            loading={submitting}
          >
            {isEdit ? "Save Changes" : "Create Sale"}
          </Button>
        </>
      }
    >
      {submitError ? (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-danger-100 bg-danger-50 px-4 py-3 text-sm text-danger-700"
        >
          {submitError}
        </div>
      ) : null}

      <UnitSaleForm
        mode={mode}
        values={values}
        errors={errors}
        disabled={submitting}
        unitOptions={resolvedUnitOptions}
        clientOptions={resolvedClientOptions}
        lockUnitAndClient={isEdit}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      {!isEdit ? (
        <p className="mt-4 text-xs text-text-muted">
          Need a client first?{" "}
          <Link
            to="/clients"
            className="font-medium text-wanas-700 hover:underline"
          >
            Manage clients
          </Link>
        </p>
      ) : null}
    </Modal>
  );
};

export default UnitSaleFormModal;
