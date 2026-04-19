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

function authHeaders() {
  const token = getToken();
  const headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse(response) {
  if (response.status === 401) {
    clearToken();
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    let errorMessage = "Request gagal";

    if (error.detail) {
      if (Array.isArray(error.detail)) {
        errorMessage = error.detail
          .map((e) => e.msg || JSON.stringify(e))
          .join(", ");
      } else if (typeof error.detail === "string") {
        errorMessage = error.detail;
      }
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;

  return response.json();
}

// AUTH
export async function register(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response);

  if (!data.access_token) {
    throw new Error("Server tidak mengembalikan access_token");
  }

  setToken(data.access_token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

export async function getMe() {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });

  return handleResponse(response);
}

export async function logout() {
  clearToken();
}

// CANDIDATES
export async function getPublicCandidates() {
  const response = await fetch(`${API_URL}/candidates`, {
    method: "GET",
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