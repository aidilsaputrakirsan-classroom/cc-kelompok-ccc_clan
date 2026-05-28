import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminNavbar from "../AdminNavbar";

vi.mock("../../services/api", () => ({
  logout: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderAdminNavbar(initialPath = "/dashboard") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AdminNavbar />
    </MemoryRouter>
  );
}

describe("AdminNavbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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