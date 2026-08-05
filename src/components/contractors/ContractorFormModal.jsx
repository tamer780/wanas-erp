import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import ContractorForm from "./ContractorForm";
import {
  contractorToFormValues,
  emptyContractorForm,
  formValuesToPayload,
  validateContractorForm,
} from "../../utils/contractorValidation";

const ContractorFormModal = ({
  open,
  mode = "create",
  contractor = null,
  submitting = false,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState(emptyContractorForm());
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!open) return;
    setValues(
      mode === "edit"
        ? contractorToFormValues(contractor)
        : emptyContractorForm(),
    );
    setErrors({});
    setSubmitError("");
  }, [open, mode, contractor]);

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
    const nextErrors = validateContractorForm(values);
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
      title={isEdit ? "Edit Contractor" : "New Contractor"}
      description={
        isEdit
          ? "Update contractor profile and contact information."
          : "Add a new contractor to the system."
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
            form="contractor-form"
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

      <ContractorForm
        values={values}
        errors={errors}
        disabled={submitting}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default ContractorFormModal;
