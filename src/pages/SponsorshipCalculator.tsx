import { useState } from 'react';
import { formatCurrency } from '../utils';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { DollarSign, RefreshCw } from 'lucide-react';

const NICHES = {
  gaming: { label: 'Gaming', cpm: 15 },
  vlog: { label: 'Vlog / Lifestyle', cpm: 20 },
  tech: { label: 'Tech / Finance', cpm: 35 },
  education: { label: 'Education', cpm: 25 },
  entertainment: { label: 'Entertainment', cpm: 18 },
};

export function SponsorshipCalculator() {
  const [values, setValues] = useState({
    followers: 0,
    avgViews: 0,
    engagementRate: 0,
    niche: 'gaming' as keyof typeof NICHES,
  });

  const [result, setResult] = useState<{ min: number; target: number; reach: number } | null>(null);

  const calculate = () => {
    const { avgViews, engagementRate, niche } = values;
    const cpm = NICHES[niche].cpm;
    
    const baseRate = (avgViews / 1000) * cpm;
    const engagementMultiplier = engagementRate > 3 ? 1 + ((engagementRate - 3) / 100) : 1;
    const rawAsk = baseRate * engagementMultiplier;
    
    setResult({
      min: Math.round(rawAsk * 0.8),
      target: Math.round(rawAsk),
      reach: Math.round(rawAsk * 1.5),
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sponsorship Rate Calculator</h2>
        <p className="text-[#8A9099] mt-2">Calculate your fair market value for brand deals.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4 bg-[#14161C] p-6 rounded-xl border border-[#1F222A] hover:border-[#B8952E]">
          <h3 className="font-semibold text-lg text-[#F3F4F6] mb-4">Channel Metrics</h3>
          
          <div className="space-y-2">
            <label className="text-sm text-[#8A9099]">Niche / Category</label>
            <select 
              className="w-full h-10 rounded-md border border-[#1F222A] bg-[#0B0C10] px-3 text-sm text-[#F3F4F6] focus:ring-2 focus:ring-[#169A76] outline-none"
              value={values.niche}
              onChange={(e) => setValues({...values, niche: e.target.value as keyof typeof NICHES})}
            >
              {Object.entries(NICHES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <Input 
            label="Total Followers" 
            type="number" 
            value={values.followers} 
            onChange={(e) => setValues({...values, followers: Number(e.target.value)})}
          />
          
          <Input 
            label="Avg. Views (Last 10 Videos)" 
            type="number" 
            value={values.avgViews} 
            onChange={(e) => setValues({...values, avgViews: Number(e.target.value)})}
          />
          
          <Input 
            label="Engagement Rate (%)" 
            type="number" 
            step="0.1"
            value={values.engagementRate} 
            onChange={(e) => setValues({...values, engagementRate: Number(e.target.value)})}
          />

          <Button className="w-full mt-4" onClick={calculate}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Calculate Rate
          </Button>
        </div>

        <div className="space-y-6">
           {result ? (
             <div className="space-y-4">
                <div className="bg-[#14161C] p-6 rounded-xl border border-[#169A76]/30 hover:border-[#B8952E] relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                     <DollarSign size={100} />
                   </div>
                   <p className="text-sm text-[#169A76] font-medium mb-1">TARGET ASKING PRICE</p>
                   <p className="text-4xl font-bold text-[#F3F4F6]">{formatCurrency(result.target)}</p>
                   <p className="text-xs text-[#5F646C] mt-2">Based on {NICHES[values.niche].cpm} CPM & {values.engagementRate}% Eng.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#14161C] p-4 rounded-xl border border-[#1F222A] hover:border-[#B8952E]">
                    <p className="text-xs text-[#5F646C] mb-1">MINIMUM ACCEPTABLE</p>
                    <p className="text-xl font-bold text-[#8A9099]">{formatCurrency(result.min)}</p>
                  </div>
                  <div className="bg-[#14161C] p-4 rounded-xl border border-[#1F222A] hover:border-[#B8952E]">
                    <p className="text-xs text-[#5F646C] mb-1">REACH / AGGRESSIVE</p>
                    <p className="text-xl font-bold text-[#169A76]">{formatCurrency(result.reach)}</p>
                  </div>
                </div>
             </div>
           ) : (
              <div className="h-full flex items-center justify-center bg-[#14161C] rounded-xl border border-dashed border-[#1F222A] hover:border-[#B8952E] p-8 text-center">
               <div>
                 <DollarSign className="w-12 h-12 text-[#1F222A] mx-auto mb-4" />
                 <p className="text-[#5F646C]">Enter your metrics to generate a rate card.</p>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
