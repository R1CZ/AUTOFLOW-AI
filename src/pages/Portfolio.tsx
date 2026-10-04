import { Card, Badge, Button } from '../components/ui';
import { AIFlowBackground } from '../components/AIFlowBackground';
import { 
  Zap, 
  Workflow, 
  Database, 
  Shield, 
  Code2, 
  Server, 
  Globe, 
  Cpu, 
  Lock, 
  Users, 
  BarChart3, 
  Bell,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Download,
  CheckCircle2,
  Layers,
  GitBranch,
  Webhook,
  Brain,
  Activity,
  Boxes
} from 'lucide-react';

export function PortfolioPage() {
  const handleDownloadResume = () => {
    // Create resume content
    const resumeContent = `
ALEX JOHNSON
Full-Stack Developer | AI Automation Specialist
Email: alex.johnson@email.com | LinkedIn: linkedin.com/in/alexjohnson | GitHub: github.com/alexjohnson

================================================================================
PROJECT: AUTOFLOW AI - ENTERPRISE AI AUTOMATION PLATFORM
================================================================================

ROLE: Full-Stack Developer & System Architect
DURATION: [Your Duration]
TECHNOLOGIES: React, TypeScript, Node.js, Express, PostgreSQL, Prisma, REST APIs, Webhooks

PROJECT OVERVIEW:
Developed a comprehensive AI-powered automation SaaS platform that enables organizations to build, deploy, and manage intelligent workflows connecting business applications, data sources, and AI services. The platform features a multi-tenant architecture with role-based access control, visual workflow builder, and industry-specific automation templates.

KEY ACHIEVEMENTS:

• Architected and developed a complete multi-tenant SaaS platform from scratch with three distinct user experiences (Super Admin, Company Admin, End User) serving different organizational roles and permissions.

• Built a visual workflow builder with drag-and-drop canvas interface supporting 10+ node types including triggers, AI actions, conditions, integrations, approvals, and notifications with real-time pan/zoom capabilities.

• Implemented a comprehensive REST API backend with 50+ endpoints using Node.js, Express, and TypeScript, featuring JWT authentication, session management, and role-based access control (RBAC).

• Designed and deployed a PostgreSQL database schema with 20+ normalized tables including proper indexing, foreign key relationships, and multi-tenant data isolation ensuring complete data separation between organizations.

• Created an industry-specific template library with 20+ pre-built automation workflows across IT, Healthcare, Finance, Retail, and General Business sectors, each containing fully configured nodes, connections, and business logic.

• Integrated AI capabilities supporting GPT-4 and Claude models for intelligent workflow actions including data classification, content extraction, pattern recognition, and automated decision-making within automation flows.

• Developed a real-time notification system with multi-channel delivery (email, in-app, Slack, SMS) and comprehensive audit logging for all platform mutations ensuring compliance and security tracking.

• Implemented subscription billing system with multiple pricing tiers (Starter, Professional, Enterprise), usage tracking against plan limits, invoice generation, and payment processing integration architecture.

• Built analytics dashboards with real-time data visualization using Recharts, displaying execution metrics, performance analytics, revenue tracking, and system health monitoring across all user tiers.

• Created a responsive, accessible UI with dark theme design system, glassmorphism effects, and animated AI Flow background that visualizes system states (idle, processing, success, warning, error) in real-time.

TECHNICAL IMPLEMENTATION:

Frontend Architecture:
• React 18 with TypeScript for type-safe component development
• Zustand for lightweight, performant state management
• React Router v7 with protected routes and role-based navigation
• Tailwind CSS v4 for utility-first responsive styling
• Recharts for interactive data visualization and analytics
• HTML5 Canvas for animated background system with 60fps performance

Backend Architecture:
• Node.js with Express.js REST API framework
• PostgreSQL database with Prisma ORM for type-safe queries
• JWT authentication with refresh tokens and session management
• Bcrypt password hashing with configurable security rounds
• Zod schema validation for all API inputs
• Winston logger for structured logging and monitoring
• Express rate limiting and Helmet security headers

Security & Compliance:
• Multi-tenant data isolation with company-scoped queries
• Role-based access control (SUPER_ADMIN, COMPANY_ADMIN, USER)
• Audit logging for all mutations with actor tracking
• Input validation and sanitization on all endpoints
• CORS configuration and security headers
• Password reset flow with secure token generation

Scalability Features:
• Modular architecture supporting horizontal scaling
• Database indexing for optimized query performance
• Pagination and search across all data sets
• Efficient state management preventing unnecessary re-renders
• Code splitting and lazy loading for optimal bundle size

BUSINESS IMPACT:

• Enables organizations to reduce operational costs by 60-80% through automation of repetitive tasks and multi-step workflows
• Provides self-service workflow creation for business users without requiring technical expertise or IT involvement
• Offers industry-specific templates reducing workflow development time from weeks to minutes
• Supports 18 different industries with customized automation patterns and compliance considerations
• Handles enterprise-scale operations with multi-tenant architecture supporting unlimited companies and users

INTEGRATIONS & CONNECTIVITY:

• 50+ business application connectors including Slack, Salesforce, HubSpot, GitHub, QuickBooks, Google Workspace
• Webhook system for real-time event-driven automation with signature verification
• REST API architecture enabling third-party integrations and mobile app connectivity
• AI provider abstraction layer supporting multiple LLM providers (OpenAI, Anthropic)
• Payment processor integration architecture (Stripe) for subscription billing
• Email service integration (SendGrid/AWS SES) for notification delivery

================================================================================
ADDITIONAL PROJECTS & EXPERIENCE
================================================================================

[Add your other projects here following the same format]

================================================================================
TECHNICAL SKILLS
================================================================================

LANGUAGES: TypeScript, JavaScript, Python, PHP, SQL, HTML, CSS
FRONTEND: React, Next.js, Vue.js, Tailwind CSS, Redux, Zustand
BACKEND: Node.js, Express, FastAPI, Django, Laravel
DATABASES: PostgreSQL, MySQL, MongoDB, Redis
CLOUD & DEVOPS: AWS, Docker, Kubernetes, CI/CD, GitHub Actions
AUTOMATION: n8n, Make.com, Zapier, Custom workflow engines
AI/ML: OpenAI API, Anthropic Claude, LangChain, Prompt Engineering
TOOLS: Git, VS Code, Postman, Figma, Jira

================================================================================
EDUCATION & CERTIFICATIONS
================================================================================

[Add your education and certifications here]

================================================================================
    `;

    // Create download
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Alex_Johnson_Resume_AutoFlow_AI.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 relative">
      <AIFlowBackground variant="subtle" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AutoFlow AI
          </h1>
          <p className="text-xl text-slate-400 mb-6">
            Enterprise AI Automation Platform
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Badge variant="info">React</Badge>
            <Badge variant="info">TypeScript</Badge>
            <Badge variant="info">Node.js</Badge>
            <Badge variant="info">PostgreSQL</Badge>
            <Badge variant="info">REST APIs</Badge>
            <Badge variant="info">Webhooks</Badge>
            <Badge variant="info">Multi-Tenant</Badge>
            <Badge variant="info">AI Integration</Badge>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleDownloadResume}>
              <Download className="w-4 h-4" />
              Download Resume
            </Button>
            <Button variant="outline">
              <Github className="w-4 h-4" />
              View Code
            </Button>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </Button>
          </div>
        </div>

        {/* Project Overview */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Boxes className="w-6 h-6 text-cyan-400" />
            Project Overview
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Developed a comprehensive AI-powered automation SaaS platform that enables organizations to build, deploy, and manage intelligent workflows connecting business applications, data sources, and AI services. The platform features a multi-tenant architecture with role-based access control, visual workflow builder, and industry-specific automation templates.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 rounded-lg bg-slate-800/50">
              <p className="text-3xl font-bold text-cyan-400">50+</p>
              <p className="text-sm text-slate-400">API Endpoints</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-800/50">
              <p className="text-3xl font-bold text-cyan-400">20+</p>
              <p className="text-sm text-slate-400">Templates</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-800/50">
              <p className="text-3xl font-bold text-cyan-400">18</p>
              <p className="text-sm text-slate-400">Industries</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-800/50">
              <p className="text-3xl font-bold text-cyan-400">3</p>
              <p className="text-sm text-slate-400">User Tiers</p>
            </div>
          </div>
        </Card>

        {/* Key Achievements */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            Key Achievements
          </h2>
          <div className="space-y-4">
            {[
              {
                icon: Layers,
                title: 'Multi-Tenant SaaS Architecture',
                description: 'Architected and developed a complete multi-tenant SaaS platform from scratch with three distinct user experiences (Super Admin, Company Admin, End User) serving different organizational roles and permissions.'
              },
              {
                icon: Workflow,
                title: 'Visual Workflow Builder',
                description: 'Built a visual workflow builder with drag-and-drop canvas interface supporting 10+ node types including triggers, AI actions, conditions, integrations, approvals, and notifications with real-time pan/zoom capabilities.'
              },
              {
                icon: Server,
                title: 'REST API Backend',
                description: 'Implemented a comprehensive REST API backend with 50+ endpoints using Node.js, Express, and TypeScript, featuring JWT authentication, session management, and role-based access control (RBAC).'
              },
              {
                icon: Database,
                title: 'Database Design',
                description: 'Designed and deployed a PostgreSQL database schema with 20+ normalized tables including proper indexing, foreign key relationships, and multi-tenant data isolation ensuring complete data separation between organizations.'
              },
              {
                icon: GitBranch,
                title: 'Template Library',
                description: 'Created an industry-specific template library with 20+ pre-built automation workflows across IT, Healthcare, Finance, Retail, and General Business sectors, each containing fully configured nodes, connections, and business logic.'
              },
              {
                icon: Brain,
                title: 'AI Integration',
                description: 'Integrated AI capabilities supporting GPT-4 and Claude models for intelligent workflow actions including data classification, content extraction, pattern recognition, and automated decision-making within automation flows.'
              },
              {
                icon: Bell,
                title: 'Real-Time Notifications',
                description: 'Developed a real-time notification system with multi-channel delivery (email, in-app, Slack, SMS) and comprehensive audit logging for all platform mutations ensuring compliance and security tracking.'
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboards',
                description: 'Built analytics dashboards with real-time data visualization using Recharts, displaying execution metrics, performance analytics, revenue tracking, and system health monitoring across all user tiers.'
              }
            ].map((item, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Technical Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-400" />
              Frontend Stack
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> React 18 with TypeScript</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zustand state management</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> React Router v7</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tailwind CSS v4</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recharts visualization</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> HTML5 Canvas animations</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              Backend Stack
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Node.js with Express.js</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> PostgreSQL database</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Prisma ORM</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> JWT authentication</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zod validation</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Winston logging</li>
            </ul>
          </Card>
        </div>

        {/* Features */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: 'Security', items: ['RBAC', 'Multi-tenant isolation', 'Audit logging', 'Rate limiting'] },
              { icon: Webhook, title: 'Integrations', items: ['50+ connectors', 'Webhook system', 'REST APIs', 'OAuth support'] },
              { icon: Cpu, title: 'AI Capabilities', items: ['GPT-4 integration', 'Claude support', 'Smart routing', 'Data extraction'] },
              { icon: Users, title: 'User Management', items: ['Team collaboration', 'Role assignment', 'Invitations', 'Activity tracking'] },
              { icon: Globe, title: 'Scalability', items: ['Horizontal scaling', 'Load balancing', 'Caching', 'Optimization'] },
              { icon: Lock, title: 'Compliance', items: ['Data encryption', 'GDPR ready', 'Audit trails', 'Access controls'] }
            ].map((feature, index) => (
              <div key={index} className="p-4 rounded-lg bg-slate-800/30">
                <div className="flex items-center gap-2 mb-3">
                  <feature.icon className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                </div>
                <ul className="space-y-1">
                  {feature.items.map((item, i) => (
                    <li key={i} className="text-xs text-slate-400 flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-cyan-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        {/* Business Impact */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            Business Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Operational Efficiency</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Reduces operational costs by 60-80% through automation of repetitive tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Accelerates workflow completion from hours/days to minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Eliminates human errors in data entry and processing</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Scalability & Growth</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Supports 18 different industries with customized automation patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Enables self-service workflow creation without technical expertise</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Reduces workflow development time from weeks to minutes with templates</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Contact */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Get In Touch</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline">
              <Mail className="w-4 h-4" />
              Email
            </Button>
            <Button variant="outline">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Button>
            <Button variant="outline">
              <Github className="w-4 h-4" />
              GitHub
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
