import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import MaterialPurchaseForm from "./MaterialPurchaseForm";
import {
  emptyMaterialPurchaseForm,
  formValuesToPayload,
  materialPurchaseToFormValues,
  validateMaterialPurchaseForm,
} from "../../utils/materialPurchaseValidation";

const MaterialPurchaseFormModal = ({
  open,
  mode = "create",
  item = null,
  submitting = false,
  supplierOptions = [],
  landOptions = [],
  buildingOptions = [],
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState(emptyMaterialPurchaseForm());
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!open) return;
    setValues(
      mode === "edit"
        ? materialPurchaseToFormValues(item)
        : emptyMaterialPurchaseForm(),
    );
    setErrors({});
    setSubmitError("");
  }, [open, mode, item]);

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
    const nextErrors = validateMaterialPurchaseForm(values);
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) return;

    try {
      await onSubmit(formValuesToPayload(values));
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
      size="lg"
      title={isEdit ? "Edit Material Purchase" : "New Material Purchase"}
      description={
        isEdit
          ? "Update purchase order details."
          : "Record a new material purchase."
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
            form="material-purchase-form"
            size="md"
            loading={submitting}
          >
            Save
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

      <MaterialPurchaseForm
        values={values}
        errors={errors}
        disabled={submitting}
        supplierOptions={supplierOptions}
        landOptions={landOptions}
        buildingOptions={buildingOptions}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default MaterialPurchaseFormModal;
