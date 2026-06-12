import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import CandidatesPage from "./components/CandidatesPage";
import CandidateFormPage from "./components/CandidateFormPage";
import CandidateDetailPage from "./components/CandidateDetailPage";
import AboutPage from "./components/AboutPage";
import ErrorBoundary from "./components/ErrorBoundary";
import VotingPage from "./components/VotingPage";
import VoteResultsPage from "./components/VoteResultsPage";
import ProtectedRoute, { GuestRoute } from "./components/ProtectedRoute";
import UnauthorizedPage from "./components/UnauthorizedPage";
import NotFoundPage from "./components/NotFoundPage";
import ComingSoonPage from "./components/ComingSoonPage";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Guest-only routes */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />

          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />

          {/* Protected common routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/candidates"
            element={
              <ProtectedRoute>
                <CandidatesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/candidates/:id"
            element={
              <ProtectedRoute>
                <CandidateDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vote-results"
            element={
              <ProtectedRoute>
                <VoteResultsPage />
              </ProtectedRoute>
            }
          />

          {/* User-only voting route */}
          <Route
            path="/voting"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <VotingPage />
              </ProtectedRoute>
            }
          />

          {/* Admin + Superadmin routes */}
          <Route
            path="/admin/candidates"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <CandidatesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/candidates/create"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <CandidateFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/candidates/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <CandidateFormPage />
              </ProtectedRoute>
            }
          />

          {/* Superadmin-only route, placeholder for Fase 2 */}
          <Route
            path="/manage-users"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <ComingSoonPage
                  badge="FASE 2"
                  title="Manajemen User"
                  description="Halaman verifikasi user dan pengelolaan data pemilih akan dibuat pada Fase 2."
                />
              </ProtectedRoute>
            }
          />

          {/* Utility routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;