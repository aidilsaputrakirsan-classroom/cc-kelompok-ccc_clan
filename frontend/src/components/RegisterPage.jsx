import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAcademicStructure, register } from "../services/api";
import {
  ACADEMIC_STRUCTURE,
  getDepartmentOptions,
  getFacultyOptions,
  getProgramOptions,
  normalizeAcademicStructure,
} from "../utils/academic";

function RegisterPage() {
  const navigate = useNavigate();

  const [academicStructure, setAcademicStructure] = useState(ACADEMIC_STRUCTURE);

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadAcademicData = async () => {
      try {
        const data = await getAcademicStructure();
        setAcademicStructure(normalizeAcademicStructure(data));
      } catch {
        setAcademicStructure(ACADEMIC_STRUCTURE);
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
      return;
    }

    if (name === "jurusan") {
      setForm((prev) => ({
        ...prev,
        jurusan: value,
        prodi: "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Nama wajib diisi.";
    if (!form.email.trim()) return "Email wajib diisi.";
    if (!form.password.trim()) return "Password wajib diisi.";
    if (!form.nim.trim()) return "NIM wajib diisi.";
    if (!form.fakultas) return "Fakultas wajib dipilih.";
    if (!form.jurusan) return "Jurusan wajib dipilih.";
    if (!form.prodi) return "Prodi wajib dipilih.";
    if (!form.angkatan) return "Angkatan wajib diisi.";

    return "";
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      setSuccess("");
      return;
    }

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
          <p>Buat akun SIPILIH untuk masuk ke sistem pemilihan digital.</p>
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
                placeholder="Minimal 8 karakter, huruf besar, angka, simbol"
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
              <label>Fakultas</label>
              <select name="fakultas" value={form.fakultas} onChange={handleChange}>
                <option value="">Pilih fakultas</option>
                {facultyOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Jurusan</label>
              <select
                name="jurusan"
                value={form.jurusan}
                onChange={handleChange}
                disabled={!form.fakultas}
              >
                <option value="">Pilih jurusan</option>
                {departmentOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prodi</label>
              <select
                name="prodi"
                value={form.prodi}
                onChange={handleChange}
                disabled={!form.jurusan}
              >
                <option value="">Pilih prodi</option>
                {programOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
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
