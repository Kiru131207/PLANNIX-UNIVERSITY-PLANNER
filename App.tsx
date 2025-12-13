import React, { useState, useEffect } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import IntroOverlay from './components/IntroOverlay';
import Dashboard from './views/Dashboard';
import Subjects from './views/Subjects';
import Assignments from './views/Assignments';
import Timetable from './views/Timetable';
import Settings from './views/Settings';
import FocusMode from './views/FocusMode';
import { usePlannerStore } from './store/usePlannerStore';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showIntro, setShowIntro] = useState(true);
  const store = usePlannerStore();
  
  useEffect(() => {
    if (!store.settings.notificationsEnabled) return;
    const checkNotifications = () => {
      // Notification logic placeholder
    };
    const interval = setInterval(checkNotifications, 60000);
    return () => clearInterval(interval);
  }, [store.schedule, store.subjects, store.settings.notificationsEnabled]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard subjects={store.subjects} assignments={store.assignments} />;
      case 'subjects': return <Subjects subjects={store.subjects} addSubject={store.addSubject} deleteSubject={store.deleteSubject} updateAttendance={store.updateAttendance} />;
      case 'assignments': return <Assignments assignments={store.assignments} subjects={store.subjects} addAssignment={store.addAssignment} toggleAssignment={store.toggleAssignment} deleteAssignment={store.deleteAssignment} />;
      case 'timetable': return <Timetable schedule={store.schedule} subjects={store.subjects} addScheduleItem={store.addScheduleItem} deleteScheduleItem={store.deleteScheduleItem} />;
      case 'focus': return <FocusMode />;
      case 'settings': return <Settings settings={store.settings} toggleNotifications={store.toggleNotifications} />;
      default: return <div>View not found</div>;
    }
  };

  return (
    <div className="h-screen bg-background text-brand-text flex font-sans selection:bg-brand-gold selection:text-black overflow-hidden relative">
      
      {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}

      {/* Deep Dark Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
         {/* Top Left Gold Glow */}
        <div className="absolute top-[-15%] left-[-15%] w-[900px] h-[900px] bg-brand-gold/5 rounded-full blur-[150px] animate-pulse-slow opacity-60" />
        
        {/* Bottom Right Amber Glow */}
        <div className="absolute bottom-[-15%] right-[-15%] w-[800px] h-[800px] bg-brand-amber/5 rounded-full blur-[150px] animate-float opacity-50" />
        
        {/* Center Vignette (Darkening edges) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
        
        {/* Subtle Noise Texture for Premium Feel */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      </div>

      <Sidebar currentView={currentView} setView={setCurrentView} />

      <main className="flex-1 md:ml-20 relative z-10 h-full flex flex-col">
        {/* Global Scroll Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto p-4 md:p-6 pb-32 md:pb-12 min-h-full">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;