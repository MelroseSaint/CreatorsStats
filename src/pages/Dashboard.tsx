import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils';
import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

export function Dashboard() {
  const { state } = useStore();
  
  // Calculate MRR from latest metrics if available
  const latestMetric = state.metrics[state.metrics.length - 1];
  const currentRevenue = latestMetric ? latestMetric.revenue : 0;
  const currentSubs = latestMetric ? latestMetric.subs : 0;

  // Simple projection logic for demo
  const nextMilestone = 100000; // Example: 100k subs
  const subsNeeded = nextMilestone - currentSubs;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-gray-400 mt-2">Welcome back, {state.user.name}. Here's what's happening with your creative business.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-gray-400">Total Revenue (Mo)</h3>
            <DollarSign className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(currentRevenue)}</div>
          <p className="text-xs text-gray-500 mt-1">+20.1% from last month</p>
        </div>

        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-gray-400">Total Subscribers</h3>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-white">{currentSubs.toLocaleString()}</div>
          <p className="text-xs text-gray-500 mt-1">{subsNeeded.toLocaleString()} to 100k</p>
        </div>

        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-gray-400">Active Projects</h3>
            <Calendar className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-white">{state.projects.filter(p => p.status === 'in-progress').length}</div>
          <p className="text-xs text-gray-500 mt-1">2 releasing this month</p>
        </div>
        
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-gray-400">Growth Velocity</h3>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-white">+12.5%</div>
          <p className="text-xs text-gray-500 mt-1">Avg. daily growth</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 bg-gray-900 border border-gray-800 rounded-xl p-6">
           <h3 className="text-lg font-medium text-white mb-4">Revenue Overview</h3>
           <div className="h-[200px] flex items-center justify-center text-gray-500 border border-dashed border-gray-700 rounded-lg">
             Chart Placeholder
           </div>
        </div>
        
        <div className="col-span-3 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Recent Projects</h3>
           <div className="space-y-4">
             {state.projects.length === 0 ? (
               <p className="text-sm text-gray-500">No active projects.</p>
             ) : (
               state.projects.map(project => (
                 <div key={project.id} className="flex items-center">
                   <div className="ml-4 space-y-1">
                     <p className="text-sm font-medium leading-none text-white">{project.name}</p>
                     <p className="text-xs text-gray-500">{project.type} • {project.releaseDate}</p>
                   </div>
                   <div className="ml-auto font-medium text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded">{project.status}</div>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
