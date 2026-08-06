import React, { useState } from 'react';
import { useDashboard } from '@/hooks/useDashboardState';
import { Activity, CircleDashed, LayoutTemplate, Sparkles } from 'lucide-react';

export default function Header() {
  const { ws } = useDashboard();
  const [url, setUrl] = useState('ws://192.168.1.50/ws');

  const isConnected = ws.status === 'connected';
  const isConnecting = ws.status === 'connecting';

  return (
    <header className="h-[72px] border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
          AI
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold tracking-wide text-foreground leading-tight">AI Desk Companion</h1>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none">Dashboard V1</span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-4">
        <StatusPill icon={<Activity size={12} />} label="LINK" value={ws.status} dot={isConnected ? 'bg-primary' : (isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-muted-foreground')} />
        <StatusPill icon={<CircleDashed size={12} />} label="STATE" value={ws.characterState} dot="bg-blue-400" />
        <StatusPill icon={<LayoutTemplate size={12} />} label="SCREEN" value={ws.currentScreen} dot="bg-purple-400" />
        <StatusPill icon={<Sparkles size={12} />} label="AMBIENT" value={ws.ambientTheme} dot="bg-orange-400" />
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="text" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-input border border-border rounded text-xs px-3 py-1.5 w-48 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="ws://..."
        />
        <button 
          onClick={() => isConnected ? ws.disconnect() : ws.connect(url)}
          className={`text-xs font-medium px-4 py-1.5 rounded transition-colors ${
            isConnected 
              ? 'bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isConnected ? 'Disconnect' : (isConnecting ? 'Connecting...' : 'Connect')}
        </button>
      </div>
    </header>
  );
}

function StatusPill({ icon, label, value, dot }: { icon: React.ReactNode, label: string, value: string, dot: string }) {
  return (
    <div className="flex items-center bg-black/40 rounded-full border border-border/50 pr-3 pl-1.5 py-1">
      <div className="flex items-center gap-1.5 opacity-60">
        {icon}
        <span className="text-[9px] uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <div className="w-px h-3 bg-border/50 mx-2" />
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span className="text-xs font-medium capitalize text-foreground">{value}</span>
      </div>
    </div>
  );
}
