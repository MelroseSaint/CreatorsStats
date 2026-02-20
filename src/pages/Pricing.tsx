import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

export function Pricing() {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-mono font-bold">G</span>
              <span className="text-xl font-bold">GrowthLedger</span>
            </Link>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <Link to="/app" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
            <p className="text-xl text-gray-400">Start free, upgrade when you're ready.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-2">Free</h2>
              <p className="text-gray-400 mb-6">Perfect for getting started</p>
              <div className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal text-gray-400">/forever</span></div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <Check size={18} className="text-green-400" />
                  Sponsorship Calculator
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check size={18} className="text-green-400" />
                  Revenue Projection
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check size={18} className="text-green-400" />
                  Basic Growth Tracker
                </li>
                <li className="flex items-center gap-3 text-gray-500">
                  <Check size={18} />
                  Data Persistence
                </li>
                <li className="flex items-center gap-3 text-gray-500">
                  <Check size={18} />
                  Release Planner
                </li>
                <li className="flex items-center gap-3 text-gray-500">
                  <Check size={18} />
                  Export / Import
                </li>
              </ul>

              <Link to="/app" className="block w-full border border-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg font-medium text-center transition-colors">
                Get Started
              </Link>
            </div>

            <div className="bg-gray-900 border-2 border-blue-600 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Recommended
              </div>
              <h2 className="text-2xl font-bold mb-2">Pro Creator</h2>
              <p className="text-gray-400 mb-6">For serious creators</p>
              <div className="text-4xl font-bold mb-6">$69<span className="text-lg font-normal text-gray-400">/lifetime</span></div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <Check size={18} className="text-blue-400" />
                  Everything in Free
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check size={18} className="text-blue-400" />
                  Data Persistence
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check size={18} className="text-blue-400" />
                  Release Planner
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check size={18} className="text-blue-400" />
                  Export / Import Backup
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check size={18} className="text-blue-400" />
                  Priority Support
                </li>
              </ul>

              <a 
                href="https://buy.stripe.com/test_placeholder" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium text-center transition-colors flex items-center justify-center gap-2"
              >
                Upgrade Now <ArrowRight size={18} />
              </a>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-500">
              Questions? <a href="mailto:support@growthledger.app" className="text-blue-400 hover:underline">Contact us</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
