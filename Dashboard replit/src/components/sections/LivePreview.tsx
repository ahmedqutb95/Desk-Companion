import React, { useEffect, useState } from 'react';
import { useDashboard } from '@/hooks/useDashboardState';

export default function LivePreview() {
  const { ws, pomodoro, clockMode, fontTheme, lastMessage } = useDashboard();
  
  // Create a local ticking time for the clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tftGlowClass = `tft-glow-${ws.ambientTheme.toLowerCase()}`;

  const renderScreen = () => {
    switch (ws.currentScreen) {
      case 'Normal':
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex gap-4 items-center">
              <div className={`w-6 h-8 rounded-full bg-primary ${ws.characterState === 'thinking' ? 'animate-pulse' : ''} ${ws.characterState === 'alert' ? 'bg-orange-500 scale-125' : ''}`}></div>
              <div className={`w-6 h-8 rounded-full bg-primary ${ws.characterState === 'thinking' ? 'animate-pulse' : ''} ${ws.characterState === 'alert' ? 'bg-orange-500 scale-125' : ''}`}></div>
            </div>
            <div className="mt-8 text-xs text-muted-foreground uppercase tracking-widest">
              {ws.characterState}
            </div>
          </div>
        );
      case 'Message':
        return (
          <div className="flex items-center justify-center p-8 w-full h-full text-center">
            <p className="text-xl text-primary font-medium break-words max-w-full">
              {lastMessage || "No message"}
            </p>
          </div>
        );
      case 'What\'s Next':
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{pomodoro.phase}</div>
            <div className="text-sm font-medium text-foreground mb-3 text-center max-w-[180px] truncate">{pomodoro.task}</div>
            <div className="text-4xl font-bold text-primary tracking-tight">
              {Math.floor(pomodoro.remainingSeconds / 60).toString().padStart(2, '0')}:{(pomodoro.remainingSeconds % 60).toString().padStart(2, '0')}
            </div>
          </div>
        );
      case 'Clock':
        return (
          <div className="flex items-center justify-center">
            {clockMode === 'Digital' ? (
              <div className="text-5xl font-bold text-primary tracking-tighter">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            ) : (
              <div className="relative w-32 h-32 rounded-full border-2 border-primary/20 flex items-center justify-center">
                <div className="absolute w-1 h-1 rounded-full bg-primary"></div>
                {/* Simplified analog hands */}
                <div 
                  className="absolute w-1 bg-primary rounded-full origin-bottom" 
                  style={{ height: '40%', bottom: '50%', transform: `rotate(${time.getHours() * 30 + time.getMinutes() * 0.5}deg)` }} 
                />
                <div 
                  className="absolute w-1 bg-primary/70 rounded-full origin-bottom" 
                  style={{ height: '45%', bottom: '50%', transform: `rotate(${time.getMinutes() * 6}deg)` }} 
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="card-container flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <span className="text-sm font-semibold tracking-wide">Live Preview</span>
        <span className="text-[10px] text-muted-foreground tracking-widest">240×240 TFT</span>
      </div>

      <div 
        className={`w-60 h-60 tft-circle mb-8 transition-shadow duration-700 ${tftGlowClass}`}
        style={{ fontFamily: fontTheme }}
      >
        {renderScreen()}
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex items-center bg-black/40 rounded-full border border-border/50 px-3 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-1">CHARACTER</span>
          <span className="text-[10px] text-foreground font-medium capitalize">{ws.characterState}</span>
        </div>
        <div className="flex items-center bg-black/40 rounded-full border border-border/50 px-3 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-1">EXPRESSION</span>
          <span className="text-[10px] text-foreground font-medium capitalize">blink</span>
        </div>
      </div>

      <div className="flex gap-2 w-full mb-6 p-1 bg-black/30 rounded-lg">
        {['Normal', 'Message', 'What\'s Next', 'Clock'].map((screen) => (
          <button
            key={screen}
            onClick={() => ws.setCurrentScreen(screen as any)}
            className={`flex-1 text-[11px] py-2 rounded-md transition-all ${
              ws.currentScreen === screen 
                ? 'bg-primary text-primary-foreground font-semibold shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
          >
            {screen}
          </button>
        ))}
      </div>

      <p className="text-center text-[11px] text-muted-foreground/60 leading-relaxed px-4">
        The companion manages its own states and expressions. The dashboard requests screens only — alerts always take priority.
      </p>
    </div>
  );
}
