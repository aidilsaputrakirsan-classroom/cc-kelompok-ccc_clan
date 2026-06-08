function ConfirmModal({
  show,
  title = "Konfirmasi",
  message = "Apakah kamu yakin?",
  confirmText = "Ya",
  cancelText = "Batal",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}) {
  if (!show) return null;

  const confirmClass =
    confirmVariant === "primary" ? "btn btn-primary" : "btn btn-danger";

  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="confirm-modal-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            {cancelText}
          </button>

          <button type="button" className={confirmClass} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;