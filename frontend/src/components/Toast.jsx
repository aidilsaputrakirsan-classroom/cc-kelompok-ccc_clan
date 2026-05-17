function Toast({ show, type = "success", message, onClose }) {
  if (!show) return null;

  return (
    <div
      className={`custom-toast ${
        type === "error" ? "toast-error" : "toast-success"
      }`}
    >
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        <button className="toast-close-btn" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;