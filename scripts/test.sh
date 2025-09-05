#!/bin/bash

echo "🧪 Running comprehensive tests..."

# Backend tests
echo "Running backend tests..."
cd backend
npm test -- --coverage
cd ..

# Frontend tests (if available)
if [ -d "frontend/src" ]; then
    echo "Running frontend tests..."
    cd frontend
    npm test -- --coverage --watchAll=false
    cd ..
fi

echo "✅ All tests completed"
