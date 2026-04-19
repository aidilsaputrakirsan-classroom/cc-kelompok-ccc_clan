# ============================================================
# Stage: Production Image
# ============================================================

# 1. Base image — Python 3.12 slim (debian minimal, ~50MB)
FROM python:3.12-slim

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 2. Tambahkan non-root user
RUN useradd -m appuser

# 3. Set working directory di dalam container
WORKDIR /app

# 4. Copy HANYA requirements.txt dulu (cache optimization)
COPY requirements.txt .

# 5. Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy seluruh kode aplikasi
COPY . .

# 7. Set permission ke user non-root
RUN chown -R appuser:appuser /app

# 8. Gunakan user non-root
USER appuser

# 9. Dokumentasikan port yang digunakan
EXPOSE 8000

# 10. Command untuk menjalankan aplikasi
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]ok