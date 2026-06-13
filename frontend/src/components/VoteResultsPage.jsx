import { useEffect, useMemo, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import Toast from "./Toast";
import { getVoteResults } from "../services/api";
import { groupCandidatesByVotingCategory } from "../utils/voting";
import "../styles/fase5.css";

function getNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

function normalizeResultItem(item) {
  const candidateId = item.candidate_id ?? item.id;

  return {
    id: candidateId,
    candidate_id: candidateId,
    nama: item.nama || item.candidate_name || item.name || `Kandidat #${candidateId || "-"}`,
    posisi: item.posisi || item.position || item.category_label || "Lainnya",
    prodi: item.prodi || item.program_studi || "",
    jurusan: item.jurusan || "",
    fakultas: item.fakultas || "",
    status: item.status || "approved",
    category_key: item.category_key || item.categoryKey || "",
    category_label: item.category_label || item.categoryLabel || "",
    level: item.level || item.scope || "",
    scope: item.scope || item.level || "",
    total_votes: getNumber(item.total_votes ?? item.totalVotes ?? item.vote_count ?? item.votes),
  };
}

function getLevelLabel(level) {
  const normalized = normalizeText(level);

  if (normalized === "km") return "KM";
  if (normalized === "fakultas") return "Fakultas";
  if (normalized === "jurusan") return "Jurusan";
  if (normalized === "prodi") return "Prodi";

  return "Lainnya";
}

function VoteResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  const closeToast = () => {
    setToast({ show: false, type: "success", message: "" });
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchResults() {
      setLoading(true);

      try {
        const resultData = await getVoteResults();

        if (!isMounted) return;

        setResults(Array.isArray(resultData) ? resultData : []);
      } catch (err) {
        if (!isMounted) return;

        setToast({
          show: true,
          type: "error",
          message: err.message || "Gagal mengambil hasil voting.",
        });
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, []);

  const groupedResults = useMemo(() => {
    const candidates = results.map(normalizeResultItem);

    return groupCandidatesByVotingCategory(candidates).map((group) => {
      const totalCategoryVotes = group.candidates.reduce(
        (total, candidate) => total + getNumber(candidate.total_votes),
        0
      );

      const sortedCandidates = [...group.candidates]
        .map((candidate) => {
          const candidateVotes = getNumber(candidate.total_votes);
          const percentage =
            totalCategoryVotes > 0
              ? Math.round((candidateVotes / totalCategoryVotes) * 100)
              : 0;

          return {
            ...candidate,
            total_votes: candidateVotes,
            percentage,
          };
        })
        .sort((a, b) => b.total_votes - a.total_votes || String(a.nama).localeCompare(String(b.nama)));

      return {
        ...group,
        levelLabel: group.levelLabel || getLevelLabel(group.level),
        totalCategoryVotes,
        candidates: sortedCandidates,
        leader: sortedCandidates[0] || null,
      };
    });
  }, [results]);

  const filteredGroups = useMemo(() => {
    const keyword = normalizeText(searchTerm);

    return groupedResults.filter((group) => {
      const matchesLevel = levelFilter === "all" || normalizeText(group.level) === levelFilter;

      const matchesKeyword =
        !keyword ||
        normalizeText(group.label).includes(keyword) ||
        normalizeText(group.levelLabel).includes(keyword) ||
        group.candidates.some((candidate) => {
          return (
            normalizeText(candidate.nama).includes(keyword) ||
            normalizeText(candidate.posisi).includes(keyword) ||
            normalizeText(candidate.prodi).includes(keyword) ||
            normalizeText(candidate.jurusan).includes(keyword) ||
            normalizeText(candidate.fakultas).includes(keyword)
          );
        });

      return matchesLevel && matchesKeyword;
    });
  }, [groupedResults, levelFilter, searchTerm]);

  const totalVotes = useMemo(
    () => results.reduce((sum, item) => sum + getNumber(item.total_votes ?? item.totalVotes ?? item.vote_count ?? item.votes), 0),
    [results]
  );

  const leadingCandidate = useMemo(() => {
    const allCandidates = groupedResults.flatMap((group) =>
      group.candidates.map((candidate) => ({
        ...candidate,
        groupLabel: group.label,
      }))
    );

    if (allCandidates.length === 0) return null;

    return [...allCandidates].sort((a, b) => b.total_votes - a.total_votes)[0];
  }, [groupedResults]);

  const topCategories = useMemo(
    () => [...groupedResults].sort((a, b) => b.totalCategoryVotes - a.totalCategoryVotes).slice(0, 5),
    [groupedResults]
  );

  const maxCategoryVotes = useMemo(
    () => Math.max(...topCategories.map((group) => group.totalCategoryVotes), 1),
    [topCategories]
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

      <main className="candidates-page fase5-page">
        <section className="fase5-hero candidate-hero">
          <div>
            <span className="candidate-badge">FASE 5 - Hasil Voting</span>
            <h1>Rekapitulasi Hasil Voting</h1>
            <p>
              Pantau hasil voting per kategori KM, fakultas, jurusan, dan prodi dengan visualisasi suara yang mudah dibaca.
            </p>
          </div>
        </section>

        <section className="fase5-stats-grid voting-stats-grid">
          <div className="fase5-stat-card">
            <span>Total Kategori</span>
            <strong>{groupedResults.length}</strong>
            <small>Kategori voting</small>
          </div>
          <div className="fase5-stat-card">
            <span>Total Kandidat</span>
            <strong>{results.length}</strong>
            <small>Data kandidat hasil</small>
          </div>
          <div className="fase5-stat-card success">
            <span>Total Suara</span>
            <strong>{totalVotes}</strong>
            <small>Seluruh kategori</small>
          </div>
          <div className="fase5-stat-card warning">
            <span>Suara Teratas</span>
            <strong>{leadingCandidate ? leadingCandidate.total_votes : 0}</strong>
            <small>{leadingCandidate ? leadingCandidate.nama : "Belum ada"}</small>
          </div>
        </section>

        <section className="fase5-results-layout">
          <div className="candidate-table-card fase5-results-main">
            <div className="candidate-table-top fase5-results-header">
              <div className="candidate-table-header">
                <div>
                  <h3>Hasil Berdasarkan Kategori</h3>
                  <p>
                    {loading
                      ? "Sedang memuat hasil voting..."
                      : `${filteredGroups.length} kategori ditampilkan`}
                  </p>
                </div>
              </div>

              <div className="fase5-filter-row">
                <input
                  type="text"
                  placeholder="Cari kategori, kandidat, prodi..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <select
                  value={levelFilter}
                  onChange={(event) => setLevelFilter(event.target.value)}
                >
                  <option value="all">Semua Level</option>
                  <option value="km">KM</option>
                  <option value="fakultas">Fakultas</option>
                  <option value="jurusan">Jurusan</option>
                  <option value="prodi">Prodi</option>
                </select>
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
            ) : filteredGroups.length === 0 ? (
              <div className="candidate-empty-state">
                <h4>Data tidak ditemukan</h4>
                <p>Coba ubah kata kunci pencarian atau filter level kategori.</p>
              </div>
            ) : (
              <div className="voting-category-list fase5-category-results">
                {filteredGroups.map((group) => (
                  <section className="voting-category fase5-result-category" key={group.key}>
                    <div className="voting-category-header fase5-category-header">
                      <div>
                        <span>{group.levelLabel}</span>
                        <h4>{group.label}</h4>
                        {group.leader && (
                          <small>Suara sementara tertinggi: {group.leader.nama}</small>
                        )}
                      </div>

                      <p>{group.totalCategoryVotes} suara</p>
                    </div>

                    <div className="fase5-candidate-result-list">
                      {group.candidates.map((candidate, index) => (
                        <article className="fase5-candidate-result-card" key={candidate.id || `${group.key}-${index}`}>
                          <div className="fase5-candidate-result-main">
                            <div className="candidate-mini-avatar">
                              {candidate.nama?.charAt(0)?.toUpperCase() || "K"}
                            </div>

                            <div>
                              <h5>{candidate.nama}</h5>
                              <p>{candidate.posisi}</p>
                              <small>
                                {[candidate.prodi, candidate.jurusan, candidate.fakultas]
                                  .filter(Boolean)
                                  .join(" • ") || "Lingkup umum"}
                              </small>
                            </div>
                          </div>

                          <div className="fase5-vote-visual">
                            <div className="fase5-vote-meta">
                              <strong>{candidate.total_votes} suara</strong>
                              <span>{candidate.percentage}%</span>
                            </div>
                            <div className="vote-result-bar fase5-wide-bar">
                              <div
                                className="vote-result-fill"
                                style={{ width: `${candidate.percentage}%` }}
                              />
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>

          <aside className="fase5-results-side">
            <section className="summary-card">
              <h3>Top Kategori</h3>
              {topCategories.length === 0 ? (
                <div className="fase5-empty-mini">Belum ada suara yang masuk.</div>
              ) : (
                <div className="fase5-bar-list">
                  {topCategories.map((group) => {
                    const width = Math.round((group.totalCategoryVotes / maxCategoryVotes) * 100);

                    return (
                      <div className="fase5-bar-row" key={group.key}>
                        <div className="fase5-bar-row-top">
                          <span>{group.label}</span>
                          <strong>{group.totalCategoryVotes}</strong>
                        </div>
                        <div className="fase5-bar-track">
                          <div className="fase5-bar-fill" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="summary-card">
              <h3>Keterangan</h3>
              <div className="guide-list">
                <div className="guide-item">
                  <span>1</span>
                  <p>Hasil dikelompokkan berdasarkan kategori voting.</p>
                </div>
                <div className="guide-item">
                  <span>2</span>
                  <p>Persentase dihitung dari total suara di kategori yang sama.</p>
                </div>
                <div className="guide-item">
                  <span>3</span>
                  <p>Gunakan filter untuk melihat hasil level KM, fakultas, jurusan, atau prodi.</p>
                </div>
              </div>
            </section>
          </aside>
        </section>
      </main>
    </>
  );
}

export default VoteResultsPage;
