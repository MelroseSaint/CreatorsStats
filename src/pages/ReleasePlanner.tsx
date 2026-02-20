import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { addDays, format, differenceInDays, parseISO } from 'date-fns';
import { type Project } from '../types';

export function ReleasePlanner() {
  const { state, addProject, deleteProject } = useStore();
  const [newProject, setNewProject] = useState({
    name: '',
    releaseDate: '',
    type: 'video' as Project['type'],
  });

  const handleAdd = () => {
    if (!newProject.name || !newProject.releaseDate) return;
    
    addProject({
      name: newProject.name,
      releaseDate: newProject.releaseDate,
      type: newProject.type,
      status: 'planning'
    });
    
    setNewProject({ name: '', releaseDate: '', type: 'video' });
  };

  const getDeadlines = (releaseDate: string) => {
    const date = parseISO(releaseDate);
    return [
      { label: 'Concept & Script', date: addDays(date, -14) },
      { label: 'Production / Filming', date: addDays(date, -7) },
      { label: 'Editing & Polish', date: addDays(date, -3) },
      { label: 'Thumbnail & Metadata', date: addDays(date, -1) },
    ];
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Release Planner</h2>
        <p className="text-[#a3a3a3] mt-2">Work backwards from your drop date to hit every deadline.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#171717] p-6 rounded-xl border border-[#262626]">
            <h3 className="font-semibold text-lg text-[#f5f5f5] mb-4">New Project</h3>
            <div className="space-y-4">
              <Input 
                label="Project Name" 
                placeholder="e.g. My Next Release"
                value={newProject.name} 
                onChange={e => setNewProject({...newProject, name: e.target.value})} 
              />
              <div className="space-y-1">
                <label className="text-sm text-[#a3a3a3] font-medium">Type</label>
                <select 
                  className="w-full h-10 rounded-md border border-[#262626] bg-[#0a0a0a] px-3 text-sm text-[#f5f5f5] outline-none focus:ring-2 focus:ring-[#10b981]"
                  value={newProject.type}
                  onChange={e => setNewProject({...newProject, type: e.target.value as Project['type']})}
                >
                  <option value="video">YouTube Video</option>
                  <option value="song">Music Release</option>
                  <option value="merch">Merch Drop</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Input 
                label="Target Release Date" 
                type="date" 
                value={newProject.releaseDate} 
                onChange={e => setNewProject({...newProject, releaseDate: e.target.value})} 
              />
              <Button className="w-full" onClick={handleAdd} disabled={!newProject.name || !newProject.releaseDate}>
                <Plus size={16} className="mr-2" />
                Add to Schedule
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {state.projects.length === 0 ? (
            <div className="h-64 flex items-center justify-center bg-[#171717] rounded-xl border border-dashed border-[#262626] text-[#525252]">
               No active projects. Start planning your next release.
            </div>
          ) : (
            <div className="space-y-6">
              {state.projects.sort((a,b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()).map(project => {
                const deadlines = getDeadlines(project.releaseDate);
                const daysLeft = differenceInDays(parseISO(project.releaseDate), new Date());
                
                return (
                  <div key={project.id} className="bg-[#171717] border border-[#262626] rounded-xl overflow-hidden">
                    <div className="p-4 bg-[#0a0a0a] border-b border-[#262626] flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-12 rounded-full ${daysLeft < 0 ? 'bg-red-500' : daysLeft < 7 ? 'bg-[#d97706]' : 'bg-[#10b981]'}`}></div>
                         <div>
                           <h3 className="font-bold text-[#f5f5f5] text-lg">{project.name}</h3>
                           <p className="text-xs text-[#525252] uppercase tracking-wider">{project.type} • Release: {project.releaseDate}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="text-right">
                           <span className="block text-2xl font-bold text-[#f5f5f5]">{daysLeft}</span>
                           <span className="text-xs text-[#525252]">DAYS LEFT</span>
                         </div>
                         <button onClick={() => deleteProject(project.id)} className="p-2 text-[#525252] hover:text-red-500 transition-colors">
                           <Trash2 size={18} />
                         </button>
                      </div>
                    </div>
                    
                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                      {deadlines.map((task, idx) => (
                        <div key={idx} className="bg-[#0a0a0a] p-3 rounded border border-[#262626]">
                          <div className="flex items-center gap-2 mb-1">
                            <CalendarIcon size={12} className="text-[#525252]" />
                            <span className="text-xs text-[#525252]">{format(task.date, 'MMM d')}</span>
                          </div>
                          <p className="text-sm font-medium text-[#a3a3a3]">{task.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
