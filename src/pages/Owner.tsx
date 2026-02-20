import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { unlockWithOwnerKey } from '../utils/pro';

export function Owner() {
  const navigate = useNavigate();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    if (!key) return;
    
    setLoading(true);
    setError('');

    const result = await unlockWithOwnerKey(key);
    
    setLoading(false);
    
    if (result.success) {
      navigate('/app');
    } else {
      setError(result.error || 'Invalid key');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
      <div className="w-full max-w-sm p-8 bg-[#14161C] border border-[#1F222A] rounded-lg">
        <h1 className="text-xl font-semibold text-[#F3F4F6] mb-6">Owner Access</h1>
        
        <input
          type="password"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setError('');
          }}
          placeholder="Enter key"
          className="w-full h-10 px-3 bg-[#0B0C10] border border-[#1F222A] rounded text-[#F3F4F6] placeholder:text-[#5F646C] focus:outline-none focus:ring-2 focus:ring-[#169A76]"
        />
        
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
        
        <button
          onClick={handleUnlock}
          disabled={loading || !key}
          className="w-full mt-4 h-10 bg-[#169A76] hover:bg-[#148A6A] active:bg-[#11795D] text-[#0B0C10] font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Unlock Pro'}
        </button>
      </div>
    </div>
  );
}
