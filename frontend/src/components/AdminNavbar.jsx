import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../services/api";
import ConfirmModal from "./ConfirmModal";

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
            className={location.pathname.startsWith("/candidates") ? "nav-active" : ""}
          >
            Kandidat
          </Link>
        </div>

        <div className="admin-navbar-right">
          <button className="btn btn-outline" onClick={openLogoutModal}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminNavbar;