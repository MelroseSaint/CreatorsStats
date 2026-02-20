import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils';
import { TrendingUp, Users, Calendar, DollarSign, Plus } from 'lucide-react';
import { verifyToken } from '../utils/pro';

export function Dashboard() {
  const { state } = useStore();
  const [proEnabled, setProEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPro = async () => {
      const isPro = await verifyToken();
      setProEnabled(isPro);
      setLoading(false);
    };
    checkPro();
  }, []);
  
  const latestMetric = state.metrics[state.metrics.length - 1];
  const currentRevenue = latestMetric?.revenue || 0;
  const currentSubs = latestMetric?.subs || 0;

  const hasData = state.metrics.length > 0 || state.projects.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#5F646C]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-[#8A9099] mt-2">Welcome back, {state.user.name}.</p>
      </div>

      {proEnabled && (
        <div className="bg-[#169A76]/10 border border-[#169A76]/20 rounded-lg px-4 py-2 text-sm text-[#169A76]">
          Pro mode enabled
        </div>
      )}

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#14161C] border border-[#1F222A] rounded-xl">
          <p className="text-[#8A9099] mb-4">No data yet</p>
          <Link
            to="/growth"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#169A76] text-[#0B0C10] rounded font-medium hover:bg-[#148A6A] transition-colors"
          >
            <Plus size={16} />
            Add your first entry
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 bg-[#14161C] border border-[#1F222A] rounded-xl">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-[#8A9099]">Total Revenue (Mo)</h3>
                <DollarSign className="h-4 w-4 text-[#169A76]" />
              </div>
              <div className="text-2xl font-bold text-[#F3F4F6]">{formatCurrency(currentRevenue)}</div>
            </div>

            <div className="p-6 bg-[#14161C] border border-[#1F222A] rounded-xl">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-[#8A9099]">Total Subscribers</h3>
                <Users className="h-4 w-4 text-[#169A76]" />
              </div>
              <div className="text-2xl font-bold text-[#F3F4F6]">{currentSubs.toLocaleString()}</div>
            </div>

            <div className="p-6 bg-[#14161C] border border-[#1F222A] rounded-xl">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-[#8A9099]">Active Projects</h3>
                <Calendar className="h-4 w-4 text-[#B8952E]" />
              </div>
              <div className="text-2xl font-bold text-[#F3F4F6]">{state.projects.filter(p => p.status === 'in-progress').length}</div>
            </div>
            
            <div className="p-6 bg-[#14161C] border border-[#1F222A] rounded-xl">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-[#8A9099]">Growth Velocity</h3>
                <TrendingUp className="h-4 w-4 text-[#B8952E]" />
              </div>
              <div className="text-2xl font-bold text-[#F3F4F6]">--</div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 bg-[#14161C] border border-[#1F222A] rounded-xl p-6">
               <h3 className="text-lg font-medium text-[#F3F4F6] mb-4">Revenue Overview</h3>
               <div className="h-[200px] flex items-center justify-center text-[#5F646C] border border-dashed border-[#1F222A] rounded-lg">
                 No data yet
               </div>
            </div>
            
            <div className="col-span-3 bg-[#14161C] border border-[#1F222A] rounded-xl p-6">
              <h3 className="text-lg font-medium text-[#F3F4F6] mb-4">Recent Projects</h3>
               <div className="space-y-4">
                 {state.projects.length === 0 ? (
                   <p className="text-sm text-[#5F646C]">No active projects.</p>
                 ) : (
                   state.projects.slice(0, 3).map(project => (
                     <div key={project.id} className="flex items-center">
                       <div className="ml-4 space-y-1">
                         <p className="text-sm font-medium leading-none text-[#F3F4F6]">{project.name}</p>
                         <p className="text-xs text-[#5F646C]">{project.type} • {project.releaseDate}</p>
                       </div>
                       <div className="ml-auto font-medium text-xs text-[#169A76] bg-[#169A76]/10 px-2 py-1 rounded">{project.status}</div>
                     </div>
                   ))
                 )}
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
