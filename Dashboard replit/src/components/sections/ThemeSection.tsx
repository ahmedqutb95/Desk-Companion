import React from 'react';
import { useDashboard } from '@/hooks/useDashboardState';

const THEMES = [
  { id: 'Focus', color: 'bg-[#BEFF00]', name: 'FOCUS' },
  { id: 'Calm', color: 'bg-[#6496FF]', name: 'CALM' },
  { id: 'Night', color: 'bg-[#9632FF]', name: 'NIGHT' },
  { id: 'Warm', color: 'bg-[#FF9632]', name: 'WARM' },
];

const FONTS = [
  'Space Grotesk',
  'Inter',
  'JetBrains Mono',
  'Outfit',
  'DM Sans'
];

export default function ThemeSection() {
  const { ws, fontTheme, setFontTheme } = useDashboard();

  return (
    <div className="card-container">
      <div className="section-label">
        <h2 className="section-title">Theme</h2>
        <span className="section-badge">AMBIENT</span>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {THEMES.map((theme) => {
          const isSelected = ws.ambientTheme === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => {
                ws.setAmbientTheme(theme.id as any);
                ws.send({ type: 'ambient_theme', theme: theme.id.toLowerCase() });
              }}
              className={`relative flex flex-col items-center gap-2 p-2 rounded-lg border transition-all duration-300 ${
                isSelected 
                  ? 'border-primary bg-primary/5 shadow-[0_0_15px_rgba(190,255,0,0.1)]' 
                  : 'border-transparent hover:bg-white/5'
              }`}
            >
              <div className={`w-full h-8 rounded-md ${theme.color} opacity-80`} />
              <span className={`text-[10px] tracking-widest font-medium ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                {theme.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-widest text-muted-foreground">FONT</label>
        <select 
          value={fontTheme}
          onChange={(e) => setFontTheme(e.target.value)}
          className="w-full bg-black/40 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
          style={{ fontFamily: fontTheme }}
        >
          {FONTS.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
