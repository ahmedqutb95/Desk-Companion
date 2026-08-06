import React from 'react';
import { DashboardProvider } from '@/hooks/useDashboardState';
import Header from '@/components/Header';
import LivePreview from '@/components/sections/LivePreview';
import ThemeSection from '@/components/sections/ThemeSection';
import MessageSection from '@/components/sections/MessageSection';
import PomodoroSection from '@/components/sections/PomodoroSection';
import TasksSection from '@/components/sections/TasksSection';
import ClockSection from '@/components/sections/ClockSection';
import PrayerSection from '@/components/sections/PrayerSection';
import HealthReminders from '@/components/sections/HealthReminders';
import WhiteNoise from '@/components/sections/WhiteNoise';
import EventLog from '@/components/sections/EventLog';

export default function Dashboard() {
  return (
    <DashboardProvider>
      <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
        <Header />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (3 cols) */}
            <div className="flex flex-col gap-6 lg:col-span-4 xl:col-span-3">
              <LivePreview />
              <ThemeSection />
            </div>

            {/* Middle Column (4 cols) */}
            <div className="flex flex-col gap-6 lg:col-span-4 xl:col-span-5">
              <MessageSection />
              <PomodoroSection />
              <TasksSection />
            </div>

            {/* Right Column (5 cols) */}
            <div className="flex flex-col gap-6 lg:col-span-4 xl:col-span-4">
              <ClockSection />
              <PrayerSection />
              <HealthReminders />
              <WhiteNoise />
              <EventLog />
            </div>

          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}
