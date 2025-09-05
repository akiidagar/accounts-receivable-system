#!/bin/bash
set -e

echo "🔧 Setting up Accounts Receivable Management System..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[SETUP]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create necessary directories
print_status "Creating directory structure..."
mkdir -p data logs backups

# Setup backend
print_status "Setting up backend..."
cd backend

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    # Generate a random JWT secret
    if command -v openssl >/dev/null 2>&1; then
        JWT_SECRET=$(openssl rand -base64 32)
        sed -i.bak "s|your-super-secure-secret-key-change-this-in-production|$JWT_SECRET|g" .env
        rm .env.bak
    fi
    print_status "Environment file created with random JWT secret"
fi

# Install backend dependencies
print_status "Installing backend dependencies..."
npm install

cd ..

# Setup frontend
print_status "Setting up frontend..."
cd frontend

# Install frontend dependencies
npm install

cd ..

print_status "=== Setup completed! ==="
print_status ""
print_status "Next steps:"
print_status "1. cd backend && npm run dev (start backend)"
print_status "2. cd frontend && npm start (start frontend)"
print_status "3. Visit http://localhost:3000"
print_status ""
print_status "Default login: admin / admin123"
