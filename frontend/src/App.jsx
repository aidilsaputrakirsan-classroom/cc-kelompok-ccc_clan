import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./components/DashboardPage";
import ProfilePage from "./components/ProfilePage";
import CandidatesPage from "./components/CandidatesPage";
import VotingPage from "./components/VotingPage";
import CandidateApprovalPage from "./components/CandidateApprovalPage";
import ManageAdminPage from "./components/ManageAdminPage";
import RegisterCandidatePage from "./components/RegisterCandidatePage";
import {
  checkHealth,
  login,
  register,
  clearToken,
  getMe,
} from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  useEffect(() => {
    checkHealth().then(setIsConnected);
  }, []);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const me = await getMe();
        setUser(me);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    loadCurrentUser();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      showNotification("Login berhasil");
    } catch (err) {
      showNotification(err.message || "Login gagal", "error");
      throw err;
    }
  };

  const handleRegister = async (userData) => {
    try {
      await register(userData);
      await handleLogin(userData.email, userData.password);
      showNotification("Register berhasil");
    } catch (err) {
      if (err instanceof Error) {
        showNotification(err.message, "error");
        throw err;
      } else {
        const error = new Error("Register gagal");
        showNotification(error.message, "error");
        throw error;
      }
    }
  };

  const handleLogout = () => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
    showNotification("Logout berhasil");
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
      <div style={styles.appShell}>
        <Sidebar user={user} />

        <div style={styles.mainContent}>
          {notification && (
            <div
              style={{
                padding: "10px",
                marginBottom: "16px",
                borderRadius: "8px",
                color: "white",
                backgroundColor:
                  notification.type === "error" ? "#e74c3c" : "#2ecc71",
                textAlign: "center",
              }}
            >
              {notification.message}
            </div>
          )}

          <Header
            isConnected={isConnected}
            user={user}
            onLogout={handleLogout}
          />

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage user={user} />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/voting" element={<VotingPage />} />
            <Route path="/register-candidate" element={<RegisterCandidatePage />} />

            {(user?.role === "admin" || user?.role === "superadmin") && (
              <Route
                path="/admin/candidates"
                element={<CandidateApprovalPage />}
              />
            )}

            {user?.role === "superadmin" && (
              <Route
                path="/superadmin/admins"
                element={<ManageAdminPage />}
              />
            )}

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
  );
}

const styles = {
  appShell: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  mainContent: {
    flex: 1,
    padding: "2rem",
  },
};

export default App;