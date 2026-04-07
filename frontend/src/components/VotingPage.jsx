import { useEffect, useState } from "react";
import { getPublicCandidates } from "../services/api";

function VotingPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [pageMessage, setPageMessage] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await getPublicCandidates();

        // ambil hanya kandidat approved
        const approvedCandidates = data.filter(
          (candidate) => candidate.status === "approved"
        );

        setCandidates(approvedCandidates);
      } catch (err) {
        console.error("Gagal ambil kandidat:", err);
        setPageMessage(
          "Halaman voting belum bisa menampilkan kandidat. Backend belum menyediakan endpoint publik kandidat."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const handleVote = (candidateId) => {
    setSelectedId(candidateId);

    alert(
      `Kamu memilih kandidat #${candidateId}. (Voting backend belum dibuat)`
    );
  };

  if (loading) {
    return (
      <div style={styles.stateBox}>
        <p style={styles.stateText}>Loading voting page...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <h1 style={styles.title}>Voting</h1>
        <p style={styles.subtitle}>
          Pilih kandidat yang sudah disetujui.
        </p>
      </div>

      {pageMessage ? (
        <div style={styles.stateBox}>
          <p style={styles.stateText}>{pageMessage}</p>
        </div>
      ) : candidates.length === 0 ? (
        <div style={styles.stateBox}>
          <p style={styles.stateText}>
            Belum ada kandidat yang bisa dipilih.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {candidates.map((candidate) => {
            const isSelected = selectedId === candidate.id;

            return (
              <div
                key={candidate.id}
                style={{
                  ...styles.card,
                  ...(isSelected ? styles.cardSelected : {}),
                }}
              >
                <div style={styles.cardTop}>
                  <div>
                    <p style={styles.badge}>Kandidat #{candidate.id}</p>
                    <h2 style={styles.cardTitle}>{candidate.posisi}</h2>
                  </div>

                  <span style={styles.approvedBadge}>approved</span>
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

                <button
                  style={{
                    ...styles.voteButton,
                    ...(isSelected ? styles.voteButtonSelected : {}),
                  }}
                  onClick={() => handleVote(candidate.id)}
                >
                  {isSelected ? "Sudah Dipilih" : "Pilih Kandidat"}
                </button>
              </div>
            );
          })}
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
    border: "2px solid transparent",
  },
  cardSelected: {
    border: "2px solid #2563eb",
    boxShadow: "0 8px 20px rgba(37,99,235,0.18)",
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
  approvedBadge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: "700",
    textTransform: "capitalize",
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
  voteButton: {
    marginTop: "8px",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
  },
  voteButtonSelected: {
    backgroundColor: "#1d4ed8",
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

export default VotingPage;