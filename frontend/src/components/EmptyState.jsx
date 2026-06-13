function EmptyState({
    eyebrow = "Data kosong",
    title = "Belum ada data",
    description = "Data belum tersedia untuk ditampilkan.",
    actionLabel,
    onAction,
    children,
  }) {
    return (
      <div className="empty-state-card fase6-empty-state">
        <span>{eyebrow}</span>
        <h3>{title}</h3>
        <p>{description}</p>
  
        {children}
  
        {actionLabel && onAction && (
          <button type="button" className="btn btn-primary" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    );
  }
  
  export default EmptyState;
  