import Modal from "./Modal";
import Button from "./Button";

const ConfirmModal = ({
  isOpen,
  title = "Confirm Action",
  message,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      maxWidth="max-w-md"
    >
      <div className="space-y-6">

        <p className="text-slate-300">
          {message}
        </p>

        <div className="flex justify-end gap-3">

          <Button
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
          >
            Delete
          </Button>

        </div>

      </div>
    </Modal>
  );
};

export default ConfirmModal;