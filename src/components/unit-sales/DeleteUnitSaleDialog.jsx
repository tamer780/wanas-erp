import Modal from "../ui/Modal";
import Button from "../ui/Button";

const DeleteUnitSaleDialog = ({
  open,
  sale,
  deleting = false,
  error = "",
  onClose,
  onConfirm,
}) => {
  const label = sale?.contract_number || "this unit sale";

  return (
    <Modal
      open={open}
      onClose={onClose}
      preventClose={deleting}
      size="sm"
      title="Delete Unit Sale"
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
        <span className="font-semibold text-text-primary">{label}</span>? Related
        installments and payments may also be affected depending on server rules.
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

export default DeleteUnitSaleDialog;
