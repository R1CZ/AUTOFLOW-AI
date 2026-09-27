import { useEffect, useRef, useMemo } from 'react';
import { useAppStore } from '../stores';

interface AIFlowBackgroundProps {
  variant?: 'login' | 'dashboard' | 'subtle';
  className?: string;
}

export function AIFlowBackground({ variant = 'dashboard', className = '' }: AIFlowBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const systemStatus = useAppStore(s => s.systemStatus);
  const animFrameRef = useRef<number>(0);
  
  const config = useMemo(() => {
    switch (variant) {
      case 'login': return { nodeCount: 40, connectionDistance: 180, speed: 0.3, opacity: 0.6, particleSize: 2 };
      case 'dashboard': return { nodeCount: 25, connectionDistance: 150, speed: 0.15, opacity: 0.3, particleSize: 1.5 };
      case 'subtle': return { nodeCount: 15, connectionDistance: 120, speed: 0.1, opacity: 0.15, particleSize: 1 };
    }
  }, [variant]);

  const statusColors = useMemo(() => {
    switch (systemStatus) {
      case 'processing': return { node: '#06b6d4', connection: '#0891b2', glow: '#22d3ee' };
      case 'success': return { node: '#10b981', connection: '#059669', glow: '#34d399' };
      case 'warning': return { node: '#f59e0b', connection: '#d97706', glow: '#fbbf24' };
      case 'error': return { node: '#ef4444', connection: '#dc2626', glow: '#f87171' };
      default: return { node: '#06b6d4', connection: '#0e7490', glow: '#22d3ee' };
    }
  }, [systemStatus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    interface Node {
      x: number; y: number; vx: number; vy: number;
      size: number; pulse: number; pulseDir: number;
      type: 'data' | 'ai' | 'workflow' | 'endpoint';
    }

    const nodes: Node[] = [];
    const types: Node['type'][] = ['data', 'ai', 'workflow', 'endpoint'];
    
    for (let i = 0; i < config.nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.speed * (prefersReducedMotion ? 0.1 : 1),
        vy: (Math.random() - 0.5) * config.speed * (prefersReducedMotion ? 0.1 : 1),
        size: config.particleSize + Math.random() * 2,
        pulse: Math.random() * Math.PI * 2,
        pulseDir: Math.random() > 0.5 ? 1 : -1,
        type: types[Math.floor(Math.random() * types.length)],
      });
    }

    let time = 0;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < config.connectionDistance) {
            const opacity = (1 - dist / config.connectionDistance) * config.opacity;
            ctx.beginPath();
            ctx.strokeStyle = statusColors.connection;
            ctx.globalAlpha = opacity * 0.5;
            ctx.lineWidth = 0.5;
            
            // Draw curved connections for workflow feel
            const midX = (nodes[i].x + nodes[j].x) / 2;
            const midY = (nodes[i].y + nodes[j].y) / 2 + Math.sin(time + i) * 10;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.quadraticCurveTo(midX, midY, nodes[j].x, nodes[j].y);
            ctx.stroke();
            
            // Data flow particles along connections
            if (systemStatus === 'processing' && !prefersReducedMotion) {
              const t = (time * 0.5 + i * 0.1) % 1;
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * t;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * t;
              ctx.beginPath();
              ctx.arc(px, py, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = statusColors.glow;
              ctx.globalAlpha = opacity;
              ctx.fill();
            }
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        node.pulse += 0.02 * node.pulseDir;
        if (node.pulse > Math.PI * 2 || node.pulse < 0) node.pulseDir *= -1;
        
        const pulseScale = 1 + Math.sin(node.pulse) * 0.3;
        const nodeSize = node.size * pulseScale;
        
        // Glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize * 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeSize * 3);
        gradient.addColorStop(0, statusColors.glow);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = config.opacity * 0.3;
        ctx.fill();
        
        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = statusColors.node;
        ctx.globalAlpha = config.opacity;
        ctx.fill();
        
        // Move
        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }
      }

      // Draw workflow paths (larger flowing lines)
      if (variant === 'login') {
        ctx.globalAlpha = config.opacity * 0.2;
        ctx.strokeStyle = statusColors.glow;
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          const startY = height * 0.2 + i * height * 0.15;
          ctx.moveTo(0, startY);
          for (let x = 0; x < width; x += 50) {
            const y = startY + Math.sin((x + time * 50) * 0.01) * 30 + Math.cos((x + time * 30) * 0.02) * 15;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [config, statusColors, systemStatus, variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
