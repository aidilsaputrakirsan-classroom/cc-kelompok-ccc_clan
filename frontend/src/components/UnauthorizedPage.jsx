import { Link } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function UnauthorizedPage() {
  return (
    <>
      <AdminNavbar />

      <main className="access-page">
        <div className="access-card">
          <span className="access-code">403</span>
          <h1>Akses Ditolak</h1>
          <p>
            Kamu tidak memiliki hak akses untuk membuka halaman ini. Silakan
            kembali ke dashboard sesuai role akunmu.
          </p>

          <Link to="/dashboard" className="btn btn-primary">
            Kembali ke Dashboard
          </Link>
        </div>
      </main>
    </>
  );
}

export default UnauthorizedPage;