import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { getAdminCandidates } from "../services/api";

function CandidateDetailPage() {
  const { id } = useParams();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCandidateDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminCandidates();
        const selectedCandidate = data.find(
          (item) => item.id === Number(id)
        );

        if (!selectedCandidate) {
          setError("Data kandidat tidak ditemukan.");
          return;
        }

        setCandidate(selectedCandidate);
      } catch (err) {
        setError(err.message || "Gagal mengambil detail kandidat.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateDetail();
  }, [id]);

  return (
    <>
      <AdminNavbar />

      <div className="candidate-detail-page">
        <div className="detail-card">
          {loading ? (
            <p className="info-message">Loading detail kandidat...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : (
            <>
              <div className="detail-header">
                <div>
                  <h1>Detail Kandidat</h1>
                  <p>Informasi lengkap kandidat SIPILIH.</p>
                </div>

                <div className="detail-header-actions">
                  <Link to="/candidates" className="btn btn-outline">
                    Kembali
                  </Link>

                  <Link
                    to={`/candidates/${candidate.id}/edit`}
                    className="btn btn-primary"
                  >
                    Edit Kandidat
                  </Link>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span>Nama</span>
                  <strong>{candidate.nama}</strong>
                </div>

                <div className="detail-item">
                  <span>NIM</span>
                  <strong>{candidate.nim}</strong>
                </div>

                <div className="detail-item">
                  <span>Email</span>
                  <strong>{candidate.email}</strong>
                </div>

                <div className="detail-item">
                  <span>Prodi</span>
                  <strong>{candidate.prodi}</strong>
                </div>

                <div className="detail-item">
                  <span>Jurusan</span>
                  <strong>{candidate.jurusan}</strong>
                </div>

                <div className="detail-item">
                  <span>Fakultas</span>
                  <strong>{candidate.fakultas}</strong>
                </div>

                <div className="detail-item">
                  <span>Posisi</span>
                  <strong>{candidate.posisi}</strong>
                </div>

                <div className="detail-item">
                  <span>Status</span>
                  <strong>{candidate.status}</strong>
                </div>
              </div>

              <div className="detail-section">
                <h3>Visi</h3>
                <p>{candidate.visi}</p>
              </div>

              <div className="detail-section">
                <h3>Misi</h3>
                <p>{candidate.misi}</p>
              </div>

              <div className="detail-section">
                <h3>Inovasi</h3>
                <p>{candidate.inovasi}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default CandidateDetailPage;