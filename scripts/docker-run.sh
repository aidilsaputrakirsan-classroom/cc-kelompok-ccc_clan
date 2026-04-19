#!/bin/bash

# ============================================================
# Script untuk menjalankan semua container secara manual
# CATATAN: Minggu 7 kita akan pakai Docker Compose yang lebih elegan
# ============================================================

# Konfigurasi sesuai project kamu
POSTGRES_USER=bento
POSTGRES_PASSWORD=mariyani1
POSTGRES_DB=sipilih
BACKEND_IMAGE=cc-kelompok-ccc_clan-backend:latest
FRONTEND_IMAGE=sipilih-frontend:v1

ACTION=${1:-start}

case $ACTION in
  start)
    echo "🚀 Starting all containers..."
    
    # Create network
    docker network create cloudnet 2>/dev/null || true
    
    # Database
    echo "📦 Starting database..."
    docker run -d \
      --name db \
      --network cloudnet \
      -e POSTGRES_USER=$POSTGRES_USER \
      -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
      -e POSTGRES_DB=$POSTGRES_DB \
      -p 5433:5432 \
      -v pgdata:/var/lib/postgresql/data \
      postgres:16-alpine
    
    # Wait for database to be ready
    echo "⏳ Waiting for database..."
    sleep 5
    
    # Backend
    echo "🐍 Starting backend..."
    docker run -d \
      --name backend \
      --network cloudnet \
      -e DATABASE_URL="postgresql://bento:mariyani1@db:5432/sipilih" \
      -p 8000:8000 \
      $BACKEND_IMAGE
    
    # Frontend
    echo "⚛️ Starting frontend..."
    docker run -d \
      --name frontend \
      --network cloudnet \
      -p 3000:80 \
      $FRONTEND_IMAGE
    
    echo ""
    echo "✅ All containers started!"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:8000"
    echo "   Database: localhost:5433"
    ;;
    
  stop)
    echo "🛑 Stopping all containers..."
    docker stop frontend backend db 2>/dev/null
    docker rm frontend backend db 2>/dev/null
    echo "✅ All containers stopped and removed."
    ;;
    
  status)
    echo "📊 Container Status:"
    docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
    ;;
    
  logs)
    CONTAINER=${2:-backend}
    echo "📋 Logs for $CONTAINER:"
    docker logs -f $CONTAINER
    ;;
    
  *)
    echo "Usage: ./scripts/docker-run.sh [start|stop|status|logs [container]]"
    ;;
esac