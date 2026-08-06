import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/hooks/useDashboardState';
import { MoonStar } from 'lucide-react';

const PRAYER_TIMES = [
  { name: 'Fajr', time: '04:38' },
  { name: 'Dhuhr', time: '12:05' },
  { name: 'Asr', time: '15:41' },
  { name: 'Maghrib', time: '18:52' },
  { name: 'Isha', time: '20:22' },
];

export default function PrayerSection() {
  const { ws } = useDashboard();
  const [nextPrayer, setNextPrayer] = useState(PRAYER_TIMES[0]);
  const [countdown, setCountdown] = useState('00:00:00');

  useEffect(() => {
    // Basic mock countdown timer
    const timer = setInterval(() => {
      const now = new Date();
      // Mock logic: just show a ticking countdown for demonstration
      // In a real app, you'd parse PRAYER_TIMES against current time
      const h = 23 - now.getHours();
      const m = 59 - now.getMinutes();
      const s = 59 - now.getSeconds();
      setCountdown(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="card-container">
      <div className="section-label">
        <h2 className="section-title">Prayer</h2>
        <span className="section-badge">SCHEDULE</span>
      </div>

      <div className="flex items-end gap-4 mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">NEXT PRAYER</span>
          <span className="text-2xl font-bold text-foreground">{nextPrayer.name}</span>
        </div>
        <div className="flex flex-col pb-0.5">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">IN</span>
          <span className="text-2xl font-bold text-primary tracking-tight">{countdown}</span>
        </div>
      </div>

      <div className="bg-black/20 rounded-lg border border-border/50 overflow-hidden mb-4">
        {PRAYER_TIMES.map((prayer, i) => (
          <div 
            key={prayer.name}
            className={`flex justify-between items-center px-4 py-2 text-sm ${
              prayer.name === nextPrayer.name 
                ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                : 'text-muted-foreground border-l-2 border-transparent'
            } ${i !== PRAYER_TIMES.length - 1 ? 'border-b border-border/50' : ''}`}
          >
            <span>{prayer.name}</span>
            <span className="font-mono text-xs">{prayer.time}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          ws.setCurrentScreen('What\'s Next');
          ws.send({ type: 'show_screen', screen: 'whats_next', context: 'prayer' });
        }}
        className="w-full bg-black/40 border border-border hover:border-primary/50 text-foreground text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <MoonStar size={16} className="text-primary" />
        Show on What's Next
      </button>
    </div>
  );
}
