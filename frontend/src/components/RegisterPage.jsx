import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InlineAlert from "./InlineAlert";
import { getAcademicStructure, register } from "../services/api";
import {
  ACADEMIC_STRUCTURE,
  getDepartmentOptions,
  getFacultyOptions,
  getProgramOptions,
  normalizeAcademicStructure,
} from "../utils/academic";
import {
  getFirstError,
  getFriendlyErrorMessage,
  hasErrors,
  normalizeSpace,
  onlyDigits,
  trimValue,
  validateRegisterForm,
} from "../utils/validation";
import "../styles/fase6.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [academicStructure, setAcademicStructure] = useState(ACADEMIC_STRUCTURE);
  const [academicWarning, setAcademicWarning] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    nim: "",
    fakultas: "",
    jurusan: "",
    prodi: "",
    angkatan: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadAcademicData = async () => {
      try {
        const data = await getAcademicStructure();
        setAcademicStructure(normalizeAcademicStructure(data));
        setAcademicWarning("");
      } catch {
        setAcademicStructure(ACADEMIC_STRUCTURE);
        setAcademicWarning(
          "Data akademik dari server belum bisa dimuat. Sistem memakai data cadangan agar register tetap bisa dilakukan."
        );
      }
    };

    loadAcademicData();
  }, []);

  const facultyOptions = useMemo(
    () => getFacultyOptions(academicStructure),
    [academicStructure]
  );

  const departmentOptions = useMemo(
    () => getDepartmentOptions(academicStructure, form.fakultas),
    [academicStructure, form.fakultas]
  );

  const programOptions = useMemo(
    () => getProgramOptions(academicStructure, form.fakultas, form.jurusan),
    [academicStructure, form.fakultas, form.jurusan]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "fakultas") {
      setForm((prev) => ({
        ...prev,
        fakultas: value,
        jurusan: "",
        prodi: "",
      }));
      setFieldErrors((prev) => ({ ...prev, fakultas: "", jurusan: "", prodi: "" }));
      setError("");
      return;
    }

    if (name === "jurusan") {
      setForm((prev) => ({
        ...prev,
        jurusan: value,
        prodi: "",
      }));
      setFieldErrors((prev) => ({ ...prev, jurusan: "", prodi: "" }));
      setError("");
      return;
    }

    const nextValue =
      name === "nim"
        ? onlyDigits(value, 8)
        : name === "angkatan"
          ? onlyDigits(value, 4)
          : name === "email"
            ? value.toLowerCase()
            : value;

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setError("");
    setSuccess("");
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const normalizedForm = {
      ...form,
      name: normalizeSpace(form.name),
      email: trimValue(form.email).toLowerCase(),
      nim: onlyDigits(form.nim, 8),
      angkatan: onlyDigits(form.angkatan, 4),
    };

    const nextErrors = validateRegisterForm(normalizedForm);
    setFieldErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      setError(getFirstError(nextErrors));
      setSuccess("");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await register({
        ...normalizedForm,
        angkatan: Number(normalizedForm.angkatan),
      });

      setSuccess("Register berhasil. Silakan login menggunakan akun yang baru dibuat.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(getFriendlyErrorMessage(err, "Register gagal. Periksa kembali data yang kamu isi."));
    } finally {
      setLoading(false);
    }
  };

  const renderFieldError = (fieldName) =>
    fieldErrors[fieldName] ? <small className="field-error-text">{fieldErrors[fieldName]}</small> : null;

  return (
    <div className="auth-page fase6-page">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h2>Register Akun</h2>
          <p>Buat akun SIPILIH dengan data akademik yang valid.</p>
        </div>

        <InlineAlert type="warning" message={academicWarning} />

        <form className="auth-form" onSubmit={handleRegister} noValidate>
          <div className="form-row">
            <div className={`form-group ${fieldErrors.name ? "field-invalid" : ""}`}>
              <label htmlFor="name">Nama Lengkap</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Contoh: Tata Suhatta Dewa"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                aria-invalid={Boolean(fieldErrors.name)}
              />
              {renderFieldError("name")}
            </div>

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
              {renderFieldError("email")}
            </div>
          </div>

          <div className="form-row">
            <div className={`form-group ${fieldErrors.password ? "field-invalid" : ""}`}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Minimal 8 karakter, Aa, angka, simbol"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                aria-invalid={Boolean(fieldErrors.password)}
              />
              <small className="field-help-text">Contoh valid: Password123!</small>
              {renderFieldError("password")}
            </div>

            <div className={`form-group ${fieldErrors.nim ? "field-invalid" : ""}`}>
              <label htmlFor="nim">NIM</label>
              <input
                id="nim"
                type="text"
                name="nim"
                inputMode="numeric"
                placeholder="8 angka"
                value={form.nim}
                onChange={handleChange}
                maxLength={8}
                aria-invalid={Boolean(fieldErrors.nim)}
              />
              {renderFieldError("nim")}
            </div>
          </div>

          <div className="form-row">
            <div className={`form-group ${fieldErrors.fakultas ? "field-invalid" : ""}`}>
              <label htmlFor="fakultas">Fakultas</label>
              <select id="fakultas" name="fakultas" value={form.fakultas} onChange={handleChange}>
                <option value="">Pilih fakultas</option>
                {facultyOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              {renderFieldError("fakultas")}
            </div>

            <div className={`form-group ${fieldErrors.jurusan ? "field-invalid" : ""}`}>
              <label htmlFor="jurusan">Jurusan</label>
              <select
                id="jurusan"
                name="jurusan"
                value={form.jurusan}
                onChange={handleChange}
                disabled={!form.fakultas}
              >
                <option value="">{form.fakultas ? "Pilih jurusan" : "Pilih fakultas dulu"}</option>
                {departmentOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              {renderFieldError("jurusan")}
            </div>
          </div>

          <div className="form-row">
            <div className={`form-group ${fieldErrors.prodi ? "field-invalid" : ""}`}>
              <label htmlFor="prodi">Prodi</label>
              <select
                id="prodi"
                name="prodi"
                value={form.prodi}
                onChange={handleChange}
                disabled={!form.jurusan}
              >
                <option value="">{form.jurusan ? "Pilih prodi" : "Pilih jurusan dulu"}</option>
                {programOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              {renderFieldError("prodi")}
            </div>

            <div className={`form-group ${fieldErrors.angkatan ? "field-invalid" : ""}`}>
              <label htmlFor="angkatan">Angkatan</label>
              <input
                id="angkatan"
                type="text"
                name="angkatan"
                inputMode="numeric"
                placeholder="Contoh: 2023"
                value={form.angkatan}
                onChange={handleChange}
                maxLength={4}
                aria-invalid={Boolean(fieldErrors.angkatan)}
              />
              {renderFieldError("angkatan")}
            </div>
          </div>

          <InlineAlert type="error" message={error} />
          <InlineAlert type="success" message={success} />

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Mendaftarkan..." : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Sudah punya akun? <Link to="/login">Login</Link>
          </p>
          <Link to="/" className="back-link">Kembali ke Landing Page</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
