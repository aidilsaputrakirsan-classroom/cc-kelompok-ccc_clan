import { useEffect, useState } from "react";
import { getPublicCandidates } from "../services/api";

function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageMessage, setPageMessage] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await getPublicCandidates();
        setCandidates(data);
      } catch (err) {
        console.error("Gagal ambil kandidat:", err);
        setPageMessage(
          "Daftar kandidat belum tersedia. Backend belum menyediakan endpoint publik kandidat."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

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
        <h1 style={styles.title}>Daftar Kandidat</h1>
        <p style={styles.subtitle}>
          Lihat informasi kandidat yang terdaftar di SIPILIH.
        </p>
      </div>

      {pageMessage ? (
        <div style={styles.stateBox}>
          <p style={styles.stateText}>{pageMessage}</p>
        </div>
      ) : candidates.length === 0 ? (
        <div style={styles.stateBox}>
          <p style={styles.stateText}>Belum ada kandidat yang tersedia.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {candidates.map((candidate) => (
            <div key={candidate.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <p style={styles.badge}>Kandidat #{candidate.id}</p>
                  <h2 style={styles.cardTitle}>{candidate.posisi}</h2>
                </div>

                <span style={getStatusStyle(candidate.status)}>
                  {candidate.status}
                </span>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Visi</h3>
                <p style={styles.text}>{candidate.visi}</p>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Misi</h3>
                <p style={styles.text}>{candidate.misi}</p>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Inovasi</h3>
                <p style={styles.text}>{candidate.inovasi}</p>
              </div>
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
    lineHeight: "1.6",
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

export default CandidatesPage;