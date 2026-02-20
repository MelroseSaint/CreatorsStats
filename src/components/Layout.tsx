import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6] font-sans antialiased">
      <Sidebar />
      <main className="ml-64 p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
