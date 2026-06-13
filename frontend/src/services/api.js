const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const TOKEN_KEY = "token";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("user");
}

export function getStoredUser() {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser);
  } catch {
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

async function handleResponse(response) {
  if (response.status === 401) {
    clearToken();
    throw new Error("UNAUTHORIZED");
  }

  if (response.status === 403) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "FORBIDDEN");
  }

  if (response.status === 503 || response.status === 504) {
    throw new Error("Service temporarily unavailable");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    let errorMessage = "Request gagal";

    if (error.detail) {
      if (Array.isArray(error.detail)) {
        errorMessage = error.detail
          .map((item) => item.msg || JSON.stringify(item))
          .join(", ");
      } else if (typeof error.detail === "string") {
        errorMessage = error.detail;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;

  return response.json();
}

// =====================
// ACADEMIC DATA
// =====================

export async function getAcademicStructure() {
  const response = await fetch(`${API_URL}/academic`, {
    method: "GET",
  });

  return handleResponse(response);
}

// =====================
// AUTH
// =====================

export async function register(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response);

  if (!data.access_token) {
    throw new Error("Server tidak mengembalikan access_token");
  }

  setToken(data.access_token);

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
}

export async function getMe() {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });

  const data = await handleResponse(response);

  if (data) {
    localStorage.setItem("user", JSON.stringify(data));
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
  const response = await fetch(`${API_URL}/candidates`, {
    method: "GET",
  });

  return handleResponse(response);
}

export async function getEligibleCandidates() {
  const response = await fetch(`${API_URL}/candidates/eligible`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });

  return handleResponse(response);
}

export async function getAdminCandidates() {
  const response = await fetch(`${API_URL}/admin/candidates`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });

  return handleResponse(response);
}

export async function getCandidateById(id) {
  const candidates = await getPublicCandidates();
  return candidates.find((candidate) => String(candidate.id) === String(id));
}

export async function createCandidate(candidateData) {
  const response = await fetch(`${API_URL}/admin/candidates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(candidateData),
  });

  return handleResponse(response);
}

export async function updateCandidate(id, candidateData) {
  const response = await fetch(`${API_URL}/admin/candidates/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(candidateData),
  });

  return handleResponse(response);
}

export async function deleteCandidate(id) {
  const response = await fetch(`${API_URL}/admin/candidates/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeaders(),
    },
  });

  return handleResponse(response);
}

// =====================
// USERS / VOTERS
// =====================

export async function getAdminUsers(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.append("search", filters.search);
  }

  if (filters.role && filters.role !== "all") {
    params.append("role", filters.role);
  }

  if (filters.status === "active") {
    params.append("is_active", "true");
  }

  if (filters.status === "inactive") {
    params.append("is_active", "false");
  }

  const queryString = params.toString();
  const url = queryString
    ? `${API_URL}/admin/users?${queryString}`
    : `${API_URL}/admin/users`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });

  return handleResponse(response);
}

export async function updateUserVerification(userId, isActive) {
  const response = await fetch(`${API_URL}/admin/users/${userId}/verification`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      is_active: isActive,
    }),
  });

  return handleResponse(response);
}

export async function updateUserRole(userId, role) {
  const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ role }),
  });

  return handleResponse(response);
}

// =====================
// VOTING
// =====================

export async function voteCandidate(candidateId) {
  const response = await fetch(`${API_URL}/vote/${candidateId}`, {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
  });

  return handleResponse(response);
}

export async function getMyVoteStatus() {
  const response = await fetch(`${API_URL}/vote/my-status`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });

  return handleResponse(response);
}

export async function getVoteResults() {
  const response = await fetch(`${API_URL}/vote/results`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });

  return handleResponse(response);
}

// =====================
// HEALTH CHECK
// =====================

export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);

    if (!response.ok) return false;

    await response.json();
    return true;
  } catch {
    return false;
  }
}

export { API_URL };
