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

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [eligibleCandidates, setEligibleCandidates] = useState([]);
  const [voteStatus, setVoteStatus] = useState({ votedCategories: [], votes: [] });
  const [adminStats, setAdminStats] = useState({
    totalCandidates: 0,
    totalUsers: 0,
    totalVotes: 0,
    verifiedUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const currentUser = await getMe();
        setUser(currentUser);

        if (currentUser.role === "user") {
          const [candidatesData, statusData] = await Promise.all([
            getEligibleCandidates(),
            getMyVoteStatus().catch(() => null),
          ]);

          setEligibleCandidates(candidatesData);
          setVoteStatus(normalizeVoteStatus(statusData));
        }

        if (currentUser.role === "admin" || currentUser.role === "superadmin") {
          const [candidatesData, usersData, resultsData] = await Promise.all([
            getAdminCandidates().catch(() => []),
            getAdminUsers({}).catch(() => []),
            getVoteResults().catch(() => []),
          ]);

          setAdminStats({
            totalCandidates: candidatesData.length,
            totalUsers: usersData.length,
            totalVotes: resultsData.reduce(
              (sum, item) => sum + Number(item.total_votes || 0),
              0
            ),
            verifiedUsers: usersData.filter((item) => item.is_active).length,
          });
        }
      } catch (err) {
        setError(err.message || "Gagal memuat dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const categoryGroups = useMemo(
    () => groupCandidatesByVotingCategory(eligibleCandidates),
    [eligibleCandidates]
  );

  const votedCategorySet = useMemo(
    () => new Set(voteStatus.votedCategories),
    [voteStatus.votedCategories]
  );

  const userVotingSummary = useMemo(() => {
    const total = categoryGroups.length;
    const done = categoryGroups.filter((group) => votedCategorySet.has(group.key)).length;

    return {
      total,
      done,
      remaining: Math.max(total - done, 0),
      percentage: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  }, [categoryGroups, votedCategorySet]);

  const roleLabel =
    user?.role === "superadmin"
      ? "Superadmin"
      : user?.role === "admin"
        ? "Admin"
        : "Pemilih";

  return (
    <>
      <AdminNavbar />

      <main className="dashboard-page">
        <section className="dashboard-hero">
          <span className="dashboard-badge">Dashboard {roleLabel}</span>
          <h1>Halo, {user?.name || "Pengguna"}</h1>
          <p>
            Pantau informasi akun, hak pilih, status voting, dan ringkasan sistem
            pemilihan SIPILIH secara real-time.
          </p>
        </section>

        {error && (
          <section className="candidate-error-box">
            <strong>Terjadi kesalahan</strong>
            <p>{error}</p>
          </section>
        )}

        {loading ? (
          <section className="summary-card">
            <p className="info-message">Memuat dashboard...</p>
          </section>
        ) : (
          <section className="dashboard-grid">
            <div className="profile-card">
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

            <div className="dashboard-side">
              {user?.role === "user" ? (
                <>
                  <div className="summary-card">
                    <h3>Status Voting</h3>
                    <p>
                      Kamu sudah mencoblos {userVotingSummary.done} dari {userVotingSummary.total} kategori yang tersedia.
                    </p>

                    <div className="status-line">
                      <span>Progress</span>
                      <strong>{userVotingSummary.percentage}%</strong>
                    </div>
                    <div className="status-line">
                      <span>Sudah Coblos</span>
                      <strong>{userVotingSummary.done}</strong>
                    </div>
                    <div className="status-line">
                      <span>Belum Coblos</span>
                      <strong>{userVotingSummary.remaining}</strong>
                    </div>

                    <Link to="/voting" className="btn btn-primary btn-full dashboard-action-link">
                      Lanjut ke Voting
                    </Link>
                  </div>

                  <div className="summary-card">
                    <h3>Kategori Hak Pilih</h3>
                    {categoryGroups.length === 0 ? (
                      <p>Belum ada kategori voting yang tersedia untuk hak pilih kamu.</p>
                    ) : (
                      <div className="guide-list">
                        {categoryGroups.map((group, index) => (
                          <div key={group.key} className="guide-item">
                            <span>{index + 1}</span>
                            <p>
                              <strong>{group.label}</strong>
                              <br />
                              {votedCategorySet.has(group.key) ? "Sudah Coblos" : "Belum Coblos"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="summary-card">
                    <h3>Ringkasan Sistem</h3>
                    <div className="status-line">
                      <span>Total Kandidat</span>
                      <strong>{adminStats.totalCandidates}</strong>
                    </div>
                    <div className="status-line">
                      <span>Total User</span>
                      <strong>{adminStats.totalUsers}</strong>
                    </div>
                    <div className="status-line">
                      <span>User Aktif</span>
                      <strong>{adminStats.verifiedUsers}</strong>
                    </div>
                    <div className="status-line">
                      <span>Total Suara</span>
                      <strong>{adminStats.totalVotes}</strong>
                    </div>
                  </div>

                  <div className="summary-card">
                    <h3>Akses Pengelola</h3>
                    <div className="guide-list">
                      <div className="guide-item">
                        <span>1</span>
                        <p>Kelola kandidat berdasarkan posisi dan lingkup akademik.</p>
                      </div>
                      <div className="guide-item">
                        <span>2</span>
                        <p>Verifikasi akun pemilih agar dapat mengikuti voting.</p>
                      </div>
                      <div className="guide-item">
                        <span>3</span>
                        <p>Pantau hasil voting berdasarkan kategori.</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default DashboardPage;
