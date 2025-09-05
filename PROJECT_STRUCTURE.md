# Project Structure

```
accounts-receivable-system/
├── README.md                    # Main project documentation
├── .gitignore                   # Git ignore rules
├── docker-compose.yml           # Docker deployment configuration
├── PROJECT_STRUCTURE.md         # This file
│
├── backend/                     # Node.js backend application
│   ├── package.json            # Backend dependencies and scripts
│   ├── .env.example            # Environment variables template
│   ├── server.js               # Main server application
│   └── Dockerfile              # Backend Docker configuration
│
├── frontend/                    # React frontend application
│   ├── package.json            # Frontend dependencies and scripts
│   ├── .env.development        # Development environment variables
│   ├── .env.production         # Production environment variables
│   ├── Dockerfile              # Frontend Docker configuration
│   ├── public/
│   │   ├── index.html          # Main HTML template
│   │   └── manifest.json       # PWA manifest
│   └── src/
│       ├── index.js            # React entry point
│       ├── index.css           # Global styles with Tailwind
│       ├── App.js              # Main App component with routing
│       ├── contexts/
│       │   └── AuthContext.js  # Authentication context
│       ├── services/
│       │   └── api.js          # API service with interceptors
│       └── components/
│           ├── LoadingSpinner.js    # Loading component
│           ├── Login.js            # Login form component
│           ├── Dashboard.js        # Main dashboard
│           ├── StatCards.js        # Statistics cards
│           ├── CreateInvoiceModal.js # Invoice creation modal
│           ├── InvoiceTable.js     # Invoices data table
│           ├── SearchAndFilter.js  # Search and filter controls
│           ├── PaymentPage.js      # Customer payment page
│           └── Notification.js     # Toast notifications
│
├── tests/                       # Test files
│   ├── auth.test.js            # Authentication tests
│   ├── invoices.test.js        # Invoice management tests
│   ├── payments.test.js        # Payment processing tests
│   └── integration.test.js     # End-to-end integration tests
│
├── scripts/                     # Utility scripts
│   ├── setup.sh               # Initial project setup
│   ├── deploy.sh               # Production deployment
│   ├── backup.sh               # Database backup
│   └── test.sh                 # Test runner
│
├── docs/                        # Documentation
│   ├── SETUP.md                # Setup and installation guide
│   ├── API.md                  # API documentation
│   └── DEPLOYMENT.md           # Production deployment guide
│
├── data/                        # Database files (created at runtime)
│   └── accounts_receivable.db  # SQLite database
│
├── logs/                        # Application logs (created at runtime)
│   ├── app.log                 # Application logs
│   ├── err.log                 # Error logs
│   └── combined.log            # Combined logs
│
└── backups/                     # Database backups (created by backup script)
    └── backup_*.db.gz          # Compressed database backups
```

## Key Features

### ✅ Complete Full-Stack Implementation
- **Backend**: Node.js + Express + SQLite + JWT Authentication
- **Frontend**: React + Tailwind CSS + React Router
- **Database**: SQLite with proper indexing and relationships
- **Security**: bcrypt, JWT, input validation, CORS protection

### ✅ All Test Cases Implemented
- Authentication (valid/invalid credentials)
- Invoice creation and validation
- Search and filtering functionality
- Payment processing and confirmation
- Payment link expiration handling

### ✅ Production-Ready Features
- Docker support with multi-stage builds
- Comprehensive error handling and logging
- Health checks and monitoring
- Automated backup system
- Security headers and best practices
- Rate limiting and input validation

### ✅ Developer Experience
- Easy setup with automated scripts
- Comprehensive documentation
- Environment-based configuration
- Hot reloading for development
- Code linting and formatting

### ✅ Bonus Features
- Modern, responsive UI with animations
- Real-time dashboard statistics
- Advanced search and pagination
- Audit logging for compliance
- Performance monitoring
- Automated deployment scripts

## Quick Start Commands

```bash
# Setup (run once)
./scripts/setup.sh

# Development
cd backend && npm run dev     # Start backend
cd frontend && npm start     # Start frontend (new terminal)

# Testing
./scripts/test.sh            # Run all tests

# Production Deployment
./scripts/deploy.sh          # Deploy to production

# Backup
./scripts/backup.sh          # Backup database
```

## Default Access
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Login**: admin / admin123

This project structure provides a complete, production-ready Accounts Receivable Management System with enterprise-level features and security.
