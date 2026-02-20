import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Download, Upload, Trash2, Shield, X } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { isProEnabled, disablePro } from '../utils/pro';

export function Settings() {
  const navigate = useNavigate();
  const { state, exportData, importData, resetData, updateUser } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const proEnabled = isProEnabled();

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

  const handleDisablePro = () => {
    if (confirm('Disable Pro on this device?')) {
      disablePro();
      navigate('/app');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-[#a3a3a3] mt-2">Manage your data and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-[#171717] border border-[#262626] rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#f5f5f5] mb-4">Creator Profile</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Input 
              label="Display Name" 
              value={state.user.name} 
              onChange={e => updateUser({ name: e.target.value })} 
            />
            <div className="space-y-1">
              <label className="text-sm text-[#a3a3a3] font-medium">Primary Platform</label>
              <select 
                className="w-full h-10 rounded-md border border-[#262626] bg-[#0a0a0a] px-3 text-sm text-[#f5f5f5] outline-none focus:ring-2 focus:ring-[#10b981]"
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
        <div className="bg-[#171717] border border-[#262626] rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#f5f5f5] flex items-center gap-2">
            <Shield size={18} className={proEnabled ? "text-[#10b981]" : "text-[#525252]"} />
            Subscription Status
          </h3>
          <p className="text-[#a3a3a3] mt-1 text-sm">
            {proEnabled 
              ? "Pro mode is enabled on this device." 
              : "Free mode. Visit /owner to unlock Pro."}
          </p>
          {proEnabled && (
            <button
              onClick={handleDisablePro}
              className="mt-4 text-sm text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <X size={14} />
              Disable Pro on this device
            </button>
          )}
          {!proEnabled && (
            <Link
              to="/owner"
              className="mt-4 inline-block text-sm text-[#d97706] hover:text-[#b45309] transition-colors"
            >
              Unlock Pro →
            </Link>
          )}
        </div>

        {/* Data Management Section */}
        <div className="bg-[#171717] border border-[#262626] rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#f5f5f5] mb-4">Data Management</h3>
          <p className="text-sm text-[#a3a3a3] mb-6">
            Your data is stored locally in your browser. Create a backup to keep it safe.
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
