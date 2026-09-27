import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuthStore } from '../stores';
import * as db from '../lib/database';
import { Card, Badge, Button, Table, SearchBar, Modal, Input, Select, StatCard, Tabs, Toast, ProgressBar, EmptyState, Dropdown, CopyButton } from '../components/ui';
import { Users, Workflow, Zap, Activity, CreditCard, Settings as SettingsIcon, UserPlus, MoreVertical, Mail, Check, Eye, Link2, Unlink } from 'lucide-react';

// Company Admin Dashboard
export function AdminDashboard() {
  const { user } = useAuthStore();
  if (!user?.companyId) return null;
  
  const company = db.getCompanyById(user.companyId);
  const users = db.getUsers(user.companyId);
  const workflows = db.getWorkflows(user.companyId);
  const executions = db.getExecutions(user.companyId);
  const integrations = db.getIntegrations(user.companyId);
  const plan = company ? db.getPlanById(company.planId) : null;
  const usage = db.getUsage(user.companyId);
  const recentExecs = executions.slice(0, 5);
  const successRate = executions.length > 0 ? Math.round((executions.filter(e => e.status === 'success').length / executions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">{company?.name} — Automation Operations Center</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Team Members" value={users.length} icon={<Users className="w-5 h-5" />} />
        <StatCard label="Active Workflows" value={workflows.filter(w => w.status === 'active').length} icon={<Workflow className="w-5 h-5" />} />
        <StatCard label="Total Executions" value={executions.length} icon={<Zap className="w-5 h-5" />} />
        <StatCard label="Success Rate" value={`${successRate}%`} icon={<Activity className="w-5 h-5" />} variant={successRate >= 90 ? 'success' : successRate >= 70 ? 'warning' : 'error'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard label="Integrations" value={integrations.filter(i => i.status === 'connected').length} icon={<Link2 className="w-5 h-5" />} />
        <StatCard label="Plan" value={plan?.name || 'N/A'} icon={<CreditCard className="w-5 h-5" />} variant="success" />
        <StatCard label="AI Credits Used" value={usage.aiCredits} icon={<Zap className="w-5 h-5" />} variant="warning" />
      </div>

      {plan && (
        <Card className="p-4">
          <h3 className="text-sm font-medium text-white mb-4">Resource Usage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProgressBar value={usage.users} max={plan.maxUsers} label={`Users (${usage.users}/${plan.maxUsers})`} />
            <ProgressBar value={usage.workflows} max={plan.maxWorkflows} label={`Workflows (${usage.workflows}/${plan.maxWorkflows})`} />
            <ProgressBar value={usage.executions} max={plan.maxExecutions} label={`Executions (${usage.executions}/${plan.maxExecutions})`} />
          </div>
        </Card>
      )}

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Trend */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-white mb-4">Execution Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={useMemo(() => {
              const days = [];
              for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const dayExecs = executions.filter(e => e.startedAt.startsWith(dateStr));
                days.push({
                  date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  successful: dayExecs.filter(e => e.status === 'success').length,
                  failed: dayExecs.filter(e => e.status === 'failed').length,
                });
              }
              return days;
            }, [executions])}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="successful" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Area type="monotone" dataKey="failed" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Workflow Performance */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-white mb-4">Workflow Performance</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={useMemo(() => {
              return workflows
                .sort((a, b) => b.executionCount - a.executionCount)
                .slice(0, 6)
                .map(w => ({
                  name: w.name.length > 12 ? w.name.substring(0, 12) + '...' : w.name,
                  success: w.successCount,
                  failed: w.failCount,
                }));
            }, [workflows])}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '11px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="success" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Integration Status */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-white mb-4">Integration Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={[
                { name: 'Connected', value: integrations.filter(i => i.status === 'connected').length, fill: '#10b981' },
                { name: 'Disconnected', value: integrations.filter(i => i.status === 'disconnected').length, fill: '#64748b' },
                { name: 'Error', value: integrations.filter(i => i.status === 'error').length, fill: '#ef4444' },
              ]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {[
                  { name: 'Connected', value: integrations.filter(i => i.status === 'connected').length, fill: '#10b981' },
                  { name: 'Disconnected', value: integrations.filter(i => i.status === 'disconnected').length, fill: '#64748b' },
                  { name: 'Error', value: integrations.filter(i => i.status === 'error').length, fill: '#ef4444' },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Execution Duration Trend */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-white mb-4">Average Execution Duration</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={useMemo(() => {
              const days = [];
              for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const dayExecs = executions.filter(e => e.startedAt.startsWith(dateStr) && e.duration);
                const avgDuration = dayExecs.length > 0 
                  ? dayExecs.reduce((sum, e) => sum + (e.duration || 0), 0) / dayExecs.length / 1000
                  : 0;
                days.push({
                  date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  duration: Math.round(avgDuration * 10) / 10,
                });
              }
              return days;
            }, [executions])}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} unit="s" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} formatter={(value: number) => [`${value}s`, 'Avg Duration']} />
              <Line type="monotone" dataKey="duration" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-white">Recent Executions</h3>
            <Link to="/admin/executions" className="text-xs text-cyan-400 hover:text-cyan-300">View all →</Link>
          </div>
          <div className="space-y-2">
            {recentExecs.map(e => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                <div>
                  <p className="text-sm text-white">{e.workflowName}</p>
                  <p className="text-xs text-slate-500">{new Date(e.startedAt).toLocaleString()}</p>
                </div>
                <Badge variant={e.status === 'success' ? 'success' : e.status === 'failed' ? 'error' : e.status === 'running' ? 'info' : 'default'}>{e.status}</Badge>
              </div>
            ))}
            {recentExecs.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No executions yet</p>}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-white">Workflows</h3>
            <Link to="/admin/workflows" className="text-xs text-cyan-400 hover:text-cyan-300">View all →</Link>
          </div>
          <div className="space-y-2">
            {workflows.slice(0, 5).map(w => (
              <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                <div>
                  <p className="text-sm text-white">{w.name}</p>
                  <p className="text-xs text-slate-500">{w.executionCount} executions</p>
                </div>
                <Badge variant={w.status === 'active' ? 'success' : w.status === 'paused' ? 'warning' : 'default'}>{w.status}</Badge>
              </div>
            ))}
            {workflows.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No workflows yet</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Team Management
export function AdminUsersPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', name: '' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!user?.companyId) return null;
  const users = db.getUsers(user.companyId);
  const filtered = search ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) : users;

  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);

  const handleInvite = () => {
    if (!inviteData.email || !inviteData.name) return;
    const result = db.createUserAccount({ email: inviteData.email, name: inviteData.name, companyId: user.companyId! });
    if (!result) {
      setToast({ message: 'Failed to create user. Email may already exist or user limit reached.', type: 'error' });
      return;
    }
    db.addAuditLog({ actorId: user.id, actorName: user.name, action: 'user.created', resource: 'user', resourceId: result.user.id, companyId: user.companyId! });
    setCreatedCredentials({ email: result.credentials.email, password: result.credentials.tempPassword });
    setInviteData({ email: '', name: '' });
    setToast({ message: 'User account created successfully.', type: 'success' });
  };

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    db.updateUser(userId, { status: newStatus as any });
    db.addAuditLog({ actorId: user.id, actorName: user.name, action: `user.${newStatus === 'active' ? 'activated' : 'deactivated'}`, resource: 'user', resourceId: userId, companyId: user.companyId! });
    setToast({ message: `User ${newStatus === 'active' ? 'activated' : 'deactivated'}.`, type: 'success' });
  };

  const handleDelete = (userId: string) => {
    if (userId === user.id) return;
    db.deleteUser(userId);
    db.addAuditLog({ actorId: user.id, actorName: user.name, action: 'user.deleted', resource: 'user', resourceId: userId, companyId: user.companyId! });
    setToast({ message: 'User removed.', type: 'success' });
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your company's team members</p>
        </div>
        <Button onClick={() => setShowInvite(true)}><UserPlus className="w-4 h-4" />Invite User</Button>
      </div>

      <Card className="p-4">
        <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search team members..." /></div>
        <Table headers={['Name', 'Email', 'Role', 'Status', 'Last Login', 'Actions']}>
          {filtered.map(u => (
            <tr key={u.id} className="hover:bg-slate-800/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">{u.name.charAt(0)}</div>
                  <span className="text-sm text-white">{u.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-slate-400">{u.email}</td>
              <td className="px-4 py-3"><Badge variant={u.role === 'company_admin' ? 'purple' : 'default'}>{u.role}</Badge></td>
              <td className="px-4 py-3"><Badge variant={u.status === 'active' ? 'success' : 'error'}>{u.status}</Badge></td>
              <td className="px-4 py-3 text-sm text-slate-500">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</td>
              <td className="px-4 py-3">
                {u.id !== user.id && (
                  <Dropdown trigger={<button className="p-1.5 rounded hover:bg-slate-700"><MoreVertical className="w-4 h-4 text-slate-400" /></button>} items={[
                    { label: u.status === 'active' ? 'Deactivate' : 'Activate', onClick: () => handleToggleStatus(u.id, u.status) },
                    { label: 'Resend Invitation', onClick: () => setToast({ message: 'Invitation resent.', type: 'success' }) },
                    { label: 'Remove', onClick: () => handleDelete(u.id), danger: true },
                  ]} />
                )}
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal open={showInvite} onClose={() => { setShowInvite(false); setCreatedCredentials(null); }} title={createdCredentials ? 'Account Created' : 'Create User Account'}>
        {createdCredentials ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <p className="text-sm font-medium text-emerald-400">User account created successfully!</p>
              </div>
              <p className="text-xs text-slate-400">Share these credentials with the user so they can log in directly.</p>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Email</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white font-mono">{createdCredentials.email}</p>
                  <CopyButton text={createdCredentials.email} />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Temporary Password</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white font-mono">{createdCredentials.password}</p>
                  <CopyButton text={createdCredentials.password} />
                </div>
              </div>
            </div>
            <p className="text-xs text-amber-400">⚠️ Please share these credentials securely. The user should change their password after first login.</p>
            <Button onClick={() => { setShowInvite(false); setCreatedCredentials(null); }} className="w-full">Done</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input label="Full Name" value={inviteData.name} onChange={e => setInviteData({ ...inviteData, name: e.target.value })} placeholder="Jane Smith" />
            <Input label="Email Address" type="email" value={inviteData.email} onChange={e => setInviteData({ ...inviteData, email: e.target.value })} placeholder="jane@company.com" />
            <p className="text-xs text-slate-500">A user account will be created with auto-generated credentials that you can share with the user.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
              <Button onClick={handleInvite}><UserPlus className="w-4 h-4" />Create Account</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Admin Workflows
export function AdminWorkflowsPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  if (!user?.companyId) return null;
  const workflows = db.getWorkflows(user.companyId);
  const filtered = useMemo(() => {
    let result = workflows;
    if (search) result = result.filter(w => w.name.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'all') result = result.filter(w => w.status === statusFilter);
    return result;
  }, [workflows, search, statusFilter]);

  const handleToggleStatus = (wfId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    db.updateWorkflow(wfId, { status: newStatus as any });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Workflows</h1>
          <p className="text-sm text-slate-400 mt-1">Manage company automation workflows</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search workflows..." /></div>
          <Select value={statusFilter} onChange={setStatusFilter} options={[{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'paused', label: 'Paused' }, { value: 'draft', label: 'Draft' }]} />
        </div>
        <Table headers={['Name', 'Status', 'Executions', 'Success', 'Failed', 'Last Run', 'Actions']}>
          {filtered.map(w => (
            <tr key={w.id} className="hover:bg-slate-800/30">
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-white">{w.name}</p>
                <p className="text-xs text-slate-500">{w.description}</p>
              </td>
              <td className="px-4 py-3"><Badge variant={w.status === 'active' ? 'success' : w.status === 'paused' ? 'warning' : 'default'}>{w.status}</Badge></td>
              <td className="px-4 py-3 text-sm text-slate-300">{w.executionCount}</td>
              <td className="px-4 py-3 text-sm text-emerald-400">{w.successCount}</td>
              <td className="px-4 py-3 text-sm text-red-400">{w.failCount}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{w.lastExecuted ? new Date(w.lastExecuted).toLocaleDateString() : 'Never'}</td>
              <td className="px-4 py-3">
                <Button size="sm" variant="ghost" onClick={() => handleToggleStatus(w.id, w.status)}>
                  {w.status === 'active' ? 'Pause' : 'Activate'}
                </Button>
              </td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && <EmptyState icon={<Workflow className="w-8 h-8" />} title="No workflows" description="Create your first automation workflow." />}
      </Card>
    </div>
  );
}

// Admin Executions
export function AdminExecutionsPage() {
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedExec, setSelectedExec] = useState<string | null>(null);

  if (!user?.companyId) return null;
  const executions = db.getExecutions(user.companyId);
  const filtered = statusFilter !== 'all' ? executions.filter(e => e.status === statusFilter) : executions;
  const selected = selectedExec ? executions.find(e => e.id === selectedExec) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Executions</h1>
        <p className="text-sm text-slate-400 mt-1">Monitor workflow execution history</p>
      </div>

      <Card className="p-4">
        <div className="flex gap-3 mb-4">
          <Select value={statusFilter} onChange={setStatusFilter} options={[{ value: 'all', label: 'All Status' }, { value: 'success', label: 'Success' }, { value: 'failed', label: 'Failed' }, { value: 'running', label: 'Running' }]} />
        </div>
        <Table headers={['Workflow', 'Status', 'Duration', 'Nodes', 'Trigger', 'Started', 'Actions']}>
          {filtered.map(e => (
            <tr key={e.id} className="hover:bg-slate-800/30">
              <td className="px-4 py-3 text-sm text-white">{e.workflowName}</td>
              <td className="px-4 py-3"><Badge variant={e.status === 'success' ? 'success' : e.status === 'failed' ? 'error' : e.status === 'running' ? 'info' : 'default'}>{e.status}</Badge></td>
              <td className="px-4 py-3 text-sm text-slate-300">{e.duration ? `${(e.duration / 1000).toFixed(1)}s` : '—'}</td>
              <td className="px-4 py-3 text-sm text-slate-300">{e.nodesExecuted}/{e.totalNodes}</td>
              <td className="px-4 py-3 text-sm text-slate-400">{e.triggerType}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{new Date(e.startedAt).toLocaleString()}</td>
              <td className="px-4 py-3"><Button size="sm" variant="ghost" onClick={() => setSelectedExec(e.id)}><Eye className="w-4 h-4" /></Button></td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && <EmptyState icon={<Zap className="w-8 h-8" />} title="No executions" description="Executions will appear here when workflows run." />}
      </Card>

      <Modal open={!!selected} onClose={() => setSelectedExec(null)} title={`Execution: ${selected?.workflowName || ''}`} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-400">Status:</span> <Badge variant={selected.status === 'success' ? 'success' : selected.status === 'failed' ? 'error' : 'info'}>{selected.status}</Badge></div>
              <div><span className="text-slate-400">Duration:</span> <span className="text-white">{selected.duration ? `${(selected.duration / 1000).toFixed(1)}s` : 'Running...'}</span></div>
              <div><span className="text-slate-400">Trigger:</span> <span className="text-white">{selected.triggerType}</span></div>
              <div><span className="text-slate-400">Nodes:</span> <span className="text-white">{selected.nodesExecuted}/{selected.totalNodes}</span></div>
            </div>
            {selected.error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{selected.error}</div>}
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Execution Logs</h4>
              <div className="space-y-2">
                {selected.logs.map((log, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${log.status === 'success' ? 'border-emerald-500/20 bg-emerald-500/5' : log.status === 'failed' ? 'border-red-500/20 bg-red-500/5' : 'border-slate-700 bg-slate-800/30'}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white">{log.nodeLabel}</span>
                      <span className="text-xs text-slate-500">{log.duration}ms</span>
                    </div>
                    {log.error && <p className="text-xs text-red-400 mt-1">{log.error}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Admin Integrations
export function AdminIntegrationsPage() {
  const { user } = useAuthStore();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!user?.companyId) return null;
  const integrations = db.getIntegrations(user.companyId);

  const availableIntegrations = [
    { provider: 'slack', name: 'Slack', icon: '💬', category: 'Communication' },
    { provider: 'salesforce', name: 'Salesforce', icon: '☁️', category: 'CRM' },
    { provider: 'hubspot', name: 'HubSpot', icon: '🔶', category: 'CRM' },
    { provider: 'gmail', name: 'Gmail', icon: '📧', category: 'Email' },
    { provider: 'github', name: 'GitHub', icon: '🐙', category: 'Development' },
    { provider: 'stripe', name: 'Stripe', icon: '💳', category: 'Payments' },
    { provider: 'notion', name: 'Notion', icon: '📝', category: 'Productivity' },
    { provider: 'jira', name: 'Jira', icon: '🎯', category: 'Project Management' },
    { provider: 'shopify', name: 'Shopify', icon: '🛒', category: 'E-commerce' },
    { provider: 'google_sheets', name: 'Google Sheets', icon: '📊', category: 'Spreadsheets' },
    { provider: 'airtable', name: 'Airtable', icon: '📋', category: 'Database' },
    { provider: 'twilio', name: 'Twilio', icon: '📱', category: 'Communication' },
  ];

  const handleConnect = (provider: string, name: string) => {
    db.connectIntegration(user.companyId!, provider, name);
    db.addAuditLog({ actorId: user.id, actorName: user.name, action: 'integration.connected', resource: 'integration', resourceId: provider, companyId: user.companyId! });
    setToast({ message: `${name} connected successfully.`, type: 'success' });
  };

  const handleDisconnect = (id: string) => {
    db.disconnectIntegration(id);
    setToast({ message: 'Integration disconnected.', type: 'success' });
  };

  const connected = integrations.filter(i => i.status === 'connected');
  const disconnected = availableIntegrations.filter(a => !integrations.find(i => i.provider === a.provider));

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div>
        <h1 className="text-2xl font-bold text-white">Integrations</h1>
        <p className="text-sm text-slate-400 mt-1">Connect your business applications</p>
      </div>

      <div>
        <h2 className="text-sm font-medium text-slate-300 mb-3">Connected ({connected.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {connected.map(int => (
            <Card key={int.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{int.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{int.name}</p>
                    <p className="text-xs text-slate-500">{int.category}</p>
                  </div>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-slate-500">Since {int.connectedAt ? new Date(int.connectedAt).toLocaleDateString() : 'N/A'}</span>
                <Button size="sm" variant="ghost" onClick={() => handleDisconnect(int.id)}><Unlink className="w-3.5 h-3.5" />Disconnect</Button>
              </div>
            </Card>
          ))}
          {connected.length === 0 && <p className="text-sm text-slate-500 col-span-full">No integrations connected yet.</p>}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-slate-300 mb-3">Available Integrations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {disconnected.map(int => (
            <Card key={int.provider} className="p-4 hover:border-slate-600 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{int.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">{int.name}</p>
                  <p className="text-xs text-slate-500">{int.category}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => handleConnect(int.provider, int.name)}><Link2 className="w-3.5 h-3.5" />Connect</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Admin Billing
export function AdminBillingPage() {
  const { user } = useAuthStore();
  if (!user?.companyId) return null;

  const company = db.getCompanyById(user.companyId);
  const subscription = db.getSubscription(user.companyId);
  const plan = subscription ? db.getPlanById(subscription.planId) : null;
  const invoices = db.getInvoices(user.companyId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Subscription</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your plan and payment history</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">{plan?.name || 'No Plan'}</h2>
            <p className="text-sm text-slate-400 mt-1">
              {subscription?.billingCycle === 'annual' ? 'Billed annually' : 'Billed monthly'} · {subscription?.status === 'trial' ? 'Trial' : subscription?.status === 'active' ? 'Active' : subscription?.status}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">${plan ? (subscription?.billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice) : 0}</p>
            <p className="text-xs text-slate-500">/{subscription?.billingCycle === 'annual' ? 'year' : 'month'}</p>
          </div>
        </div>
        {subscription && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><p className="text-slate-400">Current Period</p><p className="text-white">{new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p></div>
            <div><p className="text-slate-400">Status</p><Badge variant={subscription.status === 'active' ? 'success' : subscription.status === 'trial' ? 'info' : 'warning'}>{subscription.status}</Badge></div>
          </div>
        )}
      </Card>

      {plan && (
        <Card className="p-4">
          <h3 className="text-sm font-medium text-white mb-3">Plan Features</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {plan.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-300"><Check className="w-4 h-4 text-emerald-400" />{f}</div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-4">
        <h3 className="text-sm font-medium text-white mb-4">Invoice History</h3>
        <Table headers={['Invoice', 'Amount', 'Status', 'Date']}>
          {invoices.map(inv => (
            <tr key={inv.id} className="hover:bg-slate-800/30">
              <td className="px-4 py-3 text-sm text-white font-mono">{inv.id}</td>
              <td className="px-4 py-3 text-sm text-white">${inv.amount}</td>
              <td className="px-4 py-3"><Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'failed' ? 'error' : 'warning'}>{inv.status}</Badge></td>
              <td className="px-4 py-3 text-sm text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </Table>
        {invoices.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No invoices yet.</p>}
      </Card>
    </div>
  );
}

// Admin Settings
export function AdminSettingsPage() {
  const { user } = useAuthStore();
  if (!user?.companyId) return null;
  const company = db.getCompanyById(user.companyId);
  const [name, setName] = useState(company?.name || '');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSave = () => {
    db.updateCompany(user.companyId!, { name });
    db.addAuditLog({ actorId: user.id, actorName: user.name, action: 'company.updated', resource: 'company', resourceId: user.companyId!, companyId: user.companyId! });
    setToast({ message: 'Settings saved.', type: 'success' });
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div>
        <h1 className="text-2xl font-bold text-white">Company Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your company profile and preferences</p>
      </div>

      <Card className="p-6 space-y-4">
        <Input label="Company Name" value={name} onChange={e => setName(e.target.value)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Industry" value={company?.industry || ''} onChange={() => {}} />
          <Input label="Country" value={company?.country || ''} onChange={() => {}} />
          <Input label="Timezone" value={company?.timezone || ''} onChange={() => {}} />
          <Input label="Company ID" value={company?.id || ''} readOnly />
        </div>
        <Button onClick={handleSave}><SettingsIcon className="w-4 h-4" />Save Changes</Button>
      </Card>
    </div>
  );
}
