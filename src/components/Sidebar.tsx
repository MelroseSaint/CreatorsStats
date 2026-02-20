import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calculator, TrendingUp, Calendar, Target, Settings } from 'lucide-react';
import { cn } from '../utils';
import { isProEligible } from '../utils/pro';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/app' },
  { icon: Calculator, label: 'Rate Calculator', to: '/app/rates' },
  { icon: TrendingUp, label: 'Revenue Projection', to: '/app/revenue' },
  { icon: Target, label: 'Growth Tracker', to: '/app/growth' },
  { icon: Calendar, label: 'Release Planner', to: '/app/planner' },
  { icon: Settings, label: 'Settings', to: '/app/settings' },
];

export function Sidebar() {
  const proEnabled = isProEligible();

  return (
    <aside className="w-64 bg-[#0B0C10] border-r border-[#1F222A] flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-[#F3F4F6] tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 inline-flex">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <rect width="48" height="48" rx="12" fill="#14161C" />
              <path
                d="M28 14 C20 14 16 19 16 24 C16 29 20 34 28 34 C32 34 36 31 36 27 H28"
                stroke="#169A76"
                strokeWidth="3.5"
                fill="none"
              />
              <line x1="36" y1="14" x2="36" y2="34" stroke="#B8952E" strokeWidth="3.5" />
            </svg>
          </span>
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
                  : 'text-[#8A9099] hover:bg-[#0B0C10] hover:text-[#F3F4F6]'
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
              <span className="px-1.5 py-0.5 bg-[#14161C] text-[#B8952E] text-[10px] font-bold rounded border border-[#B8952E]">ACTIVE</span>
            ) : (
              <span className="px-1.5 py-0.5 bg-[#1F222A] text-[#5F646C] text-[10px] font-bold rounded border border-[#1F222A]">FREE</span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
