import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import UnitForm from "./UnitForm";
import {
  emptyUnitForm,
  formValuesToPayload,
  unitToFormValues,
  validateUnitForm,
} from "../../utils/unitValidation";

const UnitFormModal = ({
  open,
  mode = "create",
  unit = null,
  buildingOptions = [],
  submitting = false,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState(emptyUnitForm());
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!open) return;
    setValues(mode === "edit" ? unitToFormValues(unit) : emptyUnitForm());
    setErrors({});
    setSubmitError("");
  }, [open, mode, unit]);

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
    const nextErrors = validateUnitForm(values);
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
      title={isEdit ? "Edit Unit" : "New Unit"}
      description={
        isEdit
          ? "Update unit details and pricing information."
          : "Add a new unit to a building."
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
            form="unit-form"
            size="md"
            loading={submitting}
          >
            {isEdit ? "Save" : "Create"}
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

      <UnitForm
        values={values}
        errors={errors}
        disabled={submitting}
        buildingOptions={buildingOptions}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default UnitFormModal;
