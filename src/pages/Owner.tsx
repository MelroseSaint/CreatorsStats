import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enablePro, verifyOwnerKey } from '../utils/pro';

export function Owner() {
  const navigate = useNavigate();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = () => {
    if (verifyOwnerKey(key)) {
      enablePro();
      navigate('/app');
    } else {
      setError('Invalid key');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-full max-w-sm p-8 bg-[#171717] border border-[#262626] rounded-lg">
        <h1 className="text-xl font-semibold text-[#f5f5f5] mb-6">Owner Access</h1>
        
        <input
          type="password"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setError('');
          }}
          placeholder="Enter key"
          className="w-full h-10 px-3 bg-[#0a0a0a] border border-[#262626] rounded text-[#f5f5f5] placeholder:text-[#525252] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
        />
        
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
        
        <button
          onClick={handleUnlock}
          className="w-full mt-4 h-10 bg-[#10b981] hover:bg-[#059669] text-[#022c22] font-medium rounded transition-colors"
        >
          Unlock Pro
        </button>
      </div>
    </div>
  );
}
