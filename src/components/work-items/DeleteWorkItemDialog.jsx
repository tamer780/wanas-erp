import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { translationText } from "../../utils/format";

const DeleteWorkItemDialog = ({
  open,
  item,
  deleting = false,
  error = "",
  onClose,
  onConfirm,
}) => {
  const title =
    translationText(item?.title, "en") !== "—"
      ? translationText(item?.title, "en")
      : "this work item";

  return (
    <Modal
      open={open}
      onClose={onClose}
      preventClose={deleting}
      size="sm"
      title="Delete Work Item"
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
        <span className="font-semibold text-text-primary">{title}</span>? Related
        payment schedules may also be affected depending on server rules.
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

export default DeleteWorkItemDialog;
