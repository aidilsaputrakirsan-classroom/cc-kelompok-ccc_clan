const TOKEN_KEY = "token";
const USER_KEY = "user";

export function getStoredUser() {
  const savedUser = localStorage.getItem(USER_KEY);

  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser);
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return Boolean(getToken());
}

export function getUserRole() {
  const user = getStoredUser();
  return user?.role || null;
}

export function normalizeRole(role) {
  return String(role || "").toLowerCase().trim();
}

export function hasRole(allowedRoles = []) {
  const currentRole = normalizeRole(getUserRole());

  if (!currentRole) return false;

  return allowedRoles.map(normalizeRole).includes(currentRole);
}

export function isUser() {
  return hasRole(["user"]);
}

export function isAdmin() {
  return hasRole(["admin"]);
}

export function isSuperAdmin() {
  return hasRole(["superadmin"]);
}

export function canManageCandidates() {
  return hasRole(["admin", "superadmin"]);
}

export function canManageUsers() {
  return hasRole(["superadmin"]);
}

export function canAccessVoting() {
  return hasRole(["user"]);
}

export function getUserDisplayRole() {
  const role = getUserRole();

  if (role === "superadmin") return "Superadmin";
  if (role === "admin") return "Admin";
  if (role === "user") return "Pemilih";

  return "Guest";
}