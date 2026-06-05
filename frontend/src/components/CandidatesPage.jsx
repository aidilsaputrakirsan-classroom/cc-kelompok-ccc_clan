import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";
import {
  deleteCandidate,
  getAdminCandidates,
  getPublicCandidates,
} from "../services/api";
import { canManageCandidates } from "../utils/auth";

function CandidatesPage() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const canManage = canManageCandidates();

  const showToast = useCallback((type, message) => {
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
  }, []);

  const closeToast = () => {
    setToast({
      show: false,
      type: "success",
      message: "",
    });
  };

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = canManage
        ? await getAdminCandidates()
        : await getPublicCandidates();

      setCandidates(data || []);
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        setError("Sesi berakhir. Silakan login ulang.");

        setTimeout(() => {
          navigate("/login");
        }, 800);
      } else {
        setError(err.message || "Gagal mengambil data kandidat.");
      }
    } finally {
      setLoading(false);
    }
  }, [canManage, navigate]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    fetchCandidates();
  }, [fetchCandidates, navigate]);

  const filteredCandidates = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim();

    if (!keyword) return candidates;

    return candidates.filter((candidate) => {
      return (
        candidate.nama?.toLowerCase().includes(keyword) ||
        candidate.nim?.toLowerCase().includes(keyword) ||
        candidate.email?.toLowerCase().includes(keyword) ||
        candidate.posisi?.toLowerCase().includes(keyword) ||
        candidate.prodi?.toLowerCase().includes(keyword) ||
        candidate.jurusan?.toLowerCase().includes(keyword) ||
        candidate.fakultas?.toLowerCase().includes(keyword) ||
        candidate.visi?.toLowerCase().includes(keyword)
      );
    });
  }, [candidates, searchTerm]);

  const openDeleteModal = (candidateId) => {
    setSelectedCandidateId(candidateId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;

    setSelectedCandidateId(null);
    setShowDeleteModal(false);
  };

  const handleDeleteCandidate = async () => {
    if (!selectedCandidateId) return;

    setDeleteLoading(true);

    try {
      await deleteCandidate(selectedCandidateId);

      setCandidates((prevCandidates) =>
        prevCandidates.filter(
          (candidate) => candidate.id !== selectedCandidateId
        )
      );

      showToast("success", "Kandidat berhasil dihapus.");
      closeDeleteModal();
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        showToast("error", "Sesi berakhir. Silakan login ulang.");

        setTimeout(() => {
          navigate("/login");
        }, 900);
      } else {
        showToast("error", err.message || "Gagal menghapus kandidat.");
      }
    } finally {
      setDeleteLoading(false);
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

      <ConfirmModal
        show={showDeleteModal}
        title="Konfirmasi Hapus"
        message="Apakah kamu yakin ingin menghapus kandidat ini? Data yang dihapus tidak dapat dikembalikan."
        confirmText={deleteLoading ? "Menghapus..." : "Hapus"}
        cancelText="Batal"
        onConfirm={handleDeleteCandidate}
        onCancel={closeDeleteModal}
      />

      <div className="candidates-page">
        <section className="candidate-hero">
          <div>
            <span className="candidate-badge">
              {canManage ? "Manajemen Kandidat" : "Informasi Kandidat"}
            </span>

            <h1>{canManage ? "Kelola Kandidat" : "Daftar Kandidat"}</h1>

            <p>
              {canManage
                ? "Kelola seluruh data kandidat SIPILIH. Admin dapat menambah, mengedit, dan menghapus kandidat."
                : "Pelajari profil, visi, misi, dan inovasi kandidat sebelum melakukan voting."}
            </p>
          </div>

          <div className="candidate-hero-actions">
            {canManage ? (
              <Link to="/candidates/create" className="btn btn-primary">
                + Tambah Kandidat
              </Link>
            ) : (
              <Link to="/voting" className="btn btn-primary">
                Mulai Voting
              </Link>
            )}
          </div>
        </section>

        <section className="candidate-table-card">
          <div className="candidate-table-top">
            <div className="candidate-table-header">
              <div>
                <h3>
                  {canManage ? "Data Kandidat" : "Profil Kandidat SIPILIH"}
                </h3>
                <p>
                  {loading
                    ? "Sedang memuat data kandidat..."
                    : `${filteredCandidates.length} kandidat tersedia`}
                </p>
              </div>
            </div>

            <div className="candidate-search-box">
              <input
                type="text"
                placeholder="Cari nama, NIM, posisi, prodi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="candidate-empty-state">
              <h4>Loading data kandidat...</h4>
              <p>Mohon tunggu sebentar, data sedang diambil dari sistem.</p>
            </div>
          ) : error ? (
            <div className="candidate-error-box">
              <strong>Terjadi kesalahan</strong>
              <p>{error}</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="candidate-empty-state">
              <h4>Belum ada kandidat</h4>
              <p>
                {canManage
                  ? "Silakan tambahkan kandidat terlebih dahulu."
                  : "Saat ini belum ada kandidat yang dapat ditampilkan."}
              </p>

              {canManage && (
                <Link to="/candidates/create" className="btn btn-primary">
                  Tambah Kandidat
                </Link>
              )}
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="candidate-empty-state">
              <h4>Data tidak ditemukan</h4>
              <p>
                Tidak ada kandidat yang cocok dengan kata kunci pencarianmu.
              </p>
            </div>
          ) : (
            <div className="candidate-table-wrapper">
              <table className="candidate-table">
                <thead>
                  <tr>
                    <th>Kandidat</th>
                    <th>Posisi</th>
                    <th>Program Studi</th>
                    <th>Visi</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <td>
                        <div className="candidate-name-cell">
                          <div className="candidate-mini-avatar">
                            {candidate.nama
                              ? candidate.nama.charAt(0).toUpperCase()
                              : "K"}
                          </div>

                          <div>
                            <strong>{candidate.nama}</strong>
                            <span>{candidate.email}</span>
                          </div>
                        </div>
                      </td>

                      <td>{candidate.posisi || "-"}</td>
                      <td>{candidate.prodi || "-"}</td>

                      <td className="candidate-description-cell">
                        {candidate.visi || "-"}
                      </td>

                      <td>
                        <span
                          className={`status-pill status-${
                            candidate.status || "approved"
                          }`}
                        >
                          {candidate.status || "approved"}
                        </span>
                      </td>

                      <td>
                        <div className="candidate-action-group">
                          <Link
                            to={`/candidates/${candidate.id}`}
                            className="action-btn action-btn-detail"
                          >
                            Detail
                          </Link>

                          {!canManage && (
                            <Link
                              to="/voting"
                              className="action-btn action-btn-edit"
                            >
                              Mulai Voting
                            </Link>
                          )}

                          {canManage && (
                            <>
                              <Link
                                to={`/candidates/${candidate.id}/edit`}
                                className="action-btn action-btn-edit"
                              >
                                Edit
                              </Link>

                              <button
                                type="button"
                                className="action-btn action-btn-delete"
                                onClick={() => openDeleteModal(candidate.id)}
                              >
                                Hapus
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default CandidatesPage;