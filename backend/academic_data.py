from __future__ import annotations

from fastapi import HTTPException

ACADEMIC_STRUCTURE = [
    {
        "fakultas": "Fakultas Sains dan Teknologi Informasi",
        "jurusan": [
            {
                "nama": "Jurusan Sains dan Analitika Data",
                "prodi": [
                    "Matematika",
                    "Ilmu Aktuaria",
                    "Statistika",
                    "Fisika",
                ],
            },
            {
                "nama": "Jurusan Teknik Elektro, Informatika, dan Bisnis",
                "prodi": [
                    "Informatika",
                    "Sistem Informasi",
                    "Bisnis Digital",
                    "Teknik Elektro",
                ],
            },
        ],
    },
    {
        "fakultas": "Fakultas Pembangunan Berkelanjutan",
        "jurusan": [
            {
                "nama": "Jurusan Teknologi Kemaritiman",
                "prodi": [
                    "Teknik Perkapalan",
                    "Teknik Kelautan",
                    "Teknik Lingkungan",
                ],
            },
            {
                "nama": "Jurusan Teknik Sipil dan Perencanaan",
                "prodi": [
                    "Teknik Sipil",
                    "Perencanaan Wilayah dan Kota",
                    "Arsitektur",
                    "Desain Komunikasi Visual",
                ],
            },
        ],
    },
    {
        "fakultas": "Fakultas Rekayasa dan Teknologi Industri",
        "jurusan": [
            {
                "nama": "Jurusan Teknologi Industri",
                "prodi": [
                    "Teknik Mesin",
                    "Teknik Industri",
                    "Teknik Logistik",
                    "Teknik Material dan Metalurgi",
                ],
            },
            {
                "nama": "Jurusan Rekayasa Industri",
                "prodi": [
                    "Teknologi Pangan",
                    "Teknik Kimia",
                    "Rekayasa Keselamatan",
                ],
            },
        ],
    },
]


def normalize_text(value: str | None) -> str:
    return " ".join(str(value or "").strip().lower().split())


def get_academic_structure() -> list[dict]:
    return ACADEMIC_STRUCTURE


def get_faculty_names() -> list[str]:
    return [faculty["fakultas"] for faculty in ACADEMIC_STRUCTURE]


def get_department_names(fakultas: str | None = None) -> list[str]:
    departments: list[str] = []

    for faculty in ACADEMIC_STRUCTURE:
        if fakultas and normalize_text(faculty["fakultas"]) != normalize_text(fakultas):
            continue

        departments.extend(department["nama"] for department in faculty["jurusan"])

    return departments


def get_program_names(jurusan: str | None = None) -> list[str]:
    programs: list[str] = []

    for faculty in ACADEMIC_STRUCTURE:
        for department in faculty["jurusan"]:
            if jurusan and normalize_text(department["nama"]) != normalize_text(jurusan):
                continue

            programs.extend(department["prodi"])

    return programs


def find_faculty(fakultas: str | None) -> dict | None:
    normalized = normalize_text(fakultas)

    for faculty in ACADEMIC_STRUCTURE:
        if normalize_text(faculty["fakultas"]) == normalized:
            return faculty

    return None


def find_department(fakultas: str | None, jurusan: str | None) -> dict | None:
    faculty = find_faculty(fakultas)

    if not faculty:
        return None

    normalized = normalize_text(jurusan)

    for department in faculty["jurusan"]:
        if normalize_text(department["nama"]) == normalized:
            return department

    return None


def is_valid_program(fakultas: str | None, jurusan: str | None, prodi: str | None) -> bool:
    department = find_department(fakultas, jurusan)

    if not department:
        return False

    normalized = normalize_text(prodi)
    return any(normalize_text(program) == normalized for program in department["prodi"])


def validate_academic_selection(fakultas: str | None, jurusan: str | None, prodi: str | None) -> None:
    if not find_faculty(fakultas):
        raise HTTPException(status_code=400, detail="Fakultas tidak valid")

    if not find_department(fakultas, jurusan):
        raise HTTPException(status_code=400, detail="Jurusan tidak sesuai dengan fakultas")

    if not is_valid_program(fakultas, jurusan, prodi):
        raise HTTPException(status_code=400, detail="Prodi tidak sesuai dengan jurusan")
