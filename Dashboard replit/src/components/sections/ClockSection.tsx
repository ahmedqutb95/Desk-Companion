import React from 'react';
import { useDashboard } from '@/hooks/useDashboardState';
import { Clock } from 'lucide-react';

export default function ClockSection() {
  const { ws, clockMode, setClockMode } = useDashboard();

  return (
    <div className="card-container">
      <div className="section-label">
        <h2 className="section-title">Clock</h2>
        <span className="section-badge">SCREEN</span>
      </div>

      <div className="flex gap-2 p-1 bg-black/30 rounded-lg mb-4">
        {(['Digital', 'Analog'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setClockMode(mode)}
            className={`flex-1 text-xs py-2 rounded-md transition-all ${
              clockMode === mode 
                ? 'bg-primary text-primary-foreground font-semibold' 
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          ws.setCurrentScreen('Clock');
          ws.send({ type: 'show_screen', screen: 'clock' });
        }}
        className="w-full bg-black/40 border border-border hover:border-primary/50 text-foreground text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Clock size={16} className="text-primary" />
        Show clock screen
      </button>
    </div>
  );
}
