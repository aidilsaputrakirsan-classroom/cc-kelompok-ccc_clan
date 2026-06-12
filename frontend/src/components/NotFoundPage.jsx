import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="access-page">
      <div className="access-card">
        <span className="access-code">404</span>
        <h1>Halaman Tidak Ditemukan</h1>
        <p>
          Halaman yang kamu cari tidak tersedia atau alamat URL yang dimasukkan
          tidak sesuai.
        </p>

        <Link to="/dashboard" className="btn btn-primary">
          Kembali ke Dashboard
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;