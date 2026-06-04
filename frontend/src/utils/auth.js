export function getStoredUser() {
    const savedUser = localStorage.getItem("user");
  
    if (!savedUser) return null;
  
    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  }
  
  export function getUserRole() {
    const user = getStoredUser();
    return user?.role || null;
  }
  
  export function isLoggedIn() {
    return Boolean(localStorage.getItem("token"));
  }
  
  export function isUser() {
    return getUserRole() === "user";
  }
  
  export function isAdmin() {
    return getUserRole() === "admin";
  }
  
  export function isSuperAdmin() {
    return getUserRole() === "superadmin";
  }
  
  export function canManageCandidates() {
    return isAdmin() || isSuperAdmin();
  }