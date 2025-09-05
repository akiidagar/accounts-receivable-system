# Setup Guide

## Prerequisites

- Node.js 14+ 
- npm or yarn
- Git (optional)

## Quick Start

1. **Extract or clone the project:**
```bash
# If from zip file
unzip accounts-receivable-system.zip
cd accounts-receivable-system

# Or if from git
git clone <repository-url>
cd accounts-receivable-system
```

2. **Run setup script:**
```bash
chmod +x scripts/*.sh
./scripts/setup.sh
```

3. **Start development servers:**

Backend:
```bash
cd backend
npm run dev
```

Frontend (new terminal):
```bash
cd frontend
npm start
```

4. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Default login: admin / admin123

## Manual Setup

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Generate JWT secret:**
```bash
# Linux/Mac
openssl rand -base64 32

# Or use any random string generator
```

5. **Update .env file with your JWT secret**

6. **Start the server:**
```bash
# Development
npm run dev

# Production
npm start
```

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm start
```

4. **Build for production:**
```bash
npm run build
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - JWT signing secret (must be secure)
- `DB_PATH` - SQLite database file path
- `CORS_ORIGIN` - Allowed frontend origin

### Frontend
- `REACT_APP_API_BASE_URL` - Backend API URL

## Database

The system uses SQLite for simplicity. The database file is created automatically in the `data/` directory.

## Default User

- Username: `admin`
- Password: `admin123`

**Important:** Change the default password in production!

## Troubleshooting

### Common Issues

1. **Port already in use:**
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9
```

2. **Permission denied on scripts:**
```bash
chmod +x scripts/*.sh
```

3. **Database permission errors:**
```bash
chmod 755 data/
chmod 644 data/accounts_receivable.db
```

4. **CORS errors:**
- Check `CORS_ORIGIN` in backend .env
- Ensure frontend is running on the allowed origin

### Logs

- Backend logs: `logs/app.log`
- Frontend logs: Browser console
- Database: Check `data/` directory permissions

### Reset Database

```bash
rm data/accounts_receivable.db
# Restart backend to recreate with default user
```
