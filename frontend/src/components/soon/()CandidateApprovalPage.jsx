import { useEffect, useState } from "react";
import {
  getAdminCandidates,
  approveCandidate,
  rejectCandidate,
} from "../../services/api";

function CandidateApprovalPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getAdminCandidates();
      setCandidates(data);
    } catch (err) {
      console.error("Gagal ambil kandidat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveCandidate(id);
      fetchData();
    } catch (err) {
      console.error("Gagal approve kandidat:", err);
      alert(err.message || "Gagal approve kandidat");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectCandidate(id);
      fetchData();
    } catch (err) {
      console.error("Gagal reject kandidat:", err);
      alert(err.message || "Gagal reject kandidat");
    }
  };

  if (loading) {
    return (
      <div style={styles.stateBox}>
        <p style={styles.stateText}>Loading kandidat...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <h1 style={styles.title}>Approval Kandidat</h1>
        <p style={styles.subtitle}>
          Tinjau, setujui, atau tolak kandidat yang mendaftar.
        </p>
      </div>

      {candidates.length === 0 ? (
        <div style={styles.stateBox}>
          <p style={styles.stateText}>Tidak ada kandidat.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {candidates.map((c) => (
            <div key={c.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <p style={styles.badge}>Kandidat #{c.id}</p>
                  <h2 style={styles.cardTitle}>{c.posisi}</h2>
                </div>

                <span style={getStatusStyle(c.status)}>{c.status}</span>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Visi</h3>
                <p style={styles.text}>{c.visi}</p>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Misi</h3>
                <p style={styles.text}>{c.misi}</p>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Inovasi</h3>
                <p style={styles.text}>{c.inovasi}</p>
              </div>

              {c.status === "pending" && (
                <div style={styles.actions}>
                  <button
                    style={styles.approveBtn}
                    onClick={() => handleApprove(c.id)}
                  >
                    Approve
                  </button>
                  <button
                    style={styles.rejectBtn}
                    onClick={() => handleReject(c.id)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "18px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  badge: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.82rem",
    fontWeight: "600",
  },
  cardTitle: {
    margin: "6px 0 0 0",
    color: "#0f172a",
    fontSize: "1.25rem",
  },
  section: {
    borderTop: "1px solid #e2e8f0",
    paddingTop: "12px",
  },
  sectionTitle: {
    margin: "0 0 8px 0",
    color: "#1e293b",
    fontSize: "0.95rem",
  },
  text: {
    margin: 0,
    color: "#334155",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    whiteSpace: "pre-line",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  approveBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },
  rejectBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },
  stateBox: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "28px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  },
  stateText: {
    margin: 0,
    color: "#64748b",
    fontSize: "1rem",
  },
};

const getStatusStyle = (status) => {
  if (status === "approved") {
    return {
      backgroundColor: "#dcfce7",
      color: "#166534",
      padding: "6px 10px",
      borderRadius: "999px",
      fontSize: "0.8rem",
      fontWeight: "700",
      textTransform: "capitalize",
      whiteSpace: "nowrap",
    };
  }

  if (status === "rejected") {
    return {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      padding: "6px 10px",
      borderRadius: "999px",
      fontSize: "0.8rem",
      fontWeight: "700",
      textTransform: "capitalize",
      whiteSpace: "nowrap",
    };
  }

  return {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: "700",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  };
};

export default CandidateApprovalPage;