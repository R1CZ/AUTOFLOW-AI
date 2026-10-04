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
  const [regStep, setRegStep] = useState(1); // 1: Industry, 2: Company Info, 3: Plan, 4: User Account
  const [regData, setRegData] = useState({ 
    industry: '', 
    companyName: '', 
    country: 'US', 
    timezone: 'America/New_York',
    planId: 'plan_starter',
    userName: '',
    userEmail: '',
    userPassword: ''
  });
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);
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
    
    // Final step: create user account
    if (regStep === 4) {
      if (!regData.userName || !regData.userEmail || !regData.userPassword) {
        setError('Please fill in all user account fields.');
        return;
      }
      if (regData.userPassword.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
      
      setLoading(true);
      // Register with the admin user account
      const result = await register({ 
        email: regData.userEmail, 
        password: regData.userPassword, 
        name: regData.userName, 
        companyName: regData.companyName, 
        industry: regData.industry, 
        country: regData.country, 
        timezone: regData.timezone, 
        planId: regData.planId 
      });
      setLoading(false);
      
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error || 'Registration failed.');
      }
      return;
    }
    
    // Move to next step
    if (regStep === 1 && !regData.industry) {
      setError('Please select an industry.');
      return;
    }
    if (regStep === 2 && (!regData.companyName || !regData.country)) {
      setError('Please fill in all company information.');
      return;
    }
    
    setRegStep(regStep + 1);
    setError('');
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
            {!isRegister ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-sm text-slate-400 mb-6">Sign in to your automation workspace</p>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
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

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500/50" />
                      <span className="text-sm text-slate-400">Remember me</span>
                    </label>
                    <button type="button" className="text-sm text-cyan-400 hover:text-cyan-300">Forgot password?</button>
                  </div>

                  <Button type="submit" loading={loading} className="w-full">
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {regStep === 1 && 'Select Your Industry'}
                  {regStep === 2 && 'Company Information'}
                  {regStep === 3 && 'Choose Your Plan'}
                  {regStep === 4 && 'Create Admin Account'}
                </h2>
                <p className="text-sm text-slate-400 mb-4">
                  {regStep === 1 && 'What industry does your company operate in?'}
                  {regStep === 2 && 'Tell us about your company'}
                  {regStep === 3 && 'Select the subscription plan for your company'}
                  {regStep === 4 && 'Create the admin account to manage your company'}
                </p>

                {/* Progress indicator */}
                <div className="flex items-center gap-2 mb-6">
                  {[1, 2, 3, 4].map(step => (
                    <div key={step} className={`flex-1 h-1.5 rounded-full ${step <= regStep ? 'bg-cyan-500' : 'bg-slate-700'}`} />
                  ))}
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Step 1: Industry Selection */}
                  {regStep === 1 && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-300">Industry</label>
                      <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
                        {db.INDUSTRIES.map(ind => (
                          <button
                            key={ind.value}
                            type="button"
                            onClick={() => setRegData({ ...regData, industry: ind.value })}
                            className={`flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-all ${
                              regData.industry === ind.value 
                                ? 'border-cyan-500 bg-cyan-500/10 text-white' 
                                : 'border-slate-700 bg-slate-800/30 text-slate-300 hover:border-slate-600'
                            }`}
                          >
                            <span className="text-lg">{ind.icon}</span>
                            <span className="text-xs font-medium truncate">{ind.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Company Information */}
                  {regStep === 2 && (
                    <div className="space-y-4">
                      <Input label="Company Name" value={regData.companyName} onChange={e => setRegData({...regData, companyName: e.target.value})} placeholder="Acme Corp" />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-slate-300">Country</label>
                          <select value={regData.country} onChange={e => setRegData({...regData, country: e.target.value})} className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="AU">Australia</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            <option value="JP">Japan</option>
                            <option value="IN">India</option>
                            <option value="BR">Brazil</option>
                            <option value="SG">Singapore</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-slate-300">Timezone</label>
                          <select value={regData.timezone} onChange={e => setRegData({...regData, timezone: e.target.value})} className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                            <option value="America/New_York">Eastern (US)</option>
                            <option value="America/Chicago">Central (US)</option>
                            <option value="America/Denver">Mountain (US)</option>
                            <option value="America/Los_Angeles">Pacific (US)</option>
                            <option value="Europe/London">London</option>
                            <option value="Europe/Paris">Paris</option>
                            <option value="Asia/Tokyo">Tokyo</option>
                            <option value="Asia/Kolkata">India</option>
                            <option value="Asia/Singapore">Singapore</option>
                            <option value="Australia/Sydney">Sydney</option>
                          </select>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                        <p className="text-xs text-cyan-400">
                          <strong>Selected Industry:</strong> {db.INDUSTRIES.find(i => i.value === regData.industry)?.icon} {db.INDUSTRIES.find(i => i.value === regData.industry)?.label}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Workflows and templates will be customized for your industry.</p>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Plan Selection */}
                  {regStep === 3 && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-300">Subscription Plan</label>
                      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                        {db.getPlans().filter(p => !p.isTrial).map(plan => (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => setRegData({ ...regData, planId: plan.id })}
                            className={`w-full p-4 rounded-lg border text-left transition-all ${
                              regData.planId === plan.id 
                                ? 'border-cyan-500 bg-cyan-500/10' 
                                : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-white">{plan.name}</span>
                              <span className="text-lg font-bold text-cyan-400">${plan.monthlyPrice}<span className="text-xs text-slate-500">/mo</span></span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {plan.features.slice(0, 4).map((f, i) => (
                                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400">{f}</span>
                              ))}
                              {plan.features.length > 4 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400">+{plan.features.length - 4} more</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 4: User Account Creation */}
                  {regStep === 4 && (
                    <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 mb-2">
                        <p className="text-xs text-slate-400 mb-1">Company Summary</p>
                        <p className="text-sm text-white font-medium">{regData.companyName}</p>
                        <p className="text-xs text-slate-500">
                          {db.INDUSTRIES.find(i => i.value === regData.industry)?.icon} {db.INDUSTRIES.find(i => i.value === regData.industry)?.label} · {db.getPlans().find(p => p.id === regData.planId)?.name} Plan
                        </p>
                      </div>
                      <Input label="Your Full Name" value={regData.userName} onChange={e => setRegData({...regData, userName: e.target.value})} placeholder="John Doe" />
                      <Input label="Your Email Address" type="email" value={regData.userEmail} onChange={e => setRegData({...regData, userEmail: e.target.value})} placeholder="john@company.com" />
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-300">Password</label>
                        <div className="relative">
                          <input type={showPassword ? 'text' : 'password'} value={regData.userPassword} onChange={e => setRegData({...regData, userPassword: e.target.value})} placeholder="Min. 8 characters" className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-slate-500">This will be the admin account for your company.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {regStep > 1 && (
                      <Button type="button" variant="outline" onClick={() => setRegStep(regStep - 1)} className="flex-1">
                        Back
                      </Button>
                    )}
                    <Button type="submit" loading={loading} className="flex-1">
                      {regStep === 4 ? 'Create Company & Account' : 'Continue'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
                {' '}
                {settings.companySelfSignup && (
                  <button onClick={() => { setIsRegister(!isRegister); setError(''); setRegStep(1); }} className="text-cyan-400 hover:text-cyan-300 font-medium">
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
