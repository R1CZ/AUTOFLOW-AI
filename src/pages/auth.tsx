import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { AIFlowBackground } from '../components/AIFlowBackground';
import { Button, Input } from '../components/ui';
import { Zap, Eye, EyeOff, ArrowRight, Shield, Workflow, Brain } from 'lucide-react';
import * as db from '../lib/database';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [regData, setRegData] = useState({ name: '', companyName: '', industry: '', country: 'US', timezone: 'America/New_York' });
  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      const user = useAuthStore.getState().user;
      if (user?.role === 'super_admin') navigate('/platform');
      else if (user?.role === 'company_admin') navigate('/admin');
      else navigate('/app');
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password || !regData.name || !regData.companyName) { setError('Please fill in all required fields.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    const result = await register({ email, password, name: regData.name, companyName: regData.companyName, industry: regData.industry, country: regData.country, timezone: regData.timezone, planId: 'plan_trial' });
    setLoading(false);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Registration failed.');
    }
  };

  const settings = db.getSettings();

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Side - AI Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <AIFlowBackground variant="login" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/80 to-cyan-950/30" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AutoFlow AI</h1>
              <p className="text-xs text-cyan-400 font-medium tracking-wider">INTELLIGENT AUTOMATION</p>
            </div>
          </div>
          
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            AI-Powered<br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Automation Platform</span>
          </h2>
          
          <p className="text-lg text-slate-300 mb-10 max-w-md">
            Connect your applications, automate workflows, and let AI handle the complexity. Build, execute, and monitor intelligent automations at scale.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">AI Decision Engine</p>
                <p className="text-xs text-slate-400">Intelligent classification, extraction & routing</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Workflow className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Visual Workflow Builder</p>
                <p className="text-xs text-slate-400">Drag, connect, and automate visually</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Enterprise Security</p>
                <p className="text-xs text-slate-400">Multi-tenant isolation & role-based access</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">AutoFlow AI</h1>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-sm text-slate-400 mb-6">{isRegister ? 'Start your 14-day free trial' : 'Sign in to your automation workspace'}</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>
            )}

            <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
              {isRegister && (
                <>
                  <Input label="Full Name" value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} placeholder="John Doe" />
                  <Input label="Company Name" value={regData.companyName} onChange={e => setRegData({...regData, companyName: e.target.value})} placeholder="Acme Corp" />
                </>
              )}
              <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isRegister && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500/50" />
                    <span className="text-sm text-slate-400">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-cyan-400 hover:text-cyan-300">Forgot password?</button>
                </div>
              )}

              <Button type="submit" loading={loading} className="w-full">
                {isRegister ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
                {' '}
                {settings.companySelfSignup && (
                  <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-cyan-400 hover:text-cyan-300 font-medium">
                    {isRegister ? 'Sign In' : 'Register'}
                  </button>
                )}
                {!settings.companySelfSignup && !isRegister && <span className="text-slate-600">Registration disabled</span>}
              </p>
            </div>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900/30 border border-slate-800">
            <p className="text-xs font-medium text-slate-400 mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-xs">
              <button onClick={() => { setEmail('admin@autoflow.ai'); setPassword('demo'); }} className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors">
                <span>Super Admin</span><span className="text-slate-600">admin@autoflow.ai</span>
              </button>
              <button onClick={() => { setEmail('john@techventures.com'); setPassword('demo'); }} className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors">
                <span>Company Admin</span><span className="text-slate-600">john@techventures.com</span>
              </button>
              <button onClick={() => { setEmail('sarah@techventures.com'); setPassword('demo'); }} className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors">
                <span>User</span><span className="text-slate-600">sarah@techventures.com</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
