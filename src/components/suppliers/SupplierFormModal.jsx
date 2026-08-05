import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import SupplierForm from "./SupplierForm";
import {
  emptySupplierForm,
  formValuesToPayload,
  supplierToFormValues,
  validateSupplierForm,
} from "../../utils/supplierValidation";

const SupplierFormModal = ({
  open,
  mode = "create",
  supplier = null,
  submitting = false,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState(emptySupplierForm());
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!open) return;
    setValues(
      mode === "edit" ? supplierToFormValues(supplier) : emptySupplierForm(),
    );
    setErrors({});
    setSubmitError("");
  }, [open, mode, supplier]);

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
    const nextErrors = validateSupplierForm(values);
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
      title={isEdit ? "Edit Supplier" : "New Supplier"}
      description={
        isEdit
          ? "Update supplier profile and contact information."
          : "Add a new supplier to the system."
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
            form="supplier-form"
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

      <SupplierForm
        values={values}
        errors={errors}
        disabled={submitting}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default SupplierFormModal;
