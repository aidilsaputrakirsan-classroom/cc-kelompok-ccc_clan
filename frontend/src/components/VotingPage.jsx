import { useCallback, useEffect, useMemo, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import ConfirmModal from "./ConfirmModal";
import EmptyState from "./EmptyState";
import InlineAlert from "./InlineAlert";
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
import { getFriendlyErrorMessage } from "../utils/validation";
import "../styles/fase6.css";

function VotingPage() {
  const [user, setUser] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [voteStatus, setVoteStatus] = useState({ votedCategories: [], votes: [] });
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
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
      setWarning("");

      const currentUser = await getMe();
      setUser(currentUser);

      if (currentUser?.role && currentUser.role !== "user") {
        setError("Halaman voting hanya dapat digunakan oleh akun pemilih.");
        setCandidates([]);
        return;
      }

      if (currentUser?.is_active === false) {
        setWarning("Akun kamu belum diverifikasi. Kamu dapat melihat halaman ini, tetapi voting bisa ditolak sampai akun diaktifkan admin.");
      }

      let eligibleCandidates = [];

      try {
        eligibleCandidates = await getEligibleCandidates();
      } catch {
        const allCandidates = await getPublicCandidates();
        eligibleCandidates = allCandidates.filter((candidate) =>
          isCandidateEligibleForUser(candidate, currentUser)
        );
        setWarning((prev) =>
          prev || "Endpoint kandidat sesuai hak pilih belum tersedia, jadi frontend memakai filter cadangan dari daftar kandidat publik."
        );
      }

      const statusData = await getMyVoteStatus().catch(() => null);
      const normalizedStatus = normalizeVoteStatus(statusData);
      const savedCategories = getSavedVotedCategories(currentUser);
      const mergedCategories = mergeUniqueCategories(
        normalizedStatus.votedCategories,
        savedCategories
      );

      setCandidates(Array.isArray(eligibleCandidates) ? eligibleCandidates : []);
      setVoteStatus({
        votes: normalizedStatus.votes,
        votedCategories: mergedCategories,
      });
      saveVotedCategories(currentUser, mergedCategories);
    } catch (err) {
      setError(getFriendlyErrorMessage(err, "Gagal memuat data voting."));
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
    if (user?.is_active === false) {
      showToast("error", "Akun kamu belum diverifikasi oleh admin sehingga belum bisa voting.");
      return;
    }

    setSelectedCandidate(candidate);
    setSelectedCategory(category);
  };

  const closeConfirmModal = () => {
    if (actionLoading) return;

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
      showToast("error", getFriendlyErrorMessage(err, "Voting gagal dilakukan."));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />

      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={closeToast} />

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

      <main className="candidates-page voting-page fase6-page">
        <section className="candidate-hero">
          <div>
            <span className="candidate-badge">FASE 6 - Error Handling</span>
            <h1>Voting Utama</h1>
            <p>
              Pilih kandidat sesuai hak pilih kamu. Setiap kategori hanya bisa dicoblos satu kali.
            </p>
          </div>
        </section>

        <section className="user-stats-grid voting-stats-grid">
          <div className="user-stat-card"><span>Total Kategori</span><strong>{summary.total}</strong></div>
          <div className="user-stat-card"><span>Sudah Coblos</span><strong>{summary.done}</strong></div>
          <div className="user-stat-card"><span>Belum Coblos</span><strong>{summary.remaining}</strong></div>
          <div className="user-stat-card"><span>Status Akun</span><strong>{user?.is_active === false ? "Belum Aktif" : "Aktif"}</strong></div>
        </section>

        {user && (
          <section className="info-box voting-user-info">
            <strong>Hak pilih kamu</strong>
            <p>{user.fakultas || "Fakultas belum ada"} • {user.jurusan || "Jurusan belum ada"} • {user.prodi || "Prodi belum ada"}</p>
          </section>
        )}

        <InlineAlert type="warning" message={warning} />
        <InlineAlert type="error" message={error} onRetry={error ? loadVotingData : undefined} />

        <section className="candidate-table-card">
          <div className="candidate-table-top">
            <div>
              <h2>Daftar Kategori Voting</h2>
              <p>Setiap kategori hanya bisa dicoblos satu kali. Pastikan pilihanmu sudah benar.</p>
            </div>
          </div>

          {loading ? (
            <div className="fase6-loading-box">
              <span className="fase6-spinner" />
              <p>Memuat kandidat sesuai hak pilih...</p>
            </div>
          ) : !error && categoryGroups.length === 0 ? (
            <EmptyState
              eyebrow="Belum ada kandidat"
              title="Belum ada kandidat sesuai hak pilih"
              description="Kandidat belum tersedia, belum diverifikasi, atau belum sesuai dengan data fakultas, jurusan, dan prodi kamu."
              actionLabel="Muat ulang"
              onAction={loadVotingData}
            />
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
                                  <div className="candidate-mini-avatar">{candidate.nama?.charAt(0)?.toUpperCase() || "K"}</div>
                                  <div>
                                    <strong>{candidate.nama || "Nama belum tersedia"}</strong>
                                    <span>NIM: {candidate.nim || "-"}</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="user-academic-cell">
                                  <span>{candidate.prodi || "-"}</span>
                                  <small>{candidate.jurusan || "-"}</small>
                                  <small>{candidate.fakultas || "-"}</small>
                                </div>
                              </td>
                              <td className="candidate-description-cell">{candidate.visi || "Visi belum tersedia."}</td>
                              <td><span className="status-pill status-approved">Terverifikasi</span></td>
                              <td>
                                <button
                                  type="button"
                                  className="action-btn action-btn-detail"
                                  disabled={alreadyVoted || actionLoading || user?.is_active === false}
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
