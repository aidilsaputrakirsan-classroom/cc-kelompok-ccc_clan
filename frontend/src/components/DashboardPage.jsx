import { useState } from "react";
import AdminNavbar from "./AdminNavbar";

function DashboardPage() {
  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) return null;

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Gagal parse user dari localStorage:", error);
      return null;
    }
  });

  return (
    <>
      <AdminNavbar />

      <div className="dashboard-page">
        <div className="dashboard-hero">
          <div className="dashboard-hero-text">
            <span className="dashboard-badge">Dashboard SIPILIH</span>
            <h1>Selamat Datang, {user?.name || "Admin"}</h1>
            <p>
              Kelola sistem SIPILIH dengan lebih rapi, terstruktur, dan mudah
              diakses melalui dashboard admin.
            </p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <h3>{user?.name || "-"}</h3>
                <p>{user?.email || "-"}</p>
              </div>
            </div>

            <div className="profile-info">
              <div className="profile-item">
                <span>NIM</span>
                <strong>{user?.nim || "-"}</strong>
              </div>

              <div className="profile-item">
                <span>Prodi</span>
                <strong>{user?.prodi || "-"}</strong>
              </div>

              <div className="profile-item">
                <span>Jurusan</span>
                <strong>{user?.jurusan || "-"}</strong>
              </div>

              <div className="profile-item">
                <span>Fakultas</span>
                <strong>{user?.fakultas || "-"}</strong>
              </div>

              <div className="profile-item">
                <span>Angkatan</span>
                <strong>{user?.angkatan || "-"}</strong>
              </div>

              <div className="profile-item">
                <span>Status Akun</span>
                <strong
                  className={
                    user?.is_active ? "status-active-text" : "status-inactive-text"
                  }
                >
                  {user?.is_active ? "Aktif" : "Tidak Aktif"}
                </strong>
              </div>
            </div>
          </div>

          <div className="dashboard-side">
            <div className="summary-card">
              <h3>Tentang SIPILIH</h3>
              <p>
                SIPILIH adalah platform pemilihan digital kampus yang membantu
                proses administrasi pemilihan menjadi lebih aman, transparan,
                dan terstruktur dalam satu sistem.
              </p>
            </div>

            <div className="summary-card">
              <h3>Panduan Singkat</h3>

              <div className="guide-list">
                <div className="guide-item">
                  <span>1</span>
                  <p>Buka menu Kandidat untuk melihat seluruh data kandidat.</p>
                </div>

                <div className="guide-item">
                  <span>2</span>
                  <p>Gunakan tombol Tambah Kandidat untuk menambahkan data baru.</p>
                </div>

                <div className="guide-item">
                  <span>3</span>
                  <p>Gunakan menu Edit dan Hapus untuk mengelola data kandidat.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;