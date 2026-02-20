import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calculator, TrendingUp, Calendar, Target, Settings, LogOut } from 'lucide-react';
import { cn } from '../utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Calculator, label: 'Rate Calculator', to: '/rates' },
  { icon: TrendingUp, label: 'Revenue Projection', to: '/revenue' },
  { icon: Target, label: 'Growth Tracker', to: '/growth' },
  { icon: Calendar, label: 'Release Planner', to: '/planner' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-mono">C</span>
          Revenue OS
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
                  ? 'bg-blue-600/10 text-blue-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-500 font-mono mb-1">CURRENT PLAN</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-200">Pro Creator</span>
            <span className="px-1.5 py-0.5 bg-green-900/30 text-green-400 text-[10px] font-bold rounded border border-green-900">ACTIVE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
