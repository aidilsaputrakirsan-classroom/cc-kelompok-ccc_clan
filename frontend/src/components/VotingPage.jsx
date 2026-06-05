import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";
import { getPublicCandidates, voteCandidate } from "../services/api";
import { canManageCandidates, getStoredUser } from "../utils/auth";

const POSITION_ORDER = [
  "ketua bem km",
  "dpm km",
  "ketua bem fakultas",
  "dpm fakultas",
  "ketua himpunan",
];

const POSITION_LABELS = {
  "ketua bem km": "Ketua BEM KM",
  "dpm km": "DPM KM",
  "ketua bem fakultas": "Ketua BEM Fakultas",
  "dpm fakultas": "DPM Fakultas",
  "ketua himpunan": "Ketua Himpunan",
};

function normalizePosition(position) {
  return (position || "lainnya").toLowerCase().trim();
}

function getPositionLabel(position) {
  const normalized = normalizePosition(position);
  return POSITION_LABELS[normalized] || position || "Lainnya";
}

function getVotedStorageKey() {
  const user = getStoredUser();
  const identifier = user?.id || user?.email || "guest";
  return `votedCategories:${identifier}`;
}

function getSavedVotedCategories() {
  const saved = localStorage.getItem(getVotedStorageKey());

  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveVotedCategories(categories) {
  localStorage.setItem(getVotedStorageKey(), JSON.stringify(categories));
}

function VotingPage() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [votedCategories, setVotedCategories] = useState(
    getSavedVotedCategories
  );

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const [showVoteModal, setShowVoteModal] = useState(false);

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
      const data = await getPublicCandidates();

      const approvedCandidates = Array.isArray(data)
        ? data.filter((candidate) => {
            if (!candidate.status) return true;

            const status = candidate.status.toLowerCase();
            return status === "approved" || status === "verified";
          })
        : [];

      setCandidates(approvedCandidates);
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
  }, [navigate]);

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

  const groupedCandidates = useMemo(() => {
    const groups = {};

    filteredCandidates.forEach((candidate) => {
      const key = normalizePosition(candidate.posisi);

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(candidate);
    });

    const orderedGroups = [];

    POSITION_ORDER.forEach((positionKey) => {
      if (groups[positionKey]?.length) {
        orderedGroups.push({
          key: positionKey,
          label: getPositionLabel(positionKey),
          candidates: groups[positionKey],
        });
      }
    });

    Object.keys(groups)
      .filter((key) => !POSITION_ORDER.includes(key))
      .sort()
      .forEach((key) => {
        orderedGroups.push({
          key,
          label: getPositionLabel(key),
          candidates: groups[key],
        });
      });

    return orderedGroups;
  }, [filteredCandidates]);

  const markCategoryAsVoted = (position) => {
    const categoryKey = normalizePosition(position);

    setVotedCategories((prevCategories) => {
      if (prevCategories.includes(categoryKey)) {
        return prevCategories;
      }

      const updatedCategories = [...prevCategories, categoryKey];
      saveVotedCategories(updatedCategories);

      return updatedCategories;
    });
  };

  const hasVotedInCategory = (position) => {
    const categoryKey = normalizePosition(position);
    return votedCategories.includes(categoryKey);
  };

  const openVoteModal = (candidate) => {
    if (canManage) {
      showToast("error", "Admin tidak dapat melakukan voting.");
      return;
    }

    if (hasVotedInCategory(candidate.posisi)) {
      showToast(
        "error",
        `Kamu sudah memilih untuk kategori ${getPositionLabel(
          candidate.posisi
        )}.`
      );
      return;
    }

    setSelectedCandidate(candidate);
    setShowVoteModal(true);
  };

  const closeVoteModal = () => {
    if (votingLoading) return;

    setSelectedCandidate(null);
    setShowVoteModal(false);
  };

  const handleVote = async () => {
    if (!selectedCandidate) return;

    setVotingLoading(true);

    try {
      await voteCandidate(selectedCandidate.id);

      markCategoryAsVoted(selectedCandidate.posisi);

      showToast(
        "success",
        `Voting untuk ${selectedCandidate.nama} sebagai ${getPositionLabel(
          selectedCandidate.posisi
        )} berhasil disimpan.`
      );

      setSelectedCandidate(null);
      setShowVoteModal(false);
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        showToast("error", "Sesi berakhir. Silakan login ulang.");
        setShowVoteModal(false);

        setTimeout(() => {
          navigate("/login");
        }, 900);
      } else {
        showToast("error", err.message || "Gagal melakukan voting.");
      }
    } finally {
      setVotingLoading(false);
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
        show={showVoteModal}
        title="Konfirmasi Voting"
        message={
          selectedCandidate
            ? `Apakah kamu yakin ingin memilih ${selectedCandidate.nama} sebagai ${getPositionLabel(
                selectedCandidate.posisi
              )}? Pilihan untuk kategori ini tidak dapat diubah setelah dikirim.`
            : "Apakah kamu yakin ingin melakukan voting?"
        }
        confirmText={votingLoading ? "Menyimpan..." : "Ya, Pilih"}
        cancelText="Batal"
        onConfirm={handleVote}
        onCancel={closeVoteModal}
      />

      <div className="candidates-page">
        <section className="candidate-hero">
          <div>
            <span className="candidate-badge">Voting SIPILIH</span>
            <h1>Pilih Kandidat</h1>
            <p>
              Pilih satu kandidat untuk setiap kategori. Kamu hanya dapat
              memilih satu kali pada kategori yang sama.
            </p>
          </div>

          <Link to="/candidates" className="btn btn-outline">
            Pelajari Kandidat
          </Link>
        </section>

        {canManage && (
          <section className="candidate-error-box">
            <strong>Mode Admin</strong>
            <p>
              Akun admin dapat melihat halaman ini untuk pemantauan, tetapi
              tombol memilih hanya tersedia untuk user/pemilih biasa.
            </p>
          </section>
        )}

        <section className="candidate-table-card">
          <div className="candidate-table-top">
            <div className="candidate-table-header">
              <div>
                <h3>Voting Berdasarkan Kategori</h3>
                <p>
                  {loading
                    ? "Sedang memuat kandidat..."
                    : `${filteredCandidates.length} kandidat dalam ${groupedCandidates.length} kategori`}
                </p>
              </div>
            </div>

            <div className="candidate-search-box">
              <input
                type="text"
                placeholder="Cari nama, posisi, prodi..."
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
                Saat ini belum ada kandidat yang tersedia untuk proses voting.
              </p>
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="candidate-empty-state">
              <h4>Data tidak ditemukan</h4>
              <p>
                Tidak ada kandidat yang cocok dengan kata kunci pencarianmu.
              </p>
            </div>
          ) : (
            <div className="voting-category-list">
              {groupedCandidates.map((group) => {
                const alreadyVoted = votedCategories.includes(group.key);

                return (
                  <section className="voting-category" key={group.key}>
                    <div className="voting-category-header">
                      <div>
                        <span>Kategori</span>
                        <h4>{group.label}</h4>

                        {alreadyVoted && (
                          <p className="voting-status-text">
                            Kamu sudah memilih untuk kategori ini.
                          </p>
                        )}
                      </div>

                      <p>{group.candidates.length} kandidat</p>
                    </div>

                    <div className="candidate-table-wrapper">
                      <table className="candidate-table">
                        <thead>
                          <tr>
                            <th>Kandidat</th>
                            <th>Program Studi</th>
                            <th>Visi Singkat</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>

                        <tbody>
                          {group.candidates.map((candidate) => (
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

                              <td>{candidate.prodi || "-"}</td>

                              <td className="candidate-description-cell">
                                {candidate.visi || "-"}
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
                                    <button
                                      type="button"
                                      className="action-btn action-btn-edit"
                                      disabled={
                                        alreadyVoted || votingLoading
                                      }
                                      onClick={() => openVoteModal(candidate)}
                                    >
                                      {alreadyVoted
                                        ? "Sudah Memilih"
                                        : "Pilih"}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default VotingPage;