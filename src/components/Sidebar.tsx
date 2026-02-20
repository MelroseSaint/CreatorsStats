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
    <aside className="w-64 bg-[#0B0C10] border-r border-[#1F222A] flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-[#F3F4F6] tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 bg-[#169A76] rounded-lg flex items-center justify-center text-[#0B0C10] font-mono font-bold">G</span>
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
                  ? 'bg-[#169A76]/10 text-[#169A76]'
                  : 'text-[#8A9099] hover:bg-[#14161C] hover:text-[#F3F4F6]'
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1F222A]">
        <div className="bg-[#14161C] rounded-lg p-3">
          <p className="text-xs text-[#5F646C] font-mono mb-1">CURRENT PLAN</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#F3F4F6]">{proEnabled ? 'Pro' : 'Free'}</span>
            {proEnabled ? (
              <span className="px-1.5 py-0.5 bg-[#169A76]/20 text-[#169A76] text-[10px] font-bold rounded border border-[#169A76]/20">ACTIVE</span>
            ) : (
              <span className="px-1.5 py-0.5 bg-[#1F222A] text-[#5F646C] text-[10px] font-bold rounded border border-[#1F222A]">FREE</span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
