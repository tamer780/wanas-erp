import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import UserForm from "./UserForm";
import {
  emptyUserForm,
  formValuesToPayload,
  userToFormValues,
  validateUserForm,
} from "../../utils/userValidation";

const UserFormModal = ({
  open,
  mode = "create",
  user = null,
  submitting = false,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState(emptyUserForm());
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!open) return;
    setValues(mode === "edit" ? userToFormValues(user) : emptyUserForm());
    setErrors({});
    setSubmitError("");
  }, [open, mode, user]);

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
    const nextErrors = validateUserForm(values, { mode });
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) return;

    try {
      await onSubmit(formValuesToPayload(values, { mode }));
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
      title={isEdit ? "Edit User" : "New User"}
      description={
        isEdit
          ? "Update user profile, role, and access status."
          : "Add a new user to the system."
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
            form="user-form"
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

      <UserForm
        values={values}
        errors={errors}
        disabled={submitting}
        mode={mode}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default UserFormModal;
