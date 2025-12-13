import React, { useState } from 'react';
import { Settings as SettingsType } from '../types';
import GlassCard from '../components/GlassCard';
import { Bell, Shield, ToggleLeft, ToggleRight, Info } from 'lucide-react';

interface SettingsProps {
  settings: SettingsType;
  toggleNotifications: (enabled: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, toggleNotifications }) => {
  const [testSent, setTestSent] = useState(false);

  const handleToggle = async () => {
    if (!settings.notificationsEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toggleNotifications(true);
        new Notification("Plannix System", {
          body: "Notifications active. We will alert you about upcoming classes.",
          icon: '/favicon.ico'
        });
      } else {
        alert("Notification permission denied. Please enable it in browser settings.");
      }
    } else {
      toggleNotifications(false);
    }
  };

  const sendTestNotification = () => {
    if (settings.notificationsEnabled) {
      new Notification("Plannix Alert", {
        body: "This is a test notification from your dashboard.",
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 2000);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <header className="mb-10 text-center">
        <h2 className="text-4xl font-bold text-white font-cinematic tracking-tight mb-2">CONFIGURATION</h2>
        <p className="text-brand-violet text-xs font-mono uppercase tracking-[0.2em]">Plannix Control Panel</p>
      </header>

      <GlassCard className="mb-6 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/10 rounded-full blur-2xl" />
         
         <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-violet/20 to-black border border-brand-violet/20 flex items-center justify-center text-brand-violet">
               <Bell size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">Smart Alerts</h3>
              <p className="text-slate-400 text-sm">Receive strategic notifications for classes (15m prior) and deadlines.</p>
            </div>
            <button 
              onClick={handleToggle}
              className={`transition-colors duration-300 ${settings.notificationsEnabled ? 'text-brand-pink' : 'text-zinc-700 hover:text-zinc-500'}`}
            >
              {settings.notificationsEnabled ? <ToggleRight size={48} /> : <ToggleLeft size={48} />}
            </button>
         </div>

         <div className="bg-[#050505] p-4 rounded-xl border border-white/5 flex items-center justify-between relative z-10">
            <span className="text-sm font-mono text-zinc-500 flex items-center gap-2"><Info size={14}/> SYSTEM_TEST</span>
            <button 
              onClick={sendTestNotification}
              disabled={!settings.notificationsEnabled}
              className={`
                 px-4 py-2 text-xs font-mono uppercase tracking-wider border rounded transition-all
                 ${settings.notificationsEnabled 
                    ? 'border-brand-violet/30 hover:bg-brand-violet/10 text-white cursor-pointer hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]' 
                    : 'border-transparent text-zinc-700 cursor-not-allowed'}
              `}
            >
              {testSent ? "Signal transmitted" : "Ping"}
            </button>
         </div>
      </GlassCard>

      <GlassCard className="opacity-75 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400">
              <Shield size={24} />
           </div>
           <div>
             <h3 className="text-lg font-bold text-slate-300">Local Vault</h3>
             <p className="text-slate-500 text-sm">Data is encrypted and stored locally on your device. No external servers.</p>
           </div>
        </div>
      </GlassCard>
      
      <div className="mt-12 flex justify-center opacity-30 hover:opacity-60 transition-opacity">
        <div className="text-[10px] font-mono text-center text-zinc-500 space-y-1">
           <p className="tracking-[0.3em]">PLANNIX V1.0</p>
           <p>ENGINEERED FOR EXCELLENCE</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;