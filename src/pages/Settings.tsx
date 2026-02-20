import React, { useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Download, Upload, Trash2, ShieldCheck, ExternalLink } from 'lucide-react';
import { Input } from '../components/ui/Input';

export function Settings() {
  const { state, exportData, importData, resetData, updateUser } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importData(file);
        alert('Data imported successfully!');
      } catch (err) {
        alert('Failed to import data. Invalid file.');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-gray-400 mt-2">Manage your data, subscription, and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Creator Profile</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Input 
              label="Display Name" 
              value={state.user.name} 
              onChange={e => updateUser({ name: e.target.value })} 
            />
            <div className="space-y-1">
              <label className="text-sm text-gray-400 font-medium">Primary Platform</label>
              <select 
                className="w-full h-10 rounded-md border border-gray-700 bg-gray-900 px-3 text-sm text-gray-100 outline-none focus:ring-2 focus:ring-blue-600"
                value={state.user.platform}
                onChange={e => updateUser({ platform: e.target.value as any })}
              >
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="twitch">Twitch</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                Subscription Status
                {state.user.isPro && <ShieldCheck className="text-green-500" size={18} />}
              </h3>
              <p className="text-gray-400 mt-1 text-sm">
                {state.user.isPro 
                  ? "You have a lifetime Pro license. Thank you for supporting the development!" 
                  : "Upgrade to Pro to unlock cloud sync, advanced forecasting, and more."}
              </p>
            </div>
            {!state.user.isPro && (
              <a 
                href="https://buy.stripe.com/test_placeholder" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
              >
                Upgrade Now <ExternalLink size={14} className="ml-2" />
              </a>
            )}
          </div>
          {state.user.isPro && (
             <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
               <p className="text-xs text-gray-500">License ID: {state.user.isPro ? 'LIFETIME_PRO_ACTIVATED' : 'FREE_TIER'}</p>
               <a 
                 href="https://billing.stripe.com/p/login/fZu9AUbkT4SE5Ix3826g800" 
                 target="_blank" 
                 rel="noreferrer"
                 className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
               >
                 Manage billing →
               </a>
             </div>
          )}
        </div>

        {/* Data Management Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Data Management</h3>
          <p className="text-sm text-gray-400 mb-6">
            Your data is stored locally in your browser. Create a backup to keep it safe or transfer it to another device.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <Button variant="secondary" onClick={exportData} className="flex-1">
              <Download size={16} className="mr-2" />
              Export JSON Backup
            </Button>
            
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="flex-1">
              <Upload size={16} className="mr-2" />
              Import Backup
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json" 
              onChange={handleFileChange} 
            />

            <Button variant="danger" onClick={resetData} className="flex-1">
              <Trash2 size={16} className="mr-2" />
              Reset All Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
