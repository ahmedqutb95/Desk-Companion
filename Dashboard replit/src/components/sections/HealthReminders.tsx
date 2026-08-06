import React, { useEffect, useState } from 'react';
import { useDashboard } from '@/hooks/useDashboardState';
import { Play, Pause, RotateCcw, Trash2, Plus } from 'lucide-react';

export default function HealthReminders() {
  const { reminders, setReminders, ws } = useDashboard();
  const [newText, setNewText] = useState('');
  const [newMin, setNewMin] = useState('30');

  useEffect(() => {
    const timer = setInterval(() => {
      setReminders(prev => prev.map(r => {
        if (!r.active) return r;
        if (r.remainingSeconds <= 1) {
          // Trigger alert
          ws.send({ type: 'alert', title: 'Health Reminder', message: r.text });
          return { ...r, remainingSeconds: r.intervalMinutes * 60 };
        }
        return { ...r, remainingSeconds: r.remainingSeconds - 1 };
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [setReminders, ws]);

  const toggleActive = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const resetTimer = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, remainingSeconds: r.intervalMinutes * 60, active: false } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleAdd = () => {
    if (!newText.trim()) return;
    setReminders(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      text: newText,
      intervalMinutes: parseInt(newMin) || 30,
      remainingSeconds: (parseInt(newMin) || 30) * 60,
      active: true
    }]);
    setNewText('');
  };

  return (
    <div className="card-container">
      <div className="section-label">
        <h2 className="section-title">Health Reminders</h2>
        <span className="section-badge">WELLBEING</span>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="flex-1">
          <input 
            type="text"
            placeholder="Drink water..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="w-16 shrink-0">
          <input 
            type="number"
            value={newMin}
            onChange={(e) => setNewMin(e.target.value)}
            className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-center"
          />
        </div>
        <button
          onClick={handleAdd}
          className="px-3 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded-lg transition-colors flex items-center justify-center"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {reminders.map(rem => (
          <div key={rem.id} className="bg-black/30 border border-border/50 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-foreground">{rem.text}</span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <button onClick={() => toggleActive(rem.id)} className="p-1 hover:text-primary transition-colors">
                  {rem.active ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button onClick={() => resetTimer(rem.id)} className="p-1 hover:text-foreground transition-colors">
                  <RotateCcw size={14} />
                </button>
                <button onClick={() => deleteReminder(rem.id)} className="p-1 hover:text-destructive transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold tracking-tight text-primary">
                {Math.floor(rem.remainingSeconds / 60).toString().padStart(2, '0')}:{(rem.remainingSeconds % 60).toString().padStart(2, '0')}
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                EVERY {rem.intervalMinutes}M
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
