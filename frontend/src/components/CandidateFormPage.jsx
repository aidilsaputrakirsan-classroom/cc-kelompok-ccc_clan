import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Toast from "./Toast";
import {
  createCandidate,
  getAdminCandidates,
  updateCandidate,
} from "../services/api";

function CandidateFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    nama: "",
    nim: "",
    email: "",
    prodi: "",
    jurusan: "",
    fakultas: "",
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

  const showToast = (type, message) => {
    setToast({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setToast({
        show: false,
        type: "success",
        message: "",
      });
    }, 2500);
  };

  const closeToast = () => {
    setToast({
      show: false,
      type: "success",
      message: "",
    });
  };

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
          prodi: selectedCandidate.prodi || "",
          jurusan: selectedCandidate.jurusan || "",
          fakultas: selectedCandidate.fakultas || "",
          posisi: selectedCandidate.posisi || "",
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEditMode) {
        await updateCandidate(id, form);
        showToast("success", "Kandidat berhasil diperbarui.");
      } else {
        await createCandidate(form);
        showToast("success", "Kandidat berhasil ditambahkan.");
      }

      setTimeout(() => {
        navigate("/candidates");
      }, 1000);
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        setError("Sesi tidak valid. Silakan login ulang.");
        showToast("error", "Sesi tidak valid. Silakan login ulang.");
      } else {
        setError(err.message || "Gagal menyimpan kandidat");
        showToast("error", err.message || "Gagal menyimpan kandidat");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={closeToast}
      />

      <div className="candidate-form-page">
        <div className="form-card">
          <div className="form-page-header">
            <div>
              <h1>{isEditMode ? "Edit Kandidat" : "Tambah Kandidat"}</h1>
              <p>
                {isEditMode
                  ? "Perbarui data kandidat sesuai kebutuhan sistem."
                  : "Isi data kandidat sesuai kebutuhan sistem."}
              </p>
            </div>

            <Link to="/candidates" className="btn btn-outline">
              Kembali
            </Link>
          </div>

          {pageLoading ? (
            <p className="info-message">Loading data kandidat...</p>
          ) : (
            <>
              <div className="form-step-tabs">
                <button
                  type="button"
                  className={step === 1 ? "step-tab step-tab-active" : "step-tab"}
                  onClick={() => setStep(1)}
                >
                  1. Biodata Kandidat
                </button>

                <button
                  type="button"
                  className={step === 2 ? "step-tab step-tab-active" : "step-tab"}
                  onClick={() => setStep(2)}
                >
                  2. Visi, Misi, Inovasi
                </button>
              </div>

              <form className="candidate-form" onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="form-step-section">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Nama</label>
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
                          placeholder="Masukkan NIM"
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
                          placeholder="Masukkan email"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>Posisi</label>
                        <input
                          type="text"
                          name="posisi"
                          placeholder="Masukkan posisi"
                          value={form.posisi}
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

                    <div className="form-navigation">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleNextStep}
                      >
                        Lanjut
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="form-step-section">
                    <div className="form-group">
                      <label>Visi</label>
                      <textarea
                        rows="4"
                        name="visi"
                        placeholder="Masukkan visi kandidat"
                        value={form.visi}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label>Misi</label>
                      <textarea
                        rows="4"
                        name="misi"
                        placeholder="Masukkan misi kandidat"
                        value={form.misi}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label>Inovasi</label>
                      <textarea
                        rows="4"
                        name="inovasi"
                        placeholder="Masukkan inovasi kandidat"
                        value={form.inovasi}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <div className="form-navigation">
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handlePrevStep}
                      >
                        Kembali
                      </button>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading
                          ? isEditMode
                            ? "Menyimpan perubahan..."
                            : "Menyimpan..."
                          : isEditMode
                          ? "Update Kandidat"
                          : "Simpan Kandidat"}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CandidateFormPage;