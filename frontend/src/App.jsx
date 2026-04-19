import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import CandidatesPage from "./components/CandidatesPage";
import CandidateFormPage from "./components/CandidateFormPage";
import CandidateDetailPage from "./components/CandidateDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/candidates" element={<CandidatesPage />} />
      <Route path="/candidates/create" element={<CandidateFormPage />} />
      <Route path="/candidates/:id" element={<CandidateDetailPage />} />
      <Route path="/candidates/:id/edit" element={<CandidateFormPage />} />
    </Routes>
  );
}

export default App;