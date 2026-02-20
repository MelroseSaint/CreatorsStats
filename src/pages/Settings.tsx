import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Download, Upload, Trash2, Shield, X, ExternalLink, Loader2 } from 'lucide-react';
import { isProEnabled, getProSource, disablePro, verifyStripeSubscriber } from '../utils/pro';

export function Settings() {
  const navigate = useNavigate();
  const { state, exportData, importData, resetData, updateUser } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const proEnabled = isProEnabled();
  const proSource = getProSource();
  
  const [stripeEmail, setStripeEmail] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

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

  const handleStripeVerify = async () => {
    if (!stripeEmail) return;
    
    setVerifying(true);
    setVerifyError('');

    const result = await verifyStripeSubscriber(stripeEmail);
    
    setVerifying(false);
    
    if (result.success) {
      navigate('/app');
    } else {
      setVerifyError(result.error || 'Verification failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-[#8A9099] mt-2">Manage your data and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-[#14161C] border border-[#1F222A] rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#F3F4F6] mb-4">Creator Profile</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Input 
              label="Display Name" 
              value={state.user.name} 
              onChange={e => updateUser({ name: e.target.value })} 
            />
            <div className="space-y-1">
              <label className="text-sm text-[#8A9099] font-medium">Primary Platform</label>
              <select 
                className="w-full h-10 rounded-md border border-[#1F222A] bg-[#0B0C10] px-3 text-sm text-[#F3F4F6] outline-none focus:ring-2 focus:ring-[#169A76]"
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
        <div className="bg-[#14161C] border border-[#1F222A] rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#F3F4F6] flex items-center gap-2">
            <Shield size={18} className={proEnabled ? "text-[#169A76]" : "text-[#5F646C]"} />
            Subscription Status
          </h3>
          <p className="text-[#8A9099] mt-1 text-sm">
            {proEnabled 
              ? `Pro mode enabled via ${proSource}.` 
              : "Free mode."}
          </p>
          
          {!proEnabled && (
            <div className="mt-4 space-y-4">
              {/* Stripe Checkout Link */}
              <a 
                href={import.meta.env.VITE_STRIPE_CHECKOUT_URL || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#169A76] text-[#0B0C10] rounded font-medium hover:bg-[#148A6A] transition-colors"
              >
                Upgrade Now <ExternalLink size={14} />
              </a>
              
              <div className="pt-4 border-t border-[#1F222A]">
                <p className="text-sm text-[#8A9099] mb-2">Already a subscriber? Verify your Stripe email:</p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="email@example.com"
                    value={stripeEmail}
                    onChange={e => {
                      setStripeEmail(e.target.value);
                      setVerifyError('');
                    }}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleStripeVerify}
                    disabled={verifying || !stripeEmail}
                  >
                    {verifying ? <Loader2 size={16} className="animate-spin" /> : 'Verify'}
                  </Button>
                </div>
                {verifyError && (
                  <p className="mt-2 text-sm text-red-500">{verifyError}</p>
                )}
              </div>
              
              <div className="pt-4 border-t border-[#1F222A]">
                <Link
                  to="/owner"
                  className="text-sm text-[#B8952E] hover:text-[#A88427] transition-colors"
                >
                  Or unlock with owner key →
                </Link>
              </div>
            </div>
          )}
          
          {proEnabled && (
            <>
              <div className="mt-4 flex items-center gap-4">
                <a 
                  href={import.meta.env.VITE_STRIPE_BILLING_URL || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#169A76] hover:text-[#148A6A] transition-colors inline-flex items-center gap-2"
                >
                  Manage billing <ExternalLink size={14} />
                </a>
                <button
                  onClick={handleDisablePro}
                  className="text-sm text-red-500 hover:text-red-400 transition-colors inline-flex items-center gap-1"
                >
                  <X size={14} />
                  Disable Pro
                </button>
              </div>
            </>
          )}
        </div>

        {/* Data Management Section */}
        <div className="bg-[#14161C] border border-[#1F222A] rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#F3F4F6] mb-4">Data Management</h3>
          <p className="text-sm text-[#8A9099] mb-6">
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
