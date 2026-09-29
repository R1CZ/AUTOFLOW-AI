# AutoFlow AI Backend API

Complete production-ready backend for AutoFlow AI platform built with Node.js, Express, TypeScript, PostgreSQL, and Prisma.

## 🏗️ Architecture

### Technology Stack
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Session-based auth with bcrypt
- **Validation**: Zod schema validation
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: Winston logger
- **Caching**: Redis (optional)

### Project Structure
```
server/
├── src/
│   ├── server.ts              # Main entry point
│   ├── routes/                # API route handlers
│   │   ├── auth.ts           # Authentication routes
│   │   ├── users.ts          # User management
│   │   ├── companies.ts      # Company management
│   │   ├── workflows.ts      # Workflow CRUD
│   │   ├── executions.ts     # Execution tracking
│   │   ├── integrations.ts   # Integration management
│   │   ├── webhooks.ts       # Webhook handling
│   │   ├── notifications.ts  # Notification system
│   │   ├── billing.ts        # Subscription & payments
│   │   ├── platform.ts       # Super admin routes
│   │   └── audit.ts          # Audit logs
│   ├── middleware/            # Express middleware
│   │   ├── auth.ts           # Authentication & authorization
│   │   ├── errorHandler.ts   # Error handling
│   │   └── validation.ts     # Input validation
│   └── utils/                 # Utility functions
│       ├── auth.ts           # Auth helpers
│       └── logger.ts         # Logging configuration
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Database migrations
│   └── seed.ts               # Database seed data
├── package.json
├── tsconfig.json
└── .env.example
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Redis (optional, for caching)

### Installation

1. **Install dependencies**
```bash
cd server
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Setup database**
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
npm start
```

## 🔐 Authentication

### Endpoints

**POST /api/v1/auth/register**
- Register new user and company
- Body: `{ email, password, name, companyName, industry, country, timezone, planId }`

**POST /api/v1/auth/login**
- Login user
- Body: `{ email, password }`
- Returns: `{ user, company, accessToken, refreshToken, sessionToken }`

**POST /api/v1/auth/logout**
- Logout user
- Header: `x-session-token`

**POST /api/v1/auth/refresh**
- Refresh access token
- Body: `{ refreshToken }`

**POST /api/v1/auth/forgot-password**
- Request password reset
- Body: `{ email }`

**POST /api/v1/auth/reset-password**
- Reset password with token
- Body: `{ token, newPassword }`

**GET /api/v1/auth/me**
- Get current user
- Header: `x-session-token`

## 📡 API Endpoints

### Users
- `GET /api/v1/users` - List users (company-scoped)
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/:id` - Get user
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Companies
- `GET /api/v1/companies` - List companies (super admin)
- `GET /api/v1/companies/:id` - Get company
- `PATCH /api/v1/companies/:id` - Update company
- `POST /api/v1/companies/:id/suspend` - Suspend company
- `POST /api/v1/companies/:id/activate` - Activate company

### Workflows
- `GET /api/v1/workflows` - List workflows
- `POST /api/v1/workflows` - Create workflow
- `GET /api/v1/workflows/:id` - Get workflow
- `PATCH /api/v1/workflows/:id` - Update workflow
- `DELETE /api/v1/workflows/:id` - Delete workflow
- `POST /api/v1/workflows/:id/execute` - Execute workflow

### Executions
- `GET /api/v1/executions` - List executions
- `GET /api/v1/executions/:id` - Get execution with logs

### Integrations
- `GET /api/v1/integrations` - List integrations
- `POST /api/v1/integrations` - Connect integration
- `DELETE /api/v1/integrations/:id` - Disconnect integration

### Webhooks
- `GET /api/v1/webhooks` - List webhooks
- `POST /api/v1/webhooks` - Create webhook
- `DELETE /api/v1/webhooks/:id` - Delete webhook

### Notifications
- `GET /api/v1/notifications` - Get notifications
- `PATCH /api/v1/notifications/:id` - Mark as read
- `POST /api/v1/notifications/mark-all-read` - Mark all as read

### Billing
- `GET /api/v1/billing/subscription` - Get subscription
- `GET /api/v1/billing/invoices` - List invoices
- `POST /api/v1/billing/upgrade` - Upgrade plan
- `POST /api/v1/billing/cancel` - Cancel subscription

### Platform (Super Admin)
- `GET /api/v1/platform/stats` - Platform statistics
- `GET /api/v1/platform/settings` - Get settings
- `PATCH /api/v1/platform/settings` - Update settings
- `GET /api/v1/platform/companies` - List all companies
- `GET /api/v1/platform/audit-logs` - Audit logs

## 🔒 Security Features

### Authentication
- JWT access tokens (7 day expiry)
- Refresh tokens (30 day expiry)
- Session-based authentication
- Password hashing with bcrypt (12 rounds)
- Password reset tokens (1 hour expiry)

### Authorization
- Role-based access control (RBAC)
  - SUPER_ADMIN: Full platform access
  - COMPANY_ADMIN: Company-level access
  - USER: Limited user access
- Multi-tenant isolation
- Company-scoped data access

### Security Headers
- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation with Zod

### Audit Logging
- All mutations logged
- Actor tracking
- IP address logging
- Timestamp recording

## 🗄️ Database Schema

### Core Models

**User**
- Authentication and profile
- Role-based access
- Company association

**Company**
- Multi-tenant isolation
- Subscription management
- User management

**Plan & Subscription**
- Pricing tiers
- Billing cycles
- Usage limits

**Workflow**
- Visual workflow definitions
- Node configurations
- Connection mappings

**Execution**
- Workflow execution tracking
- Node-by-node logging
- Performance metrics

**Integration**
- Third-party connections
- Credential management
- Status tracking

**Webhook**
- Event subscriptions
- Delivery tracking
- Retry logic

**Notification**
- User notifications
- Read/unread status
- Action URLs

**AuditLog**
- Complete activity trail
- Security compliance
- Change tracking

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📦 Deployment

### Docker
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

### Environment Variables
See `.env.example` for all required variables.

### Production Checklist
- [ ] Set strong JWT secrets
- [ ] Configure PostgreSQL connection
- [ ] Setup SSL certificates
- [ ] Configure CORS origins
- [ ] Set up email provider
- [ ] Configure Stripe for payments
- [ ] Set up AI provider keys
- [ ] Configure file storage (S3)
- [ ] Enable rate limiting
- [ ] Setup monitoring/logging
- [ ] Configure backups

## 🔧 Development

### Code Style
```bash
npm run lint
```

### Database Studio
```bash
npm run prisma:studio
```

### Type Checking
```bash
npx tsc --noEmit
```

## 📊 Monitoring

### Health Check
```bash
GET /health
```

### Metrics
- Request logging
- Error tracking
- Performance monitoring
- Database query logging

## 🚨 Error Handling

All errors return consistent format:
```json
{
  "error": "Error message",
  "details": {} // Optional
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## 📝 License

MIT

## 🤝 Support

For issues and questions, please open an issue on GitHub.

---

**Note**: This backend is designed to work with the AutoFlow AI frontend. Make sure to configure CORS and API endpoints correctly in both frontend and backend.
