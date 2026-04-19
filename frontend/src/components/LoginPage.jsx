import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        setError("Sesi tidak valid. Silakan login ulang.");
      } else {
        setError(err.message || "Login gagal");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Login Admin</h2>
          <p>Masuk ke sistem SIPILIH untuk mengelola data kandidat.</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
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

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Belum punya akun? <Link to="/register">Register</Link>
          </p>
          <Link to="/" className="back-link">
            Kembali ke Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;