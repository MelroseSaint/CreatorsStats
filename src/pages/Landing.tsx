import { Link } from 'react-router-dom';
import { TrendingUp, Calculator, Calendar, Target, ArrowRight } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-mono font-bold">G</span>
            <span className="text-xl font-bold">GrowthLedger</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
            <Link to="/app" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
            <Link to="/app" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              Your Creative Business,<br />
              <span className="text-blue-400">Operating System</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Track revenue, forecast growth, and plan releases—all in one private dashboard. 
              No spreadsheets. No guesswork. Just data-driven creative success.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/app" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors flex items-center gap-2">
                Start Free <ArrowRight size={20} />
              </Link>
              <Link to="/pricing" className="border border-gray-700 hover:bg-gray-800 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-gray-900/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Everything you need to scale</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <Calculator className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sponsorship Calculator</h3>
                <p className="text-gray-400 text-sm">Calculate fair market rates for brand deals based on your niche and engagement.</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <TrendingUp className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Revenue Projection</h3>
                <p className="text-gray-400 text-sm">Forecast your annual income by aggregating ads, memberships, and merch.</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <Target className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Growth Tracker</h3>
                <p className="text-gray-400 text-sm">Log weekly metrics and visualize your trajectory with beautiful charts.</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <Calendar className="w-10 h-10 text-orange-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Release Planner</h3>
                <p className="text-gray-400 text-sm">Work backwards from your drop date to hit every deadline.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to take control?</h2>
            <p className="text-gray-400 mb-8">Join creators who are building sustainable businesses with GrowthLedger.</p>
            <Link to="/app" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors inline-block">
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-gray-500 text-sm">
          <p>© 2024 GrowthLedger. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/app" className="hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
