import { useState, useRef, useEffect, type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes } from 'react';
import { X, Search, ChevronLeft, ChevronRight, Bell, Check, AlertCircle, Loader2, Copy } from 'lucide-react';

// Button
export function Button({ children, variant = 'primary', size = 'md', loading, disabled, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'; size?: 'sm' | 'md' | 'lg'; loading?: boolean }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700',
    danger: 'bg-red-600 text-white hover:bg-red-500',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800',
    outline: 'border border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500',
  };
  const sizes = { sm: 'px-3 py-1.5 text-xs gap-1.5', md: 'px-4 py-2 text-sm gap-2', lg: 'px-6 py-3 text-base gap-2' };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

// Input
export function Input({ label, error, icon, className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; icon?: ReactNode }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</div>}
        <input className={`w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all ${icon ? 'pl-10' : ''} ${error ? 'border-red-500' : ''} ${className}`} {...props} />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// Select
export function Select({ label, options, value, onChange, className = '' }: { label?: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} className={`w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${className}`}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// Card
export function Card({ children, className = '', hover = false, onClick }: { children: ReactNode; className?: string; hover?: boolean; onClick?: () => void }) {
  return (
    <div className={`bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl ${hover ? 'hover:border-slate-700 hover:bg-slate-900/80 cursor-pointer transition-all' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

// Badge
export function Badge({ children, variant = 'default', className = '' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple'; className?: string }) {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${variants[variant]} ${className}`}>{children}</span>;
}

// Modal
export function Modal({ open, onClose, title, children, size = 'md' }: { open: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// Table
export function Table({ headers, children, className = '' }: { headers: string[]; children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-800 ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="bg-slate-900/80 border-b border-slate-800">
            {headers.map((h, i) => <th key={i} className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">{children}</tbody>
      </table>
    </div>
  );
}

// Search Bar
export function SearchBar({ value, onChange, placeholder = 'Search...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" />
    </div>
  );
}

// Pagination
export function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-sm text-slate-400">Page {page} of {totalPages}</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}><ChevronLeft className="w-4 h-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}><ChevronRight className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}

// Dropdown
export function Dropdown({ trigger, items }: { trigger: ReactNode; items: { label: string; onClick: () => void; danger?: boolean }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 py-1">
          {items.map((item, i) => (
            <button key={i} onClick={() => { item.onClick(); setOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-800 transition-colors ${item.danger ? 'text-red-400' : 'text-slate-300'}`}>{item.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// Tabs
export function Tabs({ tabs, activeTab, onChange }: { tabs: { id: string; label: string; count?: number }[]; activeTab: string; onChange: (id: string) => void }) {
  return (
    <div className="flex gap-1 border-b border-slate-800 pb-px">
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)} className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all ${activeTab === tab.id ? 'text-cyan-400 bg-slate-900/60 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}>
          {tab.label}{tab.count !== undefined && <span className="ml-1.5 text-xs text-slate-500">({tab.count})</span>}
        </button>
      ))}
    </div>
  );
}

// Notification Bell
export function NotificationBell({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors">
      <Bell className="w-5 h-5 text-slate-400" />
      {count > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">{count > 9 ? '9+' : count}</span>}
    </button>
  );
}

// Empty State
export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-500">{icon}</div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-4">{description}</p>
      {action}
    </div>
  );
}

// Loading
export function Loading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
}

// Stat Card
export function StatCard({ label, value, change, icon, variant = 'default' }: { label: string; value: string | number; change?: string; icon: ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' }) {
  const variants = {
    default: 'from-slate-800/50 to-slate-900/50 border-slate-700/50',
    success: 'from-emerald-900/20 to-slate-900/50 border-emerald-800/30',
    warning: 'from-amber-900/20 to-slate-900/50 border-amber-800/30',
    error: 'from-red-900/20 to-slate-900/50 border-red-800/30',
  };
  return (
    <Card className={`bg-gradient-to-br ${variants[variant]} p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && <p className="text-xs text-emerald-400 mt-1">{change}</p>}
        </div>
        <div className="p-2 rounded-lg bg-slate-800/50 text-cyan-400">{icon}</div>
      </div>
    </Card>
  );
}

// Toast notification
export function Toast({ message, type = 'info', onClose }: { message: string; type?: 'info' | 'success' | 'error' | 'warning'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  const colors = { info: 'border-cyan-500 bg-cyan-500/10', success: 'border-emerald-500 bg-emerald-500/10', error: 'border-red-500 bg-red-500/10', warning: 'border-amber-500 bg-amber-500/10' };
  const icons = { info: <AlertCircle className="w-4 h-4 text-cyan-400" />, success: <Check className="w-4 h-4 text-emerald-400" />, error: <X className="w-4 h-4 text-red-400" />, warning: <AlertCircle className="w-4 h-4 text-amber-400" /> };
  return (
    <div className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg border ${colors[type]} backdrop-blur-sm shadow-xl animate-in slide-in-from-bottom`}>
      {icons[type]}
      <p className="text-sm text-white">{message}</p>
      <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
    </div>
  );
}

// Copy Button
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" title="Copy">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// Progress Bar
export function ProgressBar({ value, max, label, showPercentage = true }: { value: number; max: number; label?: string; showPercentage?: boolean }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-cyan-500';
  return (
    <div className="space-y-1">
      {(label || showPercentage) && (
        <div className="flex justify-between text-xs">
          {label && <span className="text-slate-400">{label}</span>}
          {showPercentage && <span className="text-slate-500">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
