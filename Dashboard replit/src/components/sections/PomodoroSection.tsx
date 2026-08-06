import React, { useEffect, useRef } from 'react';
import { useDashboard } from '@/hooks/useDashboardState';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

export default function PomodoroSection() {
  const { ws, pomodoro, setPomodoro } = useDashboard();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (pomodoro.isRunning) {
      timerRef.current = setInterval(() => {
        setPomodoro(prev => {
          if (prev.remainingSeconds <= 1) {
            // Cycle ended
            const isFocus = prev.phase === 'Focus';
            const nextPhase = isFocus ? 'Break' : 'Focus';
            const nextCycle = isFocus ? prev.currentCycle : (prev.currentCycle >= prev.cycles ? 1 : prev.currentCycle + 1);
            
            // Auto pause on cycle end or complete
            const shouldPause = !isFocus && nextCycle === 1;
            
            // Notify device
            ws.send({
              type: 'pomodoro_update',
              event: 'phase_complete',
              nextPhase
            });
            
            return {
              ...prev,
              phase: nextPhase,
              currentCycle: nextCycle,
              remainingSeconds: (isFocus ? prev.breakMin : prev.focusMin) * 60,
              isRunning: !shouldPause
            };
          }
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pomodoro.isRunning, setPomodoro, ws]);

  const toggleTimer = () => {
    setPomodoro(prev => {
      const newState = { ...prev, isRunning: !prev.isRunning };
      if (prev.phase === 'Idle') {
        newState.phase = 'Focus';
        newState.remainingSeconds = prev.focusMin * 60;
      }
      ws.send({
        type: 'pomodoro_update',
        state: newState.isRunning ? 'running' : 'paused',
        task: prev.task
      });
      // Optionally auto-switch device screen
      if (newState.isRunning) {
        ws.setCurrentScreen('What\'s Next');
      }
      return newState;
    });
  };

  const skipPhase = () => {
    setPomodoro(prev => {
      const isFocus = prev.phase === 'Focus';
      const nextPhase = isFocus ? 'Break' : 'Focus';
      const nextCycle = isFocus ? prev.currentCycle : (prev.currentCycle >= prev.cycles ? 1 : prev.currentCycle + 1);
      
      ws.send({
        type: 'pomodoro_update',
        event: 'skipped',
        nextPhase
      });
      
      return {
        ...prev,
        phase: nextPhase,
        currentCycle: nextCycle,
        remainingSeconds: (isFocus ? prev.breakMin : prev.focusMin) * 60,
      };
    });
  };

  const resetTimer = () => {
    setPomodoro(prev => {
      ws.send({ type: 'pomodoro_update', event: 'reset' });
      return {
        ...prev,
        phase: 'Idle',
        currentCycle: 1,
        remainingSeconds: prev.focusMin * 60,
        isRunning: false
      };
    });
  };

  const totalSeconds = pomodoro.phase === 'Break' ? pomodoro.breakMin * 60 : pomodoro.focusMin * 60;
  const progressPercent = pomodoro.phase === 'Idle' ? 0 : 100 - (pomodoro.remainingSeconds / totalSeconds) * 100;

  return (
    <div className="card-container">
      <div className="section-label">
        <h2 className="section-title">Pomodoro</h2>
        <span className="section-badge">PRODUCTIVITY</span>
      </div>

      <div className="mb-5">
        <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">TASK</label>
        <input 
          type="text"
          value={pomodoro.task}
          onChange={(e) => setPomodoro(p => ({ ...p, task: e.target.value }))}
          className="w-full bg-black/40 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">FOCUS (MIN)</label>
          <input 
            type="number"
            value={pomodoro.focusMin}
            onChange={(e) => setPomodoro(p => ({ ...p, focusMin: parseInt(e.target.value) || 25, remainingSeconds: p.phase === 'Focus' || p.phase === 'Idle' ? (parseInt(e.target.value) || 25) * 60 : p.remainingSeconds }))}
            className="w-full bg-black/40 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">BREAK (MIN)</label>
          <input 
            type="number"
            value={pomodoro.breakMin}
            onChange={(e) => setPomodoro(p => ({ ...p, breakMin: parseInt(e.target.value) || 5 }))}
            className="w-full bg-black/40 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">CYCLES</label>
          <input 
            type="number"
            value={pomodoro.cycles}
            onChange={(e) => setPomodoro(p => ({ ...p, cycles: parseInt(e.target.value) || 4 }))}
            className="w-full bg-black/40 border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-end gap-6 mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">REMAINING</span>
          <span className="text-4xl font-bold tracking-tight text-primary">
            {Math.floor(pomodoro.remainingSeconds / 60).toString().padStart(2, '0')}:{(pomodoro.remainingSeconds % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="flex flex-col pb-1">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">CYCLE</span>
          <span className="text-xl font-medium">{pomodoro.currentCycle}/{pomodoro.cycles}</span>
        </div>
        <div className="flex flex-col pb-1">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">PHASE</span>
          <span className="text-xl font-medium text-foreground">{pomodoro.phase}</span>
        </div>
      </div>

      <div className="w-full h-1.5 bg-black/50 rounded-full mb-6 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${pomodoro.phase === 'Break' ? 'bg-blue-400' : 'bg-primary'}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={toggleTimer}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            pomodoro.isRunning 
              ? 'bg-primary/20 text-primary border border-primary/30' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {pomodoro.isRunning ? <Pause size={16} /> : <Play size={16} />}
          {pomodoro.isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={skipPhase}
          className="px-4 border border-border hover:bg-white/5 text-foreground py-2 rounded-lg transition-colors flex items-center justify-center"
          title="Skip Phase"
        >
          <SkipForward size={16} />
        </button>
        <button
          onClick={resetTimer}
          className="px-4 border border-destructive/30 hover:bg-destructive/10 text-destructive py-2 rounded-lg transition-colors flex items-center justify-center"
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
