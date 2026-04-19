import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    nim: "",
    prodi: "",
    jurusan: "",
    fakultas: "",
    angkatan: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await register({
        ...form,
        angkatan: Number(form.angkatan),
      });

      setSuccess("Register berhasil. Silakan login.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h2>Register Akun</h2>
          <p>Buat akun SIPILIH untuk masuk ke sistem.</p>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-row">
            <div className="form-group">
              <label>Nama</label>
              <input
                type="text"
                name="name"
                placeholder="Masukkan nama lengkap"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Masukkan email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>NIM</label>
              <input
                type="text"
                name="nim"
                placeholder="Masukkan NIM"
                value={form.nim}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prodi</label>
              <input
                type="text"
                name="prodi"
                placeholder="Masukkan prodi"
                value={form.prodi}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Jurusan</label>
              <input
                type="text"
                name="jurusan"
                placeholder="Masukkan jurusan"
                value={form.jurusan}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fakultas</label>
              <input
                type="text"
                name="fakultas"
                placeholder="Masukkan fakultas"
                value={form.fakultas}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Angkatan</label>
              <input
                type="number"
                name="angkatan"
                placeholder="Masukkan angkatan"
                value={form.angkatan}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Sudah punya akun? <Link to="/login">Login</Link>
          </p>
          <Link to="/" className="back-link">
            Kembali ke Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;