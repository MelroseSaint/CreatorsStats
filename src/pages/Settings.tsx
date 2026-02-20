import { useRef, useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Download, Upload, Trash2, Shield, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { 
  activateWithSessionId, 
  verifyAndRefreshStatus, 
  isProEligible, 
  getSubscriptionStatus, 
  clearSubscription,
  openStripePaymentLink,
} from '../utils/pro';
import type { SubscriptionStatus } from '../utils/pro';

export function Settings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, exportData, importData, resetData, updateUser } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [activating, setActivating] = useState(false);
  const [activatingError, setActivatingError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [billingUrl, setBillingUrl] = useState('');
  
  const isPro = isProEligible();

  useEffect(() => {
    const storedBillingUrl = localStorage.getItem('manual_billing_url');
    if (storedBillingUrl) setBillingUrl(storedBillingUrl);
  }, []);

  const handleOpenBilling = () => {
    const url = billingUrl || import.meta.env.VITE_STRIPE_BILLING_URL;
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleSaveBillingUrl = () => {
    if (billingUrl) {
      localStorage.setItem('manual_billing_url', billingUrl);
    }
  };

  const handleClearBillingUrl = () => {
    setBillingUrl('');
    localStorage.removeItem('manual_billing_url');
  };

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

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      handleActivate(sessionId);
    }
  }, [searchParams]);

  useEffect(() => {
    const storedStatus = getSubscriptionStatus();
    if (storedStatus) {
      setSubStatus(storedStatus);
    }
  }, []);

  const handleActivate = async (sessionId?: string) => {
    const id = sessionId || searchParams.get('session_id');
    if (!id) return;
    
    setActivating(true);
    setActivatingError('');
    
    const result = await activateWithSessionId(id);
    
    setActivating(false);
    
    if (result.success) {
      const status = getSubscriptionStatus();
      setSubStatus(status);
      navigate('/app/settings', { replace: true });
    } else {
      setActivatingError(result.error || 'Activation failed');
    }
  };

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    await verifyAndRefreshStatus();
    const status = getSubscriptionStatus();
    setSubStatus(status);
    setRefreshing(false);
  };

  const handleCancelSubscription = () => {
    if (confirm('This will clear your subscription from this device. You can reactivate anytime.')) {
      clearSubscription();
      setSubStatus(null);
      navigate('/app');
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
        <div className="bg-[#14161C] border border-[#1F222A] hover:border-[#B8952E] rounded-xl p-6">
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
          <div className="mt-4 pt-4 border-t border-[#1F222A]">
            <button
              onClick={() => {
                if (confirm('Clear all profile info?')) {
                  updateUser({ name: '', platform: 'youtube' });
                }
              }}
              className="text-sm text-red-500 hover:text-red-400 transition-colors"
            >
              Clear Profile
            </button>
          </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-[#14161C] border border-[#1F222A] hover:border-[#B8952E] rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#F3F4F6] flex items-center gap-2">
            <Shield size={18} className="text-[#B8952E]" />
            Subscription Status
          </h3>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[#D4B65A]">Owner</span>
            <Link
              to="/owner"
              className="text-sm text-[#B8952E] hover:text-[#A88427] transition-colors"
            >
              Enter owner key
            </Link>
          </div>
          
          {activating && (
            <div className="mt-4 flex items-center gap-2 text-[#169A76]">
              <Loader2 size={16} className="animate-spin" />
              <span>Verifying subscription...</span>
            </div>
          )}
          
          {activatingError && (
            <div className="mt-4 text-sm text-red-500">
              {activatingError}
            </div>
          )}
          
          {subStatus && (
            <div className="mt-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                subStatus.status === 'ACTIVE' || subStatus.status === 'TRIALING'
                  ? 'bg-[#0B0C10] text-[#B8952E] border border-[#B8952E]'
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                <span className="w-2 h-2 rounded-full bg-current"></span>
                {subStatus.status}
              </div>
              
              {subStatus.currentPeriodEnd && (
                <p className="mt-2 text-sm text-[#8A9099]">
                  {subStatus.cancelAtPeriodEnd 
                    ? `Cancels on ${new Date(subStatus.currentPeriodEnd).toLocaleDateString()}`
                    : `Renews on ${new Date(subStatus.currentPeriodEnd).toLocaleDateString()}`
                  }
                </p>
              )}
              
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleRefreshStatus}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-[#8A9099] hover:text-[#F3F4F6] transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                  Refresh status
                </button>
              </div>
            </div>
          )}
          
          {!isPro && !activating && (
            <div className="mt-4">
              <p className="text-[#8A9099] text-sm mb-4">
                Upgrade to Pro for advanced features.
              </p>
              
              <button 
                onClick={openStripePaymentLink}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#169A76] text-[#0B0C10] rounded font-medium hover:bg-[#148A6A] transition-colors"
              >
                Upgrade Now <ExternalLink size={14} />
              </button>

              <div className="mt-4 pt-4 border-t border-[#B8952E]/20">
                <Link
                  to="/owner"
                  className="text-sm text-[#B8952E] hover:text-[#A88427] transition-colors inline-flex items-center gap-2"
                >
                  Owner unlock key
                  <span className="w-2 h-2 rounded-full bg-[#D4B65A]" />
                </Link>
              </div>
            </div>
          )}
          
          {isPro && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleOpenBilling}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#14161C] border border-[#1F222A] text-[#F3F4F6] rounded font-medium hover:bg-[#1F222A] transition-colors"
                >
                  Manage Billing <ExternalLink size={14} />
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className="text-sm text-red-500 hover:text-red-400 transition-colors inline-flex items-center gap-1"
                >
                  Remove from device
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Manual billing portal URL"
                  value={billingUrl}
                  onChange={e => setBillingUrl(e.target.value)}
                  className="flex-1 h-10 rounded-md border border-[#1F222A] bg-[#0B0C10] px-3 text-sm text-[#F3F4F6] placeholder:text-[#5F646C] outline-none focus:ring-2 focus:ring-[#169A76]"
                />
                <button
                  onClick={handleSaveBillingUrl}
                  className="px-3 py-2 text-sm text-[#8A9099] hover:text-[#F3F4F6] transition-colors"
                >
                  Save
                </button>
                {billingUrl && (
                  <button
                    onClick={handleClearBillingUrl}
                    className="px-3 py-2 text-sm text-red-500 hover:text-red-400 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Data Management Section */}
        <div className="bg-[#14161C] border border-[#1F222A] hover:border-[#B8952E] rounded-xl p-6">
          <h3 className="text-lg font-medium text-[#F3F4F6] mb-4">Data Management</h3>
          <p className="text-sm text-[#8A9099] mb-6">
            Your data is stored locally in your browser. Create a backup to keep it safe.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <Button variant="secondary" onClick={exportData} className="flex-1">
              <Download size={16} className="mr-2 text-[#B8952E]" />
              Export JSON Backup
            </Button>
            
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="flex-1">
              <Upload size={16} className="mr-2 text-[#B8952E]" />
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
