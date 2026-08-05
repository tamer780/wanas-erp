import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import WorkItemForm from "./WorkItemForm";
import {
  emptyWorkItemForm,
  formValuesToPayload,
  validateWorkItemForm,
  workItemToFormValues,
} from "../../utils/workItemValidation";

const WorkItemFormModal = ({
  open,
  mode = "create",
  item = null,
  submitting = false,
  contractorOptions = [],
  buildingOptions = [],
  landOptions = [],
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState(emptyWorkItemForm());
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!open) return;
    setValues(mode === "edit" ? workItemToFormValues(item) : emptyWorkItemForm());
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
    const nextErrors = validateWorkItemForm(values);
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
      title={isEdit ? "Edit Work Item" : "New Work Item"}
      description={
        isEdit
          ? "Update work item assignment and schedule."
          : "Add a new construction work item."
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
            form="work-item-form"
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

      <WorkItemForm
        values={values}
        errors={errors}
        disabled={submitting}
        contractorOptions={contractorOptions}
        buildingOptions={buildingOptions}
        landOptions={landOptions}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default WorkItemFormModal;
