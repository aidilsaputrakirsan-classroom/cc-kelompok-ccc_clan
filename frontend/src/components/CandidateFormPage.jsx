import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import EmptyState from "./EmptyState";
import InlineAlert from "./InlineAlert";
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
import {
  getFirstError,
  getFriendlyErrorMessage,
  hasErrors,
  normalizeSpace,
  onlyDigits,
  trimValue,
  validateCandidateForm,
  validateCandidateStep,
} from "../utils/validation";
import "../styles/fase6.css";

function CandidateFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [step, setStep] = useState(1);
  const [academicStructure, setAcademicStructure] = useState(ACADEMIC_STRUCTURE);
  const [academicWarning, setAcademicWarning] = useState("");

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

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [pageError, setPageError] = useState("");
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
        setAcademicWarning("");
      } catch {
        setAcademicStructure(ACADEMIC_STRUCTURE);
        setAcademicWarning("Data akademik dari server belum bisa dimuat. Sistem memakai data cadangan.");
      }
    };

    loadAcademicData();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchCandidateForEdit = async () => {
      try {
        setPageLoading(true);
        setPageError("");
        setError("");

        const data = await getAdminCandidates();
        const selectedCandidate = data.find(
          (candidate) => String(candidate.id) === String(id)
        );

        if (!selectedCandidate) {
          setPageError("Data kandidat yang ingin diedit tidak ditemukan.");
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
        setPageError(getFriendlyErrorMessage(err, "Gagal mengambil data kandidat."));
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
  };

  const setStepErrors = (errors) => {
    setFieldErrors((prev) => ({
      ...prev,
      ...errors,
    }));
  };

  const handleNextStep = () => {
    const stepErrors = validateCandidateStep(form, step);
    setStepErrors(stepErrors);

    if (hasErrors(stepErrors)) {
      setError(getFirstError(stepErrors));
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

    const normalizedForm = {
      ...form,
      nama: normalizeSpace(form.nama),
      email: trimValue(form.email).toLowerCase(),
      nim: onlyDigits(form.nim, 8),
      visi: normalizeSpace(form.visi),
      misi: normalizeSpace(form.misi),
      inovasi: normalizeSpace(form.inovasi),
    };

    const allErrors = validateCandidateForm(normalizedForm);
    setFieldErrors(allErrors);

    if (hasErrors(allErrors)) {
      setError(getFirstError(allErrors));

      if (allErrors.nama || allErrors.nim || allErrors.email || allErrors.posisi) {
        setStep(1);
      } else if (allErrors.fakultas || allErrors.jurusan || allErrors.prodi) {
        setStep(2);
      } else {
        setStep(3);
      }

      return;
    }

    try {
      setLoading(true);
      setError("");

      if (isEditMode) {
        await updateCandidate(id, normalizedForm);
        showToast("success", "Data kandidat berhasil diperbarui.");
      } else {
        await createCandidate(normalizedForm);
        showToast("success", "Data kandidat berhasil ditambahkan.");
      }

      setTimeout(() => {
        navigate("/admin/candidates");
      }, 900);
    } catch (err) {
      const message = getFriendlyErrorMessage(err, "Gagal menyimpan data kandidat.");
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  const renderFieldError = (fieldName) =>
    fieldErrors[fieldName] ? <small className="field-error-text">{fieldErrors[fieldName]}</small> : null;

  if (pageLoading) {
    return (
      <>
        <AdminNavbar />
        <main className="candidate-form-page fase6-page">
          <section className="form-card">
            <p className="info-message">Memuat data kandidat...</p>
          </section>
        </main>
      </>
    );
  }

  if (pageError) {
    return (
      <>
        <AdminNavbar />
        <main className="candidate-form-page fase6-page">
          <section className="form-card">
            <EmptyState
              eyebrow="Data tidak tersedia"
              title="Kandidat tidak bisa dibuka"
              description={pageError}
              actionLabel="Kembali ke Kelola Kandidat"
              onAction={() => navigate("/admin/candidates")}
            />
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

      <main className="candidate-form-page fase6-page">
        <section className="form-card">
          <div className="form-page-header">
            <div>
              <h1>{isEditMode ? "Edit Kandidat" : "Tambah Kandidat"}</h1>
              <p>
                Lengkapi data kandidat dengan format yang valid agar data dapat dipakai untuk voting sesuai hak pilih.
              </p>
            </div>

            <Link to="/admin/candidates" className="btn btn-outline">
              Kembali
            </Link>
          </div>

          <InlineAlert type="warning" message={academicWarning} />

          <div className="form-step-tabs">
            <button type="button" className={`step-tab ${step === 1 ? "step-tab-active" : ""}`} onClick={() => setStep(1)}>
              1. Identitas
            </button>
            <button type="button" className={`step-tab ${step === 2 ? "step-tab-active" : ""}`} onClick={() => setStep(2)}>
              2. Akademik
            </button>
            <button type="button" className={`step-tab ${step === 3 ? "step-tab-active" : ""}`} onClick={() => setStep(3)}>
              3. Visi Misi
            </button>
          </div>

          <form className="candidate-form" onSubmit={handleSubmit} noValidate>
            {step === 1 && (
              <div className="form-step-section">
                <div className="form-row">
                  <div className={`form-group ${fieldErrors.nama ? "field-invalid" : ""}`}>
                    <label htmlFor="nama">Nama Kandidat</label>
                    <input id="nama" type="text" name="nama" placeholder="Masukkan nama kandidat" value={form.nama} onChange={handleChange} />
                    {renderFieldError("nama")}
                  </div>

                  <div className={`form-group ${fieldErrors.nim ? "field-invalid" : ""}`}>
                    <label htmlFor="nim">NIM</label>
                    <input id="nim" type="text" name="nim" inputMode="numeric" placeholder="8 angka" value={form.nim} onChange={handleChange} maxLength={8} />
                    {renderFieldError("nim")}
                  </div>
                </div>

                <div className="form-row">
                  <div className={`form-group ${fieldErrors.email ? "field-invalid" : ""}`}>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" placeholder="email kandidat" value={form.email} onChange={handleChange} />
                    {renderFieldError("email")}
                  </div>

                  <div className={`form-group ${fieldErrors.posisi ? "field-invalid" : ""}`}>
                    <label htmlFor="posisi">Posisi</label>
                    <select id="posisi" name="posisi" value={form.posisi} onChange={handleChange}>
                      <option value="">Pilih posisi kandidat</option>
                      {POSITION_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                    {renderFieldError("posisi")}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-step-section">
                <div className="info-box compact-info-box">
                  <strong>Data akademik dipakai untuk hak pilih</strong>
                  <p>
                    Kandidat KM bisa dipilih semua pemilih. Kandidat fakultas, jurusan, dan prodi hanya tampil untuk pemilih pada lingkup yang sama.
                  </p>
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
                    <select id="jurusan" name="jurusan" value={form.jurusan} onChange={handleChange} disabled={!form.fakultas}>
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
                    <select id="prodi" name="prodi" value={form.prodi} onChange={handleChange} disabled={!form.jurusan}>
                      <option value="">{form.jurusan ? "Pilih prodi" : "Pilih jurusan dulu"}</option>
                      {programOptions.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                    {renderFieldError("prodi")}
                  </div>

                  <div className="form-group">
                    <label>Ringkasan Target Hak Pilih</label>
                    <input
                      type="text"
                      value={form.posisi ? POSITION_OPTIONS.find((item) => item.value === form.posisi)?.label || form.posisi : "Pilih posisi terlebih dahulu"}
                      disabled
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step-section">
                <div className={`form-group ${fieldErrors.visi ? "field-invalid" : ""}`}>
                  <label htmlFor="visi">Visi</label>
                  <textarea id="visi" name="visi" rows="4" placeholder="Tuliskan visi kandidat" value={form.visi} onChange={handleChange} />
                  {renderFieldError("visi")}
                </div>

                <div className={`form-group ${fieldErrors.misi ? "field-invalid" : ""}`}>
                  <label htmlFor="misi">Misi</label>
                  <textarea id="misi" name="misi" rows="5" placeholder="Tuliskan misi kandidat" value={form.misi} onChange={handleChange} />
                  {renderFieldError("misi")}
                </div>

                <div className={`form-group ${fieldErrors.inovasi ? "field-invalid" : ""}`}>
                  <label htmlFor="inovasi">Inovasi</label>
                  <textarea id="inovasi" name="inovasi" rows="5" placeholder="Tuliskan inovasi kandidat" value={form.inovasi} onChange={handleChange} />
                  {renderFieldError("inovasi")}
                </div>
              </div>
            )}

            <InlineAlert type="error" message={error} />

            <div className="form-navigation">
              <button type="button" className="btn btn-outline" onClick={handlePreviousStep} disabled={step === 1 || loading}>
                Sebelumnya
              </button>

              {step < 3 ? (
                <button type="button" className="btn btn-primary" onClick={handleNextStep} disabled={loading}>
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
