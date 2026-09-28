import type { WorkflowNode, WorkflowConnection } from '../types';

// Helper functions
function n(id: string, type: WorkflowNode['type'], label: string, config: Record<string, any>, x: number, y: number): WorkflowNode {
  return { id, type, label, config, position: { x, y } };
}

function c(id: string, sourceId: string, targetId: string, label?: string): WorkflowConnection {
  return { id, sourceId, targetId, label };
}

export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
}

// ============================================================================
// IT & TECHNOLOGY TEMPLATES
// ============================================================================
export const itTemplates: AutomationTemplate[] = [
  {
    id: 'it_001',
    name: 'IT Support Ticket Auto-Routing',
    description: 'Automatically classify and route IT support tickets to the appropriate team based on priority, category, and skill requirements using AI analysis.',
    category: 'IT Support',
    industry: 'it',
    tags: ['ticketing', 'routing', 'ai', 'support', 'automation'],
    difficulty: 'intermediate',
    nodes: [
      n('n1', 'trigger', 'New Ticket Webhook', { source: 'webhook', endpoint: '/tickets/new' }, 100, 200),
      n('n2', 'ai_action', 'Classify Ticket', { model: 'gpt-4', prompt: 'Analyze this IT support ticket and classify by: category (hardware/software/network/security/other), priority (low/medium/high/critical), and required skill level. Output JSON format.', inputField: 'ticket_content' }, 300, 200),
      n('n3', 'condition', 'Priority Check', { field: 'priority', operator: 'equals', value: 'critical' }, 500, 200),
      n('n4', 'action', 'Assign to Senior Team', { template: 'assign_team', team: 'senior_support', sla: '1h' }, 700, 100),
      n('n5', 'condition', 'Category Check', { field: 'category', operator: 'equals', value: 'network' }, 700, 300),
      n('n6', 'action', 'Assign to Network Team', { template: 'assign_team', team: 'network_support', sla: '4h' }, 900, 250),
      n('n7', 'action', 'Assign to General Support', { template: 'assign_team', team: 'general_support', sla: '8h' }, 900, 350),
      n('n8', 'notification', 'Notify Assignee', { channel: 'slack', template: 'ticket_assigned', includeTicket: true }, 1100, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4', 'Critical'),
      c('c4', 'n3', 'n5', 'Normal'),
      c('c5', 'n5', 'n6', 'Network'),
      c('c6', 'n5', 'n7', 'Other'),
      c('c7', 'n4', 'n8'),
      c('c8', 'n6', 'n8'),
      c('c9', 'n7', 'n8'),
    ]
  },
  {
    id: 'it_002',
    name: 'Server Health Monitoring & Auto-Remediation',
    description: 'Monitor server health metrics continuously, detect anomalies using AI, and trigger automated remediation actions for common issues.',
    category: 'Monitoring',
    industry: 'it',
    tags: ['monitoring', 'servers', 'ai', 'remediation', 'alerts'],
    difficulty: 'advanced',
    nodes: [
      n('n1', 'trigger', 'Scheduled Check', { source: 'schedule', interval: '5m' }, 100, 200),
      n('n2', 'integration', 'Collect Metrics', { provider: 'datadog', action: 'get_metrics', metrics: ['cpu', 'memory', 'disk', 'network'] }, 300, 200),
      n('n3', 'ai_action', 'Analyze Health', { model: 'gpt-4', prompt: 'Analyze these server metrics and identify any anomalies or potential issues. Provide risk assessment and recommended actions.', inputField: 'metrics_data' }, 500, 200),
      n('n4', 'condition', 'Critical Issue?', { field: 'risk_level', operator: 'equals', value: 'critical' }, 700, 200),
      n('n5', 'action', 'Auto-Remediation', { template: 'run_remediation', script: 'auto_fix_common_issues.sh' }, 900, 100),
      n('n6', 'notification', 'Alert On-Call', { channel: 'pagerduty', severity: 'critical', includeMetrics: true }, 900, 300),
      n('n7', 'action', 'Create Incident', { template: 'create_incident', system: 'servicenow' }, 1100, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4'),
      c('c4', 'n4', 'n5', 'Yes'),
      c('c5', 'n4', 'n6', 'No'),
      c('c6', 'n5', 'n7'),
      c('c7', 'n6', 'n7'),
    ]
  },
  {
    id: 'it_003',
    name: 'Employee Onboarding Automation',
    description: 'Complete IT onboarding workflow for new employees including account creation, access provisioning, equipment ordering, and welcome communications.',
    category: 'Onboarding',
    industry: 'it',
    tags: ['onboarding', 'provisioning', 'automation', 'hr'],
    difficulty: 'intermediate',
    nodes: [
      n('n1', 'trigger', 'New Hire Form', { source: 'form', formId: 'new_hire_request' }, 100, 200),
      n('n2', 'action', 'Create Email Account', { template: 'create_email', domain: 'company.com' }, 300, 200),
      n('n3', 'integration', 'Setup AD Account', { provider: 'active_directory', action: 'create_user', groups: ['all_employees', 'department_group'] }, 500, 200),
      n('n4', 'action', 'Assign Software Licenses', { template: 'assign_licenses', software: ['office365', 'slack', 'jira'] }, 700, 200),
      n('n5', 'action', 'Order Equipment', { template: 'create_purchase_order', items: ['laptop', 'monitor', 'accessories'] }, 900, 200),
      n('n6', 'notification', 'Send Welcome Email', { channel: 'email', template: 'employee_welcome', includeCredentials: true }, 1100, 200),
      n('n7', 'action', 'Create Jira Ticket', { template: 'create_ticket', project: 'IT', type: 'onboarding', assignee: 'it_manager' }, 1300, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4'),
      c('c4', 'n4', 'n5'),
      c('c5', 'n5', 'n6'),
      c('c6', 'n6', 'n7'),
    ]
  },
  {
    id: 'it_004',
    name: 'Security Incident Response',
    description: 'Automated security incident detection, analysis, containment, and response workflow with AI-powered threat assessment.',
    category: 'Security',
    industry: 'it',
    tags: ['security', 'incident', 'ai', 'response', 'threat'],
    difficulty: 'advanced',
    nodes: [
      n('n1', 'trigger', 'Security Alert', { source: 'webhook', source_system: 'siem' }, 100, 200),
      n('n2', 'ai_action', 'Threat Analysis', { model: 'gpt-4', prompt: 'Analyze this security alert and determine: threat_level (low/medium/high/critical), attack_type, affected_systems, and recommended_response.', inputField: 'alert_data' }, 300, 200),
      n('n3', 'condition', 'Threat Level', { field: 'threat_level', operator: 'equals', value: 'critical' }, 500, 200),
      n('n4', 'action', 'Isolate System', { template: 'isolate_system', auto: true }, 700, 100),
      n('n5', 'action', 'Block IP Addresses', { template: 'block_ips', source: 'alert_data' }, 700, 300),
      n('n6', 'notification', 'Alert Security Team', { channel: 'pagerduty', severity: 'critical', escalate: true }, 900, 100),
      n('n7', 'action', 'Create Incident Ticket', { template: 'create_security_incident', priority: 'P1' }, 900, 300),
      n('n8', 'action', 'Collect Forensics', { template: 'collect_forensics', systems: 'affected' }, 1100, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4', 'Critical'),
      c('c4', 'n3', 'n5', 'Other'),
      c('c5', 'n4', 'n6'),
      c('c6', 'n5', 'n7'),
      c('c7', 'n6', 'n8'),
      c('c8', 'n7', 'n8'),
    ]
  },
  {
    id: 'it_005',
    name: 'Automated Backup Verification',
    description: 'Verify backup integrity, test restore procedures, and generate compliance reports for backup systems.',
    category: 'Backup',
    industry: 'it',
    tags: ['backup', 'verification', 'compliance', 'reporting'],
    difficulty: 'intermediate',
    nodes: [
      n('n1', 'trigger', 'Daily Schedule', { source: 'schedule', cron: '0 6 * * *' }, 100, 200),
      n('n2', 'integration', 'Check Backup Status', { provider: 'veeam', action: 'get_backup_jobs', timeframe: '24h' }, 300, 200),
      n('n3', 'condition', 'All Backups Successful?', { field: 'status', operator: 'equals', value: 'success' }, 500, 200),
      n('n4', 'action', 'Test Restore', { template: 'test_restore', sample_data: true }, 700, 100),
      n('n5', 'notification', 'Alert on Failure', { channel: 'email', template: 'backup_failed', recipients: 'it_team' }, 700, 300),
      n('n6', 'action', 'Generate Report', { template: 'generate_backup_report', format: 'pdf' }, 900, 200),
      n('n7', 'integration', 'Upload to Compliance', { provider: 'sharepoint', action: 'upload_document', folder: 'compliance/backups' }, 1100, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4', 'Yes'),
      c('c4', 'n3', 'n5', 'No'),
      c('c5', 'n4', 'n6'),
      c('c6', 'n6', 'n7'),
    ]
  },
  {
    id: 'it_006',
    name: 'API Performance Monitoring',
    description: 'Monitor API endpoints, detect performance degradation, and automatically scale resources or alert teams.',
    category: 'Monitoring',
    industry: 'it',
    tags: ['api', 'monitoring', 'performance', 'scaling'],
    difficulty: 'advanced',
    nodes: [
      n('n1', 'trigger', 'Scheduled Check', { source: 'schedule', interval: '1m' }, 100, 200),
      n('n2', 'integration', 'Test API Endpoints', { provider: 'custom', action: 'api_health_check', endpoints: 'all' }, 300, 200),
      n('n3', 'ai_action', 'Analyze Performance', { model: 'gpt-4', prompt: 'Analyze API response times and error rates. Identify performance degradation patterns and recommend scaling actions.', inputField: 'api_metrics' }, 500, 200),
      n('n4', 'condition', 'Performance Issue?', { field: 'degradation_detected', operator: 'equals', value: 'true' }, 700, 200),
      n('n5', 'action', 'Auto-Scale Resources', { template: 'scale_resources', direction: 'up', increment: '20%' }, 900, 100),
      n('n6', 'notification', 'Alert DevOps', { channel: 'slack', channel_name: '#devops-alerts', includeMetrics: true }, 900, 300),
      n('n7', 'action', 'Create Incident', { template: 'create_incident', system: 'pagerduty' }, 1100, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4'),
      c('c4', 'n4', 'n5', 'Yes'),
      c('c5', 'n4', 'n6', 'No'),
      c('c6', 'n5', 'n7'),
      c('c7', 'n6', 'n7'),
    ]
  },
  {
    id: 'it_007',
    name: 'Password Expiry Notification',
    description: 'Monitor password expiry dates and send automated notifications to users before passwords expire.',
    category: 'Security',
    industry: 'it',
    tags: ['password', 'security', 'notifications', 'compliance'],
    difficulty: 'beginner',
    nodes: [
      n('n1', 'trigger', 'Daily Schedule', { source: 'schedule', cron: '0 9 * * *' }, 100, 200),
      n('n2', 'integration', 'Check Password Expiry', { provider: 'active_directory', action: 'get_password_expiry', days_ahead: 14 }, 300, 200),
      n('n3', 'condition', 'Expiring Soon?', { field: 'days_until_expiry', operator: 'lte', value: '14' }, 500, 200),
      n('n4', 'notification', 'Send Reminder Email', { channel: 'email', template: 'password_expiry_reminder', includeResetLink: true }, 700, 200),
      n('n5', 'action', 'Log Notification', { template: 'log_activity', type: 'password_reminder_sent' }, 900, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4', 'Yes'),
      c('c4', 'n4', 'n5'),
    ]
  },
  {
    id: 'it_008',
    name: 'Software License Compliance',
    description: 'Track software license usage, detect over-utilization, and generate compliance reports.',
    category: 'Compliance',
    industry: 'it',
    tags: ['license', 'compliance', 'reporting', 'audit'],
    difficulty: 'intermediate',
    nodes: [
      n('n1', 'trigger', 'Weekly Schedule', { source: 'schedule', cron: '0 8 * * 1' }, 100, 200),
      n('n2', 'integration', 'Collect License Data', { provider: 'custom', action: 'get_license_usage', software: 'all' }, 300, 200),
      n('n3', 'ai_action', 'Analyze Compliance', { model: 'gpt-4', prompt: 'Analyze software license usage data and identify compliance issues, over-utilization, or under-utilization.', inputField: 'license_data' }, 500, 200),
      n('n4', 'condition', 'Compliance Issue?', { field: 'compliance_status', operator: 'equals', value: 'non_compliant' }, 700, 200),
      n('n5', 'notification', 'Alert IT Manager', { channel: 'email', template: 'license_compliance_alert', includeReport: true }, 900, 100),
      n('n6', 'action', 'Generate Report', { template: 'generate_license_report', format: 'excel' }, 900, 300),
      n('n7', 'integration', 'Upload to SharePoint', { provider: 'sharepoint', action: 'upload', folder: 'compliance/licenses' }, 1100, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4'),
      c('c4', 'n4', 'n5', 'Yes'),
      c('c5', 'n4', 'n6', 'No'),
      c('c6', 'n5', 'n7'),
      c('c7', 'n6', 'n7'),
    ]
  },
  {
    id: 'it_009',
    name: 'Automated Patch Management',
    description: 'Scan for available patches, test in staging environment, and deploy to production with approval workflow.',
    category: 'Maintenance',
    industry: 'it',
    tags: ['patch', 'maintenance', 'deployment', 'approval'],
    difficulty: 'advanced',
    nodes: [
      n('n1', 'trigger', 'Monthly Schedule', { source: 'schedule', cron: '0 2 1 * *' }, 100, 200),
      n('n2', 'integration', 'Scan for Patches', { provider: 'wsus', action: 'scan_updates', target: 'all_servers' }, 300, 200),
      n('n3', 'action', 'Deploy to Staging', { template: 'deploy_patches', environment: 'staging', auto_reboot: true }, 500, 200),
      n('n4', 'delay', 'Wait 24 Hours', { duration: 24, unit: 'hours' }, 700, 200),
      n('n5', 'integration', 'Check Staging Health', { provider: 'datadog', action: 'health_check', environment: 'staging' }, 900, 200),
      n('n6', 'condition', 'Staging Healthy?', { field: 'health_status', operator: 'equals', value: 'healthy' }, 1100, 200),
      n('n7', 'approval', 'Manager Approval', { approver: 'it_manager', message: 'Approve production patch deployment?' }, 1300, 100),
      n('n8', 'action', 'Deploy to Production', { template: 'deploy_patches', environment: 'production', maintenance_window: true }, 1500, 100),
      n('n9', 'notification', 'Notify Teams', { channel: 'slack', template: 'patch_deployment_complete' }, 1700, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4'),
      c('c4', 'n4', 'n5'),
      c('c5', 'n5', 'n6'),
      c('c6', 'n6', 'n7', 'Yes'),
      c('c7', 'n7', 'n8'),
      c('c8', 'n8', 'n9'),
    ]
  },
  {
    id: 'it_010',
    name: 'IT Asset Inventory Sync',
    description: 'Synchronize IT asset inventory across multiple systems and generate reconciliation reports.',
    category: 'Asset Management',
    industry: 'it',
    tags: ['assets', 'inventory', 'sync', 'reporting'],
    difficulty: 'intermediate',
    nodes: [
      n('n1', 'trigger', 'Daily Schedule', { source: 'schedule', cron: '0 3 * * *' }, 100, 200),
      n('n2', 'integration', 'Pull from ServiceNow', { provider: 'servicenow', action: 'get_assets', table: 'cmdb_ci' }, 300, 150),
      n('n3', 'integration', 'Pull from Active Directory', { provider: 'active_directory', action: 'get_computers' }, 300, 250),
      n('n4', 'transform', 'Merge Data', { mapping: { primary_key: 'asset_tag', merge_strategy: 'union' } }, 500, 200),
      n('n5', 'ai_action', 'Identify Discrepancies', { model: 'gpt-4', prompt: 'Compare asset data from multiple sources and identify discrepancies, missing assets, or duplicates.', inputField: 'merged_data' }, 700, 200),
      n('n6', 'action', 'Generate Report', { template: 'generate_asset_report', format: 'excel', include_discrepancies: true }, 900, 200),
      n('n7', 'notification', 'Email Report', { channel: 'email', template: 'asset_inventory_report', recipients: 'it_management' }, 1100, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n1', 'n3'),
      c('c3', 'n2', 'n4'),
      c('c4', 'n3', 'n4'),
      c('c5', 'n4', 'n5'),
      c('c6', 'n5', 'n6'),
      c('c7', 'n6', 'n7'),
    ]
  },
];

// ============================================================================
// HEALTHCARE TEMPLATES
// ============================================================================
export const healthcareTemplates: AutomationTemplate[] = [
  {
    id: 'health_001',
    name: 'Patient Appointment Reminder System',
    description: 'Send automated appointment reminders via SMS and email, handle confirmations, and manage no-shows.',
    category: 'Scheduling',
    industry: 'healthcare',
    tags: ['appointments', 'reminders', 'sms', 'email', 'patients'],
    difficulty: 'intermediate',
    nodes: [
      n('n1', 'trigger', 'Daily Schedule', { source: 'schedule', cron: '0 8 * * *' }, 100, 200),
      n('n2', 'integration', 'Get Tomorrow Appointments', { provider: 'epic', action: 'get_appointments', date: 'tomorrow' }, 300, 200),
      n('n3', 'transform', 'Format Patient Data', { mapping: { phone: 'patient_phone', email: 'patient_email', name: 'patient_name', time: 'appointment_time' } }, 500, 200),
      n('n4', 'action', 'Send SMS Reminder', { template: 'send_sms', template_id: 'appointment_reminder', recipient: 'phone' }, 700, 150),
      n('n5', 'action', 'Send Email Reminder', { template: 'send_email', template_id: 'appointment_reminder', recipient: 'email' }, 700, 250),
      n('n6', 'delay', 'Wait 24 Hours', { duration: 24, unit: 'hours' }, 900, 200),
      n('n7', 'condition', 'Confirmed?', { field: 'confirmation_status', operator: 'equals', value: 'confirmed' }, 1100, 200),
      n('n8', 'action', 'Mark as No-Show', { template: 'update_appointment', status: 'no_show' }, 1300, 100),
      n('n9', 'notification', 'Notify Staff', { channel: 'internal', message: 'Patient no-show detected' }, 1300, 300),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4'),
      c('c4', 'n3', 'n5'),
      c('c5', 'n4', 'n6'),
      c('c6', 'n5', 'n6'),
      c('c7', 'n6', 'n7'),
      c('c8', 'n7', 'n8', 'No'),
      c('c9', 'n7', 'n9', 'No'),
    ]
  },
  {
    id: 'health_002',
    name: 'Lab Results Notification Workflow',
    description: 'Process lab results, notify patients and physicians, and handle critical value alerts.',
    category: 'Lab',
    industry: 'healthcare',
    tags: ['lab', 'results', 'notifications', 'critical', 'hipaa'],
    difficulty: 'advanced',
    nodes: [
      n('n1', 'trigger', 'Lab Result Webhook', { source: 'webhook', source_system: 'lab_system' }, 100, 200),
      n('n2', 'ai_action', 'Analyze Results', { model: 'gpt-4', prompt: 'Analyze lab results and identify critical values, abnormal results, or trends requiring attention.', inputField: 'lab_results' }, 300, 200),
      n('n3', 'condition', 'Critical Value?', { field: 'result_status', operator: 'equals', value: 'critical' }, 500, 200),
      n('n4', 'notification', 'STAT Alert to Physician', { channel: 'pager', priority: 'stat', include_results: true }, 700, 100),
      n('n5', 'action', 'Notify Patient Portal', { template: 'post_to_patient_portal', message_type: 'lab_results', require_acknowledgment: true }, 700, 300),
      n('n6', 'action', 'Update EHR', { template: 'update_ehr_record', record_type: 'lab_results' }, 900, 200),
      n('n7', 'action', 'Log Compliance', { template: 'log_hipaa_activity', action_type: 'result_notification' }, 1100, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4', 'Yes'),
      c('c4', 'n3', 'n5', 'No'),
      c('c5', 'n4', 'n6'),
      c('c6', 'n5', 'n6'),
      c('c7', 'n6', 'n7'),
    ]
  },
  {
    id: 'health_003',
    name: 'Patient Intake Form Processing',
    description: 'Process digital intake forms, validate insurance, create patient records, and schedule appointments.',
    category: 'Intake',
    industry: 'healthcare',
    tags: ['intake', 'forms', 'insurance', 'scheduling', 'ehr'],
    difficulty: 'intermediate',
    nodes: [
      n('n1', 'trigger', 'Form Submission', { source: 'webhook', form_type: 'patient_intake' }, 100, 200),
      n('n2', 'ai_action', 'Validate Form Data', { model: 'gpt-4', prompt: 'Validate patient intake form data for completeness and accuracy. Check for missing required fields or invalid data.', inputField: 'form_data' }, 300, 200),
      n('n3', 'condition', 'Valid?', { field: 'validation_status', operator: 'equals', value: 'valid' }, 500, 200),
      n('n4', 'integration', 'Verify Insurance', { provider: 'insurance_api', action: 'verify_coverage', patient_id: 'new' }, 700, 100),
      n('n5', 'notification', 'Request Corrections', { channel: 'email', template: 'form_correction_needed', recipient: 'patient_email' }, 700, 300),
      n('n6', 'action', 'Create Patient Record', { template: 'create_ehr_record', source: 'intake_form' }, 900, 200),
      n('n7', 'action', 'Schedule Appointment', { template: 'create_appointment', type: 'new_patient', duration: '60min' }, 1100, 200),
      n('n8', 'notification', 'Send Confirmation', { channel: 'email', template: 'appointment_confirmation', include_details: true }, 1300, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4', 'Yes'),
      c('c4', 'n3', 'n5', 'No'),
      c('c5', 'n4', 'n6'),
      c('c6', 'n6', 'n7'),
      c('c7', 'n7', 'n8'),
    ]
  },
  {
    id: 'health_004',
    name: 'Medication Refill Request Automation',
    description: 'Process medication refill requests, verify with physician, check insurance coverage, and notify pharmacy.',
    category: 'Pharmacy',
    industry: 'healthcare',
    tags: ['medication', 'refill', 'pharmacy', 'insurance', 'approval'],
    difficulty: 'intermediate',
    nodes: [
      n('n1', 'trigger', 'Refill Request', { source: 'patient_portal', action: 'medication_refill' }, 100, 200),
      n('n2', 'ai_action', 'Verify Request', { model: 'gpt-4', prompt: 'Verify medication refill request: check if medication is active, last refill date, and patient eligibility.', inputField: 'refill_request' }, 300, 200),
      n('n3', 'condition', 'Requires Approval?', { field: 'requires_approval', operator: 'equals', value: 'true' }, 500, 200),
      n('n4', 'approval', 'Physician Approval', { approver: 'assigned_physician', message: 'Approve medication refill?' }, 700, 100),
      n('n5', 'integration', 'Check Insurance', { provider: 'insurance_api', action: 'check_formulary', medication_id: 'request' }, 700, 300),
      n('n6', 'action', 'Send to Pharmacy', { template: 'send_prescription', pharmacy_id: 'patient_preferred' }, 900, 200),
      n('n7', 'notification', 'Notify Patient', { channel: 'sms', template: 'refill_processed', include_pickup_info: true }, 1100, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4', 'Yes'),
      c('c4', 'n3', 'n5', 'No'),
      c('c5', 'n4', 'n6'),
      c('c6', 'n5', 'n6'),
      c('c7', 'n6', 'n7'),
    ]
  },
  {
    id: 'health_005',
    name: 'Patient Discharge Summary Generation',
    description: 'Automatically generate discharge summaries from EHR data, send to patient and PCP, and update records.',
    category: 'Documentation',
    industry: 'healthcare',
    tags: ['discharge', 'summary', 'documentation', 'ehr', 'hipaa'],
    difficulty: 'advanced',
    nodes: [
      n('n1', 'trigger', 'Discharge Event', { source: 'ehr', event: 'patient_discharged' }, 100, 200),
      n('n2', 'integration', 'Collect Patient Data', { provider: 'epic', action: 'get_patient_summary', include: ['diagnoses', 'medications', 'procedures', 'notes'] }, 300, 200),
      n('n3', 'ai_action', 'Generate Summary', { model: 'gpt-4', prompt: 'Generate a comprehensive discharge summary including: admission diagnosis, hospital course, discharge diagnosis, medications, follow-up instructions, and patient education.', inputField: 'patient_data' }, 500, 200),
      n('n4', 'approval', 'Physician Review', { approver: 'attending_physician', message: 'Review and approve discharge summary' }, 700, 200),
      n('n5', 'action', 'Update EHR', { template: 'add_to_ehr', document_type: 'discharge_summary' }, 900, 100),
      n('n6', 'action', 'Send to Patient', { template: 'send_patient_portal_message', document: 'discharge_summary', secure: true }, 900, 300),
      n('n7', 'action', 'Notify PCP', { template: 'send_to_pcp', method: 'fax', include_summary: true }, 1100, 200),
      n('n8', 'action', 'Log Activity', { template: 'log_hipaa_activity', action: 'discharge_summary_sent' }, 1300, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4'),
      c('c4', 'n4', 'n5'),
      c('c5', 'n4', 'n6'),
      c('c6', 'n5', 'n7'),
      c('c7', 'n6', 'n7'),
      c('c8', 'n7', 'n8'),
    ]
  },
];

// ============================================================================
// FINANCE TEMPLATES
// ============================================================================
export const financeTemplates: AutomationTemplate[] = [
  {
    id: 'fin_001',
    name: 'Invoice Processing & Approval Workflow',
    description: 'Automate invoice receipt, AI-powered data extraction, validation, approval routing, and payment processing.',
    category: 'Accounts Payable',
    industry: 'finance',
    tags: ['invoices', 'approval', 'payment', 'ai', 'ocr'],
    difficulty: 'advanced',
    nodes: [
      n('n1', 'trigger', 'Invoice Received', { source: 'email', filter: 'subject:invoice' }, 100, 200),
      n('n2', 'ai_action', 'Extract Invoice Data', { model: 'gpt-4-vision', prompt: 'Extract invoice data including: vendor name, invoice number, date, line items, totals, tax, and payment terms. Output as structured JSON.', inputField: 'invoice_image' }, 300, 200),
      n('n3', 'action', 'Validate Invoice', { template: 'validate_invoice', checks: ['duplicate_check', 'vendor_verification', 'amount_validation'] }, 500, 200),
      n('n4', 'condition', 'Amount Threshold', { field: 'invoice_total', operator: 'gte', value: '5000' }, 700, 200),
      n('n5', 'approval', 'Manager Approval', { approver: 'finance_manager', message: 'Approve invoice payment?' }, 900, 100),
      n('n6', 'approval', 'Director Approval', { approver: 'finance_director', message: 'High-value invoice approval required' }, 900, 300),
      n('n7', 'action', 'Schedule Payment', { template: 'schedule_payment', method: 'ach', terms: 'net_30' }, 1100, 200),
      n('n8', 'integration', 'Update Accounting', { provider: 'quickbooks', action: 'create_bill', sync: true }, 1300, 200),
      n('n9', 'notification', 'Notify AP Team', { channel: 'email', template: 'invoice_processed', include_details: true }, 1500, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4'),
      c('c4', 'n4', 'n5', '< $5000'),
      c('c5', 'n4', 'n6', '>= $5000'),
      c('c6', 'n5', 'n7'),
      c('c7', 'n6', 'n7'),
      c('c8', 'n7', 'n8'),
      c('c9', 'n8', 'n9'),
    ]
  },
  {
    id: 'fin_002',
    name: 'Expense Report Auto-Approval',
    description: 'Automate expense report submission, policy validation, AI-powered fraud detection, and approval routing.',
    category: 'Expenses',
    industry: 'finance',
    tags: ['expenses', 'approval', 'policy', 'ai', 'fraud'],
    difficulty: 'intermediate',
    nodes: [
      n('n1', 'trigger', 'Expense Submitted', { source: 'webhook', system: 'expense_system' }, 100, 200),
      n('n2', 'ai_action', 'Validate Policy', { model: 'gpt-4', prompt: 'Validate expense report against company policy: check receipts, amounts, categories, and business purpose. Flag any violations.', inputField: 'expense_data' }, 300, 200),
      n('n3', 'ai_action', 'Fraud Detection', { model: 'gpt-4', prompt: 'Analyze expense patterns for potential fraud: duplicate submissions, unusual amounts, policy violations, or suspicious patterns.', inputField: 'expense_history' }, 300, 300),
      n('n4', 'condition', 'Policy Violation?', { field: 'policy_compliant', operator: 'equals', value: 'false' }, 500, 200),
      n('n5', 'condition', 'Fraud Flag?', { field: 'fraud_score', operator: 'gte', value: '0.7' }, 500, 300),
      n('n6', 'notification', 'Request Correction', { channel: 'email', template: 'expense_correction_needed', recipient: 'employee' }, 700, 100),
      n('n7', 'notification', 'Alert Finance', { channel: 'email', template: 'fraud_alert', recipients: 'finance_team', priority: 'high' }, 700, 300),
      n('n8', 'approval', 'Manager Approval', { approver: 'direct_manager', message: 'Approve expense report?' }, 900, 200),
      n('n9', 'action', 'Process Reimbursement', { template: 'process_payment', method: 'payroll' }, 1100, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n1', 'n3'),
      c('c3', 'n2', 'n4'),
      c('c4', 'n3', 'n5'),
      c('c5', 'n4', 'n6', 'Yes'),
      c('c6', 'n5', 'n7', 'Yes'),
      c('c7', 'n4', 'n8', 'No'),
      c('c8', 'n5', 'n8', 'No'),
      c('c9', 'n8', 'n9'),
    ]
  },
  {
    id: 'fin_003',
    name: 'Financial Close Automation',
    description: 'Automate month-end financial close processes including reconciliation, journal entries, and reporting.',
    category: 'Accounting',
    industry: 'finance',
    tags: ['close', 'reconciliation', 'reporting', 'automation'],
    difficulty: 'advanced',
    nodes: [
      n('n1', 'trigger', 'Month-End Schedule', { source: 'schedule', cron: '0 0 1 * *' }, 100, 200),
      n('n2', 'integration', 'Pull Bank Statements', { provider: 'banking_api', action: 'get_statements', period: 'last_month' }, 300, 200),
      n('n3', 'integration', 'Get Ledger Data', { provider: 'quickbooks', action: 'get_general_ledger', period: 'last_month' }, 300, 300),
      n('n4', 'action', 'Bank Reconciliation', { template: 'reconcile_accounts', method: 'automated', tolerance: '0.01' }, 500, 200),
      n('n5', 'ai_action', 'Identify Discrepancies', { model: 'gpt-4', prompt: 'Analyze reconciliation results and identify discrepancies, missing transactions, or unusual patterns requiring investigation.', inputField: 'reconciliation_data' }, 700, 200),
      n('n6', 'condition', 'Discrepancies Found?', { field: 'discrepancy_count', operator: 'gt', value: '0' }, 900, 200),
      n('n7', 'notification', 'Alert Accounting Team', { channel: 'email', template: 'reconciliation_discrepancies', include_report: true }, 1100, 100),
      n('n8', 'action', 'Generate Close Report', { template: 'generate_financial_report', type: 'month_end_close', format: 'excel' }, 1100, 300),
      n('n9', 'approval', 'Controller Approval', { approver: 'controller', message: 'Approve month-end close?' }, 1300, 200),
      n('n10', 'action', 'Post Journal Entries', { template: 'post_journal_entries', auto_generated: true }, 1500, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n1', 'n3'),
      c('c3', 'n2', 'n4'),
      c('c4', 'n3', 'n4'),
      c('c5', 'n4', 'n5'),
      c('c6', 'n5', 'n6'),
      c('c7', 'n6', 'n7', 'Yes'),
      c('c8', 'n6', 'n8', 'No'),
      c('c9', 'n7', 'n9'),
      c('c10', 'n8', 'n9'),
      c('c11', 'n9', 'n10'),
    ]
  },
  {
    id: 'fin_004',
    name: 'Fraud Detection & Alert System',
    description: 'Monitor transactions in real-time, detect fraudulent patterns using AI, and trigger immediate alerts.',
    category: 'Security',
    industry: 'finance',
    tags: ['fraud', 'detection', 'ai', 'monitoring', 'alerts'],
    difficulty: 'advanced',
    nodes: [
      n('n1', 'trigger', 'Transaction Event', { source: 'webhook', system: 'payment_processor' }, 100, 200),
      n('n2', 'ai_action', 'Analyze Transaction', { model: 'gpt-4', prompt: 'Analyze this transaction for fraud indicators: unusual amount, location, frequency, merchant category, and customer behavior patterns. Provide risk score 0-1.', inputField: 'transaction_data' }, 300, 200),
      n('n3', 'condition', 'High Risk?', { field: 'fraud_score', operator: 'gte', value: '0.8' }, 500, 200),
      n('n4', 'action', 'Block Transaction', { template: 'block_transaction', reason: 'fraud_suspected' }, 700, 100),
      n('n5', 'notification', 'Alert Fraud Team', { channel: 'pagerduty', severity: 'critical', include_transaction: true }, 700, 300),
      n('n6', 'action', 'Flag Account', { template: 'flag_account', status: 'under_review', notify_customer: true }, 900, 200),
      n('n7', 'action', 'Create Case', { template: 'create_fraud_case', priority: 'high', assign_to: 'fraud_team' }, 1100, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4', 'Yes'),
      c('c4', 'n3', 'n5', 'Yes'),
      c('c5', 'n4', 'n6'),
      c('c6', 'n5', 'n6'),
      c('c7', 'n6', 'n7'),
    ]
  },
];

// ============================================================================
// RETAIL & E-COMMERCE TEMPLATES
// ============================================================================
export const retailTemplates: AutomationTemplate[] = [
  {
    id: 'ret_001',
    name: 'Order Fulfillment Automation',
    description: 'Automate order processing, inventory allocation, shipping label generation, and customer notifications.',
    category: 'Order Management',
    industry: 'retail',
    tags: ['orders', 'fulfillment', 'shipping', 'inventory', 'notifications'],
    difficulty: 'intermediate',
    nodes: [
      n('n1', 'trigger', 'New Order', { source: 'webhook', system: 'shopify' }, 100, 200),
      n('n2', 'action', 'Allocate Inventory', { template: 'reserve_inventory', items: 'order_items', warehouse: 'nearest' }, 300, 200),
      n('n3', 'condition', 'In Stock?', { field: 'inventory_status', operator: 'equals', value: 'available' }, 500, 200),
      n('n4', 'action', 'Generate Shipping Label', { template: 'create_shipping_label', carrier: 'auto_select', service: 'ground' }, 700, 100),
      n('n5', 'notification', 'Notify Warehouse', { channel: 'internal', template: 'pick_pack_ship', include_label: true }, 700, 300),
      n('n6', 'notification', 'Send Confirmation', { channel: 'email', template: 'order_confirmed', include_tracking: false }, 900, 200),
      n('n7', 'action', 'Update Order Status', { template: 'update_order', status: 'processing' }, 1100, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4', 'Yes'),
      c('c4', 'n3', 'n5', 'Yes'),
      c('c5', 'n4', 'n6'),
      c('c6', 'n5', 'n6'),
      c('c7', 'n6', 'n7'),
    ]
  },
  {
    id: 'ret_002',
    name: 'Abandoned Cart Recovery',
    description: 'Detect abandoned carts, send recovery emails with personalized offers, and track conversion rates.',
    category: 'Marketing',
    industry: 'retail',
    tags: ['cart', 'recovery', 'email', 'marketing', 'conversion'],
    difficulty: 'intermediate',
    nodes: [
      n('n1', 'trigger', 'Cart Abandoned', { source: 'webhook', system: 'ecommerce', event: 'cart_abandoned', timeout: '1h' }, 100, 200),
      n('n2', 'ai_action', 'Personalize Offer', { model: 'gpt-4', prompt: 'Generate personalized cart recovery message and discount offer based on cart contents, customer history, and purchase patterns.', inputField: 'cart_data' }, 300, 200),
      n('n3', 'action', 'Send Recovery Email', { template: 'send_email', template_id: 'cart_recovery', include_discount: true }, 500, 200),
      n('n4', 'delay', 'Wait 24 Hours', { duration: 24, unit: 'hours' }, 700, 200),
      n('n5', 'condition', 'Purchased?', { field: 'conversion_status', operator: 'equals', value: 'converted' }, 900, 200),
      n('n6', 'action', 'Send Follow-up', { template: 'send_email', template_id: 'cart_reminder', increased_discount: true }, 1100, 100),
      n('n7', 'action', 'Log Result', { template: 'track_campaign', metric: 'cart_recovery', result: 'success' }, 1100, 300),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4'),
      c('c4', 'n4', 'n5'),
      c('c5', 'n5', 'n6', 'No'),
      c('c6', 'n5', 'n7', 'Yes'),
      c('c7', 'n6', 'n7'),
    ]
  },
  {
    id: 'ret_003',
    name: 'Inventory Reorder Automation',
    description: 'Monitor inventory levels, predict demand using AI, and automatically generate purchase orders.',
    category: 'Inventory',
    industry: 'retail',
    tags: ['inventory', 'reorder', 'ai', 'forecasting', 'purchase'],
    difficulty: 'advanced',
    nodes: [
      n('n1', 'trigger', 'Hourly Check', { source: 'schedule', interval: '1h' }, 100, 200),
      n('n2', 'integration', 'Get Inventory Levels', { provider: 'inventory_system', action: 'get_stock_levels', all_products: true }, 300, 200),
      n('n3', 'ai_action', 'Predict Demand', { model: 'gpt-4', prompt: 'Analyze sales trends, seasonality, and current stock levels to predict demand for next 30 days and identify products needing reorder.', inputField: 'inventory_data' }, 500, 200),
      n('n4', 'condition', 'Reorder Needed?', { field: 'reorder_required', operator: 'equals', value: 'true' }, 700, 200),
      n('n5', 'action', 'Generate Purchase Order', { template: 'create_po', supplier: 'auto_select', quantities: 'predicted' }, 900, 200),
      n('n6', 'approval', 'Manager Approval', { approver: 'inventory_manager', threshold: '10000' }, 1100, 200),
      n('n7', 'integration', 'Send to Supplier', { provider: 'supplier_portal', action: 'submit_po' }, 1300, 200),
      n('n8', 'notification', 'Notify Team', { channel: 'slack', template: 'po_created', include_details: true }, 1500, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4'),
      c('c4', 'n4', 'n5', 'Yes'),
      c('c5', 'n5', 'n6'),
      c('c6', 'n6', 'n7'),
      c('c7', 'n7', 'n8'),
    ]
  },
];

// ============================================================================
// GENERAL BUSINESS TEMPLATES
// ============================================================================
export const generalTemplates: AutomationTemplate[] = [
  {
    id: 'gen_001',
    name: 'Customer Onboarding Workflow',
    description: 'Automate new customer onboarding with welcome emails, account setup, training scheduling, and check-in reminders.',
    category: 'CRM',
    industry: 'general',
    tags: ['customer', 'onboarding', 'crm', 'email', 'scheduling'],
    difficulty: 'intermediate',
    nodes: [
      n('n1', 'trigger', 'New Customer', { source: 'webhook', system: 'crm', event: 'customer_created' }, 100, 200),
      n('n2', 'ai_action', 'Personalize Welcome', { model: 'gpt-4', prompt: 'Generate personalized welcome message based on customer industry, company size, and stated needs.', inputField: 'customer_data' }, 300, 200),
      n('n3', 'action', 'Send Welcome Email', { template: 'send_email', template_id: 'customer_welcome', personalized: true }, 500, 200),
      n('n4', 'action', 'Create Account', { template: 'provision_account', services: ['portal', 'support', 'billing'] }, 700, 200),
      n('n5', 'action', 'Schedule Onboarding Call', { template: 'create_meeting', type: 'onboarding', duration: '60min', assignee: 'cs_team' }, 900, 200),
      n('n6', 'delay', 'Wait 7 Days', { duration: 7, unit: 'days' }, 1100, 200),
      n('n7', 'notification', 'Check-in Reminder', { channel: 'email', template: 'customer_checkin', recipients: 'cs_rep' }, 1300, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4'),
      c('c4', 'n4', 'n5'),
      c('c5', 'n5', 'n6'),
      c('c6', 'n6', 'n7'),
    ]
  },
  {
    id: 'gen_002',
    name: 'Lead Qualification & Routing',
    description: 'Automatically qualify inbound leads using AI, score them, and route to appropriate sales representatives.',
    category: 'Sales',
    industry: 'general',
    tags: ['leads', 'qualification', 'ai', 'routing', 'sales'],
    difficulty: 'intermediate',
    nodes: [
      n('n1', 'trigger', 'New Lead', { source: 'webhook', form_source: 'website_form' }, 100, 200),
      n('n2', 'ai_action', 'Qualify Lead', { model: 'gpt-4', prompt: 'Qualify this lead based on: company size, industry, budget indicators, timeline, and fit with our ideal customer profile. Provide score 1-100 and qualification status.', inputField: 'lead_data' }, 300, 200),
      n('n3', 'condition', 'Lead Score', { field: 'lead_score', operator: 'gte', value: '70' }, 500, 200),
      n('n4', 'action', 'Assign to Senior Rep', { template: 'assign_lead', rep_type: 'senior', round_robin: true }, 700, 100),
      n('n5', 'action', 'Assign to Junior Rep', { template: 'assign_lead', rep_type: 'junior', round_robin: true }, 700, 300),
      n('n6', 'notification', 'Notify Sales Rep', { channel: 'slack', template: 'new_lead_assigned', include_lead_details: true }, 900, 200),
      n('n7', 'action', 'Update CRM', { template: 'update_lead', status: 'qualified', score: 'lead_score' }, 1100, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4', '>= 70'),
      c('c4', 'n3', 'n5', '< 70'),
      c('c5', 'n4', 'n6'),
      c('c6', 'n5', 'n6'),
      c('c7', 'n6', 'n7'),
    ]
  },
  {
    id: 'gen_003',
    name: 'Employee Time-Off Request Workflow',
    description: 'Automate time-off request submission, manager approval, calendar updates, and team notifications.',
    category: 'HR',
    industry: 'general',
    tags: ['hr', 'time-off', 'approval', 'calendar', 'notifications'],
    difficulty: 'beginner',
    nodes: [
      n('n1', 'trigger', 'Time-Off Request', { source: 'form', form_id: 'pto_request' }, 100, 200),
      n('n2', 'action', 'Check Balance', { template: 'check_pto_balance', employee_id: 'requester' }, 300, 200),
      n('n3', 'condition', 'Sufficient Balance?', { field: 'balance_available', operator: 'gte', value: 'requested_days' }, 500, 200),
      n('n4', 'approval', 'Manager Approval', { approver: 'direct_manager', message: 'Approve time-off request?' }, 700, 100),
      n('n5', 'notification', 'Request More Info', { channel: 'email', template: 'insufficient_pto', recipient: 'employee' }, 700, 300),
      n('n6', 'action', 'Update Calendar', { template: 'add_calendar_event', type: 'pto', share_with: 'team' }, 900, 200),
      n('n7', 'notification', 'Notify Team', { channel: 'slack', template: 'team_member_out', include_dates: true }, 1100, 200),
      n('n8', 'action', 'Update HR System', { template: 'record_time_off', status: 'approved' }, 1300, 200),
    ],
    connections: [
      c('c1', 'n1', 'n2'),
      c('c2', 'n2', 'n3'),
      c('c3', 'n3', 'n4', 'Yes'),
      c('c4', 'n3', 'n5', 'No'),
      c('c5', 'n4', 'n6'),
      c('c6', 'n6', 'n7'),
      c('c7', 'n7', 'n8'),
    ]
  },
];

// Combine all templates
export const allTemplates: AutomationTemplate[] = [
  ...itTemplates,
  ...healthcareTemplates,
  ...financeTemplates,
  ...retailTemplates,
  ...generalTemplates,
];

// Helper functions
export function getTemplatesByIndustry(industry: string): AutomationTemplate[] {
  if (industry === 'general' || !industry) {
    return generalTemplates;
  }
  
  const industryMap: Record<string, AutomationTemplate[]> = {
    'it': itTemplates,
    'healthcare': healthcareTemplates,
    'finance': financeTemplates,
    'retail': retailTemplates,
  };
  
  return [...(industryMap[industry] || []), ...generalTemplates];
}

export function searchTemplates(query: string, templates: AutomationTemplate[]): AutomationTemplate[] {
  const lowerQuery = query.toLowerCase();
  return templates.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.category.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function filterTemplates(
  templates: AutomationTemplate[],
  filters: {
    category?: string;
    difficulty?: string;
    tags?: string[];
  }
): AutomationTemplate[] {
  return templates.filter(t => {
    if (filters.category && t.category !== filters.category) return false;
    if (filters.difficulty && t.difficulty !== filters.difficulty) return false;
    if (filters.tags && filters.tags.length > 0) {
      if (!filters.tags.some(tag => t.tags.includes(tag))) return false;
    }
    return true;
  });
}

export function getCategories(templates: AutomationTemplate[]): string[] {
  return Array.from(new Set(templates.map(t => t.category))).sort();
}

export function getAllTags(templates: AutomationTemplate[]): string[] {
  const tags = new Set<string>();
  templates.forEach(t => t.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
}
