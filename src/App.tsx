import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, useAppStore } from './stores';
import { SuperAdminLayout, CompanyAdminLayout, UserLayout } from './components/layouts';
import { LoginPage } from './pages/auth';
import { PlatformDashboard, CompaniesPage, CompanyDetailPage, PlatformUsersPage, PaymentsPage, AuditLogsPage, PlatformSettingsPage } from './pages/platform';
import { AdminDashboard, AdminUsersPage, AdminWorkflowsPage, AdminExecutionsPage, AdminIntegrationsPage, AdminBillingPage, AdminSettingsPage } from './pages/company-admin';
import { UserDashboard, UserAutomationsPage, WorkflowBuilderPage, UserExecutionsPage, UserIntegrationsPage, UserWebhooksPage, UserTemplatesPage, UserAnalyticsPage, UserSettingsPage } from './pages/user-app';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { isAuthenticated, user, isLoading, restoreSession } = useAuthStore();
  const location = useLocation();

  useEffect(() => { restoreSession(); }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <p className="text-sm text-slate-400">Loading AutoFlow AI...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard
    if (user.role === 'super_admin') return <Navigate to="/platform" replace />;
    if (user.role === 'company_admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

function NotificationLoader() {
  const { loadNotifications } = useAppStore();
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);
  
  return null;
}

function AppRoutes() {
  return (
    <>
      <NotificationLoader />
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Super Admin Routes */}
        <Route path="/platform" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <SuperAdminLayout><PlatformDashboard /></SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/platform/companies" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <SuperAdminLayout><CompaniesPage /></SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/platform/companies/:id" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <SuperAdminLayout><CompanyDetailPage /></SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/platform/users" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <SuperAdminLayout><PlatformUsersPage /></SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/platform/payments" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <SuperAdminLayout><PaymentsPage /></SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/platform/audit" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <SuperAdminLayout><AuditLogsPage /></SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/platform/settings" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <SuperAdminLayout><PlatformSettingsPage /></SuperAdminLayout>
          </ProtectedRoute>
        } />

        {/* Company Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <CompanyAdminLayout><AdminDashboard /></CompanyAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <CompanyAdminLayout><AdminUsersPage /></CompanyAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/workflows" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <CompanyAdminLayout><AdminWorkflowsPage /></CompanyAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/executions" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <CompanyAdminLayout><AdminExecutionsPage /></CompanyAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/integrations" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <CompanyAdminLayout><AdminIntegrationsPage /></CompanyAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/billing" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <CompanyAdminLayout><AdminBillingPage /></CompanyAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <CompanyAdminLayout><AdminSettingsPage /></CompanyAdminLayout>
          </ProtectedRoute>
        } />

        {/* User Routes */}
        <Route path="/app" element={
          <ProtectedRoute allowedRoles={['user', 'company_admin']}>
            <UserLayout><UserDashboard /></UserLayout>
          </ProtectedRoute>
        } />
        <Route path="/app/automations" element={
          <ProtectedRoute allowedRoles={['user', 'company_admin']}>
            <UserLayout><UserAutomationsPage /></UserLayout>
          </ProtectedRoute>
        } />
        <Route path="/app/builder" element={
          <ProtectedRoute allowedRoles={['user', 'company_admin']}>
            <UserLayout><WorkflowBuilderPage /></UserLayout>
          </ProtectedRoute>
        } />
        <Route path="/app/executions" element={
          <ProtectedRoute allowedRoles={['user', 'company_admin']}>
            <UserLayout><UserExecutionsPage /></UserLayout>
          </ProtectedRoute>
        } />
        <Route path="/app/integrations" element={
          <ProtectedRoute allowedRoles={['user', 'company_admin']}>
            <UserLayout><UserIntegrationsPage /></UserLayout>
          </ProtectedRoute>
        } />
        <Route path="/app/webhooks" element={
          <ProtectedRoute allowedRoles={['user', 'company_admin']}>
            <UserLayout><UserWebhooksPage /></UserLayout>
          </ProtectedRoute>
        } />
        <Route path="/app/templates" element={
          <ProtectedRoute allowedRoles={['user', 'company_admin']}>
            <UserLayout><UserTemplatesPage /></UserLayout>
          </ProtectedRoute>
        } />
        <Route path="/app/analytics" element={
          <ProtectedRoute allowedRoles={['user', 'company_admin']}>
            <UserLayout><UserAnalyticsPage /></UserLayout>
          </ProtectedRoute>
        } />
        <Route path="/app/settings" element={
          <ProtectedRoute allowedRoles={['user', 'company_admin']}>
            <UserLayout><UserSettingsPage /></UserLayout>
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
