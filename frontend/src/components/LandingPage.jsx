import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav className="landing-navbar">
        <div className="logo-wrap">
          <h2 className="logo">SIPILIH</h2>
          <span className="logo-subtitle">
            Sistem Informasi Pemilihan Digital
          </span>
        </div>

        {/* ✅ DUA TOMBOL DI KANAN */}
        <div className="nav-buttons">
          <Link to="/login" className="btn btn-outline">
            Masuk
          </Link>

          <Link to="/register" className="btn btn-primary">
            Daftar Akun
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-left">
          <span className="hero-badge">Platform E-Voting Kampus</span>

          <h1>
            Pemilihan Digital
            <br />
            Lebih Aman dan Terstruktur
          </h1>

          <p>
            SIPILIH membantu proses pemilihan organisasi kampus menjadi lebih
            modern, transparan, dan terintegrasi dalam satu sistem yang mudah
            digunakan.
          </p>
        </div>

        <div className="hero-right">
          <div className="hero-card">
            <h3>Keunggulan SIPILIH</h3>

            <div className="feature-item">
              <div className="feature-icon">1</div>
              <div>
                <h4>Aman</h4>
                <p>
                  Sistem autentikasi membantu menjaga akses pengguna ke dalam
                  platform.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">2</div>
              <div>
                <h4>Terstruktur</h4>
                <p>
                  Pengelolaan kandidat dan proses pemilihan dilakukan dalam satu
                  sistem terpusat.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">3</div>
              <div>
                <h4>Modern</h4>
                <p>
                  Tampilan antarmuka dirancang clean dan mudah dipahami untuk
                  kebutuhan administrasi kampus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;