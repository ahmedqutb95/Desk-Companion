import React, { useState } from 'react';
import { useDashboard } from '@/hooks/useDashboardState';

export default function MessageSection() {
  const { ws, setLastMessage, messageScrollDir, setMessageScrollDir } = useDashboard();
  const [text, setText] = useState('');

  const handlePush = () => {
    if (!text.trim()) return;
    setLastMessage(text);
    ws.setCurrentScreen('Message');
    ws.send({ 
      type: 'display_text', 
      text,
      scroll: messageScrollDir !== 'static',
      direction: messageScrollDir
    });
  };

  const handleErase = () => {
    setText('');
    setLastMessage('');
    ws.send({ type: 'display_text', text: '' });
  };

  return (
    <div className="card-container">
      <div className="section-label">
        <h2 className="section-title">Message</h2>
        <span className="section-badge">DISPLAY</span>
      </div>

      <div className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message to display..."
          className="w-full bg-black/40 border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px] resize-none"
        />
      </div>

      <div className="flex gap-2 p-1 bg-black/30 rounded-lg mb-4">
        {(['left', 'right', 'static'] as const).map((dir) => (
          <button
            key={dir}
            onClick={() => setMessageScrollDir(dir)}
            className={`flex-1 text-xs py-1.5 rounded-md transition-all capitalize ${
              messageScrollDir === dir 
                ? 'bg-primary text-primary-foreground font-semibold' 
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
          >
            {dir === 'left' ? '← Scroll' : dir === 'right' ? 'Scroll →' : 'Static'}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handlePush}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm py-2 rounded-lg transition-colors"
        >
          Push
        </button>
        <button
          onClick={handleErase}
          className="px-6 border border-destructive/50 text-destructive hover:bg-destructive/10 font-medium text-sm py-2 rounded-lg transition-colors"
        >
          Erase
        </button>
      </div>
    </div>
  );
}
