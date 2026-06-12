import { normalizeText } from "./academic";

export const POSITION_OPTIONS = [
  { value: "ketua km", label: "Ketua KM", level: "km" },
  { value: "dpm km", label: "DPM KM", level: "km" },
  { value: "ketua fakultas", label: "Ketua Fakultas", level: "fakultas" },
  { value: "dpm fakultas", label: "DPM Fakultas", level: "fakultas" },
  { value: "ketua jurusan", label: "Ketua Jurusan", level: "jurusan" },
  { value: "dpm jurusan", label: "DPM Jurusan", level: "jurusan" },
  { value: "ketua himpunan", label: "Ketua Himpunan/Prodi", level: "prodi" },
  { value: "dpm prodi", label: "DPM Prodi", level: "prodi" },
];

export const POSITION_LABELS = POSITION_OPTIONS.reduce((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});

export const LEVEL_LABELS = {
  km: "KM",
  fakultas: "Fakultas",
  jurusan: "Jurusan",
  prodi: "Prodi",
  lainnya: "Lainnya",
};

const POSITION_ORDER = POSITION_OPTIONS.map((item) => item.value);

export function normalizePosition(position) {
  return normalizeText(position) || "lainnya";
}

export function getPositionLabel(position) {
  const normalized = normalizePosition(position);
  return POSITION_LABELS[normalized] || position || "Lainnya";
}

export function getPositionLevel(position) {
  const normalized = normalizePosition(position);

  if (normalized.includes("km")) return "km";
  if (normalized.includes("fakultas")) return "fakultas";
  if (normalized.includes("jurusan")) return "jurusan";
  if (
    normalized.includes("prodi") ||
    normalized.includes("himpunan") ||
    normalized.includes("program studi")
  ) {
    return "prodi";
  }

  return "lainnya";
}

export function getCandidateLevel(candidate) {
  return getPositionLevel(candidate?.posisi);
}

export function getCandidateScopeValue(candidate) {
  const level = getCandidateLevel(candidate);

  if (level === "km") return "KM";
  if (level === "fakultas") return candidate?.fakultas || "Fakultas";
  if (level === "jurusan") return candidate?.jurusan || "Jurusan";
  if (level === "prodi") return candidate?.prodi || "Prodi";

  return candidate?.posisi || "Lainnya";
}

export function getCategoryKey(candidate) {
  const position = normalizePosition(candidate?.posisi);
  const level = getCandidateLevel(candidate);
  const scope = normalizeText(getCandidateScopeValue(candidate));
  return `${position}::${level}::${scope}`;
}

export function getCategoryLabel(candidate) {
  const level = getCandidateLevel(candidate);
  const positionLabel = getPositionLabel(candidate?.posisi);

  if (level === "km") {
    return positionLabel;
  }

  return `${positionLabel} - ${getCandidateScopeValue(candidate)}`;
}

export function getLevelLabel(candidateOrLevel) {
  const level =
    typeof candidateOrLevel === "string"
      ? candidateOrLevel
      : getCandidateLevel(candidateOrLevel);

  return LEVEL_LABELS[level] || "Lainnya";
}

export function isApprovedCandidate(candidate) {
  if (!candidate?.status) return true;

  const status = normalizeText(candidate.status);
  return status === "approved" || status === "verified" || status === "disetujui";
}

export function isCandidateEligibleForUser(candidate, user) {
  if (!candidate || !user || !isApprovedCandidate(candidate)) return false;

  const level = getCandidateLevel(candidate);

  if (level === "km") return true;
  if (level === "fakultas") return normalizeText(candidate.fakultas) === normalizeText(user.fakultas);
  if (level === "jurusan") return normalizeText(candidate.jurusan) === normalizeText(user.jurusan);
  if (level === "prodi") return normalizeText(candidate.prodi) === normalizeText(user.prodi);

  return false;
}

export function groupCandidatesByVotingCategory(candidates = []) {
  const map = new Map();

  candidates.forEach((candidate) => {
    const key = candidate.category_key || getCategoryKey(candidate);

    if (!map.has(key)) {
      map.set(key, {
        key,
        position: candidate.posisi,
        label: candidate.category_label || getCategoryLabel(candidate),
        level: candidate.level || getCandidateLevel(candidate),
        levelLabel: getLevelLabel(candidate.level || getCandidateLevel(candidate)),
        scope: candidate.scope || getCandidateScopeValue(candidate),
        candidates: [],
      });
    }

    map.get(key).candidates.push(candidate);
  });

  return sortCategoryGroups(Array.from(map.values()));
}

export function sortCategoryGroups(groups) {
  return [...groups].sort((a, b) => {
    const aPosition = normalizePosition(a.position);
    const bPosition = normalizePosition(b.position);
    const aIndex = POSITION_ORDER.indexOf(aPosition);
    const bIndex = POSITION_ORDER.indexOf(bPosition);

    if (aIndex !== -1 || bIndex !== -1) {
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      if (aIndex !== bIndex) return aIndex - bIndex;
    }

    return a.label.localeCompare(b.label);
  });
}

export function normalizeVoteStatus(data) {
  if (!data) {
    return {
      votedCategories: [],
      votes: [],
    };
  }

  if (Array.isArray(data)) {
    return {
      votedCategories: data,
      votes: [],
    };
  }

  const votes = Array.isArray(data.votes) ? data.votes : [];
  const votedCategories = Array.isArray(data.voted_categories)
    ? data.voted_categories
    : Array.isArray(data.votedCategories)
      ? data.votedCategories
      : votes.map((vote) => vote.category_key || vote.categoryKey || vote.category).filter(Boolean);

  return {
    votedCategories,
    votes,
  };
}

export function getVotedStorageKey(user) {
  const identifier = user?.id || user?.email || "guest";
  return `votedCategories:${identifier}`;
}

export function getSavedVotedCategories(user) {
  const saved = localStorage.getItem(getVotedStorageKey(user));

  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveVotedCategories(user, categories) {
  localStorage.setItem(getVotedStorageKey(user), JSON.stringify(categories));
}

export function mergeUniqueCategories(...categoryLists) {
  const merged = new Set();

  categoryLists.flat().forEach((category) => {
    if (category) merged.add(category);
  });

  return Array.from(merged);
}
