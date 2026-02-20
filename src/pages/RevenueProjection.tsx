import { useState } from 'react';
import { formatCurrency } from '../utils';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TrendingUp, PieChart } from 'lucide-react';

export function RevenueProjection() {
  const [inputs, setInputs] = useState({
    monthlyViews: 0,
    rpm: 0,
    patrons: 0,
    avgPatronValue: 0,
    merchConversion: 0,
    avgOrderValue: 0,
  });

  const [projection, setProjection] = useState<{ ads: number; direct: number; merch: number; total: number; arr: number } | null>(null);

  const calculate = () => {
    const adRev = (inputs.monthlyViews / 1000) * inputs.rpm;
    const directRev = inputs.patrons * inputs.avgPatronValue;
    const merchRev = (inputs.monthlyViews * (inputs.merchConversion / 100)) * inputs.avgOrderValue;
    const total = adRev + directRev + merchRev;

    setProjection({
      ads: adRev,
      direct: directRev,
      merch: merchRev,
      total: total,
      arr: total * 12
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Revenue Projection</h2>
        <p className="text-[#a3a3a3] mt-2">Forecast your annual income by aggregating streams.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6 bg-[#171717] p-6 rounded-xl border border-[#262626]">
           <h3 className="font-semibold text-[#f5f5f5]">Input Variables</h3>
           
           <div className="space-y-4">
             <div className="pt-2 border-t border-[#262626]">
               <p className="text-xs font-bold text-[#525252] mb-2 uppercase">Ad Revenue</p>
               <Input label="Monthly Views" type="number" value={inputs.monthlyViews} onChange={e => setInputs({...inputs, monthlyViews: Number(e.target.value)})} />
               <Input label="RPM ($)" type="number" step="0.1" value={inputs.rpm} onChange={e => setInputs({...inputs, rpm: Number(e.target.value)})} />
             </div>

             <div className="pt-2 border-t border-[#262626]">
               <p className="text-xs font-bold text-[#525252] mb-2 uppercase">Memberships</p>
               <Input label="Total Members/Patrons" type="number" value={inputs.patrons} onChange={e => setInputs({...inputs, patrons: Number(e.target.value)})} />
               <Input label="Avg Member Value ($)" type="number" value={inputs.avgPatronValue} onChange={e => setInputs({...inputs, avgPatronValue: Number(e.target.value)})} />
             </div>

             <div className="pt-2 border-t border-[#262626]">
               <p className="text-xs font-bold text-[#525252] mb-2 uppercase">Merchandise</p>
               <Input label="Conversion Rate (%)" type="number" step="0.1" value={inputs.merchConversion} onChange={e => setInputs({...inputs, merchConversion: Number(e.target.value)})} />
               <Input label="Avg Order Value ($)" type="number" value={inputs.avgOrderValue} onChange={e => setInputs({...inputs, avgOrderValue: Number(e.target.value)})} />
             </div>
             
             <Button className="w-full" onClick={calculate}>Calculate Projection</Button>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
           {projection ? (
             <>
               <div className="grid gap-4 md:grid-cols-2">
                 <div className="bg-[#171717] p-6 rounded-xl border border-[#10b981]/30">
                   <p className="text-sm text-[#10b981] mb-1">MONTHLY RECURRING (MRR)</p>
                   <p className="text-4xl font-bold text-[#f5f5f5]">{formatCurrency(projection.total)}</p>
                 </div>
                 <div className="bg-[#171717] p-6 rounded-xl border border-[#d97706]/30">
                   <p className="text-sm text-[#d97706] mb-1">ANNUAL RUN RATE (ARR)</p>
                   <p className="text-4xl font-bold text-[#f5f5f5]">{formatCurrency(projection.arr)}</p>
                 </div>
               </div>

               <div className="bg-[#171717] p-6 rounded-xl border border-[#262626]">
                 <h3 className="font-semibold text-[#f5f5f5] mb-6 flex items-center gap-2">
                   <PieChart size={18} /> Revenue Mix
                 </h3>
                 
                 <div className="space-y-4">
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span className="text-[#a3a3a3]">Ad Revenue</span>
                       <span className="text-[#f5f5f5] font-medium">{formatCurrency(projection.ads)}</span>
                     </div>
                     <div className="w-full bg-[#262626] rounded-full h-2">
                       <div className="bg-[#10b981] h-2 rounded-full" style={{ width: `${(projection.ads / projection.total) * 100}%` }}></div>
                     </div>
                   </div>

                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span className="text-[#a3a3a3]">Memberships</span>
                       <span className="text-[#f5f5f5] font-medium">{formatCurrency(projection.direct)}</span>
                     </div>
                     <div className="w-full bg-[#262626] rounded-full h-2">
                       <div className="bg-[#d97706] h-2 rounded-full" style={{ width: `${(projection.direct / projection.total) * 100}%` }}></div>
                     </div>
                   </div>

                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span className="text-[#a3a3a3]">Merchandise</span>
                       <span className="text-[#f5f5f5] font-medium">{formatCurrency(projection.merch)}</span>
                     </div>
                     <div className="w-full bg-[#262626] rounded-full h-2">
                       <div className="bg-[#525252] h-2 rounded-full" style={{ width: `${(projection.merch / projection.total) * 100}%` }}></div>
                     </div>
                   </div>
                 </div>
               </div>
             </>
           ) : (
             <div className="h-full flex items-center justify-center bg-[#171717] rounded-xl border border-dashed border-[#262626] text-[#525252]">
               <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter your metrics to see your forecast</p>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
