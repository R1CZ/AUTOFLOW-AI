// AutoFlow AI - Core Type Definitions

export type Role = 'super_admin' | 'company_admin' | 'user';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type CompanyStatus = 'active' | 'inactive' | 'suspended' | 'trial' | 'pending';
export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'disabled';
export type ExecutionStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped' | 'retrying' | 'cancelled';
export type IntegrationStatus = 'connected' | 'disconnected' | 'expired' | 'error' | 'pending';
export type WebhookStatus = 'active' | 'inactive' | 'error';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trial' | 'expired';
export type PlanBilling = 'monthly' | 'annual';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  companyId: string | null;
  status: UserStatus;
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  timezone: string;
  country: string;
  adminId: string;
  status: CompanyStatus;
  planId: string;
  subscriptionStatus: SubscriptionStatus;
  userCount: number;
  workflowCount: number;
  executionCount: number;
  createdAt: string;
  updatedAt: string;
  lastActivity?: string;
}

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  maxUsers: number;
  maxWorkflows: number;
  maxExecutions: number;
  maxIntegrations: number;
  maxWebhooks: number;
  aiCredits: number;
  features: string[];
  isActive: boolean;
  isTrial: boolean;
  trialDays: number;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'branch' | 'integration' | 'ai_action' | 'transform' | 'approval' | 'exception' | 'delay' | 'notification';
  label: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface WorkflowConnection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  companyId: string;
  createdById: string;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  triggerType?: string;
  lastExecuted?: string;
  executionCount: number;
  successCount: number;
  failCount: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Execution {
  id: string;
  workflowId: string;
  workflowName: string;
  companyId: string;
  status: ExecutionStatus;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  triggerType: string;
  triggeredBy: string;
  nodesExecuted: number;
  totalNodes: number;
  logs: ExecutionLog[];
  error?: string;
}

export interface ExecutionLog {
  nodeId: string;
  nodeLabel: string;
  status: 'success' | 'failed' | 'skipped';
  timestamp: string;
  duration: number;
  input?: any;
  output?: any;
  error?: string;
}

export interface Integration {
  id: string;
  companyId: string;
  provider: string;
  name: string;
  status: IntegrationStatus;
  icon: string;
  category: string;
  connectedAt?: string;
  lastSync?: string;
  config: Record<string, any>;
}

export interface Webhook {
  id: string;
  companyId: string;
  name: string;
  url: string;
  secret: string;
  status: WebhookStatus;
  events: string[];
  lastTriggered?: string;
  successCount: number;
  failCount: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  companyId?: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  companyId: string;
  planId: string;
  status: SubscriptionStatus;
  billingCycle: PlanBilling;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  amount: number;
  createdAt: string;
}

export interface Invoice {
  id: string;
  companyId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  paidAt?: string;
  createdAt: string;
  items: { description: string; amount: number }[];
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  resource: string;
  resourceId: string;
  companyId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface PlatformSettings {
  maintenanceMode: boolean;
  companySelfSignup: boolean;
  maxCompanies: number;
  defaultTrialDays: number;
  platformName: string;
  supportEmail: string;
  payoutBank?: string;
  payoutAccountMasked?: string;
  payoutStatus: 'active' | 'pending' | 'suspended';
  paymentProvider: string;
  paymentProviderStatus: 'connected' | 'disconnected' | 'pending';
}

export interface Usage {
  companyId: string;
  executions: number;
  workflows: number;
  users: number;
  integrations: number;
  webhooks: number;
  aiCredits: number;
  storageMb: number;
}
