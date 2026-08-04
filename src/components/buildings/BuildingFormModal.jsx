import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import BuildingForm from "./BuildingForm";
import {
  buildingToFormValues,
  emptyBuildingForm,
  formValuesToPayload,
  validateBuildingForm,
} from "../../utils/buildingValidation";

const BuildingFormModal = ({
  open,
  mode = "create",
  building = null,
  landOptions = [],
  submitting = false,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState(emptyBuildingForm());
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!open) return;
    setValues(
      mode === "edit" ? buildingToFormValues(building) : emptyBuildingForm(),
    );
    setErrors({});
    setSubmitError("");
  }, [open, mode, building]);

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
    const nextErrors = validateBuildingForm(values);
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
      title={isEdit ? "Edit Building" : "New Building"}
      description={
        isEdit
          ? "Update building details and construction information."
          : "Add a new building to a land parcel."
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
            form="building-form"
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

      <BuildingForm
        values={values}
        errors={errors}
        disabled={submitting}
        landOptions={landOptions}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default BuildingFormModal;
