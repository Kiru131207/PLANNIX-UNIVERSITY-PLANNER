import React from 'react';
import { View } from '../types';
import { LayoutDashboard, BookOpen, CalendarCheck, CalendarRange, Settings, Sparkles, Timer } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard' as View, icon: LayoutDashboard, label: 'Home' },
    { id: 'subjects' as View, icon: BookOpen, label: 'Library' },
    { id: 'assignments' as View, icon: CalendarCheck, label: 'Tasks' },
    { id: 'timetable' as View, icon: CalendarRange, label: 'Schedule' },
    { id: 'focus' as View, icon: Timer, label: 'Focus' },
    { id: 'settings' as View, icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar (Left Dock) */}
      <div className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-20 items-center py-6 z-50 bg-black">
        {/* Logo Area */}
        <div className="mb-10 flex flex-col items-center gap-2">
           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold to-brand-amber flex items-center justify-center text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse-slow">
              <Sparkles size={20} fill="black" />
           </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4 w-full px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`
                group relative flex items-center justify-center w-full aspect-square rounded-xl transition-all duration-300
                ${currentView === item.id 
                  ? 'bg-[#181818] text-brand-gold' 
                  : 'text-brand-muted hover:text-white hover:bg-[#121212]'}
              `}
              title={item.label}
            >
              <item.icon size={24} strokeWidth={currentView === item.id ? 2.5 : 2} />
              
              {/* Tooltip on Hover (Optional, removed for cleaner look, relying on icon clarity) */}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Bar (Dock) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/5 pb-safe">
        <nav className="flex justify-around items-center px-4 py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`
                p-2 transition-all duration-300 rounded-lg
                ${currentView === item.id ? 'text-brand-gold bg-white/5' : 'text-brand-muted'}
              `}
            >
              <item.icon size={26} />
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;