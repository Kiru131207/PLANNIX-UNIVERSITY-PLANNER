import React, { useState } from 'react';
import { ScheduleItem, Subject, DayOfWeek } from '../types';
import GlassCard from '../components/GlassCard';
import { Plus, Trash2, MapPin } from 'lucide-react';

interface TimetableProps {
  schedule: ScheduleItem[];
  subjects: Subject[];
  addScheduleItem: (item: any) => void;
  deleteScheduleItem: (id: string) => void;
}

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const Timetable: React.FC<TimetableProps> = ({ schedule, subjects, addScheduleItem, deleteScheduleItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    subjectId: '',
    day: 'Mon' as DayOfWeek,
    startTime: '09:00',
    endTime: '10:00',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.subjectId) return;
    addScheduleItem(newItem);
    setIsModalOpen(false);
    setNewItem(prev => ({ ...prev, subjectId: '', startTime: '09:00', endTime: '10:00', location: '' }));
  };

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white">Class Schedule</h2>
          <p className="text-zinc-500 text-sm mt-1">Your weekly timetable.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-brand-gold text-black hover:bg-brand-amber px-6 py-3 rounded-full transition-all font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.2)]"
        >
          <Plus size={18} />
          <span>Add Class</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {DAYS.map((day) => {
          const dayClasses = schedule
            .filter(item => item.day === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div key={day} className="flex flex-col gap-3">
              <div className="bg-[#121212] p-3 rounded-xl text-center border border-white/5">
                <span className="text-sm font-bold text-white">{day}</span>
              </div>
              
              <div className="flex flex-col gap-3 min-h-[300px]">
                {dayClasses.map(item => {
                  const subject = getSubject(item.subjectId);
                  return (
                    <div 
                      key={item.id} 
                      className="group relative bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 hover:border-brand-gold/20 hover:bg-[#222] transition-all"
                    >
                      <div className="flex justify-between items-start">
                         <span className="text-xs font-bold text-brand-gold">{item.startTime}</span>
                         <button onClick={() => deleteScheduleItem(item.id)} className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-500 transition-opacity">
                            <Trash2 size={14} />
                         </button>
                      </div>
                      <h4 className="font-bold text-white mt-1 mb-2">{subject?.name}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                         <MapPin size={10} />
                         <span>{item.location || 'TBD'}</span>
                      </div>
                      <div className="mt-2 h-1 w-10 rounded-full" style={{ backgroundColor: subject?.color }}></div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

       {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#0F0F0F] border border-white/10 rounded-3xl p-8 animate-slide-up">
            <h3 className="text-2xl font-bold text-white mb-6">Add Class</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Subject</label>
                  <select required value={newItem.subjectId} onChange={e => setNewItem({...newItem, subjectId: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 [&>option]:bg-black">
                     <option value="">Select...</option>
                     {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Day</label>
                    <select required value={newItem.day} onChange={e => setNewItem({...newItem, day: e.target.value as DayOfWeek})} className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 [&>option]:bg-black">
                       {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Room</label>
                    <input type="text" value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50" placeholder="101" />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Start</label>
                    <input required type="time" value={newItem.startTime} onChange={e => setNewItem({...newItem, startTime: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 invert-calendar-icon" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">End</label>
                    <input required type="time" value={newItem.endTime} onChange={e => setNewItem({...newItem, endTime: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 invert-calendar-icon" />
                  </div>
               </div>
               <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-transparent text-zinc-400 hover:text-white font-bold transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-brand-gold text-black rounded-xl font-bold hover:bg-brand-amber transition-colors">Save Class</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;