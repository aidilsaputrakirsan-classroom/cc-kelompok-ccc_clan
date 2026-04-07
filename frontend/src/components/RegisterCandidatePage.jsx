import { useState } from "react";
import { createCandidate } from "../services/api";

function RegisterCandidatePage() {
  const [form, setForm] = useState({
    posisi: "",
    visi: "",
    misi: "",
    inovasi: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.posisi || !form.visi || !form.misi || !form.inovasi) {
      alert("Semua field harus diisi");
      return;
    }

    setLoading(true);

    try {
      await createCandidate(form);
      alert("Berhasil daftar sebagai kandidat!");
      setForm({
        posisi: "",
        visi: "",
        misi: "",
        inovasi: "",
      });
    } catch (err) {
      alert(err.message || "Gagal daftar kandidat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <h1 style={styles.title}>Daftar Jadi Kandidat</h1>
        <p style={styles.subtitle}>
          Isi data pencalonan kamu dengan lengkap. Setelah dikirim, pengajuanmu
          akan masuk ke proses review admin.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.topInfo}>
          <div style={styles.badge}>Form Pendaftaran</div>
          <p style={styles.infoText}>
            Pastikan visi, misi, dan inovasi ditulis dengan jelas agar mudah
            ditinjau oleh admin.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Posisi</label>
            <input
              type="text"
              name="posisi"
              placeholder="Contoh: Ketua BEM"
              value={form.posisi}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.section}>
            <label style={styles.sectionTitle}>Visi</label>
            <textarea
              name="visi"
              placeholder="Tuliskan visi kamu"
              value={form.visi}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>

          <div style={styles.section}>
            <label style={styles.sectionTitle}>Misi</label>
            <textarea
              name="misi"
              placeholder="Tuliskan misi kamu"
              value={form.misi}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>

          <div style={styles.section}>
            <label style={styles.sectionTitle}>Inovasi</label>
            <textarea
              name="inovasi"
              placeholder="Tuliskan inovasi atau program unggulan kamu"
              value={form.inovasi}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>

          <div style={styles.actionRow}>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Mengirim..." : "Kirim Pendaftaran"}
            </button>
          </div>
        </form>
      </div>
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
    lineHeight: "1.6",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    width: "100%",
    boxSizing: "border-box",
  },
  topInfo: {
    paddingBottom: "12px",
    borderBottom: "1px solid #e2e8f0",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: "700",
    marginBottom: "12px",
  },
  infoText: {
    margin: 0,
    color: "#334155",
    fontSize: "0.95rem",
    lineHeight: "1.6",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    width: "100%",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    margin: 0,
    color: "#1e293b",
    fontSize: "0.95rem",
    fontWeight: "600",
  },
  section: {
    borderTop: "1px solid #e2e8f0",
    paddingTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  sectionTitle: {
    margin: 0,
    color: "#1e293b",
    fontSize: "0.95rem",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    color: "#334155",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
    outline: "none",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    color: "#334155",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: "1.6",
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "6px",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "16px",
  },
  button: {
    padding: "12px 18px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "0.95rem",
    minWidth: "190px",
  },
};

export default RegisterCandidatePage;