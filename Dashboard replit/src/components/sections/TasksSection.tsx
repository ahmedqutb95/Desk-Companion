import React, { useState } from 'react';
import { useDashboard } from '@/hooks/useDashboardState';
import { Plus, Play, Check, Trash2 } from 'lucide-react';

export default function TasksSection() {
  const { tasks, setTasks, setPomodoro, ws } = useDashboard();
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskMin, setNewTaskMin] = useState('25');

  const handleAdd = () => {
    if (!newTaskName.trim()) return;
    setTasks(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        name: newTaskName,
        minutes: parseInt(newTaskMin) || 25,
        completed: false
      }
    ]);
    setNewTaskName('');
  };

  const handlePlayTask = (task: any) => {
    setPomodoro(prev => ({
      ...prev,
      task: task.name,
      focusMin: task.minutes,
      remainingSeconds: task.minutes * 60,
      phase: 'Focus',
      currentCycle: 1,
      isRunning: false
    }));
    ws.setCurrentScreen('What\'s Next');
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="card-container">
      <div className="section-label">
        <h2 className="section-title">Tasks</h2>
        <span className="section-badge">FOCUS QUEUE</span>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <input 
            type="text"
            placeholder="Write documentation..."
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="w-16 shrink-0">
          <input 
            type="number"
            value={newTaskMin}
            onChange={(e) => setNewTaskMin(e.target.value)}
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

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center p-4 border border-dashed border-border/50 rounded-lg text-xs text-muted-foreground">
            No tasks yet — add one to get started.
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                task.completed ? 'bg-black/20 border-border/50 opacity-50' : 'bg-black/40 border-border hover:border-primary/30'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.name}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{task.minutes} min</p>
              </div>
              
              <div className="flex items-center gap-1 shrink-0">
                {!task.completed && (
                  <button 
                    onClick={() => handlePlayTask(task)}
                    className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded"
                    title="Load into Pomodoro"
                  >
                    <Play size={14} />
                  </button>
                )}
                <button 
                  onClick={() => toggleComplete(task.id)}
                  className={`p-1.5 transition-colors rounded ${task.completed ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                >
                  <Check size={14} />
                </button>
                <button 
                  onClick={() => removeTask(task.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
