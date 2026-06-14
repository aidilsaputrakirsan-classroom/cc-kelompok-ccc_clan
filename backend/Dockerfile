# ============================================================
# Stage 1: Builder Stage
# ============================================================

FROM python:3.12-slim AS builder

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (cache optimization)
COPY requirements.txt .

# Create virtual environment
RUN python -m venv /opt/venv

# Activate venv path
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


# ============================================================
# Stage 2: Production Stage
# ============================================================

FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install only curl for healthcheck
RUN apt-get update && apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv

# Set venv path
ENV PATH="/opt/venv/bin:$PATH"

# Create non-root user
RUN useradd -m appuser || true

# Copy application code only
COPY . .

# Buat direktori uploads dan atur izin akses
RUN mkdir -p /app/uploads && chown -R appuser:appuser /app && chmod -R 755 /app/uploads

# Use non-root user
USER appuser

# Expose application port
EXPOSE 8000

# Healthcheck endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]