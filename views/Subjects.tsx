import React, { useState } from 'react';
import { Subject, SUBJECT_COLORS, SearchResult } from '../types';
import GlassCard from '../components/GlassCard';
import { Plus, Search, X, MoreHorizontal } from 'lucide-react';
import { searchSubjectResources } from '../services/geminiService';

interface SubjectsProps {
  subjects: Subject[];
  addSubject: (s: any) => void;
  deleteSubject: (id: string) => void;
  updateAttendance: (id: string, type: 'conducted' | 'attended', increment: boolean) => void;
}

const Subjects: React.FC<SubjectsProps> = ({ subjects, addSubject, deleteSubject, updateAttendance }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState<Partial<Subject>>({ 
    name: '', code: '', professor: '', color: SUBJECT_COLORS[0], credits: 3, targetGrade: 'A', room: '' 
  });
  
  const [searching, setSearching] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<{ subjectId: string, results: SearchResult[] } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubject.name && newSubject.code) {
      addSubject(newSubject);
      setIsModalOpen(false);
      setNewSubject({ name: '', code: '', professor: '', color: SUBJECT_COLORS[0], credits: 3, targetGrade: 'A', room: '' });
    }
  };

  const handleSearch = async (subjectId: string, subjectName: string) => {
    setSearching(subjectId);
    setSearchResults(null);
    try {
      const results = await searchSubjectResources(subjectName);
      setSearchResults({ subjectId, results });
    } catch (error) {
      console.error(error);
      alert("Search failed.");
    } finally {
      setSearching(null);
    }
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white">My Courses</h2>
          <p className="text-zinc-500 text-sm mt-1">Manage your subjects and track attendance.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-brand-gold text-black hover:bg-brand-amber px-6 py-3 rounded-full transition-all font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.2)]"
        >
          <Plus size={18} />
          <span>Add Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {subjects.map((sub) => {
          const percentage = sub.classesConducted > 0 ? (sub.classesAttended / sub.classesConducted) * 100 : 100;
          const isDanger = percentage < 75;

          return (
            <GlassCard key={sub.id} className="flex flex-col overflow-hidden !p-0" hoverEffect>
              {/* Card Header Color Strip */}
              <div className="h-2 w-full shrink-0" style={{ backgroundColor: sub.color }}></div>
              
              <div className="p-6 flex-1 flex flex-col min-w-0">
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg shrink-0" style={{ backgroundColor: `${sub.color}20`, color: sub.color }}>
                       {sub.code.substring(0, 2)}
                    </div>
                    <button onClick={() => deleteSubject(sub.id)} className="text-zinc-600 hover:text-red-500 transition-colors">
                       <MoreHorizontal size={20} />
                    </button>
                 </div>

                 <h3 className="text-xl font-bold text-white mb-1 truncate" title={sub.name}>{sub.name}</h3>
                 <p className="text-sm text-zinc-500 mb-6 truncate">{sub.code} • {sub.professor}</p>

                 {/* Attendance Section */}
                 <div className="mt-auto bg-[#0A0A0A] rounded-2xl p-4 border border-white/5">
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-xs font-bold text-zinc-500 uppercase">Attendance</span>
                       <span className={`text-2xl font-bold ${isDanger ? 'text-red-500' : 'text-white'}`}>{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#1A1A1A] rounded-full overflow-hidden mb-4">
                       <div className={`h-full rounded-full ${isDanger ? 'bg-red-500' : 'bg-brand-gold'}`} style={{ width: `${percentage}%` }} />
                    </div>

                    <div className="flex justify-between text-center">
                       <div className="flex-1 border-r border-white/5">
                          <p className="text-[10px] text-zinc-500 uppercase">Conducted</p>
                          <div className="flex items-center justify-center gap-2 mt-1">
                             <button onClick={() => updateAttendance(sub.id, 'conducted', false)} className="text-zinc-600 hover:text-white">-</button>
                             <span className="font-bold text-white">{sub.classesConducted}</span>
                             <button onClick={() => updateAttendance(sub.id, 'conducted', true)} className="text-zinc-600 hover:text-white">+</button>
                          </div>
                       </div>
                       <div className="flex-1">
                          <p className="text-[10px] text-zinc-500 uppercase">Attended</p>
                          <div className="flex items-center justify-center gap-2 mt-1">
                             <button onClick={() => updateAttendance(sub.id, 'attended', false)} className="text-zinc-600 hover:text-white">-</button>
                             <span className="font-bold text-white">{sub.classesAttended}</span>
                             <button onClick={() => updateAttendance(sub.id, 'attended', true)} className="text-zinc-600 hover:text-white">+</button>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* AI Search */}
                 <button 
                   onClick={() => handleSearch(sub.id, sub.name)}
                   disabled={searching === sub.id}
                   className="mt-4 w-full py-3 bg-[#1A1A1A] hover:bg-[#222] rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2 shrink-0"
                 >
                    {searching === sub.id ? 'Thinking...' : <><Search size={14}/> Find Study Materials</>}
                 </button>

                 {searchResults && searchResults.subjectId === sub.id && (
                  <div className="mt-4 p-4 bg-[#0A0A0A] rounded-xl border border-white/5 animate-fade-in">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold text-brand-gold">Recommended Resources</span>
                       <button onClick={() => setSearchResults(null)}><X size={14} className="text-zinc-500"/></button>
                    </div>
                    <ul className="space-y-2">
                       {searchResults.results.map((res, i) => (
                          <li key={i}>
                             <a href={res.url} target="_blank" className="block text-xs text-zinc-300 hover:text-brand-gold truncate underline decoration-zinc-700">
                                {res.title}
                             </a>
                          </li>
                       ))}
                    </ul>
                  </div>
                 )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-3xl p-8 animate-slide-up">
            <h3 className="text-2xl font-bold text-white mb-6">Add New Course</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Course Name</label>
                  <input required type="text" value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50" placeholder="e.g. Calculus II" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Code</label>
                    <input required type="text" value={newSubject.code} onChange={e => setNewSubject({...newSubject, code: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50" placeholder="MAT102" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Professor</label>
                    <input type="text" value={newSubject.professor} onChange={e => setNewSubject({...newSubject, professor: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50" />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Color Tag</label>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                     {SUBJECT_COLORS.map(c => (
                        <button key={c} type="button" onClick={() => setNewSubject({...newSubject, color: c})} className={`w-8 h-8 rounded-full border-2 shrink-0 ${newSubject.color === c ? 'border-white scale-110' : 'border-transparent opacity-50'}`} style={{ backgroundColor: c }} />
                     ))}
                  </div>
               </div>
               <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-transparent text-zinc-400 hover:text-white font-bold transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-brand-gold text-black rounded-xl font-bold hover:bg-brand-amber transition-colors">Save Course</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;