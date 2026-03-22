const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

// ==================== TOKEN MANAGEMENT ====================

let authToken = null

export function setToken(token) {
  authToken = token
  console.log("🔐 Token set:", token)
}

export function getToken() {
  return authToken
}

export function clearToken() {
  authToken = null
  console.log("🗑️ Token cleared")
}

function authHeaders() {
  const headers = {}
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`
    console.log("📤 Authorization header added")
  } else {
    console.warn("⚠️ No token available! Cannot authorize request")
  }
  return headers
}

// Helper: handle response errors
// Helper: handle response errors
async function handleResponse(response) {
  if (response.status === 401) {
    console.error("❌ 401 Unauthorized - clearing token")
    clearToken()
    throw new Error("UNAUTHORIZED")
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    
    // ← TAMBAHKAN INI: Handle jika detail adalah array (validation error)
    let errorMessage = "Request gagal"
    if (error.detail) {
      if (Array.isArray(error.detail)) {
        // Validation error dari Pydantic
        errorMessage = error.detail
          .map(e => e.msg || JSON.stringify(e))
          .join(", ")
      } else if (typeof error.detail === "string") {
        // Custom error message
        errorMessage = error.detail
      }
    }
    
    throw new Error(errorMessage)
  }
  // 204 No Content
  if (response.status === 204) return null
  return response.json()
}

// ==================== AUTH API ====================

export async function register(userData) {
  console.log("📝 Registering user:", userData.email)
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
  return handleResponse(response)
}

export async function login(email, password) {
  console.log("🔐 Logging in:", email)
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const data = await handleResponse(response)
  console.log("✅ Full login response:", data)
  console.log("✅ access_token field:", data.access_token)
  console.log("✅ token_type field:", data.token_type)
  console.log("✅ user field:", data.user)
  
  if (!data.access_token) {
    console.error("❌ ERROR: access_token is undefined!")
    console.error("❌ Response keys:", Object.keys(data))
    throw new Error("Server tidak mengembalikan access_token")
  }
  
  setToken(data.access_token)
  console.log("✅ Token saved, authToken is now:", data.access_token.substring(0, 20) + "...")
  return data
}
export async function getMe() {
  console.log("👤 Fetching current user")
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: authHeaders(),
  })
  return handleResponse(response)
}

// ==================== ITEMS API ====================

export async function fetchItems(search = "", skip = 0, limit = 20) {
  console.log("📋 Fetching items with search:", search)
  const params = new URLSearchParams()
  if (search) params.append("search", search)
  params.append("skip", skip)
  params.append("limit", limit)

  const response = await fetch(`${API_URL}/items?${params}`, {
    headers: authHeaders(),
  })
  return handleResponse(response)
}

export async function createItem(itemData) {
  console.log("➕ Creating item:", itemData.name)
  const response = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(itemData),
  })
  return handleResponse(response)
}

export async function updateItem(id, itemData) {
  console.log("✏️ Updating item:", id)
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(itemData),
  })
  return handleResponse(response)
}

export async function deleteItem(id) {
  console.log("🗑️ Deleting item:", id)
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  return handleResponse(response)
}

export async function checkHealth() {
  console.log("💚 Checking health")
  try {
    const response = await fetch(`${API_URL}/health`)
    const data = await response.json()
    console.log("💚 Health check:", data.status)
    return data.status === "healthy"
  } catch {
    console.error("❌ Health check failed")
    return false
  }
}