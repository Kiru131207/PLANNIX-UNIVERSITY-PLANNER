import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../components/GlassCard';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2 } from 'lucide-react';

const FocusMode: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    let interval: number | null = null;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Determine next mode
      if (mode === 'focus') {
         if (soundEnabled) new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
         setMode('break');
         setTimeLeft(5 * 60);
      } else {
         if (soundEnabled) new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
         setMode('focus');
         setTimeLeft(25 * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, soundEnabled]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate SVG progress
  const totalTime = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const circumference = 2 * Math.PI * 120; // Radius 120

  return (
    <div className="h-full flex flex-col items-center justify-center animate-fade-in relative">
       {/* Ambient Light */}
       <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] transition-all duration-1000 ${isActive ? 'bg-brand-gold/10' : 'bg-transparent'}`} />

       <div className="relative z-10 w-full max-w-md">
          <GlassCard className="flex flex-col items-center py-16 px-8 relative overflow-visible" borderGlow={isActive}>
             {/* Timer Header */}
             <div className="absolute top-6 left-0 right-0 flex justify-center gap-2">
                <button 
                   onClick={() => { setMode('focus'); setTimeLeft(25*60); setIsActive(false); }}
                   className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${mode === 'focus' ? 'bg-brand-gold text-black' : 'text-zinc-600 hover:text-white'}`}
                >
                   FOCUS
                </button>
                <button 
                   onClick={() => { setMode('break'); setTimeLeft(5*60); setIsActive(false); }}
                   className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${mode === 'break' ? 'bg-emerald-500 text-black' : 'text-zinc-600 hover:text-white'}`}
                >
                   BREAK
                </button>
             </div>

             {/* Main Circular Timer */}
             <div className="relative w-72 h-72 flex items-center justify-center mb-12 mt-8">
                {/* Background Ring */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                   <circle cx="144" cy="144" r="120" stroke="#1A1A1A" strokeWidth="8" fill="none" />
                   <circle 
                      cx="144" cy="144" r="120" 
                      stroke={mode === 'focus' ? '#F59E0B' : '#10B981'} 
                      strokeWidth="8" 
                      fill="none" 
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (progress / 100) * circumference}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                   />
                </svg>
                
                <div className="text-center z-10">
                   <div className="text-7xl font-bold text-white tracking-tighter tabular-nums font-sans">
                      {formatTime(timeLeft)}
                   </div>
                   <p className="text-zinc-500 text-sm tracking-widest uppercase mt-2 font-medium">
                      {isActive ? 'Session Active' : 'Ready'}
                   </p>
                </div>
             </div>

             {/* Controls */}
             <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-4 rounded-full bg-[#121212] text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 transition-all"
                >
                   {soundEnabled ? <Volume2 size={20}/> : <VolumeX size={20}/>}
                </button>

                <button 
                  onClick={toggleTimer}
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl
                    ${isActive 
                       ? 'bg-[#121212] border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black' 
                       : 'bg-brand-gold text-black hover:bg-brand-amber hover:scale-105'
                    }
                  `}
                >
                   {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>

                <button 
                  onClick={resetTimer}
                  className="p-4 rounded-full bg-[#121212] text-zinc-500 hover:text-white border border-white/5 hover:border-white/20 transition-all"
                >
                   <RotateCcw size={20}/>
                </button>
             </div>
          </GlassCard>

          <div className="text-center mt-8 opacity-40 hover:opacity-100 transition-opacity duration-500">
             <p className="text-xs text-zinc-500 font-medium">"Focus is the key to all high performance."</p>
          </div>
       </div>
    </div>
  );
};

export default FocusMode;