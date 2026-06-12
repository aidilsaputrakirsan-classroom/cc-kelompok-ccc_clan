import { Link } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function ComingSoonPage({
  badge = "SIPILIH",
  title = "Fitur sedang disiapkan",
  description = "Halaman ini akan dikembangkan pada fase berikutnya.",
}) {
  return (
    <>
      <AdminNavbar />

      <main className="access-page">
        <div className="access-card">
          <span className="candidate-badge">{badge}</span>
          <h1>{title}</h1>
          <p>{description}</p>

          <Link to="/dashboard" className="btn btn-primary">
            Kembali ke Dashboard
          </Link>
        </div>
      </main>
    </>
  );
}

export default ComingSoonPage;