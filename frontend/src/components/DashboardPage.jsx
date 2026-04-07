import { useEffect, useMemo, useState } from "react";
import { getPublicCandidates } from "../services/api";

function DashboardPage({ user }) {
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
          "Data kandidat belum bisa ditampilkan. Endpoint publik kandidat di backend belum tersedia."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const chartData = useMemo(() => {
    const pending = candidates.filter((c) => c.status === "pending").length;
    const approved = candidates.filter((c) => c.status === "approved").length;
    const rejected = candidates.filter((c) => c.status === "rejected").length;

    return [
      { label: "Pending", value: pending, color: "#f59e0b" },
      { label: "Approved", value: approved, color: "#22c55e" },
      { label: "Rejected", value: rejected, color: "#ef4444" },
    ];
  }, [candidates]);

  const maxValue = Math.max(...chartData.map((item) => item.value), 1);

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <h1 style={styles.title}>Dashboard SIPILIH</h1>
        <p style={styles.subtitle}>
          Selamat datang kembali, <strong>{user?.name}</strong>.
        </p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>NIM</p>
          <h2 style={styles.cardValue}>{user?.nim || "-"}</h2>
        </div>

        <div style={styles.card}>
          <p style={styles.cardLabel}>Prodi</p>
          <h2 style={styles.cardValue}>{user?.prodi || "-"}</h2>
        </div>

        <div style={styles.card}>
          <p style={styles.cardLabel}>Angkatan</p>
          <h2 style={styles.cardValue}>{user?.angkatan || "-"}</h2>
        </div>
      </div>

      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <div>
            <h2 style={styles.chartTitle}>Statistik Kandidat</h2>
            <p style={styles.chartSubtitle}>
              Grafik jumlah kandidat berdasarkan status.
            </p>
          </div>
          <div style={styles.totalBox}>
            <span style={styles.totalLabel}>Total Kandidat</span>
            <span style={styles.totalValue}>{candidates.length}</span>
          </div>
        </div>

        {loading ? (
          <p style={styles.loadingText}>Loading grafik...</p>
        ) : pageMessage ? (
          <p style={styles.loadingText}>{pageMessage}</p>
        ) : (
          <div style={styles.chartWrapper}>
            {chartData.map((item) => (
              <div key={item.label} style={styles.barRow}>
                <div style={styles.barInfo}>
                  <span style={styles.barLabel}>{item.label}</span>
                  <span style={styles.barValue}>{item.value}</span>
                </div>

                <div style={styles.barTrack}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
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
    lineHeight: "1.6",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  },
  cardLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  cardValue: {
    margin: "8px 0 0 0",
    color: "#0f172a",
    fontSize: "1.3rem",
  },
  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "22px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  },
  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "20px",
  },
  chartTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "1.15rem",
  },
  chartSubtitle: {
    margin: "8px 0 0 0",
    color: "#64748b",
    fontSize: "0.95rem",
  },
  totalBox: {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    padding: "10px 14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "110px",
  },
  totalLabel: {
    color: "#64748b",
    fontSize: "0.8rem",
    fontWeight: "600",
  },
  totalValue: {
    color: "#0f172a",
    fontSize: "1.4rem",
    fontWeight: "800",
    marginTop: "4px",
  },
  chartWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  barRow: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  barInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  barLabel: {
    color: "#334155",
    fontWeight: "600",
    fontSize: "0.95rem",
  },
  barValue: {
    color: "#0f172a",
    fontWeight: "700",
    fontSize: "0.95rem",
  },
  barTrack: {
    width: "100%",
    height: "14px",
    backgroundColor: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: "999px",
    transition: "0.3s ease",
  },
  loadingText: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.96rem",
    lineHeight: "1.6",
  },
};

export default DashboardPage;