import React, { useState } from 'react';

export const CommissionFinancialRulesView: React.FC = () => {
  const [simGmv, setSimGmv] = useState<number>(50000);
  const [simTakeRate, setSimTakeRate] = useState<number>(20);

  const projectedCommission = (simGmv * (simTakeRate / 100)).toFixed(2);
  const projectedMerchantNet = (simGmv * ((100 - simTakeRate) / 100)).toFixed(2);

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-primary text-[11px] font-bold uppercase tracking-wider mb-1">
          <span className="material-symbols-outlined text-[16px]">account_balance</span>
          <span>Platform Financial Protocol & Settlement</span>
        </div>
        <h1 className="text-2xl font-black text-on-surface tracking-tight">
          Merchant Commission & Multi-Split Governance
        </h1>
        <p className="text-xs text-on-surface-variant max-w-3xl mt-0.5">
          Configure tiered commission contracts, dynamic delivery fee algorithms, credit card processing surcharges, and Razorpay multi-split rules across metropolitan hubs.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">30-Day Take Rate</span>
            <span className="px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold">
              +0.4%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-on-surface">15.4%</div>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Effective Margin on Gross Volume</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Gross Merchant Sales</span>
            <span className="text-xs font-bold text-on-surface-variant">Active GMV</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-on-surface">$1,420,850</div>
            <p className="text-[11px] text-on-surface-variant mt-0.5">342 Registered Kitchens</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Net Platform Commission</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
              Earned
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-primary">$218,810</div>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Platform multi-split fee</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Merchant Retained</span>
            <span className="text-xs font-bold text-tertiary">Direct Settlement</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-tertiary">84.6%</div>
            <p className="text-[11px] text-on-surface-variant mt-0.5">$1,202,039 settled to stores</p>
          </div>
        </div>
      </div>

      {/* Standard Contracts Tiers (3 Tiers) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <h2 className="text-base font-extrabold text-on-surface">Standard Partner Commission Contracts</h2>
          </div>
          <span className="text-xs text-on-surface-variant">Automated tier promotion applies on 1st of every calendar month</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tier 1 */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container-high space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-base text-on-surface">Starter Partner Tier</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-bold text-xs">
                Entry
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-primary">15%</span>
              <span className="text-xs text-on-surface-variant font-semibold">Take Rate</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Designed for new kitchen entrants under $15k monthly volume. Includes free basic POS integration.
            </p>
            <div className="pt-2 border-t border-surface-container text-xs text-on-surface space-y-1">
              <div className="flex items-center gap-1.5 text-tertiary font-bold">
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>Standard Delivery Radius (5km)</span>
              </div>
              <div className="flex items-center gap-1.5 text-tertiary font-bold">
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>Weekly ACH Settlements</span>
              </div>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border-2 border-primary ring-2 ring-primary/10 space-y-3 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold uppercase">
                Most Popular
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-base text-on-surface">Flagship Partner Tier</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-primary">18%</span>
              <span className="text-xs text-on-surface-variant font-semibold">Take Rate</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              For high-volume artisan restaurants between $15k - $50k monthly volume. Priority driver dispatch.
            </p>
            <div className="pt-2 border-t border-surface-container text-xs text-on-surface space-y-1">
              <div className="flex items-center gap-1.5 text-tertiary font-bold">
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>Expanded 10km Discovery Range</span>
              </div>
              <div className="flex items-center gap-1.5 text-tertiary font-bold">
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>Daily Auto-Settlement at 10 AM</span>
              </div>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container-high space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-base text-on-surface">Enterprise / Chain Tier</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold text-xs">
                Multi-Unit
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-secondary">20%</span>
              <span className="text-xs text-on-surface-variant font-semibold">Standard Ecosystem</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Default automated multi-split contract with marketing boost, dedicated courier fleet queue, and API POS webhooks.
            </p>
            <div className="pt-2 border-t border-surface-container text-xs text-on-surface space-y-1">
              <div className="flex items-center gap-1.5 text-tertiary font-bold">
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>Full Razorpay Route API Automation</span>
              </div>
              <div className="flex items-center gap-1.5 text-tertiary font-bold">
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>Custom Promo & Loyalty Sponsorship</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Revenue Simulator */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-on-surface">Platform Split & Revenue Simulator</h3>
            <p className="text-xs text-on-surface-variant">Forecast platform earnings and merchant payouts in real-time</p>
          </div>
          <span className="material-symbols-outlined text-primary text-[24px]">calculate</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Controls */}
          <div className="space-y-4 bg-surface-container-low p-4 rounded-xl">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Monthly Store GMV</span>
                <span className="text-primary font-black">${simGmv.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="200000"
                step="5000"
                value={simGmv}
                onChange={e => setSimGmv(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Contract Commission Rate</span>
                <span className="text-primary font-black">{simTakeRate}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                step="1"
                value={simTakeRate}
                onChange={e => setSimTakeRate(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>

          {/* Projection Results */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-primary uppercase block">Platform Commission (Byte)</span>
              <span className="text-2xl font-black text-primary mt-1">${projectedCommission}</span>
            </div>

            <div className="p-4 rounded-xl bg-tertiary/10 border border-tertiary/20 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-tertiary uppercase block">Merchant Net Payout (Store)</span>
              <span className="text-2xl font-black text-tertiary mt-1">${projectedMerchantNet}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
