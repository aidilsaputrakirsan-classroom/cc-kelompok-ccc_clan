# ============================================================
# Stage: Production Image
# ============================================================

# 1. Base image
FROM python:3.12-slim

# 2. Install system dependencies + curl
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 3. Tambahkan non-root user
RUN useradd -m appuser

# 4. Set working directory
WORKDIR /app

# 5. Copy requirements
COPY requirements.txt .

# 6. Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 7. Copy source code
COPY . .

# 8. Set permission
RUN chown -R appuser:appuser /app

# 9. Gunakan non-root user
USER appuser

# 10. Expose port
EXPOSE 8000

# 11. Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# 12. Run app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]