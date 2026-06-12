export const ACADEMIC_STRUCTURE = [
    {
      fakultas: "Fakultas Sains dan Teknologi Informasi",
      jurusan: [
        {
          nama: "Jurusan Sains dan Analitika Data",
          prodi: ["Matematika", "Ilmu Aktuaria", "Statistika", "Fisika"],
        },
        {
          nama: "Jurusan Teknik Elektro, Informatika, dan Bisnis",
          prodi: ["Informatika", "Sistem Informasi", "Bisnis Digital", "Teknik Elektro"],
        },
      ],
    },
    {
      fakultas: "Fakultas Pembangunan Berkelanjutan",
      jurusan: [
        {
          nama: "Jurusan Teknologi Kemaritiman",
          prodi: ["Teknik Perkapalan", "Teknik Kelautan", "Teknik Lingkungan"],
        },
        {
          nama: "Jurusan Teknik Sipil dan Perencanaan",
          prodi: ["Teknik Sipil", "Perencanaan Wilayah dan Kota", "Arsitektur", "Desain Komunikasi Visual"],
        },
      ],
    },
    {
      fakultas: "Fakultas Rekayasa dan Teknologi Industri",
      jurusan: [
        {
          nama: "Jurusan Teknologi Industri",
          prodi: ["Teknik Mesin", "Teknik Industri", "Teknik Logistik", "Teknik Material dan Metalurgi"],
        },
        {
          nama: "Jurusan Rekayasa Industri",
          prodi: ["Teknologi Pangan", "Teknik Kimia", "Rekayasa Keselamatan"],
        },
      ],
    },
  ];
  
  export function normalizeText(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }
  
  export function normalizeAcademicStructure(data) {
    if (!data) return ACADEMIC_STRUCTURE;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.faculties)) return data.faculties;
    return ACADEMIC_STRUCTURE;
  }
  
  export function getFacultyOptions(structure = ACADEMIC_STRUCTURE) {
    return structure.map((item) => item.fakultas);
  }
  
  export function getDepartmentOptions(structure = ACADEMIC_STRUCTURE, fakultas) {
    const selectedFaculty = structure.find(
      (item) => normalizeText(item.fakultas) === normalizeText(fakultas)
    );
  
    return selectedFaculty ? selectedFaculty.jurusan.map((item) => item.nama) : [];
  }
  
  export function getProgramOptions(structure = ACADEMIC_STRUCTURE, fakultas, jurusan) {
    const selectedFaculty = structure.find(
      (item) => normalizeText(item.fakultas) === normalizeText(fakultas)
    );
  
    const selectedDepartment = selectedFaculty?.jurusan.find(
      (item) => normalizeText(item.nama) === normalizeText(jurusan)
    );
  
    return selectedDepartment?.prodi || [];
  }
  
  export function isValidAcademicSelection(structure, fakultas, jurusan, prodi) {
    return getProgramOptions(structure, fakultas, jurusan).some(
      (item) => normalizeText(item) === normalizeText(prodi)
    );
  }
  