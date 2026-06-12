import { useEffect, useMemo, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import Toast from "./Toast";
import { getVoteResults } from "../services/api";
import { groupCandidatesByVotingCategory } from "../utils/voting";

function VoteResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const closeToast = () => {
    setToast({ show: false, type: "success", message: "" });
  };

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);

      try {
        const resultData = await getVoteResults();
        setResults(Array.isArray(resultData) ? resultData : []);
      } catch (err) {
        setToast({
          show: true,
          type: "error",
          message: err.message || "Gagal mengambil hasil voting.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, []);

  const groupedResults = useMemo(() => {
    const candidates = results.map((item) => ({
      id: item.candidate_id,
      nama: item.candidate_name,
      posisi: item.posisi,
      fakultas: item.fakultas,
      jurusan: item.jurusan,
      prodi: item.prodi,
      category_key: item.category_key,
      category_label: item.category_label,
      level: item.level,
      scope: item.scope,
      total_votes: Number(item.total_votes || 0),
    }));

    return groupCandidatesByVotingCategory(candidates).map((group) => {
      const totalCategoryVotes = group.candidates.reduce(
        (total, candidate) => total + Number(candidate.total_votes || 0),
        0
      );

      return {
        ...group,
        totalCategoryVotes,
        candidates: group.candidates.map((candidate) => {
          const percentage =
            totalCategoryVotes > 0
              ? Math.round((Number(candidate.total_votes || 0) / totalCategoryVotes) * 100)
              : 0;

          return { ...candidate, percentage };
        }),
      };
    });
  }, [results]);

  const totalVotes = useMemo(
    () => results.reduce((sum, item) => sum + Number(item.total_votes || 0), 0),
    [results]
  );

  return (
    <>
      <AdminNavbar />

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={closeToast}
      />

      <main className="candidates-page">
        <section className="candidate-hero">
          <div>
            <span className="candidate-badge">Hasil Voting</span>
            <h1>Rekapitulasi Voting</h1>
            <p>
              Hasil voting ditampilkan berdasarkan kategori KM, fakultas, jurusan,
              dan prodi agar perolehan suara setiap lingkup lebih mudah dibaca.
            </p>
          </div>
        </section>

        <section className="user-stats-grid voting-stats-grid">
          <div className="user-stat-card">
            <span>Total Kategori</span>
            <strong>{groupedResults.length}</strong>
          </div>
          <div className="user-stat-card">
            <span>Total Kandidat</span>
            <strong>{results.length}</strong>
          </div>
          <div className="user-stat-card">
            <span>Total Suara</span>
            <strong>{totalVotes}</strong>
          </div>
          <div className="user-stat-card">
            <span>Status</span>
            <strong>{loading ? "Loading" : "Aktif"}</strong>
          </div>
        </section>

        <section className="candidate-table-card">
          <div className="candidate-table-top">
            <div className="candidate-table-header">
              <div>
                <h3>Hasil Berdasarkan Kategori</h3>
                <p>
                  {loading
                    ? "Sedang memuat hasil voting..."
                    : `${groupedResults.length} kategori tersedia`}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="candidate-empty-state">
              <h4>Loading hasil voting...</h4>
              <p>Mohon tunggu sebentar, hasil sedang diambil dari sistem.</p>
            </div>
          ) : groupedResults.length === 0 ? (
            <div className="candidate-empty-state">
              <h4>Belum ada hasil voting</h4>
              <p>Belum ada data kandidat atau suara yang dapat ditampilkan.</p>
            </div>
          ) : (
            <div className="voting-category-list">
              {groupedResults.map((group) => (
                <section className="voting-category" key={group.key}>
                  <div className="voting-category-header">
                    <div>
                      <span>{group.levelLabel}</span>
                      <h4>{group.label}</h4>
                    </div>

                    <p>{group.totalCategoryVotes} suara</p>
                  </div>

                  <div className="candidate-table-wrapper">
                    <table className="candidate-table">
                      <thead>
                        <tr>
                          <th>Kandidat</th>
                          <th>Lingkup Akademik</th>
                          <th>Jumlah Suara</th>
                          <th>Persentase</th>
                        </tr>
                      </thead>

                      <tbody>
                        {group.candidates.map((candidate) => (
                          <tr key={candidate.id}>
                            <td>
                              <div className="candidate-name-cell">
                                <div className="candidate-mini-avatar">
                                  {candidate.nama?.charAt(0)?.toUpperCase() || "K"}
                                </div>

                                <div>
                                  <strong>{candidate.nama}</strong>
                                  <span>{candidate.posisi}</span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="user-academic-cell">
                                <span>{candidate.scope || candidate.prodi || "-"}</span>
                                <small>{candidate.jurusan || "-"}</small>
                                <small>{candidate.fakultas || "-"}</small>
                              </div>
                            </td>

                            <td>
                              <strong>{candidate.total_votes} suara</strong>
                            </td>

                            <td>
                              <div className="vote-result-percent">
                                <span>{candidate.percentage}%</span>
                                <div className="vote-result-bar">
                                  <div
                                    className="vote-result-fill"
                                    style={{ width: `${candidate.percentage}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default VoteResultsPage;
