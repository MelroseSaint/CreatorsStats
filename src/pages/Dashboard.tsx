import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils';
import { TrendingUp, Users, Calendar, DollarSign, Plus } from 'lucide-react';
import { isProEnabled } from '../utils/pro';

export function Dashboard() {
  const { state } = useStore();
  const proEnabled = isProEnabled();
  
  const latestMetric = state.metrics[state.metrics.length - 1];
  const currentRevenue = latestMetric?.revenue || 0;
  const currentSubs = latestMetric?.subs || 0;

  const hasData = state.metrics.length > 0 || state.projects.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-[#a3a3a3] mt-2">Welcome back, {state.user.name}.</p>
      </div>

      {proEnabled && (
        <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg px-4 py-2 text-sm text-[#10b981]">
          Pro mode enabled
        </div>
      )}

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#171717] border border-[#262626] rounded-xl">
          <p className="text-[#a3a3a3] mb-4">No data yet</p>
          <Link
            to="/growth"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#10b981] text-[#022c22] rounded font-medium hover:bg-[#059669] transition-colors"
          >
            <Plus size={16} />
            Add your first entry
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 bg-[#171717] border border-[#262626] rounded-xl">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-[#a3a3a3]">Total Revenue (Mo)</h3>
                <DollarSign className="h-4 w-4 text-[#10b981]" />
              </div>
              <div className="text-2xl font-bold text-[#f5f5f5]">{formatCurrency(currentRevenue)}</div>
            </div>

            <div className="p-6 bg-[#171717] border border-[#262626] rounded-xl">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-[#a3a3a3]">Total Subscribers</h3>
                <Users className="h-4 w-4 text-[#10b981]" />
              </div>
              <div className="text-2xl font-bold text-[#f5f5f5]">{currentSubs.toLocaleString()}</div>
            </div>

            <div className="p-6 bg-[#171717] border border-[#262626] rounded-xl">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-[#a3a3a3]">Active Projects</h3>
                <Calendar className="h-4 w-4 text-[#d97706]" />
              </div>
              <div className="text-2xl font-bold text-[#f5f5f5]">{state.projects.filter(p => p.status === 'in-progress').length}</div>
            </div>
            
            <div className="p-6 bg-[#171717] border border-[#262626] rounded-xl">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-[#a3a3a3]">Growth Velocity</h3>
                <TrendingUp className="h-4 w-4 text-[#d97706]" />
              </div>
              <div className="text-2xl font-bold text-[#f5f5f5]">--</div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 bg-[#171717] border border-[#262626] rounded-xl p-6">
               <h3 className="text-lg font-medium text-[#f5f5f5] mb-4">Revenue Overview</h3>
               <div className="h-[200px] flex items-center justify-center text-[#525252] border border-dashed border-[#262626] rounded-lg">
                 No data yet
               </div>
            </div>
            
            <div className="col-span-3 bg-[#171717] border border-[#262626] rounded-xl p-6">
              <h3 className="text-lg font-medium text-[#f5f5f5] mb-4">Recent Projects</h3>
               <div className="space-y-4">
                 {state.projects.length === 0 ? (
                   <p className="text-sm text-[#525252]">No active projects.</p>
                 ) : (
                   state.projects.slice(0, 3).map(project => (
                     <div key={project.id} className="flex items-center">
                       <div className="ml-4 space-y-1">
                         <p className="text-sm font-medium leading-none text-[#f5f5f5]">{project.name}</p>
                         <p className="text-xs text-[#525252]">{project.type} • {project.releaseDate}</p>
                       </div>
                       <div className="ml-auto font-medium text-xs text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded">{project.status}</div>
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
