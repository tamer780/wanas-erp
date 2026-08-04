import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { translationText } from "../../utils/format";

const DeleteLandDialog = ({
  open,
  land,
  deleting = false,
  error = "",
  onClose,
  onConfirm,
}) => {
  const name =
    translationText(land?.name, "en") !== "—"
      ? translationText(land?.name, "en")
      : land?.code || "this land";

  return (
    <Modal
      open={open}
      onClose={onClose}
      preventClose={deleting}
      size="sm"
      title="Delete Land"
      description="This action cannot be undone."
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            loading={deleting}
            onClick={onConfirm}
          >
            Delete
          </Button>
        </>
      }
    >
      <p className="text-sm text-text-secondary">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-text-primary">{name}</span>? Related
        buildings and costs may also be affected depending on server rules.
      </p>

      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-danger-100 bg-danger-50 px-4 py-3 text-sm text-danger-700"
        >
          {error}
        </div>
      ) : null}
    </Modal>
  );
};

export default DeleteLandDialog;
