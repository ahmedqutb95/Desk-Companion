import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useWebSocket } from './useWebSocket';

type Task = {
  id: string;
  name: string;
  minutes: number;
  completed: boolean;
};

type Reminder = {
  id: string;
  text: string;
  intervalMinutes: number;
  remainingSeconds: number;
  active: boolean;
};

type DashboardContextType = {
  ws: ReturnType<typeof useWebSocket>;
  // Dashboard state
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  fontTheme: string;
  setFontTheme: React.Dispatch<React.SetStateAction<string>>;
  clockMode: 'Digital' | 'Analog';
  setClockMode: React.Dispatch<React.SetStateAction<'Digital' | 'Analog'>>;
  // Active Pomodoro State
  pomodoro: {
    task: string;
    focusMin: number;
    breakMin: number;
    cycles: number;
    currentCycle: number;
    phase: 'Focus' | 'Break' | 'Idle';
    remainingSeconds: number;
    isRunning: boolean;
  };
  setPomodoro: React.Dispatch<React.SetStateAction<DashboardContextType['pomodoro']>>;
  // Active Message
  lastMessage: string;
  setLastMessage: React.Dispatch<React.SetStateAction<string>>;
  messageScrollDir: 'left' | 'right' | 'static';
  setMessageScrollDir: React.Dispatch<React.SetStateAction<'left' | 'right' | 'static'>>;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const ws = useWebSocket();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', text: 'Stand up and stretch', intervalMinutes: 30, remainingSeconds: 1800, active: true }
  ]);
  const [fontTheme, setFontTheme] = useState('Space Grotesk');
  const [clockMode, setClockMode] = useState<'Digital' | 'Analog'>('Digital');
  
  const [pomodoro, setPomodoro] = useState<DashboardContextType['pomodoro']>({
    task: '3D printing',
    focusMin: 25,
    breakMin: 5,
    cycles: 4,
    currentCycle: 1,
    phase: 'Idle',
    remainingSeconds: 25 * 60,
    isRunning: false,
  });

  const [lastMessage, setLastMessage] = useState('');
  const [messageScrollDir, setMessageScrollDir] = useState<'left' | 'right' | 'static'>('static');

  return (
    <DashboardContext.Provider value={{
      ws, tasks, setTasks, reminders, setReminders, fontTheme, setFontTheme, clockMode, setClockMode,
      pomodoro, setPomodoro, lastMessage, setLastMessage, messageScrollDir, setMessageScrollDir
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
