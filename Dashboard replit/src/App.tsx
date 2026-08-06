import React, { useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/components/Dashboard';

function App() {
  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <TooltipProvider>
      <Dashboard />
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
