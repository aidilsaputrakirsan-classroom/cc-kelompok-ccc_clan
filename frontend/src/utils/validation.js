const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿĀ-ž\s.'-]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NIM_PATTERN = /^\d{8}$/;
const PASSWORD_PATTERN = {
  upper: /[A-Z]/,
  lower: /[a-z]/,
  number: /\d/,
  symbol: /[^A-Za-z0-9]/,
  space: /\s/,
};

export function trimValue(value) {
  return String(value ?? "").trim();
}

export function normalizeSpace(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function onlyDigits(value, maxLength = 99) {
  return String(value ?? "").replace(/\D/g, "").slice(0, maxLength);
}

export function hasErrors(errors = {}) {
  return Object.values(errors).some(Boolean);
}

export function getFirstError(errors = {}) {
  return Object.values(errors).find(Boolean) || "";
}

export function validateName(value, label = "Nama") {
  const name = normalizeSpace(value);

  if (!name) return `${label} wajib diisi.`;
  if (name.length < 3) return `${label} minimal 3 karakter.`;
  if (name.length > 100) return `${label} maksimal 100 karakter.`;
  if (!NAME_PATTERN.test(name)) {
    return `${label} hanya boleh berisi huruf, spasi, titik, apostrof, atau tanda hubung.`;
  }

  return "";
}

export function validateEmail(value) {
  const email = trimValue(value).toLowerCase();

  if (!email) return "Email wajib diisi.";
  if (!EMAIL_PATTERN.test(email)) return "Format email belum valid. Contoh: nama@email.com.";
  if (email.length > 120) return "Email maksimal 120 karakter.";

  return "";
}

export function validateNim(value) {
  const nim = trimValue(value);

  if (!nim) return "NIM wajib diisi.";
  if (!NIM_PATTERN.test(nim)) return "NIM harus terdiri dari tepat 8 angka.";

  return "";
}

export function validatePassword(value, options = {}) {
  const password = String(value ?? "");
  const { forLogin = false } = options;

  if (!password) return "Password wajib diisi.";

  if (forLogin) return "";

  if (password.length < 8) return "Password minimal 8 karakter.";
  if (password.length > 72) return "Password maksimal 72 karakter.";
  if (PASSWORD_PATTERN.space.test(password)) return "Password tidak boleh mengandung spasi.";
  if (!PASSWORD_PATTERN.upper.test(password)) return "Password harus memuat minimal 1 huruf besar.";
  if (!PASSWORD_PATTERN.lower.test(password)) return "Password harus memuat minimal 1 huruf kecil.";
  if (!PASSWORD_PATTERN.number.test(password)) return "Password harus memuat minimal 1 angka.";
  if (!PASSWORD_PATTERN.symbol.test(password)) return "Password harus memuat minimal 1 simbol, misalnya ! @ # $.";

  return "";
}

export function validateAngkatan(value) {
  const angkatan = trimValue(value);
  const currentYear = new Date().getFullYear();
  const year = Number(angkatan);

  if (!angkatan) return "Angkatan wajib diisi.";
  if (!/^\d{4}$/.test(angkatan)) return "Angkatan harus terdiri dari 4 angka. Contoh: 2023.";
  if (year < 2000 || year > currentYear + 1) {
    return `Angkatan harus berada antara 2000 sampai ${currentYear + 1}.`;
  }

  return "";
}

export function validateRequired(value, label) {
  if (!trimValue(value)) return `${label} wajib diisi.`;
  return "";
}

export function validateSelect(value, label) {
  if (!trimValue(value)) return `${label} wajib dipilih.`;
  return "";
}

export function validateLongText(value, label, minLength = 10) {
  const text = normalizeSpace(value);

  if (!text) return `${label} wajib diisi.`;
  if (text.length < minLength) return `${label} minimal ${minLength} karakter agar informasinya jelas.`;
  if (text.length > 2000) return `${label} maksimal 2000 karakter.`;

  return "";
}

export function validateLoginForm(form) {
  return {
    email: validateEmail(form.email),
    password: validatePassword(form.password, { forLogin: true }),
  };
}

export function validateRegisterForm(form) {
  return {
    name: validateName(form.name),
    email: validateEmail(form.email),
    password: validatePassword(form.password),
    nim: validateNim(form.nim),
    fakultas: validateSelect(form.fakultas, "Fakultas"),
    jurusan: validateSelect(form.jurusan, "Jurusan"),
    prodi: validateSelect(form.prodi, "Prodi"),
    angkatan: validateAngkatan(form.angkatan),
  };
}

export function validateCandidateForm(form) {
  return {
    nama: validateName(form.nama, "Nama kandidat"),
    nim: validateNim(form.nim),
    email: validateEmail(form.email),
    posisi: validateSelect(form.posisi, "Posisi kandidat"),
    fakultas: validateSelect(form.fakultas, "Fakultas"),
    jurusan: validateSelect(form.jurusan, "Jurusan"),
    prodi: validateSelect(form.prodi, "Prodi"),
    visi: validateLongText(form.visi, "Visi", 10),
    misi: validateLongText(form.misi, "Misi", 10),
    inovasi: validateLongText(form.inovasi, "Inovasi", 10),
  };
}

export function validateCandidateStep(form, step) {
  const errors = validateCandidateForm(form);

  if (step === 1) {
    return {
      nama: errors.nama,
      nim: errors.nim,
      email: errors.email,
      posisi: errors.posisi,
    };
  }

  if (step === 2) {
    return {
      fakultas: errors.fakultas,
      jurusan: errors.jurusan,
      prodi: errors.prodi,
    };
  }

  if (step === 3) {
    return {
      visi: errors.visi,
      misi: errors.misi,
      inovasi: errors.inovasi,
    };
  }

  return errors;
}

export function getFriendlyErrorMessage(error, fallback = "Terjadi kesalahan. Silakan coba lagi.") {
  const rawMessage = typeof error === "string" ? error : error?.message;
  const message = String(rawMessage || "").trim();
  const lower = message.toLowerCase();

  if (!message) return fallback;
  if (message === "UNAUTHORIZED") return "Sesi login sudah berakhir. Silakan login ulang.";
  if (message === "FORBIDDEN") return "Kamu tidak memiliki akses untuk melakukan aksi ini.";
  if (lower.includes("failed to fetch") || lower.includes("networkerror") || lower.includes("load failed")) {
    return "Tidak dapat terhubung ke server. Pastikan backend sedang berjalan dan URL API sudah benar.";
  }
  if (lower.includes("email") && (lower.includes("sudah") || lower.includes("exist") || lower.includes("duplicate"))) {
    return "Email sudah terdaftar. Gunakan email lain atau login dengan akun tersebut.";
  }
  if (lower.includes("nim") && (lower.includes("sudah") || lower.includes("exist") || lower.includes("duplicate"))) {
    return "NIM sudah terdaftar. Pastikan NIM benar atau gunakan akun yang sudah dibuat.";
  }
  if (lower.includes("invalid credentials") || lower.includes("incorrect") || lower.includes("unauthorized")) {
    return "Email atau password salah. Periksa kembali data login kamu.";
  }
  if (lower.includes("not found") || lower.includes("tidak ditemukan")) {
    return "Data yang diminta tidak ditemukan.";
  }
  if (lower.includes("request gagal")) return fallback;

  return message;
}
