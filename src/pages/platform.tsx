import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as db from '../lib/database';
import { Card, Badge, Button, Table, SearchBar, Pagination, StatCard, Modal, Input, Select, Tabs, Toast, ProgressBar, CopyButton } from '../components/ui';
import { Building2, Users, Workflow, Zap, DollarSign, Activity, TrendingUp, CheckCircle, XCircle, Shield, CreditCard, Settings as SettingsIcon, Ban, Check, Download } from 'lucide-react';

// Platform Dashboard
export function PlatformDashboard() {
  const stats = db.getPlatformStats();
  const recentCompanies = db.getCompanies().slice(0, 5);
  const recentExecutions = db.getExecutions().slice(0, 5);
  const recentAudit = db.getAuditLogs().slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">AutoFlow AI — Complete platform overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Companies" value={stats.totalCompanies} icon={<Building2 className="w-5 h-5" />} change="+2 this month" />
        <StatCard label="Active Users" value={stats.totalUsers} icon={<Users className="w-5 h-5" />} change="+12 this week" />
        <StatCard label="Total Workflows" value={stats.totalWorkflows} icon={<Workflow className="w-5 h-5" />} />
        <StatCard label="Executions" value={stats.totalExecutions} icon={<Zap className="w-5 h-5" />} variant="success" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Gross Revenue" value={`$${stats.grossRevenue.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} variant="success" />
        <StatCard label="Net Revenue" value={`$${stats.netRevenue.toLocaleString()}`} icon={<TrendingUp className="w-5 h-5" />} variant="success" />
        <StatCard label="Success Rate" value={`${stats.totalExecutions > 0 ? Math.round((stats.successfulExecutions / stats.totalExecutions) * 100) : 0}%`} icon={<CheckCircle className="w-5 h-5" />} variant="success" />
        <StatCard label="Failed" value={stats.failedExecutions} icon={<XCircle className="w-5 h-5" />} variant="error" />
      </div>

      {/* Company Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-slate-400 mb-3">Company Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><span className="text-sm text-slate-300">Active</span><Badge variant="success">{stats.activeCompanies}</Badge></div>
            <div className="flex justify-between items-center"><span className="text-sm text-slate-300">Trial</span><Badge variant="info">{stats.trialCompanies}</Badge></div>
            <div className="flex justify-between items-center"><span className="text-sm text-slate-300">Suspended</span><Badge variant="error">{stats.suspendedCompanies}</Badge></div>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-slate-400 mb-3">Revenue Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><span className="text-sm text-slate-300">Gross</span><span className="text-sm font-medium text-white">${stats.grossRevenue.toLocaleString()}</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-slate-300">Processing Fees</span><span className="text-sm text-red-400">-${stats.processingFees.toLocaleString()}</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-slate-300">Net</span><span className="text-sm font-medium text-emerald-400">${stats.netRevenue.toLocaleString()}</span></div>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-slate-400 mb-3">System Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><span className="text-sm text-slate-300">API Status</span><Badge variant="success">Operational</Badge></div>
            <div className="flex justify-between items-center"><span className="text-sm text-slate-300">Payment Provider</span><Badge variant="success">Connected</Badge></div>
            <div className="flex justify-between items-center"><span className="text-sm text-slate-300">AI Provider</span><Badge variant="success">Active</Badge></div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-white">Recent Companies</h3>
            <Link to="/platform/companies" className="text-xs text-cyan-400 hover:text-cyan-300">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentCompanies.map(c => (
              <Link key={c.id} to={`/platform/companies/${c.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-cyan-400">{c.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-medium text-white">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.userCount} users · {c.workflowCount} workflows</p>
                  </div>
                </div>
                <Badge variant={c.status === 'active' ? 'success' : c.status === 'trial' ? 'info' : c.status === 'suspended' ? 'error' : 'default'}>{c.status}</Badge>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-white">Recent Executions</h3>
          </div>
          <div className="space-y-3">
            {recentExecutions.map(e => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                <div>
                  <p className="text-sm font-medium text-white">{e.workflowName}</p>
                  <p className="text-xs text-slate-500">{e.triggerType} · {new Date(e.startedAt).toLocaleTimeString()}</p>
                </div>
                <Badge variant={e.status === 'success' ? 'success' : e.status === 'failed' ? 'error' : e.status === 'running' ? 'info' : 'default'}>{e.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Audit Log Preview */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-white">Recent Audit Events</h3>
          <Link to="/platform/audit" className="text-xs text-cyan-400 hover:text-cyan-300">View all →</Link>
        </div>
        <div className="space-y-2">
          {recentAudit.map(log => (
            <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg text-sm">
              <Shield className="w-4 h-4 text-slate-500" />
              <span className="text-slate-300">{log.actorName}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">{log.action}</span>
              <span className="ml-auto text-xs text-slate-600">{new Date(log.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Companies Management
export function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const perPage = 10;

  const companies = useMemo(() => {
    let result = db.getCompanies();
    if (search) result = result.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.industry?.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter);
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'users') return b.userCount - a.userCount;
      if (sortBy === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
    return result;
  }, [search, statusFilter, sortBy]);

  const totalPages = Math.ceil(companies.length / perPage);
  const paginated = companies.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Companies</h1>
          <p className="text-sm text-slate-400 mt-1">Manage all registered companies</p>
        </div>
        <Button onClick={() => {}}><Download className="w-4 h-4" />Export</Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search companies..." /></div>
          <Select value={statusFilter} onChange={setStatusFilter} options={[{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'trial', label: 'Trial' }, { value: 'suspended', label: 'Suspended' }]} />
          <Select value={sortBy} onChange={setSortBy} options={[{ value: 'name', label: 'Sort: Name' }, { value: 'users', label: 'Sort: Users' }, { value: 'created', label: 'Sort: Created' }]} />
        </div>

        <Table headers={['Company', 'Admin', 'Plan', 'Users', 'Workflows', 'Executions', 'Status', 'Actions']}>
          {paginated.map(c => {
            const admin = db.getUserById(c.adminId);
            const plan = db.getPlanById(c.planId);
            return (
              <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-cyan-400">{c.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-medium text-white">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.industry || 'N/A'} · {c.country}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-300">{admin?.name || 'N/A'}</td>
                <td className="px-4 py-3"><Badge variant="purple">{plan?.name || 'N/A'}</Badge></td>
                <td className="px-4 py-3 text-sm text-slate-300">{c.userCount}</td>
                <td className="px-4 py-3 text-sm text-slate-300">{c.workflowCount}</td>
                <td className="px-4 py-3 text-sm text-slate-300">{c.executionCount.toLocaleString()}</td>
                <td className="px-4 py-3"><Badge variant={c.status === 'active' ? 'success' : c.status === 'trial' ? 'info' : c.status === 'suspended' ? 'error' : 'default'}>{c.status}</Badge></td>
                <td className="px-4 py-3">
                  <Link to={`/platform/companies/${c.id}`} className="text-cyan-400 hover:text-cyan-300 text-sm">View</Link>
                </td>
              </tr>
            );
          })}
        </Table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
  );
}

// Company Detail
export function CompanyDetailPage() {
  const navigate = useNavigate();
  const companyId = window.location.pathname.split('/').pop() || '';
  const company = db.getCompanyById(companyId);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!company) return <div className="text-center py-16"><p className="text-slate-400">Company not found</p><Button onClick={() => navigate('/platform/companies')} className="mt-4">Back to Companies</Button></div>;

  const users = db.getUsers(companyId);
  const workflows = db.getWorkflows(companyId);
  const executions = db.getExecutions(companyId);
  const plan = db.getPlanById(company.planId);
  const subscription = db.getSubscription(companyId);
  const usage = db.getUsage(companyId);
  const admin = db.getUserById(company.adminId);

  const handleSuspend = () => {
    db.updateCompany(companyId, { status: 'suspended' });
    db.addAuditLog({ actorId: 'usr_super_admin', actorName: 'Platform Admin', action: 'company.suspended', resource: 'company', resourceId: companyId });
    setToast({ message: `${company.name} has been suspended.`, type: 'success' });
  };

  const handleReactivate = () => {
    db.updateCompany(companyId, { status: 'active' });
    db.addAuditLog({ actorId: 'usr_super_admin', actorName: 'Platform Admin', action: 'company.reactivated', resource: 'company', resourceId: companyId });
    setToast({ message: `${company.name} has been reactivated.`, type: 'success' });
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/platform/companies')} className="text-slate-400 hover:text-white text-sm">← Companies</button>
        </div>
        <div className="flex gap-2">
          {company.status === 'suspended' ? (
            <Button variant="secondary" onClick={handleReactivate}><Check className="w-4 h-4" />Reactivate</Button>
          ) : (
            <Button variant="danger" onClick={handleSuspend}><Ban className="w-4 h-4" />Suspend</Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-xl font-bold text-cyan-400">{company.name.charAt(0)}</div>
        <div>
          <h1 className="text-2xl font-bold text-white">{company.name}</h1>
          <p className="text-sm text-slate-400">{company.industry} · {company.country} · {company.timezone}</p>
        </div>
        <Badge variant={company.status === 'active' ? 'success' : company.status === 'trial' ? 'info' : 'error'} className="ml-auto">{company.status}</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Users" value={company.userCount} icon={<Users className="w-5 h-5" />} />
        <StatCard label="Workflows" value={company.workflowCount} icon={<Workflow className="w-5 h-5" />} />
        <StatCard label="Executions" value={company.executionCount.toLocaleString()} icon={<Zap className="w-5 h-5" />} />
        <StatCard label="Plan" value={plan?.name || 'N/A'} icon={<CreditCard className="w-5 h-5" />} variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-white mb-4">Company Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Administrator</span><span className="text-white">{admin?.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="text-white">{admin?.email}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Registered</span><span className="text-white">{new Date(company.createdAt).toLocaleDateString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Last Activity</span><span className="text-white">{company.lastActivity ? new Date(company.lastActivity).toLocaleDateString() : 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Subscription</span><Badge variant={subscription?.status === 'active' ? 'success' : subscription?.status === 'trial' ? 'info' : 'error'}>{subscription?.status || 'N/A'}</Badge></div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-white mb-4">Resource Usage</h3>
          {plan && (
            <div className="space-y-4">
              <ProgressBar value={usage.users} max={plan.maxUsers} label={`Users (${usage.users}/${plan.maxUsers})`} />
              <ProgressBar value={usage.workflows} max={plan.maxWorkflows} label={`Workflows (${usage.workflows}/${plan.maxWorkflows})`} />
              <ProgressBar value={usage.executions} max={plan.maxExecutions} label={`Executions (${usage.executions}/${plan.maxExecutions})`} />
              <ProgressBar value={usage.integrations} max={plan.maxIntegrations} label={`Integrations (${usage.integrations}/${plan.maxIntegrations})`} />
            </div>
          )}
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-white mb-4">Team Members</h3>
        <Table headers={['Name', 'Email', 'Role', 'Status', 'Last Login']}>
          {users.map(u => (
            <tr key={u.id} className="hover:bg-slate-800/30">
              <td className="px-4 py-3 text-sm text-white">{u.name}</td>
              <td className="px-4 py-3 text-sm text-slate-400">{u.email}</td>
              <td className="px-4 py-3"><Badge variant={u.role === 'company_admin' ? 'purple' : 'default'}>{u.role}</Badge></td>
              <td className="px-4 py-3"><Badge variant={u.status === 'active' ? 'success' : 'error'}>{u.status}</Badge></td>
              <td className="px-4 py-3 text-sm text-slate-500">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

// Platform Users
export function PlatformUsersPage() {
  const [search, setSearch] = useState('');
  const users = db.getUsers().filter(u => u.role !== 'super_admin');
  const filtered = search ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) : users;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Users</h1>
        <p className="text-sm text-slate-400 mt-1">All users across all companies</p>
      </div>
      <Card className="p-4">
        <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search users..." /></div>
        <Table headers={['Name', 'Email', 'Company', 'Role', 'Status', 'Created']}>
          {filtered.map(u => {
            const company = u.companyId ? db.getCompanyById(u.companyId) : null;
            return (
              <tr key={u.id} className="hover:bg-slate-800/30">
                <td className="px-4 py-3 text-sm text-white">{u.name}</td>
                <td className="px-4 py-3 text-sm text-slate-400">{u.email}</td>
                <td className="px-4 py-3 text-sm text-slate-300">{company?.name || 'N/A'}</td>
                <td className="px-4 py-3"><Badge variant={u.role === 'company_admin' ? 'purple' : 'default'}>{u.role}</Badge></td>
                <td className="px-4 py-3"><Badge variant={u.status === 'active' ? 'success' : 'error'}>{u.status}</Badge></td>
                <td className="px-4 py-3 text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}

// Payments & Payouts
export function PaymentsPage() {
  const [tab, setTab] = useState('transactions');
  const stats = db.getPlatformStats();
  const allInvoices = [...db.getCompanies()].flatMap(c => db.getInvoices(c.id));
  const settings = db.getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payments & Payouts</h1>
        <p className="text-sm text-slate-400 mt-1">Revenue, transactions, and payout management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Gross Revenue" value={`$${stats.grossRevenue.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} variant="success" />
        <StatCard label="Processing Fees" value={`$${stats.processingFees.toLocaleString()}`} icon={<CreditCard className="w-5 h-5" />} variant="warning" />
        <StatCard label="Net Revenue" value={`$${stats.netRevenue.toLocaleString()}`} icon={<TrendingUp className="w-5 h-5" />} variant="success" />
        <StatCard label="Active Subs" value={stats.activeSubscriptions} icon={<CheckCircle className="w-5 h-5" />} />
      </div>

      <Tabs tabs={[{ id: 'transactions', label: 'Transactions' }, { id: 'payouts', label: 'Payouts' }, { id: 'provider', label: 'Provider' }]} activeTab={tab} onChange={setTab} />

      {tab === 'transactions' && (
        <Card className="p-4">
          <Table headers={['Invoice', 'Company', 'Amount', 'Status', 'Date']}>
            {allInvoices.map(inv => {
              const company = db.getCompanyById(inv.companyId);
              return (
                <tr key={inv.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3 text-sm text-white font-mono">{inv.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{company?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-white">${inv.amount}</td>
                  <td className="px-4 py-3"><Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'failed' ? 'error' : 'warning'}>{inv.status}</Badge></td>
                  <td className="px-4 py-3 text-sm text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </Table>
        </Card>
      )}

      {tab === 'payouts' && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <p className="text-xs text-slate-400">Payout Bank</p>
                <p className="text-sm font-medium text-white mt-1">{settings.payoutBank || 'Not configured'}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <p className="text-xs text-slate-400">Account</p>
                <p className="text-sm font-medium text-white mt-1">{settings.payoutAccountMasked || 'Not configured'}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <p className="text-xs text-slate-400">Status</p>
                <Badge variant={settings.payoutStatus === 'active' ? 'success' : 'warning'} className="mt-1">{settings.payoutStatus}</Badge>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <p className="text-sm text-slate-400">No payouts have been processed yet. Payouts are initiated manually by the platform administrator.</p>
            </div>
          </div>
        </Card>
      )}

      {tab === 'provider' && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-lg">💳</div>
                <div>
                  <p className="text-sm font-medium text-white">Stripe</p>
                  <p className="text-xs text-slate-400">Primary payment provider</p>
                </div>
              </div>
              <Badge variant={settings.paymentProviderStatus === 'connected' ? 'success' : 'error'}>{settings.paymentProviderStatus}</Badge>
            </div>
            <p className="text-xs text-slate-500">Payment provider credentials are stored securely server-side and never exposed to the frontend.</p>
          </div>
        </Card>
      )}
    </div>
  );
}

// Audit Logs
export function AuditLogsPage() {
  const logs = db.getAuditLogs();
  const [search, setSearch] = useState('');
  const filtered = search ? logs.filter(l => l.action.includes(search) || l.actorName.toLowerCase().includes(search.toLowerCase())) : logs;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
        <p className="text-sm text-slate-400 mt-1">Platform-wide activity and security events</p>
      </div>
      <Card className="p-4">
        <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search audit logs..." /></div>
        <Table headers={['Actor', 'Action', 'Resource', 'Details', 'Timestamp']}>
          {filtered.map(log => (
            <tr key={log.id} className="hover:bg-slate-800/30">
              <td className="px-4 py-3 text-sm text-white">{log.actorName}</td>
              <td className="px-4 py-3"><Badge variant="info">{log.action}</Badge></td>
              <td className="px-4 py-3 text-sm text-slate-300">{log.resource}</td>
              <td className="px-4 py-3 text-xs text-slate-500">{log.details ? JSON.stringify(log.details).slice(0, 50) : '—'}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

// Platform Settings
export function PlatformSettingsPage() {
  const [settings, setSettings] = useState(db.getSettings());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [tab, setTab] = useState('general');

  const save = (data: Partial<typeof settings>) => {
    setSaving(true);
    setTimeout(() => {
      const updated = db.updateSettings(data);
      setSettings(updated);
      setSaving(false);
      setToast({ message: 'Settings saved successfully.', type: 'success' });
      db.addAuditLog({ actorId: 'usr_super_admin', actorName: 'Platform Admin', action: 'settings.updated', resource: 'platform_settings', resourceId: 'global', details: data });
    }, 500);
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Configure global platform behavior</p>
      </div>

      <Tabs tabs={[{ id: 'general', label: 'General' }, { id: 'security', label: 'Security' }, { id: 'limits', label: 'Resource Limits' }, { id: 'payments', label: 'Payments' }]} activeTab={tab} onChange={setTab} />

      {tab === 'general' && (
        <Card className="p-6 space-y-4">
          <Input label="Platform Name" value={settings.platformName} onChange={e => setSettings({ ...settings, platformName: e.target.value })} />
          <Input label="Support Email" value={settings.supportEmail} onChange={e => setSettings({ ...settings, supportEmail: e.target.value })} />
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <div>
              <p className="text-sm font-medium text-white">Company Self-Signup</p>
              <p className="text-xs text-slate-400">Allow new companies to register independently</p>
            </div>
            <button onClick={() => save({ companySelfSignup: !settings.companySelfSignup })} className={`w-12 h-6 rounded-full transition-all ${settings.companySelfSignup ? 'bg-cyan-500' : 'bg-slate-700'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.companySelfSignup ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-red-500/20">
            <div>
              <p className="text-sm font-medium text-white">Maintenance Mode</p>
              <p className="text-xs text-slate-400">Block all tenant access (Super Admin remains active)</p>
            </div>
            <button onClick={() => save({ maintenanceMode: !settings.maintenanceMode })} className={`w-12 h-6 rounded-full transition-all ${settings.maintenanceMode ? 'bg-red-500' : 'bg-slate-700'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <Input label="Default Trial Days" type="number" value={String(settings.defaultTrialDays)} onChange={e => setSettings({ ...settings, defaultTrialDays: parseInt(e.target.value) || 14 })} />
          <Button onClick={() => save(settings)} loading={saving}><SettingsIcon className="w-4 h-4" />Save Settings</Button>
        </Card>
      )}

      {tab === 'security' && (
        <Card className="p-6 space-y-4">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <p className="text-sm font-medium text-white mb-2">Security Configuration</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Rate Limiting</span><Badge variant="success">Enabled</Badge></div>
              <div className="flex justify-between"><span className="text-slate-400">CSRF Protection</span><Badge variant="success">Enabled</Badge></div>
              <div className="flex justify-between"><span className="text-slate-400">Session Encryption</span><Badge variant="success">Enabled</Badge></div>
              <div className="flex justify-between"><span className="text-slate-400">Audit Logging</span><Badge variant="success">Enabled</Badge></div>
              <div className="flex justify-between"><span className="text-slate-400">Webhook Verification</span><Badge variant="success">Enabled</Badge></div>
            </div>
          </div>
        </Card>
      )}

      {tab === 'limits' && (
        <Card className="p-6 space-y-4">
          <Input label="Max Companies" type="number" value={String(settings.maxCompanies)} onChange={e => setSettings({ ...settings, maxCompanies: parseInt(e.target.value) || 1000 })} />
          <Button onClick={() => save({ maxCompanies: settings.maxCompanies })} loading={saving}>Save</Button>
        </Card>
      )}

      {tab === 'payments' && (
        <Card className="p-6 space-y-4">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <p className="text-sm font-medium text-white mb-2">Payment Provider</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Provider</span><span className="text-white capitalize">{settings.paymentProvider}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Status</span><Badge variant={settings.paymentProviderStatus === 'connected' ? 'success' : 'error'}>{settings.paymentProviderStatus}</Badge></div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <p className="text-sm font-medium text-white mb-2">Payout Configuration</p>
            <Input label="Bank" value={settings.payoutBank || ''} onChange={e => setSettings({ ...settings, payoutBank: e.target.value })} />
            <div className="mt-3">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Account (masked)</label>
              <div className="flex gap-2">
                <input value={settings.payoutAccountMasked || ''} readOnly className="flex-1 bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-400" />
                <CopyButton text={settings.payoutAccountMasked || ''} />
              </div>
            </div>
          </div>
          <Button onClick={() => save({ payoutBank: settings.payoutBank })} loading={saving}>Save</Button>
        </Card>
      )}
    </div>
  );
}
