import { useCallback, useEffect, useMemo, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";
import {
  getEligibleCandidates,
  getMe,
  getMyVoteStatus,
  getPublicCandidates,
  voteCandidate,
} from "../services/api";
import {
  getCategoryKey,
  getCategoryLabel,
  getSavedVotedCategories,
  groupCandidatesByVotingCategory,
  isCandidateEligibleForUser,
  mergeUniqueCategories,
  normalizeVoteStatus,
  saveVotedCategories,
} from "../utils/voting";

function VotingPage() {
  const [user, setUser] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [voteStatus, setVoteStatus] = useState({ votedCategories: [], votes: [] });
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const showToast = useCallback((type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "success", message: "" });
    }, 2500);
  }, []);

  const closeToast = () => {
    setToast({ show: false, type: "success", message: "" });
  };

  const loadVotingData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const currentUser = await getMe();
      setUser(currentUser);

      let eligibleCandidates = [];

      try {
        eligibleCandidates = await getEligibleCandidates();
      } catch {
        const allCandidates = await getPublicCandidates();
        eligibleCandidates = allCandidates.filter((candidate) =>
          isCandidateEligibleForUser(candidate, currentUser)
        );
      }

      const statusData = await getMyVoteStatus().catch(() => null);
      const normalizedStatus = normalizeVoteStatus(statusData);
      const savedCategories = getSavedVotedCategories(currentUser);
      const mergedCategories = mergeUniqueCategories(
        normalizedStatus.votedCategories,
        savedCategories
      );

      setCandidates(eligibleCandidates);
      setVoteStatus({
        votes: normalizedStatus.votes,
        votedCategories: mergedCategories,
      });
      saveVotedCategories(currentUser, mergedCategories);
    } catch (err) {
      setError(err.message || "Gagal memuat data voting.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVotingData();
  }, [loadVotingData]);

  const categoryGroups = useMemo(
    () => groupCandidatesByVotingCategory(candidates),
    [candidates]
  );

  const votedCategorySet = useMemo(
    () => new Set(voteStatus.votedCategories),
    [voteStatus.votedCategories]
  );

  const summary = useMemo(() => {
    const total = categoryGroups.length;
    const done = categoryGroups.filter((group) => votedCategorySet.has(group.key)).length;

    return {
      total,
      done,
      remaining: Math.max(total - done, 0),
    };
  }, [categoryGroups, votedCategorySet]);

  const openConfirmModal = (candidate, category) => {
    setSelectedCandidate(candidate);
    setSelectedCategory(category);
  };

  const closeConfirmModal = () => {
    setSelectedCandidate(null);
    setSelectedCategory(null);
  };

  const handleVote = async () => {
    if (!selectedCandidate || !selectedCategory) return;

    try {
      setActionLoading(true);
      setError("");

      const response = await voteCandidate(selectedCandidate.id);
      const categoryKey = response?.category_key || getCategoryKey(selectedCandidate);
      const mergedCategories = mergeUniqueCategories(voteStatus.votedCategories, [categoryKey]);

      setVoteStatus((prev) => ({
        ...prev,
        votedCategories: mergedCategories,
      }));
      saveVotedCategories(user, mergedCategories);
      showToast("success", `Voting untuk ${selectedCategory.label} berhasil.`);
      closeConfirmModal();
      await loadVotingData();
    } catch (err) {
      showToast("error", err.message || "Voting gagal dilakukan.");
    } finally {
      setActionLoading(false);
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
        show={Boolean(selectedCandidate)}
        title="Konfirmasi Voting"
        message={
          selectedCandidate
            ? `Kamu akan memilih ${selectedCandidate.nama} pada kategori ${selectedCategory?.label || getCategoryLabel(selectedCandidate)}. Pilihan tidak dapat diubah.`
            : "Apakah kamu yakin ingin memilih kandidat ini?"
        }
        confirmText={actionLoading ? "Memproses..." : "Ya, Pilih"}
        cancelText="Batal"
        confirmVariant="primary"
        onConfirm={handleVote}
        onCancel={closeConfirmModal}
      />

      <main className="candidates-page voting-page">
        <section className="candidate-hero">
          <div>
            <span className="candidate-badge">FASE 3</span>
            <h1>Voting Utama</h1>
            <p>
              Pilih kandidat sesuai hak pilih kamu. Ketua KM dan DPM KM dapat
              dipilih semua pemilih, sedangkan kategori fakultas, jurusan, dan
              prodi hanya tampil sesuai data akademik masing-masing.
            </p>
          </div>
        </section>

        <section className="user-stats-grid voting-stats-grid">
          <div className="user-stat-card">
            <span>Total Kategori</span>
            <strong>{summary.total}</strong>
          </div>
          <div className="user-stat-card">
            <span>Sudah Coblos</span>
            <strong>{summary.done}</strong>
          </div>
          <div className="user-stat-card">
            <span>Belum Coblos</span>
            <strong>{summary.remaining}</strong>
          </div>
          <div className="user-stat-card">
            <span>Status Akun</span>
            <strong>{user?.is_active === false ? "Belum Aktif" : "Aktif"}</strong>
          </div>
        </section>

        {user && (
          <section className="info-box voting-user-info">
            <strong>Hak pilih kamu</strong>
            <p>
              {user.fakultas} • {user.jurusan} • {user.prodi}
            </p>
          </section>
        )}

        {error && (
          <section className="candidate-error-box">
            <strong>Terjadi kesalahan</strong>
            <p>{error}</p>
          </section>
        )}

        <section className="candidate-table-card">
          <div className="candidate-table-top">
            <div>
              <h2>Daftar Kategori Voting</h2>
              <p>
                Setiap kategori hanya bisa dicoblos satu kali. Pastikan pilihanmu
                sudah benar sebelum menekan tombol pilih.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="info-message">Memuat kandidat sesuai hak pilih...</p>
          ) : categoryGroups.length === 0 ? (
            <div className="candidate-empty-state">
              <h4>Belum ada kandidat sesuai hak pilih</h4>
              <p>
                Kandidat belum tersedia atau belum diverifikasi untuk lingkup
                akademik kamu.
              </p>
            </div>
          ) : (
            <div className="voting-category-list">
              {categoryGroups.map((category) => {
                const alreadyVoted = votedCategorySet.has(category.key);

                return (
                  <div key={category.key} className="voting-category">
                    <div className="voting-category-header">
                      <div>
                        <span>{category.levelLabel}</span>
                        <h4>{category.label}</h4>
                      </div>

                      <p className={alreadyVoted ? "voting-status-done" : "voting-status-open"}>
                        {alreadyVoted ? "Sudah Coblos" : "Belum Coblos"}
                      </p>
                    </div>

                    <div className="candidate-table-wrapper">
                      <table className="candidate-table voting-table">
                        <thead>
                          <tr>
                            <th>Kandidat</th>
                            <th>Akademik</th>
                            <th>Visi</th>
                            <th>Status</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.candidates.map((candidate) => (
                            <tr key={candidate.id}>
                              <td>
                                <div className="candidate-name-cell">
                                  <div className="candidate-mini-avatar">
                                    {candidate.nama?.charAt(0)?.toUpperCase() || "K"}
                                  </div>
                                  <div>
                                    <strong>{candidate.nama}</strong>
                                    <span>NIM: {candidate.nim}</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="user-academic-cell">
                                  <span>{candidate.prodi}</span>
                                  <small>{candidate.jurusan}</small>
                                  <small>{candidate.fakultas}</small>
                                </div>
                              </td>
                              <td className="candidate-description-cell">
                                {candidate.visi || "-"}
                              </td>
                              <td>
                                <span className="status-pill status-approved">Terverifikasi</span>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="action-btn action-btn-detail"
                                  disabled={alreadyVoted || actionLoading}
                                  onClick={() => openConfirmModal(candidate, category)}
                                >
                                  {alreadyVoted ? "Terkunci" : "Pilih"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default VotingPage;
