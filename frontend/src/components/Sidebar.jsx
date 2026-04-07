import { Link, useLocation } from "react-router-dom";

function Sidebar({ user }) {
  const location = useLocation();
  const role = user?.role || "user";

  const menuByRole = {
    user: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Daftar Kandidat", path: "/candidates" },
      { label: "Daftar Jadi Kandidat", path: "/register-candidate" },
      { label: "Voting", path: "/voting" },
      { label: "Profil", path: "/profile" },
    ],
    admin: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Approval Kandidat", path: "/admin/candidates" },
      { label: "Daftar Kandidat", path: "/candidates" },
      { label: "Profil", path: "/profile" },
    ],
    superadmin: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Approval Kandidat", path: "/admin/candidates" },
      { label: "Kelola Admin", path: "/superadmin/admins" },
      { label: "Daftar Kandidat", path: "/candidates" },
      { label: "Profil", path: "/profile" },
    ],
  };

  const menus = menuByRole[role] || menuByRole.user;

  return (
    <aside style={styles.sidebar}>
      <div>
        <div style={styles.brandBox}>
          <h2 style={styles.brand}>SIPILIH</h2>
          <p style={styles.brandSub}>Sistem Pemilihan Kampus</p>
        </div>

        <nav style={styles.nav}>
          {menus.map((menu) => {
            const isActive = location.pathname === menu.path;

            return (
              <Link
                key={menu.path}
                to={menu.path}
                style={{
                  ...styles.menuItem,
                  ...(isActive ? styles.menuItemActive : {}),
                }}
              >
                {menu.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div style={styles.footer}>
        <div style={styles.profileMini}>
          <div style={styles.avatar}>👤</div>
          <div>
            <div style={styles.name}>{user?.name || "Guest"}</div>
            <div style={styles.role}>{role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    minHeight: "100vh",
    backgroundColor: "#111827",
    color: "white",
    padding: "24px 18px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
  brandBox: {
    marginBottom: "28px",
  },
  brand: {
    margin: 0,
    fontSize: "1.7rem",
    fontWeight: "700",
  },
  brandSub: {
    margin: "6px 0 0 0",
    fontSize: "0.9rem",
    color: "#9ca3af",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  menuItem: {
    padding: "12px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
    textDecoration: "none",
    color: "white",
    border: "1px solid rgba(255,255,255,0.05)",
    backgroundColor: "transparent",
  },
  menuItemActive: {
    backgroundColor: "#1e293b",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: "18px",
    marginTop: "20px",
  },
  profileMini: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    backgroundColor: "#1f2937",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
  },
  name: {
    fontSize: "0.95rem",
    fontWeight: "600",
  },
  role: {
    fontSize: "0.8rem",
    color: "#9ca3af",
    textTransform: "capitalize",
    marginTop: "2px",
  },
};

export default Sidebar;