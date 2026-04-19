import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Toast from "./Toast";
import ConfirmModal from "./ConfirmModal";
import { getAdminCandidates, deleteCandidate } from "../services/api";

function CandidatesPage() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const [deleteModal, setDeleteModal] = useState({
    show: false,
    candidateId: null,
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

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminCandidates();
      setCandidates(data || []);
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        setError("Sesi berakhir. Silakan login ulang.");
        navigate("/login");
      } else {
        setError(err.message || "Gagal mengambil data kandidat");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const filteredCandidates = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim();

    if (!keyword) return candidates;

    return candidates.filter((candidate) => {
      return (
        candidate.nama?.toLowerCase().includes(keyword) ||
        candidate.nim?.toLowerCase().includes(keyword) ||
        candidate.email?.toLowerCase().includes(keyword) ||
        candidate.posisi?.toLowerCase().includes(keyword) ||
        candidate.fakultas?.toLowerCase().includes(keyword)
      );
    });
  }, [candidates, searchTerm]);

  const openDeleteModal = (id) => {
    setDeleteModal({
      show: true,
      candidateId: id,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      show: false,
      candidateId: null,
    });
  };

  const handleDelete = async () => {
    try {
      await deleteCandidate(deleteModal.candidateId);
      closeDeleteModal();
      showToast("success", "Kandidat berhasil dihapus.");
      fetchCandidates();
    } catch (err) {
      closeDeleteModal();
      showToast("error", err.message || "Gagal menghapus kandidat.");
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
        show={deleteModal.show}
        title="Hapus Kandidat"
        message="Apakah kamu yakin ingin menghapus kandidat ini? Tindakan ini tidak bisa dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />

      <div className="candidates-page">
        <div className="candidate-hero">
          <div>
            <span className="candidate-badge">Manajemen Kandidat</span>
            <h1>Daftar Kandidat</h1>
            <p>
              Kelola seluruh data kandidat SIPILIH dengan tampilan yang lebih
              rapi, terstruktur, dan mudah diakses.
            </p>
          </div>

          <Link
            to="/candidates/create"
            className="btn btn-primary candidate-add-btn"
          >
            + Tambah Kandidat
          </Link>
        </div>

        <div className="candidate-table-card">
          <div className="candidate-table-top">
            <div className="candidate-table-header">
              <div>
                <h3>Data Kandidat</h3>
                <p>
                  {loading
                    ? "Sedang memuat data..."
                    : `${filteredCandidates.length} kandidat ditemukan`}
                </p>
              </div>
            </div>

            <div className="candidate-search-box">
              <input
                type="text"
                placeholder="Cari nama, NIM, email, posisi..."
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
              <h4>Belum ada data kandidat</h4>
              <p>
                Tambahkan kandidat pertama untuk mulai mengelola pemilihan pada
                sistem SIPILIH.
              </p>
              <Link to="/candidates/create" className="btn btn-primary">
                Tambah Kandidat
              </Link>
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
                    <th>Nama</th>
                    <th>NIM</th>
                    <th>Email</th>
                    <th>Posisi</th>
                    <th>Fakultas</th>
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
                          </div>
                        </div>
                      </td>
                      <td>{candidate.nim}</td>
                      <td className="candidate-email-cell">
                        {candidate.email}
                      </td>
                      <td>{candidate.posisi}</td>
                      <td>{candidate.fakultas}</td>
                      <td>
                        <div className="candidate-action-group">
                          <Link
                            to={`/candidates/${candidate.id}`}
                            className="action-btn action-btn-detail"
                          >
                            Detail
                          </Link>

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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CandidatesPage;