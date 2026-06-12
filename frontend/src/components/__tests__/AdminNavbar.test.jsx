import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminNavbar from "../AdminNavbar";
import { ThemeProvider } from "../../context/ThemeContext";

vi.mock("../../services/api", () => ({
  logout: vi.fn(),
}));

function renderAdminNavbar(initialPath = "/dashboard") {
  localStorage.setItem("token", "dummy-token");
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: 1,
      name: "Admin SIPILIH",
      email: "admin@sipilih.test",
      role: "admin",
      is_active: true,
    })
  );

  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <AdminNavbar />
      </MemoryRouter>
    </ThemeProvider>
  );
}

describe("AdminNavbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.body.className = "";
  });

  it("menampilkan logo dan subtitle aplikasi", () => {
    renderAdminNavbar();

    expect(screen.getByText("SIPILIH")).toBeInTheDocument();
    expect(
      screen.getByText("Sistem Informasi Pemilihan Digital")
    ).toBeInTheDocument();
  });

  it("menampilkan link navigasi Dashboard dan Kandidat", () => {
    renderAdminNavbar();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Kandidat")).toBeInTheDocument();
  });

  it("menampilkan tombol logout", () => {
    renderAdminNavbar();

    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("menampilkan modal konfirmasi saat tombol logout diklik", () => {
    renderAdminNavbar();

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    expect(screen.getByText("Konfirmasi Logout")).toBeInTheDocument();
    expect(
      screen.getByText("Apakah kamu yakin ingin keluar dari sistem SIPILIH?")
    ).toBeInTheDocument();
  });
});