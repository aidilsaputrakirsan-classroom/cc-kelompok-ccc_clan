import { useState } from "react";

function LoginPage({ onLogin, onRegister }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    nim: "",
    prodi: "",
    jurusan: "",
    fakultas: "",
    angkatan: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        if (!formData.name.trim()) {
          setError("Nama wajib diisi");
          setLoading(false);
          return;
        }

        if (!formData.nim.trim()) {
          setError("NIM wajib diisi");
          setLoading(false);
          return;
        }

        if (!formData.prodi.trim()) {
          setError("Prodi wajib diisi");
          setLoading(false);
          return;
        }

        if (!formData.jurusan.trim()) {
          setError("Jurusan wajib diisi");
          setLoading(false);
          return;
        }

        if (!formData.fakultas.trim()) {
          setError("Fakultas wajib diisi");
          setLoading(false);
          return;
        }

        if (!formData.angkatan) {
          setError("Angkatan wajib diisi");
          setLoading(false);
          return;
        }

        if (formData.password.length < 8) {
          setError("Password minimal 8 karakter");
          setLoading(false);
          return;
        }

        await onRegister({
          ...formData,
          angkatan: Number(formData.angkatan),
        });
      } else {
        await onLogin(formData.email, formData.password);
      }
    } catch (err) {
      console.log("ERROR:", err);

      if (typeof err === "string") {
        setError(err);
      } else if (err?.message) {
        setError(err.message);
      } else if (err?.detail) {
        setError(err.detail);
      } else {
        setError("Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.overlay} />
      <div style={styles.card}>
        <div style={styles.headerBox}>
          <h1 style={styles.title}>SIPILIH</h1>
          <p style={styles.subtitle}>Sistem Pemilihan Kampus</p>
        </div>

        <div style={styles.tabs}>
          <button
            type="button"
            style={{ ...styles.tab, ...(!isRegister ? styles.tabActive : {}) }}
            onClick={() => {
              setIsRegister(false);
              setError("");
            }}
          >
            Login
          </button>
          <button
            type="button"
            style={{ ...styles.tab, ...(isRegister ? styles.tabActive : {}) }}
            onClick={() => {
              setIsRegister(true);
              setError("");
            }}
          >
            Register
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <>
              <div style={styles.field}>
                <label style={styles.label}>Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>NIM</label>
                <input
                  type="text"
                  name="nim"
                  value={formData.nim}
                  onChange={handleChange}
                  placeholder="Masukkan NIM"
                  style={styles.input}
                />
              </div>

              <div style={styles.grid}>
                <div style={styles.field}>
                  <label style={styles.label}>Prodi</label>
                  <input
                    type="text"
                    name="prodi"
                    value={formData.prodi}
                    onChange={handleChange}
                    placeholder="Contoh: Sistem Informasi"
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Jurusan</label>
                  <input
                    type="text"
                    name="jurusan"
                    value={formData.jurusan}
                    onChange={handleChange}
                    placeholder="Contoh: TI"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.grid}>
                <div style={styles.field}>
                  <label style={styles.label}>Fakultas</label>
                  <input
                    type="text"
                    name="fakultas"
                    value={formData.fakultas}
                    onChange={handleChange}
                    placeholder="Masukkan fakultas"
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Angkatan</label>
                  <input
                    type="number"
                    name="angkatan"
                    value={formData.angkatan}
                    onChange={handleChange}
                    placeholder="2022"
                    style={styles.input}
                  />
                </div>
              </div>
            </>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@student.ac.id"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 8 karakter"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.btnSubmit} disabled={loading}>
            {loading
              ? "Memproses..."
              : isRegister
              ? "Daftar Akun"
              : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #334155 100%)",
    padding: "2rem",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top right, rgba(59,130,246,0.15), transparent 30%), radial-gradient(circle at bottom left, rgba(16,185,129,0.12), transparent 25%)",
  },
  card: {
    position: "relative",
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.97)",
    padding: "2rem",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "620px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
    backdropFilter: "blur(6px)",
  },
  headerBox: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  title: {
    margin: "0 0 0.35rem 0",
    color: "#0f172a",
    fontSize: "2.2rem",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },
  subtitle: {
    color: "#64748b",
    margin: 0,
    fontSize: "0.95rem",
  },
  tabs: {
    display: "flex",
    marginBottom: "1.5rem",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #dbe2ea",
    backgroundColor: "#f8fafc",
  },
  tab: {
    flex: 1,
    padding: "0.85rem",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#64748b",
  },
  tabActive: {
    backgroundColor: "#0f172a",
    color: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontSize: "0.88rem",
    fontWeight: "700",
    color: "#334155",
  },
  input: {
    padding: "0.85rem 1rem",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "0.97rem",
    outline: "none",
    backgroundColor: "#fff",
  },
  btnSubmit: {
    padding: "0.95rem",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "700",
    marginTop: "0.5rem",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    marginBottom: "0.75rem",
    fontSize: "0.92rem",
    textAlign: "center",
  },
};

export default LoginPage;