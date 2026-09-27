import { useState, useMemo, useRef, useEffect } from 'react';
import { useAuthStore } from '../stores';
import * as db from '../lib/database';
import { Card, Badge, Button, Table, SearchBar, Modal, Input, Select, StatCard, Tabs, Toast, EmptyState, ProgressBar } from '../components/ui';
import { Zap, Workflow, Activity, Plus, Play, Pause, Trash2, Copy, Settings, Webhook, Clock, CheckCircle, XCircle, AlertCircle, GitBranch, Brain, Bell, Shield, RefreshCw } from 'lucide-react';
import type { WorkflowNode, WorkflowConnection } from '../types';

// User Dashboard
export function UserDashboard() {
  const { user } = useAuthStore();
  if (!user?.companyId) return null;

  const workflows = db.getWorkflows(user.companyId).filter(w => w.createdById === user.id || true);
  const executions = db.getExecutions(user.companyId);
  const myWorkflows = workflows.slice(0, 5);
  const myExecs = executions.slice(0, 5);
  const successRate = executions.length > 0 ? Math.round((executions.filter(e => e.status === 'success').length / executions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Workspace</h1>
        <p className="text-sm text-slate-400 mt-1">Your personal automation dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Workflows" value={workflows.length} icon={<Workflow className="w-5 h-5" />} />
        <StatCard label="Active" value={workflows.filter(w => w.status === 'active').length} icon={<Play className="w-5 h-5" />} variant="success" />
        <StatCard label="Total Executions" value={executions.length} icon={<Zap className="w-5 h-5" />} />
        <StatCard label="Success Rate" value={`${successRate}%`} icon={<CheckCircle className="w-5 h-5" />} variant={successRate >= 90 ? 'success' : 'warning'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-white">My Workflows</h3>
            <a href="/app/automations" className="text-xs text-cyan-400 hover:text-cyan-300">View all →</a>
          </div>
          <div className="space-y-2">
            {myWorkflows.map(w => (
              <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${w.status === 'active' ? 'bg-emerald-400' : w.status === 'paused' ? 'bg-amber-400' : 'bg-slate-500'}`} />
                  <div>
                    <p className="text-sm text-white">{w.name}</p>
                    <p className="text-xs text-slate-500">{w.executionCount} runs</p>
                  </div>
                </div>
                <Badge variant={w.status === 'active' ? 'success' : w.status === 'paused' ? 'warning' : 'default'}>{w.status}</Badge>
              </div>
            ))}
            {myWorkflows.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No workflows yet. Create one!</p>}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-white">Recent Executions</h3>
            <a href="/app/executions" className="text-xs text-cyan-400 hover:text-cyan-300">View all →</a>
          </div>
          <div className="space-y-2">
            {myExecs.map(e => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                <div>
                  <p className="text-sm text-white">{e.workflowName}</p>
                  <p className="text-xs text-slate-500">{new Date(e.startedAt).toLocaleTimeString()}</p>
                </div>
                <Badge variant={e.status === 'success' ? 'success' : e.status === 'failed' ? 'error' : e.status === 'running' ? 'info' : 'default'}>{e.status}</Badge>
              </div>
            ))}
            {myExecs.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No executions yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

// My Automations
export function UserAutomationsPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!user?.companyId) return null;
  const workflows = db.getWorkflows(user.companyId);
  const filtered = search ? workflows.filter(w => w.name.toLowerCase().includes(search.toLowerCase())) : workflows;

  const handleToggle = (id: string, status: string) => {
    const newStatus = status === 'active' ? 'paused' : 'active';
    db.updateWorkflow(id, { status: newStatus as any });
    setToast({ message: `Workflow ${newStatus === 'active' ? 'activated' : 'paused'}.`, type: 'success' });
  };

  const handleDelete = (id: string) => {
    db.deleteWorkflow(id);
    setToast({ message: 'Workflow deleted.', type: 'success' });
  };

  const handleDuplicate = (id: string) => {
    const wf = db.getWorkflowById(id);
    if (wf) {
      db.createWorkflow({ name: `${wf.name} (Copy)`, description: wf.description, companyId: wf.companyId, createdById: wf.createdById, nodes: wf.nodes, connections: wf.connections });
      setToast({ message: 'Workflow duplicated.', type: 'success' });
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Automations</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your workflow automations</p>
        </div>
        <a href="/app/builder"><Button><Plus className="w-4 h-4" />New Workflow</Button></a>
      </div>

      <Card className="p-4">
        <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search automations..." /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(w => (
            <Card key={w.id} hover className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium text-white">{w.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{w.description}</p>
                </div>
                <Badge variant={w.status === 'active' ? 'success' : w.status === 'paused' ? 'warning' : 'default'}>{w.status}</Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                <span>{w.nodes.length} nodes</span>
                <span>{w.executionCount} runs</span>
                <span>v{w.version}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleToggle(w.id, w.status)}>{w.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}{w.status === 'active' ? 'Pause' : 'Activate'}</Button>
                <Button size="sm" variant="ghost" onClick={() => handleDuplicate(w.id)}><Copy className="w-3 h-3" /></Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(w.id)}><Trash2 className="w-3 h-3 text-red-400" /></Button>
              </div>
            </Card>
          ))}
        </div>
        {filtered.length === 0 && <EmptyState icon={<Workflow className="w-8 h-8" />} title="No automations" description="Create your first workflow automation." action={<a href="/app/builder"><Button><Plus className="w-4 h-4" />Create Workflow</Button></a>} />}
      </Card>
    </div>
  );
}

// Workflow Builder
export function WorkflowBuilderPage() {
  const { user } = useAuthStore();
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showNodePanel, setShowNodePanel] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [wfName, setWfName] = useState('');
  const [wfDesc, setWfDesc] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragNode, setDragNode] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<{ from: string; x: number; y: number } | null>(null);

  if (!user?.companyId) return null;
  const workflows = db.getWorkflows(user.companyId);
  const currentWf = selectedWorkflow ? workflows.find(w => w.id === selectedWorkflow) : null;

  useEffect(() => {
    if (currentWf) {
      setNodes(currentWf.nodes);
      setConnections(currentWf.connections);
      setWfName(currentWf.name);
      setWfDesc(currentWf.description);
    }
  }, [currentWf]);

  const nodeTypes = [
    { type: 'trigger' as const, label: 'Trigger', icon: Zap, color: 'from-emerald-500 to-green-600', desc: 'Start workflow on event' },
    { type: 'action' as const, label: 'Action', icon: Play, color: 'from-blue-500 to-indigo-600', desc: 'Perform an action' },
    { type: 'condition' as const, label: 'Condition', icon: GitBranch, color: 'from-amber-500 to-orange-600', desc: 'Branch based on data' },
    { type: 'ai_action' as const, label: 'AI Action', icon: Brain, color: 'from-purple-500 to-violet-600', desc: 'AI-powered processing' },
    { type: 'integration' as const, label: 'Integration', icon: Activity, color: 'from-cyan-500 to-blue-600', desc: 'Connect external service' },
    { type: 'transform' as const, label: 'Transform', icon: RefreshCw, color: 'from-pink-500 to-rose-600', desc: 'Transform data' },
    { type: 'approval' as const, label: 'Approval', icon: Shield, color: 'from-teal-500 to-emerald-600', desc: 'Human approval step' },
    { type: 'notification' as const, label: 'Notification', icon: Bell, color: 'from-yellow-500 to-amber-600', desc: 'Send notification' },
    { type: 'delay' as const, label: 'Delay', icon: Clock, color: 'from-slate-500 to-gray-600', desc: 'Wait/schedule' },
    { type: 'exception' as const, label: 'Exception', icon: AlertCircle, color: 'from-red-500 to-rose-600', desc: 'Handle errors' },
  ];

  const addNode = (type: WorkflowNode['type']) => {
    const nodeType = nodeTypes.find(n => n.type === type);
    const newNode: WorkflowNode = {
      id: 'node_' + Date.now(),
      type,
      label: nodeType?.label || 'Node',
      config: {},
      position: { x: 200 + nodes.length * 180, y: 200 + Math.random() * 100 },
    };
    setNodes([...nodes, newNode]);
    setShowNodePanel(false);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    setConnections(connections.filter(c => c.sourceId !== id && c.targetId !== id));
    if (selectedNode === id) setSelectedNode(null);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (connecting) {
      setConnecting(null);
    }
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (e.shiftKey) {
      // Start connection
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setConnecting({ from: nodeId, x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    } else {
      setDragNode(nodeId);
      setSelectedNode(nodeId);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (dragNode) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setNodes(nodes.map(n => n.id === dragNode ? { ...n, position: { x: e.clientX - rect.left - 60, y: e.clientY - rect.top - 25 } } : n));
      }
    }
    if (connecting) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setConnecting({ ...connecting, x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    if (dragNode) {
      setDragNode(null);
    }
    if (connecting) {
      // Check if dropped on a node
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const targetNode = nodes.find(n => n.id !== connecting.from && Math.abs(n.position.x + 60 - x) < 60 && Math.abs(n.position.y + 25 - y) < 25);
        if (targetNode) {
          const newConn: WorkflowConnection = { id: 'conn_' + Date.now(), sourceId: connecting.from, targetId: targetNode.id };
          if (!connections.find(c => c.sourceId === connecting.from && c.targetId === targetNode.id)) {
            setConnections([...connections, newConn]);
          }
        }
      }
      setConnecting(null);
    }
  };

  const handleSave = () => {
    if (selectedWorkflow && currentWf) {
      db.updateWorkflow(selectedWorkflow, { name: wfName, description: wfDesc, nodes, connections });
      setToast({ message: 'Workflow saved.', type: 'success' });
    }
  };

  const handleCreate = () => {
    if (!newName) return;
    const wf = db.createWorkflow({ name: newName, description: newDesc, companyId: user.companyId!, createdById: user.id });
    setSelectedWorkflow(wf.id);
    setNodes([]);
    setConnections([]);
    setWfName(newName);
    setWfDesc(newDesc);
    setShowNewModal(false);
    setNewName('');
    setNewDesc('');
    setToast({ message: 'Workflow created.', type: 'success' });
  };

  const handleRun = () => {
    if (!selectedWorkflow) return;
    db.executeWorkflow(selectedWorkflow, user.id);
    setToast({ message: 'Workflow execution started.', type: 'success' });
  };

  const getNodeColor = (type: string) => {
    const nt = nodeTypes.find(n => n.type === type);
    return nt?.color || 'from-slate-500 to-gray-600';
  };

  const getNodeIcon = (type: string) => {
    const nt = nodeTypes.find(n => n.type === type);
    return nt?.icon || Zap;
  };

  return (
    <div className="space-y-4 h-[calc(100vh-120px)] flex flex-col">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <select value={selectedWorkflow || ''} onChange={e => setSelectedWorkflow(e.target.value || null)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
            <option value="">Select workflow...</option>
            {workflows.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          {currentWf && <Badge variant={currentWf.status === 'active' ? 'success' : 'default'}>{currentWf.status}</Badge>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowNewModal(true)}><Plus className="w-4 h-4" />New</Button>
          {selectedWorkflow && (
            <>
              <Button variant="outline" size="sm" onClick={() => setShowNodePanel(true)}><Plus className="w-4 h-4" />Add Node</Button>
              <Button variant="secondary" size="sm" onClick={handleSave}><CheckCircle className="w-4 h-4" />Save</Button>
              <Button size="sm" onClick={handleRun}><Play className="w-4 h-4" />Run</Button>
            </>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex gap-4 min-h-0">
        <div ref={canvasRef} className="flex-1 relative bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden" onMouseDown={handleCanvasMouseDown} onMouseMove={handleCanvasMouseMove} onMouseUp={handleCanvasMouseUp}>
          {!selectedWorkflow ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Workflow className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Select or create a workflow to start building</p>
                <Button className="mt-4" onClick={() => setShowNewModal(true)}><Plus className="w-4 h-4" />Create Workflow</Button>
              </div>
            </div>
          ) : (
            <>
              {/* Grid pattern */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.1 }}>
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* SVG Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {connections.map(conn => {
                  const source = nodes.find(n => n.id === conn.sourceId);
                  const target = nodes.find(n => n.id === conn.targetId);
                  if (!source || !target) return null;
                  const sx = source.position.x + 120;
                  const sy = source.position.y + 25;
                  const tx = target.position.x;
                  const ty = target.position.y + 25;
                  const mx = (sx + tx) / 2;
                  return (
                    <g key={conn.id}>
                      <path d={`M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}`} fill="none" stroke="url(#connGradient)" strokeWidth="2" strokeDasharray="4 2" className="animate-pulse" />
                      <circle r="3" fill="#06b6d4">
                        <animateMotion dur="2s" repeatCount="indefinite" path={`M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}`} />
                      </circle>
                    </g>
                  );
                })}
                {connecting && (
                  <line x1={nodes.find(n => n.id === connecting.from)?.position.x! + 120 || 0} y1={nodes.find(n => n.id === connecting.from)?.position.y! + 25 || 0} x2={connecting.x} y2={connecting.y} stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" />
                )}
                <defs>
                  <linearGradient id="connGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Nodes */}
              {nodes.map(node => {
                const Icon = getNodeIcon(node.type);
                const isSelected = selectedNode === node.id;
                return (
                  <div key={node.id} className={`absolute cursor-move select-none group ${isSelected ? 'z-20' : 'z-10'}`} style={{ left: node.position.x, top: node.position.y }} onMouseDown={e => handleNodeMouseDown(e, node.id)}>
                    <div className={`w-[140px] rounded-xl border ${isSelected ? 'border-cyan-400 shadow-lg shadow-cyan-500/20' : 'border-slate-700'} bg-slate-900/90 backdrop-blur-sm overflow-hidden transition-all hover:border-slate-600`}>
                      <div className={`h-1 bg-gradient-to-r ${getNodeColor(node.type)}`} />
                      <div className="p-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${getNodeColor(node.type)} flex items-center justify-center`}>
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs font-medium text-white truncate">{node.label}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 capitalize">{node.type.replace('_', ' ')}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 flex gap-1">
                          <button onClick={(e) => { e.stopPropagation(); removeNode(node.id); }} className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-400"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      )}
                      {/* Connection point */}
                      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-500 border-2 border-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" title="Shift+drag to connect" />
                    </div>
                  </div>
                );
              })}

              {/* Help text */}
              {nodes.length > 0 && (
                <div className="absolute bottom-3 left-3 text-[10px] text-slate-600">
                  Drag nodes to move • Shift+drag from node to connect • Click to select
                </div>
              )}
            </>
          )}
        </div>

        {/* Node Config Panel */}
        {selectedNode && (
          <div className="w-72 bg-slate-900/60 border border-slate-800 rounded-xl p-4 overflow-y-auto">
            {(() => {
              const node = nodes.find(n => n.id === selectedNode);
              if (!node) return null;
              const Icon = getNodeIcon(node.type);
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getNodeColor(node.type)} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{node.label}</p>
                      <p className="text-xs text-slate-500 capitalize">{node.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <Input label="Label" value={node.label} onChange={e => setNodes(nodes.map(n => n.id === node.id ? { ...n, label: e.target.value } : n))} />
                  {node.type === 'trigger' && (
                    <Select label="Trigger Source" value={node.config.source || 'webhook'} onChange={v => setNodes(nodes.map(n => n.id === node.id ? { ...n, config: { ...n.config, source: v } } : n))} options={[{ value: 'webhook', label: 'Webhook' }, { value: 'schedule', label: 'Schedule' }, { value: 'email', label: 'Email' }, { value: 'form', label: 'Form' }]} />
                  )}
                  {node.type === 'ai_action' && (
                    <>
                      <Select label="AI Model" value={node.config.model || 'gpt-4'} onChange={v => setNodes(nodes.map(n => n.id === node.id ? { ...n, config: { ...n.config, model: v } } : n))} options={[{ value: 'gpt-4', label: 'GPT-4' }, { value: 'gpt-3.5', label: 'GPT-3.5 Turbo' }, { value: 'claude', label: 'Claude' }]} />
                      <Input label="Prompt" value={node.config.prompt || ''} onChange={e => setNodes(nodes.map(n => n.id === node.id ? { ...n, config: { ...n.config, prompt: e.target.value } } : n))} placeholder="Describe the AI task..." />
                    </>
                  )}
                  {node.type === 'condition' && (
                    <>
                      <Input label="Field" value={node.config.field || ''} onChange={e => setNodes(nodes.map(n => n.id === node.id ? { ...n, config: { ...n.config, field: e.target.value } } : n))} placeholder="field_name" />
                      <Select label="Operator" value={node.config.operator || 'equals'} onChange={v => setNodes(nodes.map(n => n.id === node.id ? { ...n, config: { ...n.config, operator: v } } : n))} options={[{ value: 'equals', label: 'Equals' }, { value: 'contains', label: 'Contains' }, { value: 'gte', label: 'Greater or Equal' }, { value: 'lte', label: 'Less or Equal' }]} />
                      <Input label="Value" value={node.config.value || ''} onChange={e => setNodes(nodes.map(n => n.id === node.id ? { ...n, config: { ...n.config, value: e.target.value } } : n))} />
                    </>
                  )}
                  {node.type === 'integration' && (
                    <>
                      <Select label="Provider" value={node.config.provider || 'slack'} onChange={v => setNodes(nodes.map(n => n.id === node.id ? { ...n, config: { ...n.config, provider: v } } : n))} options={[{ value: 'slack', label: 'Slack' }, { value: 'salesforce', label: 'Salesforce' }, { value: 'gmail', label: 'Gmail' }, { value: 'github', label: 'GitHub' }]} />
                      <Input label="Action" value={node.config.action || ''} onChange={e => setNodes(nodes.map(n => n.id === node.id ? { ...n, config: { ...n.config, action: e.target.value } } : n))} placeholder="e.g., send_message" />
                    </>
                  )}
                  {node.type === 'action' && (
                    <Select label="Action Type" value={node.config.template || ''} onChange={v => setNodes(nodes.map(n => n.id === node.id ? { ...n, config: { ...n.config, template: v } } : n))} options={[{ value: 'send_email', label: 'Send Email' }, { value: 'create_record', label: 'Create Record' }, { value: 'update_record', label: 'Update Record' }, { value: 'webhook_call', label: 'Webhook Call' }]} />
                  )}
                  {node.type === 'notification' && (
                    <>
                      <Select label="Channel" value={node.config.channel || 'email'} onChange={v => setNodes(nodes.map(n => n.id === node.id ? { ...n, config: { ...n.config, channel: v } } : n))} options={[{ value: 'email', label: 'Email' }, { value: 'slack', label: 'Slack' }, { value: 'sms', label: 'SMS' }, { value: 'in_app', label: 'In-App' }]} />
                      <Input label="Message" value={node.config.message || ''} onChange={e => setNodes(nodes.map(n => n.id === node.id ? { ...n, config: { ...n.config, message: e.target.value } } : n))} placeholder="Notification message..." />
                    </>
                  )}
                  {node.type === 'approval' && (
                    <Input label="Approver" value={node.config.approver || ''} onChange={e => setNodes(nodes.map(n => n.id === node.id ? { ...n, config: { ...n.config, approver: e.target.value } } : n))} placeholder="Email or role..." />
                  )}
                  {node.type === 'delay' && (
                    <>
                      <Input label="Duration" type="number" value={node.config.duration || '60'} onChange={e => setNodes(nodes.map(n => n.id === node.id ? { ...n, config: { ...n.config, duration: e.target.value } } : n))} />
                      <Select label="Unit" value={node.config.unit || 'seconds'} onChange={v => setNodes(nodes.map(n => n.id === node.id ? { ...n, config: { ...n.config, unit: v } } : n))} options={[{ value: 'seconds', label: 'Seconds' }, { value: 'minutes', label: 'Minutes' }, { value: 'hours', label: 'Hours' }]} />
                    </>
                  )}
                  <Button variant="danger" size="sm" onClick={() => removeNode(node.id)}><Trash2 className="w-3 h-3" />Delete Node</Button>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Add Node Panel */}
      <Modal open={showNodePanel} onClose={() => setShowNodePanel(false)} title="Add Node" size="lg">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {nodeTypes.map(nt => (
            <button key={nt.type} onClick={() => addNode(nt.type)} className="p-4 rounded-xl border border-slate-700 hover:border-cyan-500/50 bg-slate-800/30 hover:bg-slate-800/60 transition-all text-left group">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${nt.color} flex items-center justify-center mb-2`}>
                <nt.icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{nt.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{nt.desc}</p>
            </button>
          ))}
        </div>
      </Modal>

      {/* New Workflow Modal */}
      <Modal open={showNewModal} onClose={() => setShowNewModal(false)} title="Create New Workflow">
        <div className="space-y-4">
          <Input label="Workflow Name" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g., Customer Onboarding" />
          <Input label="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="What does this workflow do?" />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Cancel</Button>
            <Button onClick={handleCreate}><Plus className="w-4 h-4" />Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// User Executions
export function UserExecutionsPage() {
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
        <p className="text-sm text-slate-400 mt-1">View workflow execution history and logs</p>
      </div>

      <Card className="p-4">
        <div className="flex gap-3 mb-4">
          <Select value={statusFilter} onChange={setStatusFilter} options={[{ value: 'all', label: 'All' }, { value: 'success', label: 'Success' }, { value: 'failed', label: 'Failed' }, { value: 'running', label: 'Running' }]} />
        </div>
        <Table headers={['Workflow', 'Status', 'Duration', 'Nodes', 'Trigger', 'Started']}>
          {filtered.map(e => (
            <tr key={e.id} className="hover:bg-slate-800/30 cursor-pointer" onClick={() => setSelectedExec(e.id)}>
              <td className="px-4 py-3 text-sm text-white">{e.workflowName}</td>
              <td className="px-4 py-3"><Badge variant={e.status === 'success' ? 'success' : e.status === 'failed' ? 'error' : e.status === 'running' ? 'info' : 'default'}>{e.status}</Badge></td>
              <td className="px-4 py-3 text-sm text-slate-300">{e.duration ? `${(e.duration / 1000).toFixed(1)}s` : '—'}</td>
              <td className="px-4 py-3 text-sm text-slate-300">{e.nodesExecuted}/{e.totalNodes}</td>
              <td className="px-4 py-3 text-sm text-slate-400">{e.triggerType}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{new Date(e.startedAt).toLocaleString()}</td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && <EmptyState icon={<Zap className="w-8 h-8" />} title="No executions" description="Execution history will appear here." />}
      </Card>

      <Modal open={!!selected} onClose={() => setSelectedExec(null)} title={`Execution Details`} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-400">Workflow:</span> <span className="text-white">{selected.workflowName}</span></div>
              <div><span className="text-slate-400">Status:</span> <Badge variant={selected.status === 'success' ? 'success' : selected.status === 'failed' ? 'error' : 'info'}>{selected.status}</Badge></div>
              <div><span className="text-slate-400">Duration:</span> <span className="text-white">{selected.duration ? `${(selected.duration / 1000).toFixed(1)}s` : 'Running...'}</span></div>
              <div><span className="text-slate-400">Trigger:</span> <span className="text-white">{selected.triggerType}</span></div>
            </div>
            {selected.error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400"><strong>Error:</strong> {selected.error}</div>}
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Step Logs</h4>
              <div className="space-y-2">
                {selected.logs.map((log, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${log.status === 'success' ? 'border-emerald-500/20 bg-emerald-500/5' : log.status === 'failed' ? 'border-red-500/20 bg-red-500/5' : 'border-slate-700 bg-slate-800/30'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {log.status === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                        <span className="text-sm text-white">{log.nodeLabel}</span>
                      </div>
                      <span className="text-xs text-slate-500">{log.duration}ms</span>
                    </div>
                    {log.error && <p className="text-xs text-red-400 mt-1 ml-6">{log.error}</p>}
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

// User Integrations
export function UserIntegrationsPage() {
  const { user } = useAuthStore();
  if (!user?.companyId) return null;
  const integrations = db.getIntegrations(user.companyId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Integrations</h1>
        <p className="text-sm text-slate-400 mt-1">Connected business applications</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map(int => (
          <Card key={int.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{int.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">{int.name}</p>
                  <p className="text-xs text-slate-500">{int.category}</p>
                </div>
              </div>
              <Badge variant={int.status === 'connected' ? 'success' : int.status === 'error' ? 'error' : 'default'}>{int.status}</Badge>
            </div>
            {int.connectedAt && <p className="text-xs text-slate-600 mt-2">Connected {new Date(int.connectedAt).toLocaleDateString()}</p>}
          </Card>
        ))}
        {integrations.length === 0 && <EmptyState icon={<Activity className="w-8 h-8" />} title="No integrations" description="Ask your admin to connect integrations." />}
      </div>
    </div>
  );
}

// User Webhooks
export function UserWebhooksPage() {
  const { user } = useAuthStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!user?.companyId) return null;
  const webhooks = db.getWebhooks(user.companyId);

  const handleCreate = () => {
    if (!newName) return;
    db.createWebhook({ companyId: user.companyId!, name: newName, events: ['data.created', 'data.updated'] });
    setShowCreate(false);
    setNewName('');
    setToast({ message: 'Webhook created.', type: 'success' });
  };

  const handleDelete = (id: string) => {
    db.deleteWebhook(id);
    setToast({ message: 'Webhook deleted.', type: 'success' });
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Webhooks</h1>
          <p className="text-sm text-slate-400 mt-1">Manage incoming webhook endpoints</p>
        </div>
        <Button onClick={() => setShowCreate(true)}><Plus className="w-4 h-4" />Create Webhook</Button>
      </div>

      <Card className="p-4">
        <Table headers={['Name', 'URL', 'Status', 'Events', 'Success', 'Failed', 'Actions']}>
          {webhooks.map(wh => (
            <tr key={wh.id} className="hover:bg-slate-800/30">
              <td className="px-4 py-3 text-sm text-white">{wh.name}</td>
              <td className="px-4 py-3 text-xs text-slate-400 font-mono max-w-[200px] truncate">{wh.url}</td>
              <td className="px-4 py-3"><Badge variant={wh.status === 'active' ? 'success' : 'default'}>{wh.status}</Badge></td>
              <td className="px-4 py-3 text-xs text-slate-400">{wh.events.join(', ')}</td>
              <td className="px-4 py-3 text-sm text-emerald-400">{wh.successCount}</td>
              <td className="px-4 py-3 text-sm text-red-400">{wh.failCount}</td>
              <td className="px-4 py-3"><Button size="sm" variant="ghost" onClick={() => handleDelete(wh.id)}><Trash2 className="w-3.5 h-3.5 text-red-400" /></Button></td>
            </tr>
          ))}
        </Table>
        {webhooks.length === 0 && <EmptyState icon={<Webhook className="w-8 h-8" />} title="No webhooks" description="Create a webhook to receive external events." />}
      </Card>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Webhook">
        <div className="space-y-4">
          <Input label="Webhook Name" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g., Payment Events" />
          <p className="text-xs text-slate-500">A unique URL and signing secret will be generated automatically.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Templates
export function UserTemplatesPage() {
  const { user } = useAuthStore();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const templates = [
    { id: 'tpl_1', name: 'Customer Onboarding', description: 'Automate new customer setup with AI classification', category: 'CRM', nodes: 5 },
    { id: 'tpl_2', name: 'Invoice Processing', description: 'Extract data from invoices using AI and save to accounting', category: 'Finance', nodes: 4 },
    { id: 'tpl_3', name: 'Lead Qualification', description: 'Score and route incoming leads automatically', category: 'Sales', nodes: 5 },
    { id: 'tpl_4', name: 'Support Ticket Routing', description: 'Classify and route support tickets to the right team', category: 'Support', nodes: 4 },
    { id: 'tpl_5', name: 'Social Media Monitor', description: 'Monitor mentions and create alerts', category: 'Marketing', nodes: 3 },
    { id: 'tpl_6', name: 'Data Sync Pipeline', description: 'Sync data between two systems with transformation', category: 'Integration', nodes: 4 },
  ];

  const handleUseTemplate = (tpl: typeof templates[0]) => {
    if (!user?.companyId) return;
    db.createWorkflow({ name: tpl.name, description: tpl.description, companyId: user.companyId, createdById: user.id });
    setToast({ message: `Workflow created from "${tpl.name}" template.`, type: 'success' });
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div>
        <h1 className="text-2xl font-bold text-white">Templates</h1>
        <p className="text-sm text-slate-400 mt-1">Start from pre-built workflow templates</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(tpl => (
          <Card key={tpl.id} hover className="p-4">
            <div className="flex items-start justify-between mb-2">
              <Badge variant="purple">{tpl.category}</Badge>
              <span className="text-xs text-slate-500">{tpl.nodes} nodes</span>
            </div>
            <h3 className="text-sm font-medium text-white mb-1">{tpl.name}</h3>
            <p className="text-xs text-slate-400 mb-4">{tpl.description}</p>
            <Button size="sm" variant="outline" className="w-full" onClick={() => handleUseTemplate(tpl)}><Copy className="w-3 h-3" />Use Template</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Analytics
export function UserAnalyticsPage() {
  const { user } = useAuthStore();
  if (!user?.companyId) return null;

  const executions = db.getExecutions(user.companyId);
  const workflows = db.getWorkflows(user.companyId);
  const successCount = executions.filter(e => e.status === 'success').length;
  const failCount = executions.filter(e => e.status === 'failed').length;
  const avgDuration = executions.filter(e => e.duration).reduce((sum, e) => sum + (e.duration || 0), 0) / (executions.filter(e => e.duration).length || 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Workflow performance and usage metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Executions" value={executions.length} icon={<Zap className="w-5 h-5" />} />
        <StatCard label="Success Rate" value={executions.length > 0 ? `${Math.round((successCount / executions.length) * 100)}%` : '0%'} icon={<CheckCircle className="w-5 h-5" />} variant="success" />
        <StatCard label="Avg Duration" value={`${(avgDuration / 1000).toFixed(1)}s`} icon={<Clock className="w-5 h-5" />} />
        <StatCard label="Active Workflows" value={workflows.filter(w => w.status === 'active').length} icon={<Workflow className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-white mb-4">Execution Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><span className="text-sm text-slate-300">Successful</span><span className="text-sm font-medium text-emerald-400">{successCount}</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-slate-300">Failed</span><span className="text-sm font-medium text-red-400">{failCount}</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-slate-300">Running</span><span className="text-sm font-medium text-cyan-400">{executions.filter(e => e.status === 'running').length}</span></div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-white mb-4">Top Workflows</h3>
          <div className="space-y-3">
            {workflows.sort((a, b) => b.executionCount - a.executionCount).slice(0, 5).map(w => (
              <div key={w.id} className="flex justify-between items-center">
                <span className="text-sm text-slate-300">{w.name}</span>
                <span className="text-sm text-white font-medium">{w.executionCount}</span>
              </div>
            ))}
            {workflows.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No data yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

// User Settings
export function UserSettingsPage() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSave = () => {
    if (user) {
      db.updateUser(user.id, { name });
      setToast({ message: 'Profile updated.', type: 'success' });
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your profile and preferences</p>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-medium text-white">Profile</h3>
        <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
        <Input label="Email" value={user?.email || ''} readOnly />
        <div className="flex items-center gap-2">
          <Badge variant="purple">{user?.role}</Badge>
          <Badge variant={user?.status === 'active' ? 'success' : 'error'}>{user?.status}</Badge>
        </div>
        <Button onClick={handleSave}><Settings className="w-4 h-4" />Save Profile</Button>
      </Card>
    </div>
  );
}
