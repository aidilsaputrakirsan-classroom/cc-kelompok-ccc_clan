import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../services/api";
import { useTheme } from "../context/UseTheme";
import ConfirmModal from "./ConfirmModal";
import { getStoredUser, canManageCandidates, isSuperAdmin } from "../utils/auth";

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const user = getStoredUser();
  const role = user?.role || "guest";
  const canManage = canManageCandidates();
  const superAdmin = isSuperAdmin();

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <>
      <ConfirmModal
        show={showLogoutModal}
        title="Konfirmasi Logout"
        message="Apakah kamu yakin ingin keluar dari sistem SIPILIH?"
        confirmText="Logout"
        cancelText="Batal"
        onConfirm={handleLogout}
        onCancel={closeLogoutModal}
      />

      <div className="admin-navbar">
        <div className="admin-navbar-left">
          <h2 className="admin-logo">SIPILIH</h2>
          <span className="admin-subtitle">
            Sistem Informasi Pemilihan Digital
          </span>
        </div>

        <div className="admin-navbar-links">
          <Link
            to="/dashboard"
            className={location.pathname === "/dashboard" ? "nav-active" : ""}
          >
            Dashboard
          </Link>

          <Link
            to="/candidates"
            className={
              location.pathname.startsWith("/candidates") ? "nav-active" : ""
            }
          >
            Kandidat
          </Link>

          {!canManage && (
            <Link
              to="/voting"
              className={location.pathname === "/voting" ? "nav-active" : ""}
            >
            Voting
            </Link>
          )}

          <Link
            to="/vote-results"
            className={
              location.pathname === "/vote-results" ? "nav-active" : ""
            }
          >
            Hasil Voting
          </Link>

          {canManage && (
            <Link
              to="/admin/candidates"
              className={
                location.pathname.startsWith("/admin/candidates")
                  ? "nav-active"
                  : ""
              }
            >
              Kelola Kandidat
            </Link>
          )}

          {superAdmin && (
            <Link
              to="/manage-users"
              className={
                location.pathname === "/manage-users" ? "nav-active" : ""
              }
            >
              Manajemen User
            </Link>
          )}
        </div>

        <div className="admin-navbar-right">
        <span className="role-pill">{role}</span>
        
          <button
            type="button"
            className="btn btn-outline theme-toggle-btn"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <button className="btn btn-outline" onClick={openLogoutModal}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminNavbar;
