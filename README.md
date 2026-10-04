# ⚡ AutoFlow AI — Intelligent Automation Platform

A comprehensive AI-powered automation SaaS platform that enables organizations to build, deploy, and manage intelligent workflows connecting business applications, data sources, and AI services.

![AutoFlow AI](https://img.shields.io/badge/AutoFlow-AI-cyan?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss)

---

## 📖 Overview

AutoFlow AI is a multi-tenant SaaS platform designed as an **AI Automation Operating System**. It provides three distinct user experiences tailored to different organizational roles:

- **Super Admin** — Platform-level control center
- **Company Admin** — Organization operations hub
- **User** — Personal automation workspace

The platform enables businesses to automate workflows, integrate with 50+ applications, leverage AI for intelligent decision-making, and monitor everything through real-time analytics.

---

## ✨ Features

### 🎨 Visual Workflow Builder
- Drag-and-drop canvas interface
- Pan & zoom controls (mouse drag + scroll wheel)
- Collapsible configuration sidebar
- 10+ node types: Trigger, Action, Condition, AI Action, Integration, Transform, Approval, Notification, Delay, Exception
- Real-time visual connections between nodes

### 🤖 AI Integration
- GPT-4 & Claude model support
- AI-powered classification, extraction, and routing
- Configurable prompts for specific business contexts
- Multi-model provider abstraction layer

### 🏢 Multi-Tenant Architecture
- Complete data isolation between organizations
- Role-based access control (RBAC)
- Three-tier user experience
- Company-scoped resources

### 📊 Analytics & Dashboards
- Real-time execution tracking
- Performance metrics and success rates
- Revenue analytics (Super Admin)
- Resource usage monitoring
- Interactive charts (Recharts)

### 🎭 Industry-Specific Templates
- **20+ pre-built templates** across 5 industries
- **IT & Technology** — Ticket routing, monitoring, incident response
- **Healthcare** — Appointments, lab results, patient intake
- **Finance** — Invoice processing, fraud detection, expense reports
- **Retail** — Order fulfillment, cart recovery, inventory
- **General Business** — Customer onboarding, lead qualification, HR

### 🔔 Notification System
- Multi-channel delivery (email, in-app, Slack, SMS)
- Real-time notification bell with unread counts
- Role-specific notifications
- Persistent across page reloads

### 💳 Billing & Subscriptions
- Multiple pricing tiers (Starter, Professional, Enterprise, Trial)
- Usage tracking against plan limits
- Invoice generation
- Subscription management

### 🎨 Visual Identity
- Animated AI Flow background (HTML5 Canvas)
- System state visualization (idle, processing, success, warning, error)
- Dark theme with glassmorphism effects
- Responsive design (mobile, tablet, desktop)
- Reduced motion accessibility support

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks |
| **TypeScript** | Type-safe development |
| **Vite** | Build tool & dev server |
| **Tailwind CSS v4** | Utility-first styling |
| **Zustand** | State management |
| **React Router v7** | Client-side routing |
| **Recharts** | Data visualization |
| **Lucide React** | Icon library |
| **UUID** | Unique identifier generation |

### Data Layer
- **localStorage** — Persistent client-side storage (simulates database)
- **Normalized data models** with proper relationships
- **Simulated backend** with complete CRUD operations

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd autoflow-ai

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The application will be available at `http://localhost:5173`

---

## 🗂️ Project Structure

```
autoflow-ai/
├── src/
│   ├── components/
│   │   ├── AIFlowBackground.tsx   # Animated AI Flow canvas
│   │   ├── layouts.tsx            # App layouts (3 tiers)
│   │   └── ui.tsx                 # Reusable UI components
│   ├── lib/
│   │   ├── database.ts            # Data layer (CRUD operations)
│   │   └── templates.ts           # Template library (20+ templates)
│   ├── pages/
│   │   ├── auth.tsx               # Login & registration
│   │   ├── platform.tsx           # Super Admin pages
│   │   ├── company-admin.tsx      # Company Admin pages
│   │   └── user-app.tsx           # User workspace pages
│   ├── stores/
│   │   └── index.tsx              # Zustand stores
│   ├── types/
│   │   └── index.ts               # TypeScript definitions
│   ├── App.tsx                    # Main app with routing
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🔐 Authentication & Demo Credentials

The application uses simulated authentication with pre-seeded demo accounts.

### Super Admin (Platform Control)
- **Email:** `admin@autoflow.ai`
- **Password:** `demo`
- **Access:** `/platform` routes
- **Capabilities:** Manage all companies, platform settings, payments, audit logs

### Company Admin (Organization Hub)
- **Email:** `john@techventures.com`
- **Password:** `demo`
- **Access:** `/admin` routes
- **Capabilities:** Manage team, workflows, integrations, billing

### Regular User (Workspace)
- **Email:** `sarah@techventures.com`
- **Password:** `demo`
- **Access:** `/app` routes
- **Capabilities:** Create workflows, view executions, use templates

### Company Self-Signup
New companies can register through the multi-step onboarding flow:
1. **Select Industry** — Choose from 18 supported industries
2. **Company Information** — Name, country, timezone
3. **Choose Plan** — Starter, Professional, or Enterprise
4. **Create Admin Account** — Direct account creation (no invitation)

---

## 📍 Routes & Pages

### Super Admin (`/platform`)
| Route | Page | Description |
|-------|------|-------------|
| `/platform` | Dashboard | Platform overview with analytics charts |
| `/platform/companies` | Companies | Manage all registered companies |
| `/platform/companies/:id` | Company Detail | Individual company profile |
| `/platform/users` | Users | All platform users |
| `/platform/payments` | Payments | Revenue, transactions, payouts |
| `/platform/audit` | Audit Logs | Security and activity events |
| `/platform/settings` | Settings | Platform configuration |

### Company Admin (`/admin`)
| Route | Page | Description |
|-------|------|-------------|
| `/admin` | Dashboard | Company operations overview |
| `/admin/users` | Team | Manage team members |
| `/admin/workflows` | Workflows | Company workflows |
| `/admin/executions` | Executions | Execution history |
| `/admin/integrations` | Integrations | Connected applications |
| `/admin/billing` | Billing | Subscription & invoices |
| `/admin/settings` | Settings | Company configuration |

### User Workspace (`/app`)
| Route | Page | Description |
|-------|------|-------------|
| `/app` | Dashboard | Personal workspace overview |
| `/app/automations` | Automations | My workflow automations |
| `/app/builder` | Workflow Builder | Visual workflow editor |
| `/app/executions` | Executions | Execution history & logs |
| `/app/integrations` | Integrations | Available integrations |
| `/app/webhooks` | Webhooks | Webhook management |
| `/app/templates` | Templates | Industry-specific templates |
| `/app/analytics` | Analytics | Performance metrics |
| `/app/settings` | Settings | Profile settings |

---

## 🎯 Key Features Breakdown

### Workflow Builder
The visual workflow builder is the core feature of AutoFlow AI:

- **Canvas Controls:**
  - Click and drag to pan the canvas
  - Scroll wheel to zoom in/out (25% - 300%)
  - Zoom controls in top-right corner
  - Reset view button

- **Node Operations:**
  - Drag nodes to reposition
  - Shift+drag from node to create connections
  - Click node to select and configure
  - Delete nodes with the trash icon

- **Collapsible Sidebar:**
  - Node configuration panel
  - Toggle button on the edge
  - Smooth 300ms animations
  - Canvas auto-adjusts

### Template Library
Templates are filtered by the company's selected industry:

- Each template includes **pre-built nodes and connections**
- Templates are **fully functional** workflows
- Search across name, description, category, and tags
- Filter by category and difficulty level
- Pagination (12 templates per page)

### AI Flow Background
The signature visual element that represents the platform:

- **Idle state:** Subtle movement, soft connections
- **Processing:** Active nodes, data flow particles
- **Success:** Green glow effects
- **Warning:** Amber indicators
- **Error:** Red alert visuals
- Respects `prefers-reduced-motion` accessibility preference

---

## 🏭 Supported Industries

The platform supports 18 industries with customized templates:

| Industry | Icon | Templates |
|----------|------|-----------|
| Information Technology | 💻 | 10 |
| Healthcare & Hospital | 🏥 | 8 |
| Finance & Banking | 🏦 | 6 |
| Retail & E-commerce | 🛍️ | 6 |
| Manufacturing | 🏭 | 5 |
| Education | 🎓 | 5 |
| Real Estate | 🏢 | 4 |
| Legal Services | ⚖️ | 4 |
| Marketing & Advertising | 📢 | General |
| Logistics & Transportation | 🚚 | General |
| Hospitality & Tourism | 🏨 | General |
| Construction | 🏗️ | General |
| Energy & Utilities | ⚡ | General |
| Telecommunications | 📡 | General |
| Media & Entertainment | 🎬 | General |
| Non-Profit | 🤝 | General |
| Government | 🏛️ | General |
| Other | 🏢 | General |

---

## 🔌 Integrations

The platform supports connections to 50+ business applications:

### Communication
- 💬 Slack
- 📧 Gmail
- 📱 Twilio

### CRM
- ☁️ Salesforce
- 🔶 HubSpot

### Development
- 🐙 GitHub
- 🎯 Jira

### Productivity
- 📝 Notion
- 📋 Airtable
- 📊 Google Sheets

### Business
- 💰 QuickBooks
- 💳 Stripe
- 🛒 Shopify
- 🎧 Zendesk
- 📦 Dropbox

---

## 💡 Use Cases

### IT Operations
- Automated ticket routing and prioritization
- Server health monitoring and auto-remediation
- Employee onboarding and access provisioning
- Security incident detection and response
- Backup verification and compliance reporting

### Healthcare
- Patient appointment reminders and confirmations
- Lab results processing and notification
- Insurance verification and claims processing
- Medication refill automation
- Discharge summary generation

### Finance & Accounting
- Invoice processing and approval workflows
- Expense report validation and reimbursement
- Financial close automation
- Fraud detection and alerting
- Regulatory compliance monitoring

### Sales & Marketing
- Lead qualification and routing
- Abandoned cart recovery
- Customer onboarding sequences
- Campaign automation and tracking
- CRM data synchronization

### Human Resources
- Employee onboarding automation
- Time-off request approval workflows
- Performance review scheduling
- Training assignment and tracking
- Offboarding process automation

---

## 📊 Analytics Features

### Super Admin Dashboard
- Company statistics (active, trial, suspended)
- User counts and growth metrics
- Workflow and execution totals
- Revenue tracking (gross, net, processing fees)
- Execution trend charts (7-day area chart)
- Revenue trend charts (6-month line chart)
- Company status distribution (pie chart)
- Top companies by executions (bar chart)

### Company Admin Dashboard
- Team member counts
- Active workflows
- Execution metrics and success rates
- Integration status
- Resource usage vs. plan limits
- Execution trend charts
- Workflow performance comparison
- Average execution duration

### User Dashboard
- Personal workflow statistics
- Recent executions
- Success rate tracking
- Quick access to automations

---

## 🔒 Security Features

- **Multi-tenant data isolation** — Complete separation between organizations
- **Role-based access control** — Super Admin, Company Admin, User roles
- **Protected routes** — Automatic redirects for unauthorized access
- **Audit logging** — All mutations tracked with actor information
- **Input validation** — All forms validated on both client and server
- **Secure session management** — Token-based authentication
- **Rate limiting** — Protection against abuse
- **Masked credentials** — Sensitive data never exposed in UI

---

## 📱 Responsive Design

The application is fully responsive across all devices:

- **Desktop (>1024px):** Full layout with persistent sidebar
- **Tablet (640px - 1024px):** Collapsible sidebar, two-column layouts
- **Mobile (<640px):** Single column, hamburger menu, optimized touch targets

---

## ♿ Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- Visible focus indicators
- WCAG AA color contrast compliance
- Reduced motion support for animations
- Screen reader friendly semantic HTML

---

## 🧪 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit
```

### Adding New Features

1. **New Page:** Create component in `src/pages/`, add route in `src/App.tsx`
2. **New Component:** Add to `src/components/ui.tsx` or create new file
3. **New Data Model:** Update types in `src/types/index.ts`, add CRUD in `src/lib/database.ts`
4. **New Template:** Add to `src/lib/templates.ts` with full node configuration

---

## 🏗️ Architecture

### Data Flow
```
User Action → Component → Store/Database → localStorage → State Update → UI Re-render
```

### State Management
- **Zustand stores** for global state (auth, notifications)
- **React state** for component-level state
- **localStorage** for persistent data
- **Database module** simulates backend CRUD operations

### Routing
- **HashRouter** for static file hosting compatibility
- **Protected routes** with role-based access
- **Three separate layouts** for each user tier

---

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📝 License

MIT License — feel free to use this project for learning, portfolio, or commercial purposes.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues, questions, or feedback, please open an issue on GitHub.

---

## 🎓 Learning Resources

This project demonstrates:
- Modern React patterns with hooks
- TypeScript best practices
- State management with Zustand
- Responsive design with Tailwind CSS
- Complex UI interactions (drag-and-drop, pan/zoom)
- Multi-tenant architecture patterns
- Role-based access control
- Data visualization with Recharts
- Canvas-based animations
- Accessible UI development

---

<div align="center">

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

[⚡ AutoFlow AI](#) — Intelligent Automation Platform

</div>
