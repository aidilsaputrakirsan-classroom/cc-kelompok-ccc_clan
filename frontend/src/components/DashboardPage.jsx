import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import {
  getAdminCandidates,
  getAdminUsers,
  getEligibleCandidates,
  getMe,
  getMyVoteStatus,
  getVoteResults,
} from "../services/api";
import {
  groupCandidatesByVotingCategory,
  normalizeVoteStatus,
} from "../utils/voting";
import "../styles/fase5.css";

function normalizeStatus(status) {
  return String(status || "approved").toLowerCase().trim();
}

function isCandidateApproved(candidate) {
  const status = normalizeStatus(candidate?.status);
  return status === "approved" || status === "verified" || status === "disetujui";
}

function getRoleLabel(role) {
  if (role === "superadmin") return "Superadmin";
  if (role === "admin") return "Admin";
  if (role === "user") return "Pemilih";
  return "Pengguna";
}

function getNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function normalizeResultItem(item) {
  const candidateId = item.candidate_id ?? item.id;

  return {
    id: candidateId,
    candidate_id: candidateId,
    nama: item.nama || item.candidate_name || item.name || `Kandidat #${candidateId || "-"}`,
    posisi: item.posisi || item.position || item.category_label || "Lainnya",
    prodi: item.prodi || item.program_studi || "",
    jurusan: item.jurusan || "",
    fakultas: item.fakultas || "",
    status: item.status || "approved",
    category_key: item.category_key || item.categoryKey || "",
    category_label: item.category_label || item.categoryLabel || "",
    level: item.level || item.scope || "",
    scope: item.scope || item.level || "",
    total_votes: getNumber(item.total_votes ?? item.totalVotes ?? item.vote_count ?? item.votes),
  };
}

function buildResultGroups(results) {
  const normalizedResults = results.map(normalizeResultItem);

  return groupCandidatesByVotingCategory(normalizedResults).map((group) => {
    const totalVotes = group.candidates.reduce(
      (sum, candidate) => sum + getNumber(candidate.total_votes),
      0
    );

    const sortedCandidates = [...group.candidates]
      .map((candidate) => {
        const candidateVotes = getNumber(candidate.total_votes);
        const percentage = totalVotes > 0 ? Math.round((candidateVotes / totalVotes) * 100) : 0;

        return {
          ...candidate,
          total_votes: candidateVotes,
          percentage,
        };
      })
      .sort((a, b) => b.total_votes - a.total_votes || String(a.nama).localeCompare(String(b.nama)));

    return {
      ...group,
      totalVotes,
      candidates: sortedCandidates,
      leader: sortedCandidates[0] || null,
    };
  });
}

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [eligibleCandidates, setEligibleCandidates] = useState([]);
  const [voteStatus, setVoteStatus] = useState({ votedCategories: [], votes: [] });
  const [results, setResults] = useState([]);
  const [adminStats, setAdminStats] = useState({
    totalCandidates: 0,
    approvedCandidates: 0,
    pendingCandidates: 0,
    rejectedCandidates: 0,
    totalUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
    totalVotes: 0,
    totalAdmins: 0,
    totalSuperadmins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        setWarning("");

        const currentUser = await getMe();

        if (!isMounted) return;

        setUser(currentUser);

        if (currentUser.role === "user") {
          const [candidatesData, statusData, resultData] = await Promise.all([
            getEligibleCandidates().catch(() => []),
            getMyVoteStatus().catch(() => null),
            getVoteResults().catch(() => []),
          ]);

          if (!isMounted) return;

          setEligibleCandidates(Array.isArray(candidatesData) ? candidatesData : []);
          setVoteStatus(normalizeVoteStatus(statusData));
          setResults(Array.isArray(resultData) ? resultData : []);
        }

        if (currentUser.role === "admin" || currentUser.role === "superadmin") {
          const [candidatesData, usersData, resultsData] = await Promise.all([
            getAdminCandidates().catch(() => null),
            getAdminUsers({}).catch(() => null),
            getVoteResults().catch(() => null),
          ]);

          const safeCandidates = Array.isArray(candidatesData) ? candidatesData : [];
          const safeUsers = Array.isArray(usersData) ? usersData : [];
          const safeResults = Array.isArray(resultsData) ? resultsData : [];

          if (!isMounted) return;

          if (!Array.isArray(candidatesData) || !Array.isArray(usersData) || !Array.isArray(resultsData)) {
            setWarning("Sebagian data dashboard tidak dapat dimuat. Pastikan endpoint admin dan hasil voting sedang aktif.");
          }

          setResults(safeResults);
          setAdminStats({
            totalCandidates: safeCandidates.length,
            approvedCandidates: safeCandidates.filter(isCandidateApproved).length,
            pendingCandidates: safeCandidates.filter((item) => normalizeStatus(item.status) === "pending").length,
            rejectedCandidates: safeCandidates.filter((item) => normalizeStatus(item.status) === "rejected").length,
            totalUsers: safeUsers.length,
            verifiedUsers: safeUsers.filter((item) => item.is_active).length,
            unverifiedUsers: safeUsers.filter((item) => !item.is_active).length,
            totalVotes: safeResults.reduce((sum, item) => sum + getNumber(item.total_votes ?? item.totalVotes ?? item.vote_count ?? item.votes), 0),
            totalAdmins: safeUsers.filter((item) => item.role === "admin").length,
            totalSuperadmins: safeUsers.filter((item) => item.role === "superadmin").length,
          });
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err.message === "UNAUTHORIZED" ? "Sesi login berakhir. Silakan login ulang." : err.message || "Gagal memuat dashboard.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryGroups = useMemo(
    () => groupCandidatesByVotingCategory(eligibleCandidates),
    [eligibleCandidates]
  );

  const votedCategorySet = useMemo(
    () => new Set(voteStatus.votedCategories),
    [voteStatus.votedCategories]
  );

  const resultGroups = useMemo(() => buildResultGroups(results), [results]);

  const userVotingSummary = useMemo(() => {
    const total = categoryGroups.length;
    const done = categoryGroups.filter((group) => votedCategorySet.has(group.key)).length;
    const remaining = Math.max(total - done, 0);

    return {
      total,
      done,
      remaining,
      percentage: total === 0 ? 0 : Math.round((done / total) * 100),
      totalCandidates: eligibleCandidates.length,
    };
  }, [categoryGroups, eligibleCandidates.length, votedCategorySet]);

  const topResultGroups = useMemo(
    () => [...resultGroups].sort((a, b) => b.totalVotes - a.totalVotes).slice(0, 5),
    [resultGroups]
  );

  const roleLabel = getRoleLabel(user?.role);
  const isUserDashboard = user?.role === "user";
  const isSuperadminDashboard = user?.role === "superadmin";

  return (
    <>
      <AdminNavbar />

      <main className="dashboard-page fase5-page">
        <section className="fase5-hero dashboard-hero">
          <div>
            <span className="dashboard-badge">FASE 5 - Dashboard {roleLabel}</span>
            <h1>Halo, {user?.name || "Pengguna"}</h1>
            <p>
              Pantau status voting, hasil suara per kategori, dan ringkasan sistem SIPILIH dalam satu dashboard.
            </p>
          </div>

          <div className="fase5-hero-actions">
            <Link to="/vote-results" className="btn btn-primary">
              Lihat Hasil Voting
            </Link>
            {isUserDashboard && (
              <Link to="/voting" className="btn btn-outline">
                Lanjut Voting
              </Link>
            )}
          </div>
        </section>

        {error && (
          <section className="candidate-error-box">
            <strong>Terjadi kesalahan</strong>
            <p>{error}</p>
          </section>
        )}

        {warning && !error && (
          <section className="fase5-warning-box">
            <strong>Perhatian</strong>
            <p>{warning}</p>
          </section>
        )}

        {loading ? (
          <section className="summary-card fase5-loading-card">
            <p className="info-message">Memuat dashboard...</p>
          </section>
        ) : (
          <>
            <section className="fase5-stats-grid">
              {isUserDashboard ? (
                <>
                  <div className="fase5-stat-card">
                    <span>Total Kategori</span>
                    <strong>{userVotingSummary.total}</strong>
                    <small>Kategori sesuai hak pilih</small>
                  </div>
                  <div className="fase5-stat-card success">
                    <span>Sudah Coblos</span>
                    <strong>{userVotingSummary.done}</strong>
                    <small>{userVotingSummary.percentage}% selesai</small>
                  </div>
                  <div className="fase5-stat-card warning">
                    <span>Belum Coblos</span>
                    <strong>{userVotingSummary.remaining}</strong>
                    <small>Kategori tersisa</small>
                  </div>
                  <div className="fase5-stat-card">
                    <span>Kandidat Tersedia</span>
                    <strong>{userVotingSummary.totalCandidates}</strong>
                    <small>Sesuai hak pilihmu</small>
                  </div>
                </>
              ) : (
                <>
                  <div className="fase5-stat-card">
                    <span>Total Kandidat</span>
                    <strong>{adminStats.totalCandidates}</strong>
                    <small>{adminStats.approvedCandidates} terverifikasi</small>
                  </div>
                  <div className="fase5-stat-card">
                    <span>Total User</span>
                    <strong>{adminStats.totalUsers}</strong>
                    <small>{adminStats.verifiedUsers} aktif</small>
                  </div>
                  <div className="fase5-stat-card success">
                    <span>Total Suara</span>
                    <strong>{adminStats.totalVotes}</strong>
                    <small>Dari seluruh kategori</small>
                  </div>
                  <div className="fase5-stat-card warning">
                    <span>Belum Verifikasi</span>
                    <strong>{adminStats.unverifiedUsers}</strong>
                    <small>Akun perlu dicek</small>
                  </div>
                  {isSuperadminDashboard && (
                    <div className="fase5-stat-card">
                      <span>Akun Admin</span>
                      <strong>{adminStats.totalAdmins}</strong>
                      <small>{adminStats.totalSuperadmins} superadmin</small>
                    </div>
                  )}
                </>
              )}
            </section>

            <section className="fase5-dashboard-layout">
              <div className="profile-card fase5-profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {user?.name?.charAt(0)?.toUpperCase() || "S"}
                  </div>
                  <div>
                    <h3>{user?.name}</h3>
                    <p>{user?.email}</p>
                  </div>
                </div>

                <div className="profile-info">
                  <div className="profile-item">
                    <span>Role</span>
                    <strong>{roleLabel}</strong>
                  </div>
                  <div className="profile-item">
                    <span>Status Akun</span>
                    <strong className={user?.is_active ? "status-active-text" : "status-inactive-text"}>
                      {user?.is_active ? "Aktif" : "Belum Aktif"}
                    </strong>
                  </div>
                  <div className="profile-item">
                    <span>NIM</span>
                    <strong>{user?.nim || "-"}</strong>
                  </div>
                  <div className="profile-item">
                    <span>Angkatan</span>
                    <strong>{user?.angkatan || "-"}</strong>
                  </div>
                </div>

                <div className="profile-extra">
                  <h4>Data Akademik</h4>
                  <div className="extra-item">
                    <span>Fakultas</span>
                    <strong>{user?.fakultas || "-"}</strong>
                  </div>
                  <div className="extra-item">
                    <span>Jurusan</span>
                    <strong>{user?.jurusan || "-"}</strong>
                  </div>
                  <div className="extra-item">
                    <span>Prodi</span>
                    <strong>{user?.prodi || "-"}</strong>
                  </div>
                </div>
              </div>

              {isUserDashboard ? (
                <div className="fase5-panel-grid">
                  <section className="summary-card fase5-progress-card">
                    <h3>Progress Voting</h3>
                    <div className="fase5-progress-wrap">
                      <div
                        className="fase5-progress-circle"
                        style={{ "--progress": `${userVotingSummary.percentage}%` }}
                      >
                        <strong>{userVotingSummary.percentage}%</strong>
                        <span>Selesai</span>
                      </div>
                      <div>
                        <p>
                          Kamu sudah mencoblos {userVotingSummary.done} dari {userVotingSummary.total} kategori yang tersedia.
                        </p>
                        <Link to="/voting" className="btn btn-primary dashboard-action-link">
                          Buka Halaman Voting
                        </Link>
                      </div>
                    </div>
                  </section>

                  <section className="summary-card">
                    <h3>Status Kategori Hak Pilih</h3>
                    {categoryGroups.length === 0 ? (
                      <div className="fase5-empty-mini">
                        Belum ada kategori voting yang tersedia untuk akunmu.
                      </div>
                    ) : (
                      <div className="fase5-category-status-list">
                        {categoryGroups.map((group) => {
                          const hasVoted = votedCategorySet.has(group.key);

                          return (
                            <div key={group.key} className="fase5-category-status-item">
                              <div>
                                <span>{group.levelLabel}</span>
                                <strong>{group.label}</strong>
                                <small>{group.candidates.length} kandidat</small>
                              </div>
                              <em className={hasVoted ? "done" : "pending"}>
                                {hasVoted ? "Sudah Coblos" : "Belum Coblos"}
                              </em>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                </div>
              ) : (
                <div className="fase5-panel-grid">
                  <section className="summary-card">
                    <h3>Ringkasan Kandidat</h3>
                    <div className="fase5-mini-stat-list">
                      <div><span>Terverifikasi</span><strong>{adminStats.approvedCandidates}</strong></div>
                      <div><span>Menunggu</span><strong>{adminStats.pendingCandidates}</strong></div>
                      <div><span>Ditolak</span><strong>{adminStats.rejectedCandidates}</strong></div>
                    </div>
                    <Link to="/admin/candidates" className="btn btn-primary dashboard-action-link">
                      Kelola Kandidat
                    </Link>
                  </section>

                  <section className="summary-card">
                    <h3>Kategori dengan Suara Terbanyak</h3>
                    {topResultGroups.length === 0 ? (
                      <div className="fase5-empty-mini">Belum ada suara yang masuk.</div>
                    ) : (
                      <div className="fase5-bar-list">
                        {topResultGroups.map((group) => {
                          const maxVotes = Math.max(...topResultGroups.map((item) => item.totalVotes), 1);
                          const width = Math.round((group.totalVotes / maxVotes) * 100);

                          return (
                            <div className="fase5-bar-row" key={group.key}>
                              <div className="fase5-bar-row-top">
                                <span>{group.label}</span>
                                <strong>{group.totalVotes} suara</strong>
                              </div>
                              <div className="fase5-bar-track">
                                <div className="fase5-bar-fill" style={{ width: `${width}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <Link to="/vote-results" className="btn btn-outline dashboard-action-link">
                      Lihat Detail Hasil
                    </Link>
                  </section>
                </div>
              )}
            </section>

            <section className="summary-card fase5-quick-links-card">
              <h3>Akses Cepat</h3>
              <div className="fase5-quick-links">
                {isUserDashboard ? (
                  <>
                    <Link to="/voting">Voting</Link>
                    <Link to="/candidates">Kandidat</Link>
                    <Link to="/vote-results">Hasil Voting</Link>
                  </>
                ) : (
                  <>
                    <Link to="/admin/candidates">Kelola Kandidat</Link>
                    <Link to="/manage-users">Manajemen User</Link>
                    <Link to="/vote-results">Hasil Voting</Link>
                  </>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default DashboardPage;
