import { getFriendlyErrorMessage } from "../utils/validation";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  const savedUser = localStorage.getItem(USER_KEY);

  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

function authHeaders() {
  const token = getToken();
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function extractDetailMessage(detail) {
  if (!detail) return "";

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.msg) return item.msg;
        if (item?.message) return item.message;
        return JSON.stringify(item);
      })
      .join(", ");
  }

  if (typeof detail === "object") {
    if (detail.msg) return detail.msg;
    if (detail.message) return detail.message;
    return JSON.stringify(detail);
  }

  return "";
}

async function readResponseBody(response) {
  const contentType = response.headers?.get?.("content-type") || "";

  if (contentType.includes("application/json") && typeof response.json === "function") {
    return response.json().catch(() => ({}));
  }

  if (typeof response.json === "function") {
    return response.json().catch(() => ({}));
  }

  if (typeof response.text === "function") {
    const text = await response.text().catch(() => "");
    return text ? { detail: text } : {};
  }

  return {};
}

async function handleResponse(response) {
  if (response.status === 401) {
    clearToken();
    throw new Error("UNAUTHORIZED");
  }

  if (response.status === 403) {
    const error = await readResponseBody(response);
    throw new Error(extractDetailMessage(error.detail) || "FORBIDDEN");
  }

  if (response.status === 503 || response.status === 504) {
    throw new Error("Server sedang tidak tersedia. Coba lagi beberapa saat lagi.");
  }

  if (!response.ok) {
    const error = await readResponseBody(response);
    const rawMessage =
      extractDetailMessage(error.detail) ||
      error.message ||
      `Request gagal dengan status ${response.status}`;

    throw new Error(getFriendlyErrorMessage(rawMessage, "Request gagal. Periksa kembali data yang dikirim."));
  }

  if (response.status === 204) return null;

  return readResponseBody(response);
}

async function apiFetch(path, options = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, options);
    return await handleResponse(response);
  } catch (error) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      throw error;
    }

    throw new Error(getFriendlyErrorMessage(error));
  }
}

// =====================
// ACADEMIC DATA
// =====================

export async function getAcademicStructure() {
  return apiFetch("/academic", {
    method: "GET",
  });
}

// =====================
// AUTH
// =====================

export async function register(userData) {
  return apiFetch("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
}

export async function login(email, password) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (data?.user?.is_active === false) {
    clearToken();
    throw new Error(
      "Akun belum diverifikasi oleh admin. Silakan tunggu sampai akun kamu diverifikasi."
    );
  }

  if (!data?.access_token) {
    throw new Error(
      "Login berhasil diproses, tetapi server tidak mengirim token. Hubungi tim backend."
    );
  }

  setToken(data.access_token);

  if (data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  return data;
}

export async function getMe() {
  const data = await apiFetch("/auth/me", {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });

  if (data) {
    localStorage.setItem(USER_KEY, JSON.stringify(data));
  }

  return data;
}

export async function logout() {
  clearToken();
}

// =====================
// CANDIDATES
// =====================

export async function getPublicCandidates() {
  return apiFetch("/candidates", {
    method: "GET",
  });
}

export async function getEligibleCandidates() {
  return apiFetch("/candidates/eligible", {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
}

export async function getAdminCandidates() {
  return apiFetch("/admin/candidates", {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
}

export async function getCandidateById(id) {
  const candidates = await getPublicCandidates();
  return candidates.find((candidate) => String(candidate.id) === String(id));
}

export async function createCandidate(candidateData) {
  return apiFetch("/admin/candidates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(candidateData),
  });
}

export async function updateCandidate(id, candidateData) {
  return apiFetch(`/admin/candidates/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(candidateData),
  });
}

export async function updateCandidateStatus(id, status) {
  return updateCandidate(id, { status });
}

export async function deleteCandidate(id) {
  return apiFetch(`/admin/candidates/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeaders(),
    },
  });
}

// =====================
// USERS / VOTERS
// =====================

export async function getAdminUsers(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.role && filters.role !== "all") params.append("role", filters.role);
  if (filters.status === "active") params.append("is_active", "true");
  if (filters.status === "inactive") params.append("is_active", "false");

  const queryString = params.toString();
  const url = queryString ? `/admin/users?${queryString}` : "/admin/users";

  return apiFetch(url, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
}

export async function updateUserVerification(userId, isActive) {
  return apiFetch(`/admin/users/${userId}/verification`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ is_active: isActive }),
  });
}

export async function updateUserRole(userId, role) {
  return apiFetch(`/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ role }),
  });
}

// =====================
// VOTING
// =====================

export async function voteCandidate(candidateId) {
  return apiFetch(`/vote/${candidateId}`, {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
  });
}

export async function getMyVoteStatus() {
  return apiFetch("/vote/my-status", {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
}

export async function getVoteResults() {
  return apiFetch("/vote/results", {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });
}

// =====================
// HEALTH CHECK
// =====================

export async function checkHealth() {
  try {
    await apiFetch("/health", {
      method: "GET",
    });

    return true;
  } catch {
    return false;
  }
}

export { API_URL };
