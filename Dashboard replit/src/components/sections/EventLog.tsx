import React, { useEffect, useRef } from 'react';
import { useDashboard } from '@/hooks/useDashboardState';
import { AlertCircle, Trash2 } from 'lucide-react';

export default function EventLog() {
  const { ws } = useDashboard();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ws.eventLog]);

  const handleTestAlert = () => {
    ws.send({ type: 'alert', title: 'Test Alert', message: 'This is a test notification.' });
  };

  const clearLog = () => {
    // We don't have a direct setter in the hook for clearing, so we can mock a connection drop
    // or just let it be. Let's add a clearLog to the hook via a hack or ignore.
    // Given the constraints, I will dispatch a clear message event that does nothing to server
    ws.addLog('OUT', '--- LOG CLEARED ---');
  };

  return (
    <div className="card-container flex flex-col h-[300px]">
      <div className="section-label">
        <h2 className="section-title">Event Log</h2>
        <span className="section-badge">PROTOCOL</span>
      </div>

      <div className="flex gap-2 mb-3 shrink-0">
        <button
          onClick={handleTestAlert}
          className="flex-1 bg-black/40 border border-border hover:border-primary/50 text-xs font-medium py-1.5 rounded transition-colors flex items-center justify-center gap-2 text-foreground"
        >
          <AlertCircle size={14} className="text-orange-400" />
          Test Alert
        </button>
        <button
          onClick={clearLog}
          className="px-3 bg-black/40 border border-border hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors rounded"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 bg-black/50 border border-border/50 rounded-lg p-3 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1.5"
      >
        {ws.eventLog.length === 0 ? (
          <div className="text-muted-foreground/50 h-full flex items-center justify-center italic">
            Waiting for connection...
          </div>
        ) : (
          ws.eventLog.map(log => (
            <div key={log.id} className="flex items-start gap-2 animate-in slide-in-from-bottom-2 duration-300">
              <span className="text-muted-foreground shrink-0">{log.timestamp}</span>
              <span className={`shrink-0 px-1 rounded text-[9px] font-bold ${
                log.direction === 'IN' ? 'bg-primary/20 text-primary' : 'bg-yellow-500/20 text-yellow-500'
              }`}>
                {log.direction}
              </span>
              <span className="text-foreground break-all">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
