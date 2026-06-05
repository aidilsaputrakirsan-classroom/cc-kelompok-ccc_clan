import { useEffect, useMemo, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import Toast from "./Toast";
import { getPublicCandidates, getVoteResults } from "../services/api";

const POSITION_ORDER = [
  "ketua bem km",
  "dpm km",
  "ketua bem fakultas",
  "dpm fakultas",
  "ketua himpunan",
];

const POSITION_LABELS = {
  "ketua bem km": "Ketua BEM KM",
  "dpm km": "DPM KM",
  "ketua bem fakultas": "Ketua BEM Fakultas",
  "dpm fakultas": "DPM Fakultas",
  "ketua himpunan": "Ketua Himpunan",
};

function normalizePosition(position) {
  return (position || "lainnya").toLowerCase().trim();
}

function getPositionLabel(position) {
  const normalized = normalizePosition(position);
  return POSITION_LABELS[normalized] || position || "Lainnya";
}

function VoteResultsPage() {
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const closeToast = () => {
    setToast({
      show: false,
      type: "success",
      message: "",
    });
  };

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);

      try {
        const [candidateData, resultData] = await Promise.all([
          getPublicCandidates(),
          getVoteResults(),
        ]);

        setCandidates(Array.isArray(candidateData) ? candidateData : []);
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
    const voteMap = {};

    results.forEach((result) => {
      voteMap[Number(result.candidate_id)] = Number(result.total_votes || 0);
    });

    const mergedCandidates = candidates.map((candidate) => {
      return {
        ...candidate,
        total_votes: voteMap[Number(candidate.id)] || 0,
      };
    });

    const groups = {};

    mergedCandidates.forEach((candidate) => {
      const key = normalizePosition(candidate.posisi);

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(candidate);
    });

    const orderedGroups = [];

    POSITION_ORDER.forEach((positionKey) => {
      if (groups[positionKey]?.length) {
        orderedGroups.push({
          key: positionKey,
          label: getPositionLabel(positionKey),
          candidates: groups[positionKey],
        });
      }
    });

    Object.keys(groups)
      .filter((key) => !POSITION_ORDER.includes(key))
      .sort()
      .forEach((key) => {
        orderedGroups.push({
          key,
          label: getPositionLabel(key),
          candidates: groups[key],
        });
      });

    return orderedGroups.map((group) => {
      const totalCategoryVotes = group.candidates.reduce(
        (total, candidate) => total + candidate.total_votes,
        0
      );

      return {
        ...group,
        totalCategoryVotes,
        candidates: group.candidates.map((candidate) => {
          const percentage =
            totalCategoryVotes > 0
              ? Math.round((candidate.total_votes / totalCategoryVotes) * 100)
              : 0;

          return {
            ...candidate,
            percentage,
          };
        }),
      };
    });
  }, [candidates, results]);

  return (
    <>
      <AdminNavbar />

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={closeToast}
      />

      <div className="candidates-page">
        <section className="candidate-hero">
          <div>
            <span className="candidate-badge">Hasil Voting</span>
            <h1>Rekapitulasi Voting</h1>
            <p>
              Hasil voting ditampilkan berdasarkan kategori pemilihan agar
              perolehan suara setiap posisi lebih mudah dibaca.
            </p>
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
                      <span>Kategori</span>
                      <h4>{group.label}</h4>
                    </div>

                    <p>{group.totalCategoryVotes} suara</p>
                  </div>

                  <div className="candidate-table-wrapper">
                    <table className="candidate-table">
                      <thead>
                        <tr>
                          <th>Kandidat</th>
                          <th>Program Studi</th>
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
                                  {candidate.nama
                                    ? candidate.nama.charAt(0).toUpperCase()
                                    : "K"}
                                </div>

                                <div>
                                  <strong>{candidate.nama}</strong>
                                  <span>{candidate.email}</span>
                                </div>
                              </div>
                            </td>

                            <td>{candidate.prodi || "-"}</td>

                            <td>
                              <strong>{candidate.total_votes} suara</strong>
                            </td>

                            <td>
                              <div className="vote-result-percent">
                                <span>{candidate.percentage}%</span>
                                <div className="vote-result-bar">
                                  <div
                                    className="vote-result-fill"
                                    style={{
                                      width: `${candidate.percentage}%`,
                                    }}
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
      </div>
    </>
  );
}

export default VoteResultsPage;