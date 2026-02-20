import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calculator, TrendingUp, Calendar, Target, Settings } from 'lucide-react';
import { cn } from '../utils';
import { isProEnabled } from '../utils/pro';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/app' },
  { icon: Calculator, label: 'Rate Calculator', to: '/app/rates' },
  { icon: TrendingUp, label: 'Revenue Projection', to: '/app/revenue' },
  { icon: Target, label: 'Growth Tracker', to: '/app/growth' },
  { icon: Calendar, label: 'Release Planner', to: '/app/planner' },
  { icon: Settings, label: 'Settings', to: '/app/settings' },
];

export function Sidebar() {
  const proEnabled = isProEnabled();

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-[#262626] flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-[#f5f5f5] tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 bg-[#10b981] rounded-lg flex items-center justify-center text-[#022c22] font-mono font-bold">G</span>
          GrowthLedger
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#10b981]/10 text-[#10b981]'
                  : 'text-[#a3a3a3] hover:bg-[#171717] hover:text-[#f5f5f5]'
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#262626]">
        <div className="bg-[#171717] rounded-lg p-3">
          <p className="text-xs text-[#525252] font-mono mb-1">CURRENT PLAN</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#f5f5f5]">{proEnabled ? 'Pro' : 'Free'}</span>
            {proEnabled ? (
              <span className="px-1.5 py-0.5 bg-[#10b981]/20 text-[#10b981] text-[10px] font-bold rounded border border-[#10b981]/20">ACTIVE</span>
            ) : (
              <span className="px-1.5 py-0.5 bg-[#262626] text-[#525252] text-[10px] font-bold rounded border border-[#262626]">FREE</span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
