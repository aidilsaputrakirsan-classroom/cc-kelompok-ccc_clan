import { useCallback, useEffect, useMemo, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import {
  getAdminUsers,
  updateUserRole,
  updateUserVerification,
} from "../services/api";
import { getStoredUser, isSuperAdmin } from "../utils/auth";

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "-";
  }
}

function getRoleLabel(role) {
  if (role === "superadmin") return "Superadmin";
  if (role === "admin") return "Admin";
  if (role === "user") return "Pemilih";

  return role || "-";
}

function getStatusLabel(isActive) {
  return isActive ? "Terverifikasi" : "Belum Terverifikasi";
}

function ManageUsersPage() {
  const currentUser = getStoredUser();
  const superAdmin = isSuperAdmin();

  const pageTitle = superAdmin
    ? "Manajemen User, Admin, dan Superadmin"
    : "Manajemen Akun Pemilih";

  const pageDescription = superAdmin
    ? "Kelola seluruh akun dalam sistem, termasuk pemilih, admin, dan superadmin."
    : "Kelola data pemilih, cek identitas mahasiswa, dan atur status verifikasi akun sebelum pengguna melakukan voting.";

  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all",
  });

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const finalFilters = superAdmin
        ? filters
        : {
            ...filters,
            role: "user",
          };

      const data = await getAdminUsers(finalFilters);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal memuat user:", err);

      if (err.message === "FORBIDDEN") {
        setError("Kamu tidak memiliki akses untuk melihat data user.");
      } else if (err.message === "UNAUTHORIZED") {
        setError("Sesi login berakhir. Silakan login ulang.");
      } else {
        setError(err.message || "Gagal memuat data user.");
      }
    } finally {
      setLoading(false);
    }
  }, [filters, superAdmin]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const stats = useMemo(() => {
    const total = users.length;
    const verified = users.filter((user) => user.is_active).length;
    const unverified = users.filter((user) => !user.is_active).length;
    const admins = users.filter((user) =>
      ["admin", "superadmin"].includes(user.role)
    ).length;

    return {
      total,
      verified,
      unverified,
      admins,
    };
  }, [users]);

  const handleApplySearch = (event) => {
    event.preventDefault();

    setFilters((prev) => ({
      ...prev,
      search: searchInput.trim(),
    }));
  };

  const handleRoleFilterChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      role: event.target.value,
    }));
  };

  const handleStatusFilterChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      status: event.target.value,
    }));
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setFilters({
      search: "",
      role: "all",
      status: "all",
    });
  };

  const handleToggleVerification = async (user) => {
    const canVerifyThisUser = superAdmin || user.role === "user";

    if (!canVerifyThisUser) {
      setError("Admin hanya dapat mengelola akun pemilih.");
      return;
    }

    const nextStatus = !user.is_active;

    try {
      setActionLoadingId(user.id);
      setError("");
      setSuccessMessage("");

      const updatedUser = await updateUserVerification(user.id, nextStatus);

      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item.id === updatedUser.id ? updatedUser : item
        )
      );

      setSuccessMessage(
        nextStatus
          ? `Akun ${user.name} berhasil diverifikasi.`
          : `Akun ${user.name} berhasil dinonaktifkan.`
      );
    } catch (err) {
      console.error("Gagal memperbarui status user:", err);
      setError(err.message || "Gagal memperbarui status user.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRoleChange = async (user, nextRole) => {
    if (!superAdmin) {
      setError("Hanya superadmin yang dapat mengubah role akun.");
      return;
    }

    try {
      setActionLoadingId(user.id);
      setError("");
      setSuccessMessage("");

      const updatedUser = await updateUserRole(user.id, nextRole);

      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item.id === updatedUser.id ? updatedUser : item
        )
      );

      setSuccessMessage(`Role ${user.name} berhasil diubah.`);
    } catch (err) {
      console.error("Gagal memperbarui role user:", err);
      setError(err.message || "Gagal memperbarui role user.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <>
      <AdminNavbar />

      <main className="manage-users-page">
        <section className="candidate-hero">
          <div>
            <span className="candidate-badge">Kelola Pemilih</span>
            <h1>{pageTitle}</h1>
            <p>{pageDescription}</p>
          </div>
        </section>

        <section className="user-stats-grid">
          <div className="user-stat-card">
            <span>{superAdmin ? "Total Akun" : "Total Pemilih"}</span>
            <strong>{stats.total}</strong>
          </div>

          <div className="user-stat-card">
            <span>Terverifikasi</span>
            <strong>{stats.verified}</strong>
          </div>

          <div className="user-stat-card">
            <span>Belum Verifikasi</span>
            <strong>{stats.unverified}</strong>
          </div>

          <div className="user-stat-card">
            <span>{superAdmin ? "Admin/Superadmin" : "Akun Pengelola"}</span>
            <strong>{superAdmin ? stats.admins : 0}</strong>
          </div>
        </section>

        <section className="candidate-table-card">
          <div className="candidate-table-top">
            <div>
              <h2>{superAdmin ? "Daftar Seluruh Akun" : "Daftar Pemilih"}</h2>
              <p>
                {superAdmin
                  ? "Superadmin dapat mengelola seluruh akun dan role pengguna."
                  : "Admin hanya dapat melihat serta memverifikasi akun pemilih."}
              </p>
            </div>
          </div>

          <form className="user-filter-bar" onSubmit={handleApplySearch}>
            <input
              type="text"
              placeholder="Cari nama, email, NIM, prodi, atau fakultas..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />

            {superAdmin ? (
              <select value={filters.role} onChange={handleRoleFilterChange}>
                <option value="all">Semua Role</option>
                <option value="user">Pemilih</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            ) : (
              <select value="user" disabled>
                <option value="user">Pemilih</option>
              </select>
            )}

            <select value={filters.status} onChange={handleStatusFilterChange}>
              <option value="all">Semua Status</option>
              <option value="active">Terverifikasi</option>
              <option value="inactive">Belum Terverifikasi</option>
            </select>

            <button type="submit" className="btn btn-primary">
              Cari
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={handleResetFilters}
            >
              Reset
            </button>
          </form>

          {successMessage && <p className="success-text">{successMessage}</p>}
          {error && <p className="error-text">{error}</p>}

          {loading ? (
            <p className="info-message">Memuat data user...</p>
          ) : users.length === 0 ? (
            <div className="empty-state-card">
              <h3>Belum ada data user yang sesuai</h3>
              <p>
                Coba ubah kata kunci pencarian atau reset filter untuk melihat
                semua user.
              </p>
            </div>
          ) : (
            <div className="responsive-table-wrapper">
              <table className="candidate-table user-table">
                <thead>
                  <tr>
                    <th>Identitas</th>
                    <th>Data Akademik</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Dibuat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => {
                    const isCurrentUser = currentUser?.id === user.id;
                    const isActionLoading = actionLoadingId === user.id;
                    const canVerifyThisUser = superAdmin || user.role === "user";

                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="user-identity-cell">
                            <strong>{user.name}</strong>
                            <span>{user.email}</span>
                            <small>NIM: {user.nim || "-"}</small>
                          </div>
                        </td>

                        <td>
                          <div className="user-academic-cell">
                            <span>{user.prodi || "-"}</span>
                            <small>{user.jurusan || "-"}</small>
                            <small>{user.fakultas || "-"}</small>
                            <small>Angkatan {user.angkatan || "-"}</small>
                          </div>
                        </td>

                        <td>
                          {superAdmin && !isCurrentUser ? (
                            <select
                              className="role-select"
                              value={user.role}
                              disabled={isActionLoading}
                              onChange={(event) =>
                                handleRoleChange(user, event.target.value)
                              }
                            >
                              <option value="user">Pemilih</option>
                              <option value="admin">Admin</option>
                              <option value="superadmin">Superadmin</option>
                            </select>
                          ) : (
                            <span className="role-pill">
                              {getRoleLabel(user.role)}
                            </span>
                          )}
                        </td>

                        <td>
                          <span
                            className={
                              user.is_active
                                ? "verification-badge verified"
                                : "verification-badge unverified"
                            }
                          >
                            {getStatusLabel(user.is_active)}
                          </span>
                        </td>

                        <td>{formatDate(user.created_at)}</td>

                        <td>
                          <button
                            type="button"
                            className={
                              user.is_active
                                ? "action-btn danger-action"
                                : "action-btn primary-action"
                            }
                            disabled={
                              isCurrentUser ||
                              isActionLoading ||
                              !canVerifyThisUser
                            }
                            onClick={() => handleToggleVerification(user)}
                          >
                            {isActionLoading
                              ? "Memproses..."
                              : user.is_active
                                ? "Nonaktifkan"
                                : "Verifikasi"}
                          </button>

                          {isCurrentUser && (
                            <small className="table-note">
                              Akun sedang dipakai
                            </small>
                          )}

                          {!canVerifyThisUser && (
                            <small className="table-note">
                              Hanya superadmin yang dapat mengelola akun ini
                            </small>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default ManageUsersPage;