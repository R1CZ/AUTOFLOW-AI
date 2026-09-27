import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useAppStore } from '../stores';
import { AIFlowBackground } from './AIFlowBackground';
import { NotificationBell, Modal } from './ui';
import { LayoutDashboard, Building2, Settings, CreditCard, Shield, Activity, Users, LogOut, Menu, X, Bell, Zap } from 'lucide-react';

// Super Admin Layout
export function SuperAdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markRead, markAllRead } = useAppStore();

  const nav = [
    { path: '/platform', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/platform/companies', icon: Building2, label: 'Companies' },
    { path: '/platform/users', icon: Users, label: 'Users' },
    { path: '/platform/payments', icon: CreditCard, label: 'Payments' },
    { path: '/platform/audit', icon: Shield, label: 'Audit Logs' },
    { path: '/platform/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AIFlowBackground variant="subtle" />
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">AutoFlow AI</h1>
            <p className="text-[10px] text-cyan-400 font-medium">PLATFORM CONTROL</p>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map(item => (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${location.pathname === item.path ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">{user?.name?.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500">Super Admin</p>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-red-400"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-4 lg:px-6 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">Platform Operational</span>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell count={unreadCount} onClick={() => setNotifOpen(true)} />
          </div>
        </header>
        <main className="p-4 lg:p-6 relative">{children}</main>
      </div>

      {/* Notification Panel */}
      <Modal open={notifOpen} onClose={() => setNotifOpen(false)} title="Notifications" size="md">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-400">{unreadCount} unread</p>
          <button onClick={markAllRead} className="text-xs text-cyan-400 hover:text-cyan-300">Mark all read</button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notifications.slice(0, 20).map(n => (
            <div key={n.id} onClick={() => markRead(n.id)} className={`p-3 rounded-lg border cursor-pointer transition-all ${n.read ? 'border-slate-800 bg-slate-900/40' : 'border-cyan-500/20 bg-cyan-500/5'}`}>
              <div className="flex items-start gap-2">
                <Bell className={`w-4 h-4 mt-0.5 ${n.type === 'error' ? 'text-red-400' : n.type === 'success' ? 'text-emerald-400' : n.type === 'warning' ? 'text-amber-400' : 'text-cyan-400'}`} />
                <div>
                  <p className="text-sm font-medium text-white">{n.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-slate-600 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
          {notifications.length === 0 && <p className="text-center text-sm text-slate-500 py-8">No notifications</p>}
        </div>
      </Modal>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}

// Company Admin Layout
export function CompanyAdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markRead, markAllRead } = useAppStore();

  const nav = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Team' },
    { path: '/admin/workflows', icon: Activity, label: 'Workflows' },
    { path: '/admin/executions', icon: Zap, label: 'Executions' },
    { path: '/admin/integrations', icon: Building2, label: 'Integrations' },
    { path: '/admin/billing', icon: CreditCard, label: 'Billing' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AIFlowBackground variant="subtle" />
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">AutoFlow AI</h1>
            <p className="text-[10px] text-cyan-400 font-medium">COMPANY ADMIN</p>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map(item => (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${location.pathname === item.path ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white">{user?.name?.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500">Company Admin</p>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-red-400"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-4 lg:px-6 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="text-sm text-slate-400">Automation Operations Center</div>
          <div className="flex items-center gap-3">
            <NotificationBell count={unreadCount} onClick={() => setNotifOpen(true)} />
          </div>
        </header>
        <main className="p-4 lg:p-6 relative">{children}</main>
      </div>

      <Modal open={notifOpen} onClose={() => setNotifOpen(false)} title="Notifications" size="md">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-400">{unreadCount} unread</p>
          <button onClick={markAllRead} className="text-xs text-cyan-400 hover:text-cyan-300">Mark all read</button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notifications.slice(0, 20).map(n => (
            <div key={n.id} onClick={() => markRead(n.id)} className={`p-3 rounded-lg border cursor-pointer transition-all ${n.read ? 'border-slate-800 bg-slate-900/40' : 'border-cyan-500/20 bg-cyan-500/5'}`}>
              <p className="text-sm font-medium text-white">{n.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
            </div>
          ))}
          {notifications.length === 0 && <p className="text-center text-sm text-slate-500 py-8">No notifications</p>}
        </div>
      </Modal>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}

// User Layout
export function UserLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markRead, markAllRead } = useAppStore();

  const nav = [
    { path: '/app', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/app/automations', icon: Zap, label: 'My Automations' },
    { path: '/app/builder', icon: Activity, label: 'Workflow Builder' },
    { path: '/app/executions', icon: Shield, label: 'Executions' },
    { path: '/app/integrations', icon: Building2, label: 'Integrations' },
    { path: '/app/webhooks', icon: Activity, label: 'Webhooks' },
    { path: '/app/templates', icon: LayoutDashboard, label: 'Templates' },
    { path: '/app/analytics', icon: CreditCard, label: 'Analytics' },
    { path: '/app/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AIFlowBackground variant="subtle" />
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">AutoFlow AI</h1>
            <p className="text-[10px] text-cyan-400 font-medium">WORKSPACE</p>
          </div>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {nav.map(item => (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${location.pathname === item.path ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">{user?.name?.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500">User</p>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-red-400"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-4 lg:px-6 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="text-sm text-slate-400">Personal Automation Workspace</div>
          <div className="flex items-center gap-3">
            <NotificationBell count={unreadCount} onClick={() => setNotifOpen(true)} />
          </div>
        </header>
        <main className="p-4 lg:p-6 relative">{children}</main>
      </div>

      <Modal open={notifOpen} onClose={() => setNotifOpen(false)} title="Notifications" size="md">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-400">{unreadCount} unread</p>
          <button onClick={markAllRead} className="text-xs text-cyan-400 hover:text-cyan-300">Mark all read</button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notifications.slice(0, 20).map(n => (
            <div key={n.id} onClick={() => markRead(n.id)} className={`p-3 rounded-lg border cursor-pointer transition-all ${n.read ? 'border-slate-800 bg-slate-900/40' : 'border-cyan-500/20 bg-cyan-500/5'}`}>
              <p className="text-sm font-medium text-white">{n.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
            </div>
          ))}
          {notifications.length === 0 && <p className="text-center text-sm text-slate-500 py-8">No notifications</p>}
        </div>
      </Modal>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
