# AutoFlow AI - Complete Setup Guide

## 🎯 Overview

This guide explains how to set up the complete AutoFlow AI platform with both frontend and backend.

## 📋 Prerequisites

### Required Software
- **Node.js** 20+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### Optional (for production)
- **Redis** (for caching and sessions)
- **Docker** (for containerization)
- **Stripe Account** (for payments)
- **SendGrid Account** (for emails)
- **OpenAI API Key** (for AI features)

---

## 🚀 Quick Start (Development)

### Step 1: Clone/Download the Project

```bash
# If using git
git clone <repository-url>
cd autoflow-ai

# Or if you have the files, just navigate to the project directory
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your configuration
# At minimum, set:
# - DATABASE_URL (your PostgreSQL connection string)
# - JWT_SECRET (a random secure string)
# - FRONTEND_URL (http://localhost:5173)
```

### Step 3: Setup Database

```bash
# Make sure PostgreSQL is running

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with demo data
npm run prisma:seed
```

### Step 4: Start Backend Server

```bash
# Start development server
npm run dev

# Server will run on http://localhost:3001
```

### Step 5: Setup Frontend

```bash
# Open a new terminal and navigate to project root
cd ..

# Install frontend dependencies
npm install

# Start frontend development server
npm run dev

# Frontend will run on http://localhost:5173
```

### Step 6: Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api/v1
- **Health Check**: http://localhost:3001/health

### Demo Credentials

After seeding the database, you can login with:

**Super Admin:**
- Email: `admin@autoflow.ai`
- Password: `admin123`

**Company Admin:**
- Email: `john@techventures.com`
- Password: `demo123`

---

## 🔧 Configuration

### Backend Environment Variables

Edit `server/.env` with your settings:

```bash
# Server
NODE_ENV=development
PORT=3001

# Database (REQUIRED)
DATABASE_URL="postgresql://username:password@localhost:5432/autoflow_ai?schema=public"

# JWT (REQUIRED - use strong random strings)
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-key-min-32-chars"

# Frontend URL (REQUIRED)
FRONTEND_URL="http://localhost:5173"

# Optional: Email (SendGrid)
EMAIL_PROVIDER="sendgrid"
SENDGRID_API_KEY="your-sendgrid-api-key"

# Optional: Payments (Stripe)
STRIPE_SECRET_KEY="sk_test_your-stripe-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Optional: AI (OpenAI)
OPENAI_API_KEY="sk-your-openai-api-key"
```

### Frontend Configuration

The frontend is already configured to connect to the backend at `http://localhost:3001`. If you need to change this, update the API base URL in the frontend code.

---

## 🗄️ Database Setup

### PostgreSQL Installation

**macOS (Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**
Download and install from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)

### Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database and user
CREATE USER autoflow_user WITH PASSWORD 'your-password';
CREATE DATABASE autoflow_ai OWNER autoflow_user;
GRANT ALL PRIVILEGES ON DATABASE autoflow_ai TO autoflow_user;

# Exit
\q
```

### Update DATABASE_URL

Update your `.env` file:
```bash
DATABASE_URL="postgresql://autoflow_user:your-password@localhost:5432/autoflow_ai?schema=public"
```

---

## 🏗️ Building for Production

### Backend

```bash
cd server

# Build TypeScript
npm run build

# Start production server
npm start
```

### Frontend

```bash
# Build frontend
npm run build

# The built files will be in the 'dist' directory
# Deploy these files to your web server (Nginx, Apache, etc.)
```

---

## 🐳 Docker Deployment

### Backend Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

### Frontend Dockerfile

```dockerfile
FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: autoflow_user
      POSTGRES_PASSWORD: your-password
      POSTGRES_DB: autoflow_ai
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./server
    environment:
      DATABASE_URL: postgresql://autoflow_user:your-password@postgres:5432/autoflow_ai
      JWT_SECRET: your-jwt-secret
      FRONTEND_URL: http://localhost
    ports:
      - "3001:3001"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Run with:
```bash
docker-compose up -d
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Use strong JWT secrets (min 32 characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for your domain only
- [ ] Set up proper firewall rules
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure database backups
- [ ] Use environment variables for secrets
- [ ] Never commit `.env` file
- [ ] Enable PostgreSQL SSL connections
- [ ] Set up proper backup strategy
- [ ] Configure email provider
- [ ] Set up payment provider (Stripe)
- [ ] Configure AI provider (OpenAI)

---

## 📊 Monitoring

### Backend Logs

Logs are stored in:
- Console output (development)
- `logs/combined.log` (production)
- `logs/error.log` (errors only)

### Database Monitoring

```bash
# View running queries
psql -U postgres -d autoflow_ai -c "SELECT * FROM pg_stat_activity;"

# Check database size
psql -U postgres -d autoflow_ai -c "SELECT pg_size_pretty(pg_database_size('autoflow_ai'));"
```

### Health Checks

```bash
# Backend health
curl http://localhost:3001/health

# Database connection
curl http://localhost:3001/api/v1/health
```

---

## 🐛 Troubleshooting

### Backend won't start

**Error: Database connection failed**
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Ensure database exists
- Check user permissions

**Error: Port 3001 already in use**
- Change PORT in `.env`
- Or kill the process using port 3001

### Frontend can't connect to backend

**Error: CORS error**
- Check FRONTEND_URL in backend `.env`
- Ensure backend CORS is configured correctly

**Error: Network error**
- Verify backend is running on port 3001
- Check firewall settings
- Verify API base URL in frontend code

### Database migration errors

```bash
# Reset database
npm run prisma:migrate reset

# Or manually
psql -U postgres -c "DROP DATABASE autoflow_ai;"
psql -U postgres -c "CREATE DATABASE autoflow_ai OWNER autoflow_user;"
npm run prisma:migrate
npm run prisma:seed
```

---

## 📚 Additional Resources

### Documentation
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/docs)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [pgAdmin](https://www.pgadmin.org/) - PostgreSQL GUI
- [Redis Commander](https://github.com/joeferner/redis-commander) - Redis GUI

---

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs in `server/logs/`
3. Check the [GitHub Issues](your-repo-url/issues)
4. Contact support at support@autoflow.ai

---

## 🎉 You're Ready!

Your AutoFlow AI platform is now set up and ready to use. Start building amazing automations!

**Next Steps:**
1. Login with demo credentials
2. Explore the workflow builder
3. Create your first automation
4. Connect integrations
5. Invite team members

Happy automating! 🚀
