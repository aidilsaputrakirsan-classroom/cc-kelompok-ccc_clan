function AboutPage({ onBack }) {
    const team = [
        {"name": "Dzakwan Fatih Fadhilah", "nim": "10231034", "role": "Lead Backend"},
        {"name": "Risky Nur Fatimah Bahar", "nim": "10231084", "role": "Lead Frontend"},
        {"name": "Muhammad Dani", "nim": "10231062", "role": "Lead Devops"},
        {"name": "Ade Ayu Kholifah Putri", "nim": "10231004", "role": "Lead QA & Docs"}
    ]
    
  
    return (
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <button onClick={onBack} style={{ marginBottom: "20px" }}>
          ← Kembali
        </button>
        <h1>About This Project</h1>
        <p>Aplikasi Cloud-Native yang dibangun untuk mata kuliah Komputasi Awan.</p>
        
        <h2>Tech Stack</h2>
        <ul>
          <li><strong>Backend:</strong> FastAPI + PostgreSQL</li>
          <li><strong>Frontend:</strong> React + Vite</li>
          <li><strong>Container:</strong> Docker + Docker Compose</li>
          <li><strong>CI/CD:</strong> GitHub Actions (coming soon)</li>
        </ul>
  
        <h2>Tim</h2>
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr><th>Nama</th><th>NIM</th><th>Peran</th></tr>
          </thead>
          <tbody>
            {team.map((m, i) => (
              <tr key={i}><td>{m.name}</td><td>{m.nim}</td><td>{m.role}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  export default AboutPage