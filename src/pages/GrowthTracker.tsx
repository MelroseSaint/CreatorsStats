import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function GrowthTracker() {
  const { state, addMetric, deleteMetric } = useStore();
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    subs: 0,
    views: 0,
    revenue: 0
  });

  const handleAdd = () => {
    if (newEntry.subs > 0) {
      addMetric(newEntry);
      setNewEntry({
        ...newEntry,
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  const sortedMetrics = [...state.metrics].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Growth Tracker</h2>
        <p className="text-[#a3a3a3] mt-2">Log your metrics weekly to visualize your trajectory.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-[#171717] border border-[#262626] rounded-xl p-6 h-[400px]">
             <h3 className="text-lg font-medium text-[#f5f5f5] mb-4">Subscriber Growth</h3>
             {sortedMetrics.length > 1 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={sortedMetrics}>
                   <defs>
                     <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                   <XAxis dataKey="date" stroke="#525252" fontSize={12} tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {month:'short', day:'numeric'})} />
                   <YAxis stroke="#525252" fontSize={12} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#171717', borderColor: '#262626' }}
                     itemStyle={{ color: '#f5f5f5' }}
                   />
                   <Area type="monotone" dataKey="subs" stroke="#10b981" fillOpacity={1} fill="url(#colorSubs)" />
                 </AreaChart>
               </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-[#525252] border border-dashed border-[#262626] rounded-lg">
                 Add at least 2 data points to see the chart.
               </div>
             )}
           </div>

           <div className="bg-[#171717] border border-[#262626] rounded-xl overflow-hidden">
             <table className="w-full text-sm text-left text-[#a3a3a3]">
               <thead className="bg-[#0a0a0a] text-[#f5f5f5] uppercase font-medium">
                 <tr>
                   <th className="px-6 py-3">Date</th>
                   <th className="px-6 py-3">Subscribers</th>
                   <th className="px-6 py-3">Total Views</th>
                   <th className="px-6 py-3">Revenue</th>
                   <th className="px-6 py-3 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {sortedMetrics.map((metric) => (
                   <tr key={metric.id} className="border-b border-[#262626] hover:bg-[#0a0a0a]">
                     <td className="px-6 py-4">{metric.date}</td>
                     <td className="px-6 py-4 text-[#f5f5f5]">{metric.subs.toLocaleString()}</td>
                     <td className="px-6 py-4">{metric.views.toLocaleString()}</td>
                     <td className="px-6 py-4 text-[#10b981]">${metric.revenue}</td>
                     <td className="px-6 py-4 text-right">
                       <button onClick={() => deleteMetric(metric.id)} className="text-red-500 hover:text-red-400">
                         <Trash2 size={16} />
                       </button>
                     </td>
                   </tr>
                 ))}
                 {sortedMetrics.length === 0 && (
                   <tr>
                     <td colSpan={5} className="px-6 py-8 text-center text-[#525252]">No data yet.</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#171717] p-6 rounded-xl border border-[#262626] sticky top-6">
            <h3 className="font-semibold text-lg text-[#f5f5f5] mb-4">Add Entry</h3>
            <div className="space-y-4">
              <Input 
                label="Date" 
                type="date" 
                value={newEntry.date} 
                onChange={e => setNewEntry({...newEntry, date: e.target.value})} 
              />
              <Input 
                label="Total Subscribers" 
                type="number" 
                value={newEntry.subs} 
                onChange={e => setNewEntry({...newEntry, subs: Number(e.target.value)})} 
              />
              <Input 
                label="Total Views (Lifetime)" 
                type="number" 
                value={newEntry.views} 
                onChange={e => setNewEntry({...newEntry, views: Number(e.target.value)})} 
              />
              <Input 
                label="Monthly Revenue ($)" 
                type="number" 
                value={newEntry.revenue} 
                onChange={e => setNewEntry({...newEntry, revenue: Number(e.target.value)})} 
              />
              <Button className="w-full" onClick={handleAdd}>
                <Plus size={16} className="mr-2" />
                Log Data Point
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
