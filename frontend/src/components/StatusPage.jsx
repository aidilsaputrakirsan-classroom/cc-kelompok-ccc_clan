import { useState, useEffect, useCallback } from "react";
import AdminNavbar from "./AdminNavbar";

const AUTH_URL =
  import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:8001";
const CANDIDATE_URL =
  import.meta.env.VITE_CANDIDATE_SERVICE_URL || "http://localhost:8002";
const BACKEND_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

function ServiceCard({ name, icon, url }) {
  const [status, setStatus] = useState("checking");

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      setStatus("healthy");
    } catch {
      setStatus("unreachable");
    }
  }, [url]);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const color =
    status === "healthy"
      ? "#22c55e"
      : status === "checking"
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "18px",
        marginBottom: "14px",
        borderLeft: `6px solid ${color}`,
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h3 style={{ margin: 0 }}>
          {icon} {name}
        </h3>
        <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>
          {url}
        </p>
      </div>

      <span
        style={{
          background: color,
          color: "#fff",
          padding: "5px 12px",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: "600",
          textTransform: "uppercase",
        }}
      >
        {status}
      </span>
    </div>
  );
}

export default function StatusPage() {
  return (
    <>
      {/* 🔥 NAVBAR SELALU ADA */}
      <AdminNavbar />

      {/* PAGE BODY */}
      <div style={{ background: "#f3f6fb", minHeight: "100vh" }}>
        <div style={{ padding: "24px" }}>
          
          {/* HEADER */}
          <div style={{ marginBottom: "20px" }}>
            <h1 style={{ marginBottom: "6px" }}>
              📊 Status Sistem SiPilih
            </h1>
            <p style={{ color: "#6b7280" }}>
              Monitoring kesehatan semua service backend secara real-time
            </p>
          </div>

          {/* CARD WRAPPER */}
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
            }}
          >
            <ServiceCard
              name="Auth Service"
              icon="🔐"
              url={`${AUTH_URL}/auth/health`}
            />

            <ServiceCard
              name="Candidate Service"
              icon="👤"
              url={`${CANDIDATE_URL}/candidates/health`}
            />

            <ServiceCard
              name="Main Backend"
              icon="🗳️"
              url={`${BACKEND_URL}/health`}
            />
          </div>
        </div>
      </div>
    </>
  );
}