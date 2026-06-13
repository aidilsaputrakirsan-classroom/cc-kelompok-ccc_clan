import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InlineAlert from "./InlineAlert";
import { login } from "../services/api";
import {
  getFirstError,
  getFriendlyErrorMessage,
  hasErrors,
  trimValue,
  validateLoginForm,
} from "../utils/validation";
import "../styles/fase6.css";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "email" ? value.toLowerCase() : value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setError("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const nextErrors = validateLoginForm(form);
    setFieldErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      setError(getFirstError(nextErrors));
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(trimValue(form.email).toLowerCase(), form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getFriendlyErrorMessage(err, "Login gagal. Periksa email dan password kamu."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fase6-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Login SIPILIH</h2>
          <p>Masuk menggunakan email dan password yang sudah terdaftar.</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin} noValidate>
          <div className={`form-group ${fieldErrors.email ? "field-invalid" : ""}`}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              aria-invalid={Boolean(fieldErrors.email)}
            />
            {fieldErrors.email && <small className="field-error-text">{fieldErrors.email}</small>}
          </div>

          <div className={`form-group ${fieldErrors.password ? "field-invalid" : ""}`}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Masukkan password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              aria-invalid={Boolean(fieldErrors.password)}
            />
            {fieldErrors.password && <small className="field-error-text">{fieldErrors.password}</small>}
          </div>

          <InlineAlert type="error" message={error} />

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Memeriksa akun..." : "Login"}
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
