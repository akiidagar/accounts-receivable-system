#!/bin/bash
set -e

echo "🚀 Starting deployment process..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v node >/dev/null 2>&1; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm >/dev/null 2>&1; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_status "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Backend
    cd backend
    npm ci --production
    cd ..
    
    # Frontend
    cd frontend
    npm ci
    cd ..
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    cd frontend
    npm run build
    cd ..
}

# Start services
start_services() {
    print_status "Starting services..."
    
    # Kill existing processes
    pkill -f "node.*server.js" || true
    
    # Start backend
    cd backend
    nohup npm start > ../logs/app.log 2>&1 &
    echo $! > ../app.pid
    cd ..
    
    print_status "Backend started with PID: $(cat app.pid)"
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    sleep 5
    
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        print_status "Health check passed ✓"
    else
        print_error "Health check failed ✗"
        exit 1
    fi
}

# Main deployment process
main() {
    print_status "=== Accounts Receivable Management System Deployment ==="
    
    check_prerequisites
    install_dependencies
    build_frontend
    start_services
    health_check
    
    print_status "=== Deployment completed successfully! ==="
    print_status "Backend: http://localhost:5000"
    print_status "Frontend: http://localhost:3000 (dev) or serve build folder"
    print_status "Logs: tail -f logs/app.log"
}

# Stop services
stop_services() {
    print_status "Stopping services..."
    
    if [ -f "app.pid" ]; then
        kill $(cat app.pid) || true
        rm app.pid
        print_status "Backend stopped"
    fi
}

case "$1" in
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        sleep 2
        main
        ;;
    *)
        main
        ;;
esac
