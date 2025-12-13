import React from 'react';
import { Subject, Assignment } from '../types';
import GlassCard from '../components/GlassCard';
import { Search, Plus, MoreHorizontal, ArrowUpRight, Clock, MapPin, Play, Pause, CheckCircle2, ListTodo, CalendarDays, AlertTriangle, AlertCircle } from 'lucide-react';
import { usePlannerStore } from '../store/usePlannerStore';

interface DashboardProps {
  subjects: Subject[];
  assignments: Assignment[];
}

// Robust Fitness Ring Component
const FitnessRing: React.FC<{ 
  percentage: number; 
  color: string; 
  icon?: React.ReactNode; 
  label: string; 
  subLabel: string;
  size?: number;
  alert?: boolean;
}> = ({ percentage, color, icon, label, subLabel, size = 130, alert = false }) => {
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center w-full py-2 relative">
      <div className="relative flex items-center justify-center mb-3 shrink-0" style={{ width: size, height: size }}>
        {/* Background Track */}
        <svg className="absolute w-full h-full transform -rotate-90 drop-shadow-lg">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1A1A1A"
            strokeWidth="10"
            fill="none"
          />
          {/* Progress Indicator */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Inner Content */}
        <div className="absolute flex flex-col items-center justify-center text-white">
          {icon}
          <span className={`text-2xl font-bold mt-1 tracking-tighter tabular-nums ${alert ? 'text-red-500' : 'text-white'}`}>{percentage}%</span>
        </div>
        
        {/* Warning Badge for Low Attendance */}
        {alert && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-black rounded-full p-1.5 shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-black animate-pulse z-10">
            <AlertTriangle size={16} fill="currentColor" />
          </div>
        )}
      </div>
      <div className="text-center w-full px-2">
        <p className="text-sm font-bold text-white tracking-wide truncate">{label}</p>
        <div className={`flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest mt-0.5 truncate ${alert ? 'text-red-500 font-bold' : 'text-zinc-500'}`}>
           {alert && <AlertCircle size={10} />}
           <span>{subLabel}</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ subjects, assignments }) => {
  const { schedule } = usePlannerStore();
  
  const upcomingAssignments = assignments
    .filter(a => !a.isCompleted)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Calculations
  const totalClasses = subjects.reduce((acc, s) => acc + s.classesConducted, 0);
  const totalAttended = subjects.reduce((acc, s) => acc + s.classesAttended, 0);
  const attendanceRate = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 100;
  
  // Attendance Criteria Logic (75%)
  const isAttendanceLow = attendanceRate < 75;
  const attendanceColor = isAttendanceLow ? '#EF4444' : '#F59E0B'; // Red if < 75%, Gold otherwise

  const totalTasks = assignments.length;
  const completedTasks = assignments.filter(a => a.isCompleted).length;
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Next Class Logic
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const todaysClasses = schedule
    .filter(s => s.day === todayName as any)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  const nextClass = todaysClasses.find(c => {
     const now = new Date();
     const [hours, mins] = c.startTime.split(':').map(Number);
     const classTime = new Date();
     classTime.setHours(hours, mins, 0);
     return classTime > now;
  }) || todaysClasses[0]; 

  const nextClassSubject = nextClass ? subjects.find(s => s.id === nextClass.subjectId) : null;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Area */}
      <div className="shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4 px-1 opacity-0 animate-fade-in" style={{ animationDelay: '0ms' }}>
         <div className="flex flex-col justify-end">
            <p className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-1">Overview</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none">Dashboard</h2>
         </div>
         
         {/* Action Bar */}
         <div className="flex items-center gap-3 self-start md:self-auto w-full md:w-auto">
            <div className="flex-1 md:flex-none flex items-center gap-2 bg-[#121212] rounded-full p-1 pl-4 border border-white/5 max-w-[200px] md:max-w-none">
               <Search className="text-zinc-500 shrink-0" size={16} />
               <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none w-full md:w-48"
               />
            </div>
            <button className="w-10 h-10 rounded-full bg-brand-gold text-black flex items-center justify-center hover:scale-105 transition-transform shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
               <Plus size={20} />
            </button>
         </div>
      </div>

      {/* Main Content Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COL 1: Stats & Rings - Delay 100ms */}
        <div 
          className="lg:col-span-3 flex flex-col md:flex-row lg:flex-col gap-6 opacity-0 animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
           {/* Attendance Ring */}
           <GlassCard className={`flex-1 flex flex-col items-center justify-center py-6 ${isAttendanceLow ? 'border-red-500/20 bg-red-500/5' : ''}`} hoverEffect>
              <FitnessRing 
                 percentage={attendanceRate} 
                 color={attendanceColor} 
                 label="Attendance" 
                 subLabel={isAttendanceLow ? "Warning: Low" : "Good Standing"}
                 icon={isAttendanceLow ? <AlertTriangle size={24} className="text-red-500" /> : <ArrowUpRight size={24} className="text-brand-gold"/>}
                 alert={isAttendanceLow}
              />
           </GlassCard>

           {/* Task Ring */}
           <GlassCard className="flex-1 flex flex-col items-center justify-center py-6" hoverEffect>
              <FitnessRing 
                 percentage={taskRate} 
                 color="#10B981" 
                 label="Assignments" 
                 subLabel="Completion"
                 icon={<CheckCircle2 size={24} className="text-emerald-500"/>}
              />
           </GlassCard>
        </div>

        {/* COL 2: Schedule - Up Next (200ms) & Queue (300ms) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           {/* 'Up Next' Card */}
           <div 
             className="bg-gradient-to-r from-[#1E1b15] to-[#121212] rounded-[2rem] p-6 border border-brand-gold/10 relative overflow-hidden group shadow-lg min-h-[140px] opacity-0 animate-slide-up"
             style={{ animationDelay: '200ms' }}
           >
              {/* Visualizer Animation */}
              <div className="absolute top-6 right-6 flex gap-1 items-end h-6 opacity-60">
                 <span className="w-1 bg-brand-gold h-3 animate-[pulse_0.8s_ease-in-out_infinite]"></span>
                 <span className="w-1 bg-brand-gold h-6 animate-[pulse_1.2s_ease-in-out_infinite]"></span>
                 <span className="w-1 bg-brand-gold h-4 animate-[pulse_1.0s_ease-in-out_infinite]"></span>
              </div>
              
              <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-3">Up Next</p>
              
              {nextClassSubject ? (
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#252525] flex items-center justify-center text-brand-gold shadow-md shrink-0 border border-white/5">
                       <Play fill="currentColor" size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                       <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight truncate leading-tight">
                         {nextClassSubject.name}
                       </h3>
                       <div className="flex items-center gap-3 text-xs md:text-sm text-zinc-400 mt-1.5 truncate">
                          <span className="flex items-center gap-1.5 shrink-0"><Clock size={14} className="text-brand-gold"/> {nextClass.startTime}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-700 shrink-0"></span>
                          <span className="flex items-center gap-1.5 truncate"><MapPin size={14} className="text-brand-gold"/> {nextClass.location || 'TBD'}</span>
                       </div>
                    </div>
                 </div>
              ) : (
                 <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] flex items-center justify-center text-zinc-600 shrink-0 border border-white/5">
                       <Pause size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-zinc-300">No active classes</h3>
                       <p className="text-sm text-zinc-500">You're clear for now.</p>
                    </div>
                 </div>
              )}
           </div>

           {/* Schedule Queue */}
           <GlassCard 
             className="flex flex-col gap-2 opacity-0 animate-slide-up"
             style={{ animationDelay: '300ms' }}
           >
              <div className="flex justify-between items-center mb-2 px-1">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2"><CalendarDays size={18} className="text-zinc-500"/> Today's Queue</h3>
                 <span className="text-xs font-bold text-zinc-500 bg-white/5 px-2 py-1 rounded-md">{todaysClasses.length}</span>
              </div>
              
              <div className="flex flex-col gap-2">
                 {todaysClasses.length === 0 ? (
                    <div className="py-12 text-center text-zinc-600 text-sm italic">No classes scheduled</div>
                 ) : (
                    todaysClasses.map((item, idx) => {
                       const sub = subjects.find(s => s.id === item.subjectId);
                       const isNext = item.id === nextClass?.id;
                       return (
                          <div key={item.id} className={`group flex items-center gap-4 p-3 rounded-xl transition-all border border-transparent ${isNext ? 'bg-brand-gold/10 border-brand-gold/10' : 'hover:bg-white/5 hover:border-white/5'}`}>
                             <div className="w-6 text-center text-xs font-mono opacity-50 shrink-0">
                                {isNext ? <Play size={10} className="mx-auto text-brand-gold" fill="currentColor"/> : idx + 1}
                             </div>
                             <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-bold truncate ${isNext ? 'text-brand-gold' : 'text-zinc-200'}`}>{sub?.name}</h4>
                                <p className="text-[10px] text-zinc-500 truncate">{item.location || 'Room TBD'}</p>
                             </div>
                             <div className="text-xs font-mono text-zinc-400 shrink-0">
                                {item.startTime}
                             </div>
                          </div>
                       )
                    })
                 )}
              </div>
           </GlassCard>
        </div>

        {/* COL 3: Tasks List - Delay 400ms */}
        <div 
          className="lg:col-span-4 flex flex-col opacity-0 animate-slide-up"
          style={{ animationDelay: '400ms' }}
        >
           <GlassCard className="h-auto min-h-[400px]">
              <div className="flex justify-between items-center mb-5 px-1">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2"><ListTodo size={18} className="text-zinc-500"/> Tasks</h3>
                 <button className="text-zinc-500 hover:text-white transition-colors">
                    <MoreHorizontal size={20} />
                 </button>
              </div>

              <div className="flex flex-col gap-2">
                 {upcomingAssignments.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-zinc-600 gap-3 opacity-60">
                       <CheckCircle2 size={40} strokeWidth={1.5} />
                       <span className="text-sm">All caught up</span>
                    </div>
                 ) : (
                    upcomingAssignments.map((task) => {
                       const sub = subjects.find(s => s.id === task.subjectId);
                       return (
                          <div key={task.id} className="group flex items-center gap-3 p-3 rounded-xl bg-[#0F0F0F] border border-white/5 hover:border-brand-gold/20 hover:bg-[#161616] transition-all cursor-pointer">
                             {/* Priority Dot */}
                             <div className={`w-1.5 h-8 rounded-full shrink-0 ${
                                task.priority === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 
                                task.priority === 'Medium' ? 'bg-brand-gold' : 'bg-blue-500'
                             }`}></div>
                             
                             <div className="flex-1 min-w-0 overflow-hidden">
                                <h4 className="text-sm font-bold text-zinc-200 truncate group-hover:text-white transition-colors">
                                   {task.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5 truncate">
                                   <span className="bg-white/5 px-1.5 py-0.5 rounded text-zinc-400 shrink-0">{sub?.code || 'GEN'}</span>
                                   <span className="text-zinc-700">•</span>
                                   <span className="truncate">Due {new Date(task.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                                </div>
                             </div>

                             {/* Hover Check Action */}
                             <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center group-hover:bg-brand-gold group-hover:border-brand-gold group-hover:text-black text-zinc-600 transition-all shrink-0">
                                <CheckCircle2 size={16} />
                             </div>
                          </div>
                       )
                    })
                 )}
              </div>
           </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;