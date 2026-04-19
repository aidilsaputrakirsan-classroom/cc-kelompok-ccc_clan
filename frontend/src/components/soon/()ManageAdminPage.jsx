function ManageAdminPage() {
    return (
      <div style={styles.box}>
        <h1 style={styles.title}>Kelola Admin</h1>
        <p style={styles.text}>Halaman kelola admin nanti ditampilkan di sini.</p>
      </div>
    );
  }
  
  const styles = {
    box: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    },
    title: {
      marginTop: 0,
      marginBottom: "16px",
      color: "#1e293b",
    },
    text: {
      color: "#334155",
      fontSize: "16px",
    },
  };
  
  export default ManageAdminPage;