import React, { useState } from 'react';
import { Assignment, Subject, Priority } from '../types';
import GlassCard from '../components/GlassCard';
import { Plus, CheckCircle2, Circle, Calendar, Clock, Trash2, Link as LinkIcon, Paperclip, Upload } from 'lucide-react';

interface AssignmentsProps {
  assignments: Assignment[];
  subjects: Subject[];
  addAssignment: (a: any) => void;
  toggleAssignment: (id: string) => void;
  deleteAssignment: (id: string) => void;
}

const Assignments: React.FC<AssignmentsProps> = ({ assignments, subjects, addAssignment, toggleAssignment, deleteAssignment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({ 
    title: '', subjectId: '', dueDate: '', description: '', priority: 'Medium', tags: [], estimatedTime: '', resourceLink: '' 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAssignment.title && newAssignment.subjectId) {
       addAssignment(newAssignment);
       setIsModalOpen(false);
       setNewAssignment({ title: '', subjectId: '', dueDate: '', description: '', priority: 'Medium', tags: [], estimatedTime: '', resourceLink: '' });
    }
  };

  const pendingTasks = assignments.filter(a => !a.isCompleted);
  const completedTasks = assignments.filter(a => a.isCompleted);

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white">To-Do List</h2>
          <p className="text-zinc-500 text-sm mt-1">Keep track of your deadlines and homework.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-brand-gold text-black hover:bg-brand-amber px-6 py-3 rounded-full transition-all font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.2)]"
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main List */}
         <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wide mb-2">Upcoming ({pendingTasks.length})</h3>
            
            {pendingTasks.length === 0 ? (
               <div className="py-12 text-center border border-dashed border-white/10 rounded-3xl">
                  <p className="text-zinc-600">No pending tasks. Relax!</p>
               </div>
            ) : (
               pendingTasks.map(task => {
                  const sub = subjects.find(s => s.id === task.subjectId);
                  const isHighPriority = task.priority === 'High';

                  return (
                     <div key={task.id} className="group bg-[#121212] p-4 rounded-2xl border border-white/[0.03] hover:border-brand-gold/20 hover:bg-[#181818] transition-all flex items-center gap-4">
                        <button onClick={() => toggleAssignment(task.id)} className="text-zinc-600 hover:text-brand-gold transition-colors shrink-0">
                           <Circle size={24} />
                        </button>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-white text-lg truncate">{task.title}</h4>
                              {isHighPriority && <span className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">Urgent</span>}
                              <span className="bg-white/5 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">{sub?.code || 'General'}</span>
                           </div>
                           <div className="flex items-center gap-4 text-xs text-zinc-500">
                              <span className="flex items-center gap-1 shrink-0"><Calendar size={12}/> {new Date(task.dueDate).toLocaleDateString()}</span>
                              {task.estimatedTime && <span className="flex items-center gap-1 shrink-0"><Clock size={12}/> {task.estimatedTime}</span>}
                              {task.resourceLink && (
                                 <a href={task.resourceLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 shrink-0 text-brand-gold hover:underline">
                                    <Paperclip size={12}/> Attachment
                                 </a>
                              )}
                           </div>
                        </div>
                        <button onClick={() => deleteAssignment(task.id)} className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-500 transition-all p-2 shrink-0">
                           <Trash2 size={18} />
                        </button>
                     </div>
                  )
               })
            )}

            {completedTasks.length > 0 && (
               <>
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wide mt-8 mb-2">Completed</h3>
                  <div className="opacity-50">
                     {completedTasks.map(task => (
                        <div key={task.id} className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/[0.02] flex items-center gap-4 mb-3">
                           <button onClick={() => toggleAssignment(task.id)} className="text-brand-gold shrink-0">
                              <CheckCircle2 size={24} />
                           </button>
                           <h4 className="font-medium text-zinc-400 line-through truncate">{task.title}</h4>
                        </div>
                     ))}
                  </div>
               </>
            )}
         </div>

         {/* Sidebar Stats */}
         <div className="space-y-6">
            <GlassCard>
               <h3 className="font-bold text-white mb-4">Priority Breakdown</h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div> High
                     </div>
                     <span className="font-bold text-white">{assignments.filter(a => a.priority === 'High' && !a.isCompleted).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <div className="w-3 h-3 rounded-full bg-brand-gold"></div> Medium
                     </div>
                     <span className="font-bold text-white">{assignments.filter(a => a.priority === 'Medium' && !a.isCompleted).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div> Low
                     </div>
                     <span className="font-bold text-white">{assignments.filter(a => a.priority === 'Low' && !a.isCompleted).length}</span>
                  </div>
               </div>
            </GlassCard>
         </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-3xl p-8 animate-slide-up max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-2xl font-bold text-white mb-6">Add New Task</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Task Title</label>
                  <input required type="text" value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Subject</label>
                    <select required value={newAssignment.subjectId} onChange={e => setNewAssignment({...newAssignment, subjectId: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 [&>option]:bg-black">
                       <option value="">Select...</option>
                       {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Due Date</label>
                    <input required type="date" value={newAssignment.dueDate} onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 invert-calendar-icon" />
                  </div>
               </div>
               
               <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Attachment / Resource Link</label>
                  <div className="flex items-center gap-2 bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 focus-within:border-brand-gold/50 group">
                     <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-focus-within:text-brand-gold transition-colors">
                        <Upload size={16} />
                     </div>
                     <input type="text" value={newAssignment.resourceLink} onChange={e => setNewAssignment({...newAssignment, resourceLink: e.target.value})} className="w-full bg-transparent text-white focus:outline-none placeholder:text-zinc-600 text-sm" placeholder="Paste link to file (Drive, Dropbox, etc)" />
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1 pl-1">Supports links to cloud storage files.</p>
               </div>

               <div>
                   <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Priority</label>
                   <div className="flex gap-4">
                      {['High', 'Medium', 'Low'].map(p => (
                         <label key={p} className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                            <input type="radio" name="priority" value={p} checked={newAssignment.priority === p} onChange={() => setNewAssignment({...newAssignment, priority: p as Priority})} className="accent-brand-gold" />
                            {p}
                         </label>
                      ))}
                   </div>
               </div>
               <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-transparent text-zinc-400 hover:text-white font-bold transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-brand-gold text-black rounded-xl font-bold hover:bg-brand-amber transition-colors">Save Task</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;