function InlineAlert({ type = "error", title, message, items = [], onRetry }) {
    if (!message && items.length === 0) return null;
  
    const finalTitle =
      title ||
      (type === "success"
        ? "Berhasil"
        : type === "warning"
          ? "Perlu diperhatikan"
          : "Terjadi kesalahan");
  
    return (
      <div className={`inline-alert inline-alert-${type}`} role="alert">
        <div>
          <strong>{finalTitle}</strong>
          {message && <p>{message}</p>}
  
          {items.length > 0 && (
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
  
        {onRetry && (
          <button type="button" className="inline-alert-action" onClick={onRetry}>
            Coba lagi
          </button>
        )}
      </div>
    );
  }
  
  export default InlineAlert;
  