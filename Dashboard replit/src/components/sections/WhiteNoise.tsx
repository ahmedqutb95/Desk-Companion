import React, { useState } from 'react';
import { useDashboard } from '@/hooks/useDashboardState';
import { Flame, Waves, Leaf, Play, Pause } from 'lucide-react';

const AMBIENTS = [
  { id: 'fire', icon: Flame, label: 'Fire', color: 'text-orange-500' },
  { id: 'ocean', icon: Waves, label: 'Ocean', color: 'text-blue-400' },
  { id: 'leaves', icon: Leaf, label: 'Leaves', color: 'text-green-500' },
];

export default function WhiteNoise() {
  const { ws } = useDashboard();
  const [selected, setSelected] = useState('fire');
  const [volume, setVolume] = useState(60);
  const [timer, setTimer] = useState('0');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    ws.send({ 
      type: 'ambient_sound', 
      theme: selected, 
      action: nextState ? 'play' : 'pause',
      volume,
      timer: parseInt(timer) || 0
    });
  };

  return (
    <div className="card-container">
      <div className="section-label">
        <h2 className="section-title">White Noise</h2>
        <div className="flex gap-2 items-center">
          <span className="section-badge">AMBIENCE</span>
          <span className={`text-[9px] uppercase tracking-widest font-bold ${isPlaying ? 'text-primary' : 'text-muted-foreground'}`}>
            {isPlaying ? 'PLAYING' : 'STOPPED'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {AMBIENTS.map(amb => {
          const Icon = amb.icon;
          const isSelected = selected === amb.id;
          return (
            <button
              key={amb.id}
              onClick={() => {
                setSelected(amb.id);
                if (isPlaying) {
                  ws.send({ type: 'ambient_sound', theme: amb.id, action: 'play', volume });
                }
              }}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                isSelected 
                  ? 'border-primary bg-primary/5 shadow-[0_0_15px_rgba(190,255,0,0.1)]' 
                  : 'border-border/50 bg-black/20 hover:border-border hover:bg-black/40'
              }`}
            >
              <Icon size={24} className={isSelected ? amb.color : 'text-muted-foreground'} />
              <span className={`text-[10px] font-medium tracking-wider ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                {amb.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 flex justify-between">
            <span>VOLUME</span>
            <span>{volume}%</span>
          </label>
          <input 
            type="range" 
            min="0" max="100" 
            value={volume}
            onChange={(e) => {
              setVolume(parseInt(e.target.value));
              if (isPlaying) {
                ws.send({ type: 'ambient_sound', action: 'volume', volume: parseInt(e.target.value) });
              }
            }}
            className="w-full accent-primary h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
            TIMER (MIN, 0 = OFF)
          </label>
          <input 
            type="number"
            value={timer}
            onChange={(e) => setTimer(e.target.value)}
            className="w-full bg-black/40 border border-border rounded-md p-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-center"
          />
        </div>
      </div>

      <button
        onClick={handleTogglePlay}
        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
          isPlaying 
            ? 'bg-primary/20 text-primary border border-primary/30' 
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        {isPlaying ? 'Pause Ambience' : 'Play Ambience'}
      </button>
    </div>
  );
}
