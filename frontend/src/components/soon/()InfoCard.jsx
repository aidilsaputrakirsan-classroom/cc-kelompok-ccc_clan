function InfoCard({ title, value, subtitle }) {
    return (
      <div style={styles.card}>
        <p style={styles.title}>{title}</p>
        <h2 style={styles.value}>{value}</h2>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>
    );
  }
  
  const styles = {
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "14px",
      padding: "20px",
      boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      minHeight: "120px",
    },
    title: {
      margin: 0,
      fontSize: "0.95rem",
      color: "#64748b",
      marginBottom: "10px",
    },
    value: {
      margin: 0,
      fontSize: "1.6rem",
      color: "#0f172a",
    },
    subtitle: {
      marginTop: "10px",
      fontSize: "0.85rem",
      color: "#94a3b8",
    },
  };
  
  export default InfoCard;