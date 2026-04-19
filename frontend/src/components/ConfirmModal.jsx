function ConfirmModal({
    show,
    title = "Konfirmasi",
    message = "Apakah kamu yakin?",
    confirmText = "Ya",
    cancelText = "Batal",
    onConfirm,
    onCancel,
  }) {
    if (!show) return null;
  
    return (
      <div className="modal-overlay">
        <div className="confirm-modal">
          <h3>{title}</h3>
          <p>{message}</p>
  
          <div className="confirm-modal-actions">
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              {cancelText}
            </button>
  
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default ConfirmModal;