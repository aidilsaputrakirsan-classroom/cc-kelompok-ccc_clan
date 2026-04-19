function ProfilePage({ user }) {
    return (
      <div style={styles.container}>
        <div style={styles.headerSection}>
          <h1 style={styles.title}>Profil Saya</h1>
          <p style={styles.subtitle}>
            Informasi akun dan data mahasiswa yang terdaftar di SIPILIH.
          </p>
        </div>
  
        <div style={styles.profileGrid}>
          <div style={styles.profileCard}>
            <div style={styles.avatarBox}>
              <div style={styles.avatar}>👤</div>
              <div>
                <h2 style={styles.name}>{user?.name || "-"}</h2>
                <p style={styles.role}>{user?.role || "-"}</p>
              </div>
            </div>
  
            <div style={styles.statusRow}>
              <span style={styles.statusLabel}>Status Akun</span>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: user?.is_active ? "#dcfce7" : "#fee2e2",
                  color: user?.is_active ? "#166534" : "#991b1b",
                }}
              >
                {user?.is_active ? "Aktif" : "Tidak Aktif"}
              </span>
            </div>
          </div>
  
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Informasi Akun</h3>
  
            <div style={styles.infoList}>
              <div style={styles.infoItem}>
                <span style={styles.label}>Email</span>
                <span style={styles.value}>{user?.email || "-"}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.label}>Nama Lengkap</span>
                <span style={styles.value}>{user?.name || "-"}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.label}>Role</span>
                <span style={styles.value}>{user?.role || "-"}</span>
              </div>
            </div>
          </div>
  
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Data Mahasiswa</h3>
  
            <div style={styles.infoList}>
              <div style={styles.infoItem}>
                <span style={styles.label}>NIM</span>
                <span style={styles.value}>{user?.nim || "-"}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.label}>Prodi</span>
                <span style={styles.value}>{user?.prodi || "-"}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.label}>Jurusan</span>
                <span style={styles.value}>{user?.jurusan || "-"}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.label}>Fakultas</span>
                <span style={styles.value}>{user?.fakultas || "-"}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.label}>Angkatan</span>
                <span style={styles.value}>{user?.angkatan || "-"}</span>
              </div>
            </div>
          </div>
  
          <div style={styles.noteCard}>
            <h3 style={styles.cardTitle}>Catatan</h3>
            <p style={styles.noteText}>
              Pastikan data profil kamu sudah benar sebelum mengikuti proses
              pemilihan, pendaftaran kandidat, atau voting di SIPILIH.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    headerSection: {
      backgroundColor: "#ffffff",
      borderRadius: "14px",
      padding: "22px",
      boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    },
    title: {
      margin: 0,
      color: "#0f172a",
      fontSize: "1.8rem",
    },
    subtitle: {
      marginTop: "8px",
      marginBottom: 0,
      color: "#64748b",
      fontSize: "0.96rem",
    },
    profileGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "18px",
    },
    profileCard: {
      backgroundColor: "#ffffff",
      borderRadius: "14px",
      padding: "22px",
      boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    },
    avatarBox: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    avatar: {
      width: "72px",
      height: "72px",
      borderRadius: "50%",
      backgroundColor: "#e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.8rem",
    },
    name: {
      margin: 0,
      fontSize: "1.3rem",
      color: "#0f172a",
    },
    role: {
      margin: "6px 0 0 0",
      fontSize: "0.95rem",
      color: "#64748b",
      textTransform: "capitalize",
    },
    statusRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderTop: "1px solid #e2e8f0",
      paddingTop: "14px",
    },
    statusLabel: {
      color: "#334155",
      fontWeight: "600",
    },
    statusBadge: {
      padding: "6px 12px",
      borderRadius: "999px",
      fontSize: "0.82rem",
      fontWeight: "700",
    },
    infoCard: {
      backgroundColor: "#ffffff",
      borderRadius: "14px",
      padding: "22px",
      boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    },
    noteCard: {
      backgroundColor: "#ffffff",
      borderRadius: "14px",
      padding: "22px",
      boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    },
    cardTitle: {
      marginTop: 0,
      marginBottom: "16px",
      color: "#0f172a",
      fontSize: "1.1rem",
    },
    infoList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    infoItem: {
      display: "flex",
      justifyContent: "space-between",
      gap: "16px",
      paddingBottom: "10px",
      borderBottom: "1px solid #f1f5f9",
    },
    label: {
      color: "#64748b",
      fontWeight: "600",
    },
    value: {
      color: "#0f172a",
      textAlign: "right",
      maxWidth: "60%",
      wordBreak: "break-word",
    },
    noteText: {
      margin: 0,
      color: "#334155",
      lineHeight: "1.7",
      fontSize: "0.95rem",
    },
  };
  
  export default ProfilePage;