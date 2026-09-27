import { v4 as uuid } from 'uuid';
import type { User, Company, Plan, Workflow, Execution, Integration, Webhook, Notification, Subscription, Invoice, AuditLog, PlatformSettings, Usage, WorkflowNode, WorkflowConnection } from '../types';

const DB_KEY = 'autoflow_ai_db';

interface Database {
  users: User[];
  companies: Company[];
  plans: Plan[];
  workflows: Workflow[];
  executions: Execution[];
  integrations: Integration[];
  webhooks: Webhook[];
  notifications: Notification[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  auditLogs: AuditLog[];
  settings: PlatformSettings;
  sessions: Record<string, string>; // token -> userId
}

function getDefaultPlans(): Plan[] {
  return [
    { id: 'plan_starter', name: 'Starter', monthlyPrice: 29, annualPrice: 290, maxUsers: 3, maxWorkflows: 10, maxExecutions: 1000, maxIntegrations: 5, maxWebhooks: 3, aiCredits: 500, features: ['Basic automations', '5 integrations', 'Email support', '1,000 executions/mo'], isActive: true, isTrial: false, trialDays: 0 },
    { id: 'plan_pro', name: 'Professional', monthlyPrice: 99, annualPrice: 990, maxUsers: 15, maxWorkflows: 50, maxExecutions: 10000, maxIntegrations: 20, maxWebhooks: 10, aiCredits: 5000, features: ['Advanced automations', '20 integrations', 'Priority support', '10,000 executions/mo', 'AI actions', 'Webhooks', 'Analytics'], isActive: true, isTrial: false, trialDays: 0 },
    { id: 'plan_enterprise', name: 'Enterprise', monthlyPrice: 299, annualPrice: 2990, maxUsers: 999999, maxWorkflows: 999999, maxExecutions: 999999999, maxIntegrations: 999999, maxWebhooks: 999999, aiCredits: 999999999, features: ['Unlimited workflows', 'Unlimited AI tools & agents', 'Unlimited executions', 'Unlimited integrations', 'Unlimited webhooks', 'Unlimited AI credits', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'SSO', 'Audit logs', 'Priority processing', 'Advanced AI agents', 'Custom automation'], isActive: true, isTrial: false, trialDays: 0 },
    { id: 'plan_trial', name: 'Free Trial', monthlyPrice: 0, annualPrice: 0, maxUsers: 2, maxWorkflows: 3, maxExecutions: 100, maxIntegrations: 2, maxWebhooks: 1, aiCredits: 50, features: ['Trial access', '2 integrations', '100 executions', '14-day trial'], isActive: true, isTrial: true, trialDays: 14 },
  ];
}

function getDefaultSettings(): PlatformSettings {
  return {
    maintenanceMode: false,
    companySelfSignup: true,
    maxCompanies: 1000,
    defaultTrialDays: 14,
    platformName: 'AutoFlow AI',
    supportEmail: 'support@autoflow.ai',
    payoutBank: 'Chase Bank',
    payoutAccountMasked: '****4829',
    payoutStatus: 'active',
    paymentProvider: 'stripe',
    paymentProviderStatus: 'connected',
  };
}

function getDefaultSuperAdmin(): User {
  return {
    id: 'usr_super_admin',
    email: 'admin@autoflow.ai',
    name: 'Platform Admin',
    role: 'super_admin',
    companyId: null,
    status: 'active',
    lastLogin: new Date().toISOString(),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  };
}

function seedDatabase(): Database {
  const superAdmin = getDefaultSuperAdmin();
  const now = new Date().toISOString();
  
  const companies: Company[] = [
    { id: 'cmp_1', name: 'TechVentures Inc', industry: 'Technology', timezone: 'America/New_York', country: 'US', adminId: 'usr_cmp1_admin', status: 'active', planId: 'plan_pro', subscriptionStatus: 'active', userCount: 8, workflowCount: 12, executionCount: 3420, createdAt: '2024-03-15T00:00:00Z', updatedAt: now, lastActivity: now },
    { id: 'cmp_2', name: 'DataFlow Solutions', industry: 'Data Analytics', timezone: 'Europe/London', country: 'UK', adminId: 'usr_cmp2_admin', status: 'active', planId: 'plan_enterprise', subscriptionStatus: 'active', userCount: 25, workflowCount: 45, executionCount: 15600, createdAt: '2024-02-01T00:00:00Z', updatedAt: now, lastActivity: now },
    { id: 'cmp_3', name: 'GreenLeaf Marketing', industry: 'Marketing', timezone: 'America/Chicago', country: 'US', adminId: 'usr_cmp3_admin', status: 'trial', planId: 'plan_trial', subscriptionStatus: 'trial', userCount: 2, workflowCount: 2, executionCount: 45, createdAt: '2024-11-01T00:00:00Z', updatedAt: now, lastActivity: now },
    { id: 'cmp_4', name: 'Nordic Systems AB', industry: 'Software', timezone: 'Europe/Stockholm', country: 'SE', adminId: 'usr_cmp4_admin', status: 'suspended', planId: 'plan_starter', subscriptionStatus: 'past_due', userCount: 3, workflowCount: 5, executionCount: 890, createdAt: '2024-06-10T00:00:00Z', updatedAt: now, lastActivity: '2024-10-15T00:00:00Z' },
  ];

  const users: User[] = [
    superAdmin,
    { id: 'usr_cmp1_admin', email: 'john@techventures.com', name: 'John Mitchell', role: 'company_admin', companyId: 'cmp_1', status: 'active', lastLogin: now, createdAt: '2024-03-15T00:00:00Z', updatedAt: now },
    { id: 'usr_cmp1_user1', email: 'sarah@techventures.com', name: 'Sarah Chen', role: 'user', companyId: 'cmp_1', status: 'active', lastLogin: now, createdAt: '2024-04-01T00:00:00Z', updatedAt: now },
    { id: 'usr_cmp1_user2', email: 'mike@techventures.com', name: 'Mike Johnson', role: 'user', companyId: 'cmp_1', status: 'active', createdAt: '2024-05-01T00:00:00Z', updatedAt: now },
    { id: 'usr_cmp2_admin', email: 'emma@dataflow.io', name: 'Emma Williams', role: 'company_admin', companyId: 'cmp_2', status: 'active', lastLogin: now, createdAt: '2024-02-01T00:00:00Z', updatedAt: now },
    { id: 'usr_cmp2_user1', email: 'alex@dataflow.io', name: 'Alex Kumar', role: 'user', companyId: 'cmp_2', status: 'active', createdAt: '2024-03-01T00:00:00Z', updatedAt: now },
    { id: 'usr_cmp3_admin', email: 'lisa@greenleaf.co', name: 'Lisa Park', role: 'company_admin', companyId: 'cmp_3', status: 'active', createdAt: '2024-11-01T00:00:00Z', updatedAt: now },
    { id: 'usr_cmp4_admin', email: 'erik@nordic.se', name: 'Erik Lindqvist', role: 'company_admin', companyId: 'cmp_4', status: 'suspended', createdAt: '2024-06-10T00:00:00Z', updatedAt: now },
  ];

  const workflows: Workflow[] = [
    {
      id: 'wf_1', name: 'Customer Onboarding', description: 'Automated customer onboarding workflow', companyId: 'cmp_1', createdById: 'usr_cmp1_admin', status: 'active',
      nodes: [
        { id: 'n1', type: 'trigger', label: 'New Customer Signup', config: { source: 'webhook' }, position: { x: 100, y: 200 } },
        { id: 'n2', type: 'ai_action', label: 'Classify Customer', config: { model: 'gpt-4', prompt: 'Classify customer type' }, position: { x: 300, y: 200 } },
        { id: 'n3', type: 'condition', label: 'Enterprise?', config: { field: 'type', operator: 'equals', value: 'enterprise' }, position: { x: 500, y: 200 } },
        { id: 'n4', type: 'action', label: 'Send Welcome Email', config: { template: 'welcome_standard' }, position: { x: 700, y: 100 } },
        { id: 'n5', type: 'approval', label: 'Manager Review', config: { approver: 'admin' }, position: { x: 700, y: 300 } },
        { id: 'n6', type: 'integration', label: 'Create CRM Record', config: { provider: 'salesforce', action: 'create_contact' }, position: { x: 900, y: 200 } },
      ],
      connections: [
        { id: 'c1', sourceId: 'n1', targetId: 'n2' },
        { id: 'c2', sourceId: 'n2', targetId: 'n3' },
        { id: 'c3', sourceId: 'n3', targetId: 'n4', label: 'No' },
        { id: 'c4', sourceId: 'n3', targetId: 'n5', label: 'Yes' },
        { id: 'c5', sourceId: 'n4', targetId: 'n6' },
        { id: 'c6', sourceId: 'n5', targetId: 'n6' },
      ],
      triggerType: 'webhook', lastExecuted: now, executionCount: 245, successCount: 238, failCount: 7, createdAt: '2024-04-01T00:00:00Z', updatedAt: now, version: 3,
    },
    {
      id: 'wf_2', name: 'Invoice Processing', description: 'AI-powered invoice data extraction', companyId: 'cmp_1', createdById: 'usr_cmp1_user1', status: 'active',
      nodes: [
        { id: 'n1', type: 'trigger', label: 'Email Attachment', config: { source: 'email', filter: 'subject:invoice' }, position: { x: 100, y: 200 } },
        { id: 'n2', type: 'ai_action', label: 'Extract Invoice Data', config: { model: 'gpt-4', prompt: 'Extract invoice fields' }, position: { x: 350, y: 200 } },
        { id: 'n3', type: 'transform', label: 'Format Data', config: { mapping: { vendor: 'vendor_name', amount: 'total', date: 'invoice_date' } }, position: { x: 600, y: 200 } },
        { id: 'n4', type: 'integration', label: 'Save to Accounting', config: { provider: 'quickbooks', action: 'create_bill' }, position: { x: 850, y: 200 } },
      ],
      connections: [
        { id: 'c1', sourceId: 'n1', targetId: 'n2' },
        { id: 'c2', sourceId: 'n2', targetId: 'n3' },
        { id: 'c3', sourceId: 'n3', targetId: 'n4' },
      ],
      triggerType: 'email', lastExecuted: now, executionCount: 189, successCount: 185, failCount: 4, createdAt: '2024-05-15T00:00:00Z', updatedAt: now, version: 2,
    },
    {
      id: 'wf_3', name: 'Lead Qualification', description: 'AI lead scoring and routing', companyId: 'cmp_2', createdById: 'usr_cmp2_admin', status: 'active',
      nodes: [
        { id: 'n1', type: 'trigger', label: 'Form Submission', config: { source: 'form', formId: 'contact' }, position: { x: 100, y: 200 } },
        { id: 'n2', type: 'ai_action', label: 'Score Lead', config: { model: 'gpt-4', prompt: 'Score lead quality 1-100' }, position: { x: 350, y: 200 } },
        { id: 'n3', type: 'condition', label: 'Score >= 70?', config: { field: 'score', operator: 'gte', value: 70 }, position: { x: 600, y: 200 } },
        { id: 'n4', type: 'notification', label: 'Alert Sales Team', config: { channel: 'slack', message: 'Hot lead detected!' }, position: { x: 850, y: 100 } },
        { id: 'n5', type: 'action', label: 'Nurture Sequence', config: { template: 'nurture_cold' }, position: { x: 850, y: 300 } },
      ],
      connections: [
        { id: 'c1', sourceId: 'n1', targetId: 'n2' },
        { id: 'c2', sourceId: 'n2', targetId: 'n3' },
        { id: 'c3', sourceId: 'n3', targetId: 'n4', label: 'Yes' },
        { id: 'c4', sourceId: 'n3', targetId: 'n5', label: 'No' },
      ],
      triggerType: 'form', lastExecuted: now, executionCount: 567, successCount: 550, failCount: 17, createdAt: '2024-03-01T00:00:00Z', updatedAt: now, version: 5,
    },
  ];

  const executions: Execution[] = [
    { id: 'exe_1', workflowId: 'wf_1', workflowName: 'Customer Onboarding', companyId: 'cmp_1', status: 'success', startedAt: new Date(Date.now() - 300000).toISOString(), completedAt: new Date(Date.now() - 295000).toISOString(), duration: 5000, triggerType: 'webhook', triggeredBy: 'system', nodesExecuted: 5, totalNodes: 6, logs: [{ nodeId: 'n1', nodeLabel: 'New Customer Signup', status: 'success', timestamp: new Date(Date.now() - 300000).toISOString(), duration: 100 }, { nodeId: 'n2', nodeLabel: 'Classify Customer', status: 'success', timestamp: new Date(Date.now() - 299000).toISOString(), duration: 2500 }, { nodeId: 'n3', nodeLabel: 'Enterprise?', status: 'success', timestamp: new Date(Date.now() - 297000).toISOString(), duration: 50 }, { nodeId: 'n4', nodeLabel: 'Send Welcome Email', status: 'success', timestamp: new Date(Date.now() - 296500).toISOString(), duration: 1200 }, { nodeId: 'n6', nodeLabel: 'Create CRM Record', status: 'success', timestamp: new Date(Date.now() - 295500).toISOString(), duration: 800 }] },
    { id: 'exe_2', workflowId: 'wf_2', workflowName: 'Invoice Processing', companyId: 'cmp_1', status: 'failed', startedAt: new Date(Date.now() - 600000).toISOString(), completedAt: new Date(Date.now() - 595000).toISOString(), duration: 5000, triggerType: 'email', triggeredBy: 'system', nodesExecuted: 2, totalNodes: 4, error: 'AI provider timeout', logs: [{ nodeId: 'n1', nodeLabel: 'Email Attachment', status: 'success', timestamp: new Date(Date.now() - 600000).toISOString(), duration: 200 }, { nodeId: 'n2', nodeLabel: 'Extract Invoice Data', status: 'failed', timestamp: new Date(Date.now() - 598000).toISOString(), duration: 3000, error: 'Request timeout after 3000ms' }] },
    { id: 'exe_3', workflowId: 'wf_3', workflowName: 'Lead Qualification', companyId: 'cmp_2', status: 'success', startedAt: new Date(Date.now() - 120000).toISOString(), completedAt: new Date(Date.now() - 117000).toISOString(), duration: 3000, triggerType: 'form', triggeredBy: 'system', nodesExecuted: 4, totalNodes: 5, logs: [{ nodeId: 'n1', nodeLabel: 'Form Submission', status: 'success', timestamp: new Date(Date.now() - 120000).toISOString(), duration: 50 }, { nodeId: 'n2', nodeLabel: 'Score Lead', status: 'success', timestamp: new Date(Date.now() - 119000).toISOString(), duration: 1800 }, { nodeId: 'n3', nodeLabel: 'Score >= 70?', status: 'success', timestamp: new Date(Date.now() - 118000).toISOString(), duration: 20 }, { nodeId: 'n4', nodeLabel: 'Alert Sales Team', status: 'success', timestamp: new Date(Date.now() - 117500).toISOString(), duration: 500 }] },
    { id: 'exe_4', workflowId: 'wf_1', workflowName: 'Customer Onboarding', companyId: 'cmp_1', status: 'running', startedAt: new Date(Date.now() - 10000).toISOString(), triggerType: 'webhook', triggeredBy: 'system', nodesExecuted: 2, totalNodes: 6, logs: [{ nodeId: 'n1', nodeLabel: 'New Customer Signup', status: 'success', timestamp: new Date(Date.now() - 10000).toISOString(), duration: 100 }, { nodeId: 'n2', nodeLabel: 'Classify Customer', status: 'success', timestamp: new Date(Date.now() - 8000).toISOString(), duration: 2200 }] },
  ];

  const integrations: Integration[] = [
    { id: 'int_1', companyId: 'cmp_1', provider: 'slack', name: 'Slack', status: 'connected', icon: '💬', category: 'Communication', connectedAt: '2024-04-01T00:00:00Z', lastSync: now, config: {} },
    { id: 'int_2', companyId: 'cmp_1', provider: 'salesforce', name: 'Salesforce', status: 'connected', icon: '☁️', category: 'CRM', connectedAt: '2024-04-15T00:00:00Z', lastSync: now, config: {} },
    { id: 'int_3', companyId: 'cmp_1', provider: 'gmail', name: 'Gmail', status: 'connected', icon: '📧', category: 'Email', connectedAt: '2024-05-01T00:00:00Z', lastSync: now, config: {} },
    { id: 'int_4', companyId: 'cmp_1', provider: 'quickbooks', name: 'QuickBooks', status: 'disconnected', icon: '💰', category: 'Accounting', config: {} },
    { id: 'int_5', companyId: 'cmp_1', provider: 'github', name: 'GitHub', status: 'connected', icon: '🐙', category: 'Development', connectedAt: '2024-06-01T00:00:00Z', lastSync: now, config: {} },
    { id: 'int_6', companyId: 'cmp_2', provider: 'slack', name: 'Slack', status: 'connected', icon: '💬', category: 'Communication', connectedAt: '2024-03-01T00:00:00Z', lastSync: now, config: {} },
    { id: 'int_7', companyId: 'cmp_2', provider: 'hubspot', name: 'HubSpot', status: 'connected', icon: '🔶', category: 'CRM', connectedAt: '2024-03-15T00:00:00Z', lastSync: now, config: {} },
  ];

  const webhooks: Webhook[] = [
    { id: 'wh_1', companyId: 'cmp_1', name: 'Customer Signup', url: 'https://api.autoflow.ai/webhooks/wh_1', secret: 'whsec_***masked***', status: 'active', events: ['customer.created', 'customer.updated'], lastTriggered: now, successCount: 245, failCount: 3, createdAt: '2024-04-01T00:00:00Z' },
    { id: 'wh_2', companyId: 'cmp_1', name: 'Payment Events', url: 'https://api.autoflow.ai/webhooks/wh_2', secret: 'whsec_***masked***', status: 'active', events: ['payment.succeeded', 'payment.failed'], lastTriggered: now, successCount: 89, failCount: 1, createdAt: '2024-05-01T00:00:00Z' },
    { id: 'wh_3', companyId: 'cmp_2', name: 'Lead Capture', url: 'https://api.autoflow.ai/webhooks/wh_3', secret: 'whsec_***masked***', status: 'active', events: ['lead.created'], lastTriggered: now, successCount: 567, failCount: 12, createdAt: '2024-03-01T00:00:00Z' },
  ];

  const notifications: Notification[] = [
    { id: 'ntf_1', userId: 'usr_super_admin', type: 'success', title: 'New Company Registered', message: 'GreenLeaf Marketing has registered on the Professional plan.', read: false, createdAt: now },
    { id: 'ntf_2', userId: 'usr_super_admin', type: 'info', title: 'Payment Received', message: 'TechVentures Inc - $99.00 monthly subscription.', read: false, createdAt: now },
    { id: 'ntf_3', userId: 'usr_super_admin', type: 'warning', title: 'Company Suspended', message: 'Nordic Systems AB has been suspended due to payment failure.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'ntf_4', userId: 'usr_cmp1_admin', type: 'success', title: 'Workflow Executed', message: 'Customer Onboarding completed successfully (245 total runs).', read: false, createdAt: now },
    { id: 'ntf_5', userId: 'usr_cmp1_admin', type: 'error', title: 'Execution Failed', message: 'Invoice Processing failed: AI provider timeout.', read: false, createdAt: new Date(Date.now() - 600000).toISOString() },
    { id: 'ntf_6', userId: 'usr_cmp1_user1', type: 'info', title: 'Workflow Updated', message: 'Invoice Processing workflow was updated to version 2.', read: false, createdAt: now },
    { id: 'ntf_7', userId: 'usr_cmp2_admin', type: 'success', title: 'Milestone Reached', message: 'Lead Qualification has processed 500+ leads successfully.', read: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
  ];

  const subscriptions: Subscription[] = [
    { id: 'sub_1', companyId: 'cmp_1', planId: 'plan_pro', status: 'active', billingCycle: 'monthly', currentPeriodStart: '2024-11-01T00:00:00Z', currentPeriodEnd: '2024-12-01T00:00:00Z', amount: 99, createdAt: '2024-03-15T00:00:00Z' },
    { id: 'sub_2', companyId: 'cmp_2', planId: 'plan_enterprise', status: 'active', billingCycle: 'annual', currentPeriodStart: '2024-02-01T00:00:00Z', currentPeriodEnd: '2025-02-01T00:00:00Z', amount: 2990, createdAt: '2024-02-01T00:00:00Z' },
    { id: 'sub_3', companyId: 'cmp_3', planId: 'plan_trial', status: 'trial', billingCycle: 'monthly', currentPeriodStart: '2024-11-01T00:00:00Z', currentPeriodEnd: '2024-11-15T00:00:00Z', amount: 0, createdAt: '2024-11-01T00:00:00Z' },
    { id: 'sub_4', companyId: 'cmp_4', planId: 'plan_starter', status: 'past_due', billingCycle: 'monthly', currentPeriodStart: '2024-10-01T00:00:00Z', currentPeriodEnd: '2024-11-01T00:00:00Z', amount: 29, createdAt: '2024-06-10T00:00:00Z' },
  ];

  const invoices: Invoice[] = [
    { id: 'inv_1', companyId: 'cmp_1', subscriptionId: 'sub_1', amount: 99, currency: 'USD', status: 'paid', paidAt: '2024-11-01T00:00:00Z', createdAt: '2024-11-01T00:00:00Z', items: [{ description: 'Professional Plan - Monthly', amount: 99 }] },
    { id: 'inv_2', companyId: 'cmp_1', subscriptionId: 'sub_1', amount: 99, currency: 'USD', status: 'paid', paidAt: '2024-10-01T00:00:00Z', createdAt: '2024-10-01T00:00:00Z', items: [{ description: 'Professional Plan - Monthly', amount: 99 }] },
    { id: 'inv_3', companyId: 'cmp_2', subscriptionId: 'sub_2', amount: 2990, currency: 'USD', status: 'paid', paidAt: '2024-02-01T00:00:00Z', createdAt: '2024-02-01T00:00:00Z', items: [{ description: 'Enterprise Plan - Annual', amount: 2990 }] },
    { id: 'inv_4', companyId: 'cmp_4', subscriptionId: 'sub_4', amount: 29, currency: 'USD', status: 'failed', createdAt: '2024-10-01T00:00:00Z', items: [{ description: 'Starter Plan - Monthly', amount: 29 }] },
  ];

  const auditLogs: AuditLog[] = [
    { id: 'al_1', actorId: 'usr_super_admin', actorName: 'Platform Admin', action: 'company.suspended', resource: 'company', resourceId: 'cmp_4', details: { reason: 'Payment failure' }, createdAt: '2024-10-15T00:00:00Z' },
    { id: 'al_2', actorId: 'usr_super_admin', actorName: 'Platform Admin', action: 'settings.updated', resource: 'platform_settings', resourceId: 'global', details: { field: 'maintenanceMode', value: false }, createdAt: '2024-11-01T00:00:00Z' },
    { id: 'al_3', actorId: 'usr_cmp1_admin', actorName: 'John Mitchell', action: 'workflow.created', resource: 'workflow', resourceId: 'wf_1', companyId: 'cmp_1', createdAt: '2024-04-01T00:00:00Z' },
    { id: 'al_4', actorId: 'usr_cmp1_admin', actorName: 'John Mitchell', action: 'user.invited', resource: 'user', resourceId: 'usr_cmp1_user1', companyId: 'cmp_1', createdAt: '2024-04-01T00:00:00Z' },
    { id: 'al_5', actorId: 'usr_cmp2_admin', actorName: 'Emma Williams', action: 'integration.connected', resource: 'integration', resourceId: 'int_6', companyId: 'cmp_2', createdAt: '2024-03-01T00:00:00Z' },
  ];

  return {
    users,
    companies,
    plans: getDefaultPlans(),
    workflows,
    executions,
    integrations,
    webhooks,
    notifications,
    subscriptions,
    invoices,
    auditLogs,
    settings: getDefaultSettings(),
    sessions: {},
  };
}

function loadDB(): Database {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const db = seedDatabase();
  saveDB(db);
  return db;
}

function saveDB(db: Database) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

let db: Database = loadDB();

// Auth
export function login(email: string, password: string): { user: User; token: string } | null {
  // In production, password would be hashed and verified server-side
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  if (user.status === 'suspended') return null;
  if (db.settings.maintenanceMode && user.role !== 'super_admin') return null;
  
  const token = 'tok_' + uuid();
  db.sessions[token] = user.id;
  user.lastLogin = new Date().toISOString();
  user.updatedAt = new Date().toISOString();
  saveDB(db);
  return { user, token };
}

export function register(data: { email: string; name: string; password: string; companyName: string; industry: string; country: string; timezone: string; planId: string }): { user: User; company: Company; token: string } | null {
  if (!db.settings.companySelfSignup) return null;
  if (db.users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) return null;
  
  const companyId = 'cmp_' + uuid().slice(0, 8);
  const userId = 'usr_' + uuid().slice(0, 8);
  const now = new Date().toISOString();
  
  // Determine company status based on plan
  const isTrial = data.planId === 'plan_trial';
  const companyStatus = isTrial ? 'trial' : 'active';
  const subStatus = isTrial ? 'trial' : 'active';
  
  const company: Company = {
    id: companyId, name: data.companyName, industry: data.industry, timezone: data.timezone, country: data.country,
    adminId: userId, status: companyStatus, planId: data.planId, subscriptionStatus: subStatus,
    userCount: 1, workflowCount: 0, executionCount: 0, createdAt: now, updatedAt: now, lastActivity: now,
  };
  
  const user: User = {
    id: userId, email: data.email, name: data.name, role: 'company_admin', companyId,
    status: 'active', lastLogin: now, createdAt: now, updatedAt: now,
  };
  
  const plan = db.plans.find(p => p.id === data.planId);
  const amount = plan ? (data.planId === 'plan_trial' ? 0 : plan.monthlyPrice) : 0;
  
  const sub: Subscription = {
    id: 'sub_' + uuid().slice(0, 8), companyId, planId: data.planId, status: subStatus,
    billingCycle: 'monthly', currentPeriodStart: now,
    currentPeriodEnd: new Date(Date.now() + (isTrial ? 14 : 30) * 86400000).toISOString(), amount, createdAt: now,
  };
  
  db.companies.push(company);
  db.users.push(user);
  db.subscriptions.push(sub);
  
  // Create initial invoice if paid plan
  if (!isTrial && amount > 0) {
    db.invoices.push({
      id: 'inv_' + uuid().slice(0, 8), companyId, subscriptionId: sub.id,
      amount, currency: 'USD', status: 'paid', paidAt: now, createdAt: now,
      items: [{ description: `${plan?.name} Plan - Monthly`, amount }],
    });
  }
  
  db.auditLogs.push({ id: 'al_' + uuid().slice(0, 8), actorId: userId, actorName: data.name, action: 'company.created', resource: 'company', resourceId: companyId, details: { industry: data.industry, plan: data.planId }, createdAt: now });
  
  const token = 'tok_' + uuid();
  db.sessions[token] = userId;
  saveDB(db);
  
  return { user, company, token };
}

export function getSession(token: string): User | null {
  const userId = db.sessions[token];
  if (!userId) return null;
  return db.users.find(u => u.id === userId) || null;
}

export function logout(token: string) {
  delete db.sessions[token];
  saveDB(db);
}

// Users
export function getUsers(companyId?: string): User[] {
  if (companyId) return db.users.filter(u => u.companyId === companyId);
  return db.users;
}

export function getUserById(id: string): User | undefined {
  return db.users.find(u => u.id === id);
}

export function createUser(data: Partial<User> & { email: string; name: string; companyId: string }): User {
  const now = new Date().toISOString();
  const user: User = {
    id: 'usr_' + uuid().slice(0, 8), email: data.email, name: data.name, role: data.role || 'user',
    companyId: data.companyId, status: 'active', createdAt: now, updatedAt: now,
  };
  db.users.push(user);
  const company = db.companies.find(c => c.id === data.companyId);
  if (company) company.userCount = db.users.filter(u => u.companyId === data.companyId).length;
  saveDB(db);
  return user;
}

export function updateUser(id: string, data: Partial<User>): User | null {
  const idx = db.users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  db.users[idx] = { ...db.users[idx], ...data, updatedAt: new Date().toISOString() };
  saveDB(db);
  return db.users[idx];
}

export function deleteUser(id: string): boolean {
  const idx = db.users.findIndex(u => u.id === id);
  if (idx === -1) return false;
  const companyId = db.users[idx].companyId;
  db.users.splice(idx, 1);
  if (companyId) {
    const company = db.companies.find(c => c.id === companyId);
    if (company) company.userCount = db.users.filter(u => u.companyId === companyId).length;
  }
  saveDB(db);
  return true;
}

// Companies
export function getCompanies(): Company[] { return db.companies; }
export function getCompanyById(id: string): Company | undefined { return db.companies.find(c => c.id === id); }
export function updateCompany(id: string, data: Partial<Company>): Company | null {
  const idx = db.companies.findIndex(c => c.id === id);
  if (idx === -1) return null;
  db.companies[idx] = { ...db.companies[idx], ...data, updatedAt: new Date().toISOString() };
  saveDB(db);
  return db.companies[idx];
}

// Plans
export function getPlans(): Plan[] { return db.plans; }
export function getPlanById(id: string): Plan | undefined { return db.plans.find(p => p.id === id); }
export function updatePlan(id: string, data: Partial<Plan>): Plan | null {
  const idx = db.plans.findIndex(p => p.id === id);
  if (idx === -1) return null;
  db.plans[idx] = { ...db.plans[idx], ...data };
  saveDB(db);
  return db.plans[idx];
}

// Workflows
export function getWorkflows(companyId?: string): Workflow[] {
  if (companyId) return db.workflows.filter(w => w.companyId === companyId);
  return db.workflows;
}
export function getWorkflowById(id: string): Workflow | undefined { return db.workflows.find(w => w.id === id); }
export function createWorkflow(data: { name: string; description: string; companyId: string; createdById: string; nodes?: WorkflowNode[]; connections?: WorkflowConnection[] }): Workflow {
  const now = new Date().toISOString();
  const wf: Workflow = {
    id: 'wf_' + uuid().slice(0, 8), name: data.name, description: data.description, companyId: data.companyId,
    createdById: data.createdById, status: 'draft', nodes: data.nodes || [], connections: data.connections || [],
    executionCount: 0, successCount: 0, failCount: 0, createdAt: now, updatedAt: now, version: 1,
  };
  db.workflows.push(wf);
  const company = db.companies.find(c => c.id === data.companyId);
  if (company) company.workflowCount = db.workflows.filter(w => w.companyId === data.companyId).length;
  saveDB(db);
  return wf;
}
export function updateWorkflow(id: string, data: Partial<Workflow>): Workflow | null {
  const idx = db.workflows.findIndex(w => w.id === id);
  if (idx === -1) return null;
  db.workflows[idx] = { ...db.workflows[idx], ...data, updatedAt: new Date().toISOString(), version: db.workflows[idx].version + 1 };
  saveDB(db);
  return db.workflows[idx];
}
export function deleteWorkflow(id: string): boolean {
  const idx = db.workflows.findIndex(w => w.id === id);
  if (idx === -1) return false;
  const companyId = db.workflows[idx].companyId;
  db.workflows.splice(idx, 1);
  if (companyId) {
    const company = db.companies.find(c => c.id === companyId);
    if (company) company.workflowCount = db.workflows.filter(w => w.companyId === companyId).length;
  }
  saveDB(db);
  return true;
}

// Executions
export function getExecutions(companyId?: string, workflowId?: string): Execution[] {
  let result = db.executions;
  if (companyId) result = result.filter(e => e.companyId === companyId);
  if (workflowId) result = result.filter(e => e.workflowId === workflowId);
  return result.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}
export function getExecutionById(id: string): Execution | undefined { return db.executions.find(e => e.id === id); }

export function executeWorkflow(workflowId: string, triggeredBy: string): Execution | null {
  const wf = db.workflows.find(w => w.id === workflowId);
  if (!wf || wf.status !== 'active') return null;
  
  const now = new Date().toISOString();
  const execution: Execution = {
    id: 'exe_' + uuid().slice(0, 8), workflowId: wf.id, workflowName: wf.name, companyId: wf.companyId,
    status: 'running', startedAt: now, triggerType: wf.triggerType || 'manual', triggeredBy,
    nodesExecuted: 0, totalNodes: wf.nodes.length, logs: [],
  };
  db.executions.unshift(execution);
  
  // Simulate execution
  setTimeout(() => {
    const exec = db.executions.find(e => e.id === execution.id);
    if (!exec) return;
    exec.status = 'success';
    exec.completedAt = new Date().toISOString();
    exec.duration = Date.now() - new Date(exec.startedAt).getTime();
    exec.nodesExecuted = wf.nodes.length;
    exec.logs = wf.nodes.map((node, i) => ({
      nodeId: node.id, nodeLabel: node.label, status: 'success' as const,
      timestamp: new Date(Date.now() - (wf.nodes.length - i) * 500).toISOString(),
      duration: Math.floor(Math.random() * 2000) + 100,
    }));
    wf.executionCount++;
    wf.successCount++;
    wf.lastExecuted = now;
    const company = db.companies.find(c => c.id === wf.companyId);
    if (company) company.executionCount++;
    saveDB(db);
  }, 2000);
  
  saveDB(db);
  return execution;
}

// Integrations
export function getIntegrations(companyId?: string): Integration[] {
  if (companyId) return db.integrations.filter(i => i.companyId === companyId);
  return db.integrations;
}
export function connectIntegration(companyId: string, provider: string, name: string): Integration {
  const int: Integration = {
    id: 'int_' + uuid().slice(0, 8), companyId, provider, name, status: 'connected',
    icon: getIntegrationIcon(provider), category: getIntegrationCategory(provider),
    connectedAt: new Date().toISOString(), lastSync: new Date().toISOString(), config: {},
  };
  db.integrations.push(int);
  saveDB(db);
  return int;
}
export function disconnectIntegration(id: string): boolean {
  const idx = db.integrations.findIndex(i => i.id === id);
  if (idx === -1) return false;
  db.integrations[idx].status = 'disconnected';
  db.integrations[idx].connectedAt = undefined;
  saveDB(db);
  return true;
}

function getIntegrationIcon(provider: string): string {
  const icons: Record<string, string> = { slack: '💬', salesforce: '☁️', gmail: '📧', quickbooks: '💰', github: '🐙', hubspot: '🔶', stripe: '💳', notion: '📝', jira: '🎯', zendesk: '🎧', shopify: '🛒', google_sheets: '📊', airtable: '📋', twilio: '📱', dropbox: '📦' };
  return icons[provider] || '🔗';
}
function getIntegrationCategory(provider: string): string {
  const cats: Record<string, string> = { slack: 'Communication', salesforce: 'CRM', gmail: 'Email', quickbooks: 'Accounting', github: 'Development', hubspot: 'CRM', stripe: 'Payments', notion: 'Productivity', jira: 'Project Management', zendesk: 'Support', shopify: 'E-commerce', google_sheets: 'Spreadsheets', airtable: 'Database', twilio: 'Communication', dropbox: 'Storage' };
  return cats[provider] || 'Other';
}

// Webhooks
export function getWebhooks(companyId?: string): Webhook[] {
  if (companyId) return db.webhooks.filter(w => w.companyId === companyId);
  return db.webhooks;
}
export function createWebhook(data: { companyId: string; name: string; events: string[] }): Webhook {
  const wh: Webhook = {
    id: 'wh_' + uuid().slice(0, 8), companyId: data.companyId, name: data.name,
    url: `https://api.autoflow.ai/webhooks/wh_${uuid().slice(0, 8)}`,
    secret: 'whsec_***masked***', status: 'active', events: data.events,
    successCount: 0, failCount: 0, createdAt: new Date().toISOString(),
  };
  db.webhooks.push(wh);
  saveDB(db);
  return wh;
}
export function deleteWebhook(id: string): boolean {
  const idx = db.webhooks.findIndex(w => w.id === id);
  if (idx === -1) return false;
  db.webhooks.splice(idx, 1);
  saveDB(db);
  return true;
}

// Notifications
export function getNotifications(userId: string): Notification[] {
  return db.notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
export function getUnreadCount(userId: string): number {
  return db.notifications.filter(n => n.userId === userId && !n.read).length;
}
export function markNotificationRead(id: string) {
  const n = db.notifications.find(n => n.id === id);
  if (n) { n.read = true; saveDB(db); }
}
export function markAllNotificationsRead(userId: string) {
  db.notifications.filter(n => n.userId === userId).forEach(n => n.read = true);
  saveDB(db);
}
export function createNotification(data: { userId: string; type: 'info' | 'success' | 'warning' | 'error'; title: string; message: string; actionUrl?: string }) {
  const n: Notification = { id: 'ntf_' + uuid().slice(0, 8), ...data, read: false, createdAt: new Date().toISOString() };
  db.notifications.push(n);
  saveDB(db);
  return n;
}

// Subscriptions & Invoices
export function getSubscription(companyId: string): Subscription | undefined { return db.subscriptions.find(s => s.companyId === companyId); }
export function getInvoices(companyId: string): Invoice[] { return db.invoices.filter(i => i.companyId === companyId); }

// Audit Logs
export function getAuditLogs(companyId?: string): AuditLog[] {
  if (companyId) return db.auditLogs.filter(a => a.companyId === companyId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return db.auditLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
export function addAuditLog(data: { actorId: string; actorName: string; action: string; resource: string; resourceId: string; companyId?: string; details?: Record<string, any> }) {
  const log: AuditLog = { id: 'al_' + uuid().slice(0, 8), ...data, createdAt: new Date().toISOString() };
  db.auditLogs.push(log);
  saveDB(db);
}

// Platform Settings
export function getSettings(): PlatformSettings { return db.settings; }
export function updateSettings(data: Partial<PlatformSettings>): PlatformSettings {
  db.settings = { ...db.settings, ...data };
  saveDB(db);
  return db.settings;
}

// Usage
export function getUsage(companyId: string): Usage {
  const company = db.companies.find(c => c.id === companyId);
  return {
    companyId,
    executions: company?.executionCount || 0,
    workflows: db.workflows.filter(w => w.companyId === companyId).length,
    users: db.users.filter(u => u.companyId === companyId).length,
    integrations: db.integrations.filter(i => i.companyId === companyId && i.status === 'connected').length,
    webhooks: db.webhooks.filter(w => w.companyId === companyId).length,
    aiCredits: Math.floor(Math.random() * 1000) + 200,
    storageMb: Math.floor(Math.random() * 500) + 50,
  };
}

// Platform Stats (Super Admin)
export function getPlatformStats() {
  const activeCompanies = db.companies.filter(c => c.status === 'active').length;
  const trialCompanies = db.companies.filter(c => c.status === 'trial').length;
  const suspendedCompanies = db.companies.filter(c => c.status === 'suspended').length;
  const totalUsers = db.users.filter(u => u.role !== 'super_admin').length;
  const totalWorkflows = db.workflows.length;
  const totalExecutions = db.executions.length;
  const successfulExecutions = db.executions.filter(e => e.status === 'success').length;
  const failedExecutions = db.executions.filter(e => e.status === 'failed').length;
  const paidInvoices = db.invoices.filter(i => i.status === 'paid');
  const grossRevenue = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
  const processingFees = Math.round(grossRevenue * 0.029);
  const netRevenue = grossRevenue - processingFees;
  
  return {
    totalCompanies: db.companies.length,
    activeCompanies,
    trialCompanies,
    suspendedCompanies,
    totalUsers,
    totalWorkflows,
    totalExecutions,
    successfulExecutions,
    failedExecutions,
    grossRevenue,
    processingFees,
    netRevenue,
    activeSubscriptions: db.subscriptions.filter(s => s.status === 'active').length,
  };
}

export function resetDatabase() {
  localStorage.removeItem(DB_KEY);
  db = seedDatabase();
  saveDB(db);
}

// Industry-specific templates
export interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string;
  nodes: number;
  tags: string[];
}

export function getIndustryTemplates(industry: string): IndustryTemplate[] {
  const allTemplates: IndustryTemplate[] = [
    // IT Industry Templates
    { id: 'tpl_it_1', name: 'IT Support Ticket Routing', description: 'Automatically classify and route IT support tickets to the appropriate team based on priority and category', category: 'IT Support', industry: 'it', nodes: 5, tags: ['ticketing', 'routing', 'support'] },
    { id: 'tpl_it_2', name: 'System Monitoring & Alerts', description: 'Monitor system health metrics and trigger automated alerts when thresholds are exceeded', category: 'Monitoring', industry: 'it', nodes: 4, tags: ['monitoring', 'alerts', 'infrastructure'] },
    { id: 'tpl_it_3', name: 'Employee Onboarding Automation', description: 'Automate IT onboarding process including account creation, access provisioning, and equipment setup', category: 'Onboarding', industry: 'it', nodes: 6, tags: ['onboarding', 'provisioning', 'automation'] },
    { id: 'tpl_it_4', name: 'Incident Response Workflow', description: 'Automated incident detection, escalation, and resolution tracking for IT incidents', category: 'Incident Management', industry: 'it', nodes: 5, tags: ['incident', 'response', 'escalation'] },
    { id: 'tpl_it_5', name: 'Server Maintenance Scheduler', description: 'Schedule and automate server maintenance tasks with notifications and rollback procedures', category: 'Maintenance', industry: 'it', nodes: 4, tags: ['maintenance', 'scheduling', 'servers'] },
    { id: 'tpl_it_6', name: 'Security Threat Detection', description: 'AI-powered security monitoring and automated threat response workflows', category: 'Security', industry: 'it', nodes: 5, tags: ['security', 'threat', 'ai'] },
    { id: 'tpl_it_7', name: 'Documentation Auto-Generator', description: 'Automatically generate and update technical documentation from code and system changes', category: 'Documentation', industry: 'it', nodes: 4, tags: ['documentation', 'automation', 'ai'] },
    { id: 'tpl_it_8', name: 'DevOps Pipeline Automation', description: 'Automate CI/CD pipeline stages with testing, deployment, and rollback capabilities', category: 'DevOps', industry: 'it', nodes: 6, tags: ['devops', 'ci/cd', 'deployment'] },

    // Healthcare Industry Templates
    { id: 'tpl_health_1', name: 'Patient Appointment Scheduling', description: 'Automate patient appointment booking, reminders, and rescheduling workflows', category: 'Scheduling', industry: 'healthcare', nodes: 5, tags: ['appointments', 'scheduling', 'patients'] },
    { id: 'tpl_health_2', name: 'Medical Records Management', description: 'Automate medical record creation, updates, and secure access management', category: 'Records', industry: 'healthcare', nodes: 4, tags: ['records', 'documentation', 'compliance'] },
    { id: 'tpl_health_3', name: 'Patient Intake Automation', description: 'Streamline patient intake with digital forms, insurance verification, and data validation', category: 'Intake', industry: 'healthcare', nodes: 6, tags: ['intake', 'forms', 'verification'] },
    { id: 'tpl_health_4', name: 'Billing & Insurance Claims', description: 'Automate medical billing, insurance claim submission, and payment processing', category: 'Billing', industry: 'healthcare', nodes: 5, tags: ['billing', 'insurance', 'claims'] },
    { id: 'tpl_health_5', name: 'Medication Reminder System', description: 'Automated medication reminders and adherence tracking for patients', category: 'Medication', industry: 'healthcare', nodes: 4, tags: ['medication', 'reminders', 'adherence'] },
    { id: 'tpl_health_6', name: 'Lab Results Notification', description: 'Automate lab result processing and secure patient notification workflows', category: 'Lab', industry: 'healthcare', nodes: 4, tags: ['lab', 'results', 'notification'] },
    { id: 'tpl_health_7', name: 'Staff Scheduling Optimization', description: 'AI-powered staff scheduling based on patient volume and availability', category: 'Staffing', industry: 'healthcare', nodes: 5, tags: ['scheduling', 'staff', 'optimization'] },
    { id: 'tpl_health_8', name: 'Compliance Monitoring', description: 'Automated healthcare compliance monitoring and audit trail generation', category: 'Compliance', industry: 'healthcare', nodes: 4, tags: ['compliance', 'audit', 'monitoring'] },

    // Finance Industry Templates
    { id: 'tpl_fin_1', name: 'Invoice Processing & Approval', description: 'Automate invoice receipt, data extraction, approval routing, and payment processing', category: 'Accounts Payable', industry: 'finance', nodes: 5, tags: ['invoices', 'approval', 'payment'] },
    { id: 'tpl_fin_2', name: 'Expense Report Automation', description: 'Streamline expense report submission, approval, and reimbursement workflows', category: 'Expenses', industry: 'finance', nodes: 4, tags: ['expenses', 'reports', 'reimbursement'] },
    { id: 'tpl_fin_3', name: 'Financial Report Generation', description: 'Automate financial report creation, data aggregation, and distribution', category: 'Reporting', industry: 'finance', nodes: 5, tags: ['reports', 'analytics', 'automation'] },
    { id: 'tpl_fin_4', name: 'Fraud Detection System', description: 'AI-powered transaction monitoring and automated fraud alert workflows', category: 'Security', industry: 'finance', nodes: 5, tags: ['fraud', 'detection', 'ai'] },
    { id: 'tpl_fin_5', name: 'Loan Application Processing', description: 'Automate loan application intake, credit checks, and approval workflows', category: 'Lending', industry: 'finance', nodes: 6, tags: ['loans', 'applications', 'credit'] },
    { id: 'tpl_fin_6', name: 'Regulatory Compliance Monitoring', description: 'Automated compliance checking and regulatory reporting workflows', category: 'Compliance', industry: 'finance', nodes: 4, tags: ['compliance', 'regulatory', 'monitoring'] },

    // Retail/E-commerce Templates
    { id: 'tpl_ret_1', name: 'Order Fulfillment Automation', description: 'Automate order processing, inventory updates, and shipping notifications', category: 'Order Management', industry: 'retail', nodes: 5, tags: ['orders', 'fulfillment', 'shipping'] },
    { id: 'tpl_ret_2', name: 'Customer Support Ticket Routing', description: 'Intelligently route customer support requests based on issue type and priority', category: 'Support', industry: 'retail', nodes: 4, tags: ['support', 'tickets', 'routing'] },
    { id: 'tpl_ret_3', name: 'Inventory Management Alerts', description: 'Monitor inventory levels and automate reorder notifications and alerts', category: 'Inventory', industry: 'retail', nodes: 4, tags: ['inventory', 'alerts', 'reorder'] },
    { id: 'tpl_ret_4', name: 'Marketing Campaign Automation', description: 'Automate marketing campaign execution, tracking, and performance reporting', category: 'Marketing', industry: 'retail', nodes: 5, tags: ['marketing', 'campaigns', 'automation'] },
    { id: 'tpl_ret_5', name: 'Return & Refund Processing', description: 'Streamline return requests, approval workflows, and refund processing', category: 'Returns', industry: 'retail', nodes: 5, tags: ['returns', 'refunds', 'processing'] },
    { id: 'tpl_ret_6', name: 'Customer Feedback Collection', description: 'Automate post-purchase feedback collection and sentiment analysis', category: 'Feedback', industry: 'retail', nodes: 4, tags: ['feedback', 'reviews', 'sentiment'] },

    // Manufacturing Templates
    { id: 'tpl_mfg_1', name: 'Production Line Monitoring', description: 'Monitor production metrics and automate quality control alerts', category: 'Production', industry: 'manufacturing', nodes: 5, tags: ['production', 'monitoring', 'quality'] },
    { id: 'tpl_mfg_2', name: 'Supply Chain Management', description: 'Automate supplier communications, order tracking, and delivery scheduling', category: 'Supply Chain', industry: 'manufacturing', nodes: 6, tags: ['supply', 'chain', 'logistics'] },
    { id: 'tpl_mfg_3', name: 'Equipment Maintenance Scheduling', description: 'Predictive maintenance scheduling and automated work order generation', category: 'Maintenance', industry: 'manufacturing', nodes: 4, tags: ['maintenance', 'equipment', 'scheduling'] },
    { id: 'tpl_mfg_4', name: 'Quality Control Automation', description: 'Automated quality inspection workflows and defect tracking', category: 'Quality', industry: 'manufacturing', nodes: 5, tags: ['quality', 'inspection', 'defects'] },
    { id: 'tpl_mfg_5', name: 'Inventory Reorder System', description: 'Automated inventory monitoring and purchase order generation', category: 'Inventory', industry: 'manufacturing', nodes: 4, tags: ['inventory', 'reorder', 'automation'] },

    // Education Templates
    { id: 'tpl_edu_1', name: 'Student Enrollment Automation', description: 'Streamline student enrollment, document verification, and onboarding', category: 'Enrollment', industry: 'education', nodes: 5, tags: ['enrollment', 'students', 'onboarding'] },
    { id: 'tpl_edu_2', name: 'Course Scheduling System', description: 'Automate course scheduling, room allocation, and instructor assignment', category: 'Scheduling', industry: 'education', nodes: 4, tags: ['courses', 'scheduling', 'rooms'] },
    { id: 'tpl_edu_3', name: 'Grade Processing & Reporting', description: 'Automate grade entry, calculation, and report card generation', category: 'Grades', industry: 'education', nodes: 4, tags: ['grades', 'reports', 'automation'] },
    { id: 'tpl_edu_4', name: 'Attendance Tracking', description: 'Automated attendance tracking and parent notification workflows', category: 'Attendance', industry: 'education', nodes: 4, tags: ['attendance', 'tracking', 'notification'] },
    { id: 'tpl_edu_5', name: 'Financial Aid Processing', description: 'Automate financial aid applications, verification, and disbursement', category: 'Financial Aid', industry: 'education', nodes: 5, tags: ['financial', 'aid', 'processing'] },

    // Real Estate Templates
    { id: 'tpl_re_1', name: 'Property Listing Automation', description: 'Automate property listing creation, updates, and multi-platform syndication', category: 'Listings', industry: 'real_estate', nodes: 4, tags: ['listings', 'properties', 'syndication'] },
    { id: 'tpl_re_2', name: 'Lead Qualification Workflow', description: 'AI-powered lead qualification and automated follow-up sequences', category: 'Leads', industry: 'real_estate', nodes: 5, tags: ['leads', 'qualification', 'follow-up'] },
    { id: 'tpl_re_3', name: 'Document Management', description: 'Automate document collection, verification, and secure storage', category: 'Documents', industry: 'real_estate', nodes: 4, tags: ['documents', 'verification', 'storage'] },
    { id: 'tpl_re_4', name: 'Transaction Coordination', description: 'Streamline real estate transactions with automated milestone tracking', category: 'Transactions', industry: 'real_estate', nodes: 6, tags: ['transactions', 'coordination', 'milestones'] },

    // Legal Templates
    { id: 'tpl_legal_1', name: 'Case Management Automation', description: 'Automate case intake, document management, and deadline tracking', category: 'Case Management', industry: 'legal', nodes: 5, tags: ['cases', 'documents', 'deadlines'] },
    { id: 'tpl_legal_2', name: 'Contract Review Workflow', description: 'AI-assisted contract review and approval routing', category: 'Contracts', industry: 'legal', nodes: 4, tags: ['contracts', 'review', 'approval'] },
    { id: 'tpl_legal_3', name: 'Client Onboarding', description: 'Automate client intake, conflict checks, and engagement letter generation', category: 'Onboarding', industry: 'legal', nodes: 5, tags: ['clients', 'onboarding', 'intake'] },
    { id: 'tpl_legal_4', name: 'Billing & Time Tracking', description: 'Automated time tracking, invoice generation, and payment processing', category: 'Billing', industry: 'legal', nodes: 4, tags: ['billing', 'time', 'invoices'] },

    // General Templates (available to all industries)
    { id: 'tpl_gen_1', name: 'Customer Onboarding', description: 'Automate new customer setup with AI classification and welcome sequences', category: 'CRM', industry: 'general', nodes: 5, tags: ['customers', 'onboarding', 'crm'] },
    { id: 'tpl_gen_2', name: 'Email Campaign Automation', description: 'Automate email campaign creation, scheduling, and performance tracking', category: 'Marketing', industry: 'general', nodes: 4, tags: ['email', 'campaigns', 'marketing'] },
    { id: 'tpl_gen_3', name: 'Data Sync Pipeline', description: 'Sync data between systems with transformation and validation', category: 'Integration', industry: 'general', nodes: 4, tags: ['data', 'sync', 'integration'] },
    { id: 'tpl_gen_4', name: 'Social Media Monitor', description: 'Monitor social media mentions and create automated alerts', category: 'Social', industry: 'general', nodes: 3, tags: ['social', 'monitoring', 'alerts'] },
  ];

  // Return industry-specific templates plus general templates
  if (industry === 'general' || !industry) {
    return allTemplates.filter(t => t.industry === 'general');
  }
  return allTemplates.filter(t => t.industry === industry || t.industry === 'general');
}

export const INDUSTRIES = [
  { value: 'it', label: 'Information Technology', icon: '💻' },
  { value: 'healthcare', label: 'Healthcare & Hospital', icon: '🏥' },
  { value: 'finance', label: 'Finance & Banking', icon: '🏦' },
  { value: 'retail', label: 'Retail & E-commerce', icon: '🛍️' },
  { value: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'real_estate', label: 'Real Estate', icon: '🏢' },
  { value: 'legal', label: 'Legal Services', icon: '⚖️' },
  { value: 'marketing', label: 'Marketing & Advertising', icon: '📢' },
  { value: 'logistics', label: 'Logistics & Transportation', icon: '🚚' },
  { value: 'hospitality', label: 'Hospitality & Tourism', icon: '🏨' },
  { value: 'construction', label: 'Construction', icon: '🏗️' },
  { value: 'energy', label: 'Energy & Utilities', icon: '⚡' },
  { value: 'telecommunications', label: 'Telecommunications', icon: '📡' },
  { value: 'media', label: 'Media & Entertainment', icon: '🎬' },
  { value: 'nonprofit', label: 'Non-Profit', icon: '🤝' },
  { value: 'government', label: 'Government', icon: '🏛️' },
  { value: 'other', label: 'Other', icon: '🏢' },
];

// Create user account for existing company (admin creates user directly)
export function createUserAccount(data: { companyId: string; email: string; name: string; role?: 'company_admin' | 'user' }): { user: User; credentials: { email: string; tempPassword: string } } | null {
  const company = db.companies.find(c => c.id === data.companyId);
  if (!company) return null;
  
  // Check if email already exists
  if (db.users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) return null;
  
  // Check user limit based on plan
  const plan = db.plans.find(p => p.id === company.planId);
  const currentUsers = db.users.filter(u => u.companyId === data.companyId).length;
  if (plan && currentUsers >= plan.maxUsers) return null;
  
  const now = new Date().toISOString();
  const userId = 'usr_' + uuid().slice(0, 8);
  const tempPassword = 'AutoFlow_' + Math.random().toString(36).slice(-8);
  
  const user: User = {
    id: userId, email: data.email, name: data.name, role: data.role || 'user',
    companyId: data.companyId, status: 'active', createdAt: now, updatedAt: now,
  };
  
  db.users.push(user);
  company.userCount = db.users.filter(u => u.companyId === data.companyId).length;
  
  db.auditLogs.push({ 
    id: 'al_' + uuid().slice(0, 8), 
    actorId: 'system', 
    actorName: 'System', 
    action: 'user.created', 
    resource: 'user', 
    resourceId: userId, 
    companyId: data.companyId,
    details: { email: data.email, role: data.role },
    createdAt: now 
  });
  
  saveDB(db);
  
  return { user, credentials: { email: data.email, tempPassword } };
}
