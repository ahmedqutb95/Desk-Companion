import { useState, useCallback, useRef, useEffect } from 'react';

export type LogEntry = {
  id: string;
  timestamp: string;
  direction: 'IN' | 'OUT';
  message: string;
};

export function useWebSocket() {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [characterState, setCharacterState] = useState<'idle' | 'thinking' | 'alert'>('idle');
  const [currentScreen, setCurrentScreen] = useState<'Normal' | 'Message' | 'What\'s Next' | 'Clock'>('Normal');
  const [ambientTheme, setAmbientTheme] = useState<'Focus' | 'Calm' | 'Night' | 'Warm'>('Focus');
  const [eventLog, setEventLog] = useState<LogEntry[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);

  const addLog = useCallback((direction: 'IN' | 'OUT', message: string) => {
    setEventLog(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
        direction,
        message
      }
    ].slice(-50)); // Keep last 50
  }, []);

  const normalizeWebSocketUrl = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) {
      throw new Error('WebSocket URL is empty');
    }

    if (/^wss?:\/\//.test(trimmed)) {
      return trimmed;
    }

    const [host, ...pathParts] = trimmed.split('/');
    const path = pathParts.length ? `/${pathParts.join('/')}` : '';
    const hasPort = /:\d+$/.test(host);
    return `ws://${host}${hasPort ? '' : ':81'}${path}`;
  };

  const connect = useCallback((url: string) => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setStatus('connecting');
    addLog('OUT', `Connecting to ${url}...`);

    const normalizedUrl = normalizeWebSocketUrl(url);
    const socket = new WebSocket(normalizedUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      setStatus('connected');
      addLog('IN', `Connected to ${normalizedUrl}`);
      addLog('IN', 'character.state value=idle');
      setCharacterState('idle');
    };

    socket.onclose = (event) => {
      setStatus('disconnected');
      addLog('IN', `Disconnected${event.code ? ` (${event.code})` : ''}`);
      wsRef.current = null;
    };

    socket.onerror = (event) => {
      setStatus('disconnected');
      addLog('IN', 'WebSocket error');
      console.error('WebSocket encountered an error:', event);
      wsRef.current = null;
    };

    socket.onmessage = (event) => {
      let message = event.data;
      try {
        const parsed = JSON.parse(event.data);
        message = JSON.stringify(parsed);
      } catch {
        // leave raw string
      }
      addLog('IN', message);
    };
  }, [addLog]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('disconnected');
    addLog('OUT', 'Disconnected from device');
  }, [addLog]);

  const send = useCallback((message: any) => {
    const msgStr = JSON.stringify(message);

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addLog('OUT', `Failed to send: not connected`);
      return;
    }

    wsRef.current.send(msgStr);
    addLog('OUT', msgStr);

    if (message.type === 'show_screen') {
      const screenMap: Record<string, string> = {
        'normal': 'Normal',
        'message': 'Message',
        'whats_next': 'What\'s Next',
        'clock': 'Clock'
      };
      if (screenMap[message.screen]) {
        setCurrentScreen(screenMap[message.screen] as any);
      }
    } else if (message.type === 'ambient_theme') {
      const themeMap: Record<string, string> = {
        'focus': 'Focus',
        'calm': 'Calm',
        'night': 'Night',
        'warm': 'Warm'
      };
      if (themeMap[message.theme]) {
        setAmbientTheme(themeMap[message.theme] as any);
      }
    }
  }, [addLog]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    status,
    connect,
    disconnect,
    send,
    characterState,
    currentScreen,
    ambientTheme,
    eventLog,
    addLog,
    setCurrentScreen,
    setAmbientTheme
  };
}
