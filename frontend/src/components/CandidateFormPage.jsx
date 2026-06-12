import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Toast from "./Toast";
import {
  createCandidate,
  getAcademicStructure,
  getAdminCandidates,
  updateCandidate,
} from "../services/api";
import {
  ACADEMIC_STRUCTURE,
  getDepartmentOptions,
  getFacultyOptions,
  getProgramOptions,
  normalizeAcademicStructure,
} from "../utils/academic";
import { POSITION_OPTIONS } from "../utils/voting";

function CandidateFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [step, setStep] = useState(1);
  const [academicStructure, setAcademicStructure] = useState(ACADEMIC_STRUCTURE);

  const [form, setForm] = useState({
    nama: "",
    nim: "",
    email: "",
    fakultas: "",
    jurusan: "",
    prodi: "",
    posisi: "",
    visi: "",
    misi: "",
    inovasi: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [error, setError] = useState("");

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

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

  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 2500);
  };

  const closeToast = () => {
    setToast({ show: false, type: "success", message: "" });
  };

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

  useEffect(() => {
    if (!isEditMode) return;

    const fetchCandidateForEdit = async () => {
      try {
        setPageLoading(true);
        setError("");

        const data = await getAdminCandidates();
        const selectedCandidate = data.find(
          (candidate) => candidate.id === Number(id)
        );

        if (!selectedCandidate) {
          setError("Data kandidat tidak ditemukan.");
          return;
        }

        setForm({
          nama: selectedCandidate.nama || "",
          nim: selectedCandidate.nim || "",
          email: selectedCandidate.email || "",
          fakultas: selectedCandidate.fakultas || "",
          jurusan: selectedCandidate.jurusan || "",
          prodi: selectedCandidate.prodi || "",
          posisi: selectedCandidate.posisi?.toLowerCase() || "",
          visi: selectedCandidate.visi || "",
          misi: selectedCandidate.misi || "",
          inovasi: selectedCandidate.inovasi || "",
        });
      } catch (err) {
        setError(err.message || "Gagal mengambil data kandidat.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchCandidateForEdit();
  }, [id, isEditMode]);

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

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!form.nama.trim()) return "Nama kandidat wajib diisi.";
      if (!form.nim.trim()) return "NIM kandidat wajib diisi.";
      if (!form.email.trim()) return "Email kandidat wajib diisi.";
      if (!form.posisi) return "Posisi kandidat wajib dipilih.";
      return "";
    }

    if (currentStep === 2) {
      if (!form.fakultas) return "Fakultas wajib dipilih.";
      if (!form.jurusan) return "Jurusan wajib dipilih.";
      if (!form.prodi) return "Prodi wajib dipilih.";
      return "";
    }

    if (currentStep === 3) {
      if (!form.visi.trim()) return "Visi wajib diisi.";
      if (!form.misi.trim()) return "Misi wajib diisi.";
      if (!form.inovasi.trim()) return "Inovasi wajib diisi.";
      return "";
    }

    return "";
  };

  const handleNextStep = () => {
    const validationMessage = validateStep(step);

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setError("");
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePreviousStep = () => {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const allStepError = validateStep(1) || validateStep(2) || validateStep(3);
    if (allStepError) {
      setError(allStepError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (isEditMode) {
        await updateCandidate(id, form);
        showToast("success", "Data kandidat berhasil diperbarui.");
      } else {
        await createCandidate(form);
        showToast("success", "Data kandidat berhasil ditambahkan.");
      }

      setTimeout(() => {
        navigate("/admin/candidates");
      }, 900);
    } catch (err) {
      setError(err.message || "Gagal menyimpan data kandidat.");
      showToast("error", err.message || "Gagal menyimpan data kandidat.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <>
        <AdminNavbar />
        <main className="candidate-form-page">
          <section className="form-card">
            <p className="info-message">Memuat data kandidat...</p>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={closeToast}
      />

      <main className="candidate-form-page">
        <section className="form-card">
          <div className="form-page-header">
            <div>
              <h1>{isEditMode ? "Edit Kandidat" : "Tambah Kandidat"}</h1>
              <p>
                Lengkapi data kandidat dengan pilihan fakultas, jurusan, dan prodi
                yang sudah tersinkron dari struktur akademik.
              </p>
            </div>

            <Link to="/admin/candidates" className="btn btn-outline">
              Kembali
            </Link>
          </div>

          <div className="form-step-tabs">
            <button
              type="button"
              className={`step-tab ${step === 1 ? "step-tab-active" : ""}`}
              onClick={() => setStep(1)}
            >
              1. Identitas
            </button>
            <button
              type="button"
              className={`step-tab ${step === 2 ? "step-tab-active" : ""}`}
              onClick={() => setStep(2)}
            >
              2. Akademik
            </button>
            <button
              type="button"
              className={`step-tab ${step === 3 ? "step-tab-active" : ""}`}
              onClick={() => setStep(3)}
            >
              3. Visi Misi
            </button>
          </div>

          <form className="candidate-form" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="form-step-section">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nama Kandidat</label>
                    <input
                      type="text"
                      name="nama"
                      placeholder="Masukkan nama kandidat"
                      value={form.nama}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>NIM</label>
                    <input
                      type="text"
                      name="nim"
                      placeholder="Masukkan NIM kandidat"
                      value={form.nim}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Masukkan email kandidat"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Posisi</label>
                    <select name="posisi" value={form.posisi} onChange={handleChange}>
                      <option value="">Pilih posisi kandidat</option>
                      {POSITION_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-step-section">
                <div className="info-box compact-info-box">
                  <strong>Data akademik dipakai untuk hak pilih</strong>
                  <p>
                    Kandidat KM bisa dipilih semua pemilih. Kandidat fakultas,
                    jurusan, dan prodi hanya tampil untuk pemilih pada lingkup yang sama.
                  </p>
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
                    <label>Ringkasan Target Hak Pilih</label>
                    <input
                      type="text"
                      value={
                        form.posisi
                          ? POSITION_OPTIONS.find((item) => item.value === form.posisi)?.label || form.posisi
                          : "Pilih posisi terlebih dahulu"
                      }
                      disabled
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step-section">
                <div className="form-group">
                  <label>Visi</label>
                  <textarea
                    name="visi"
                    rows="4"
                    placeholder="Tuliskan visi kandidat"
                    value={form.visi}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Misi</label>
                  <textarea
                    name="misi"
                    rows="5"
                    placeholder="Tuliskan misi kandidat"
                    value={form.misi}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Inovasi</label>
                  <textarea
                    name="inovasi"
                    rows="5"
                    placeholder="Tuliskan inovasi kandidat"
                    value={form.inovasi}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {error && <p className="error-text">{error}</p>}

            <div className="form-navigation">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handlePreviousStep}
                disabled={step === 1 || loading}
              >
                Sebelumnya
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNextStep}
                  disabled={loading}
                >
                  Selanjutnya
                </button>
              ) : (
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Menyimpan..." : isEditMode ? "Update Kandidat" : "Simpan Kandidat"}
                </button>
              )}
            </div>
          </form>
        </section>
      </main>
    </>
  );
}

export default CandidateFormPage;
