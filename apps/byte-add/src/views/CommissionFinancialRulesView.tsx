import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

export interface CommissionTier {
  id: 'starter' | 'flagship' | 'enterprise';
  name: string;
  badge: string;
  badgeClass: string;
  rate: number;
  label: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export const TIERS: CommissionTier[] = [
  {
    id: 'starter',
    name: 'Starter Partner Tier',
    badge: 'Entry',
    badgeClass: 'bg-surface-container text-on-surface',
    rate: 15,
    label: 'Take Rate',
    description: 'Designed for new kitchen entrants under $15k monthly volume. Includes free basic POS integration.',
    features: [
      'Standard Delivery Radius (5km)',
      'Weekly ACH Settlements',
      'Basic Performance Analytics',
    ],
  },
  {
    id: 'flagship',
    name: 'Flagship Partner Tier',
    badge: 'Most Popular',
    badgeClass: 'bg-primary text-on-primary',
    rate: 18,
    label: 'Take Rate',
    description: 'For high-volume artisan restaurants between $15k - $50k monthly volume. Priority driver dispatch.',
    features: [
      'Expanded 10km Discovery Range',
      'Daily Auto-Settlement at 10 AM',
      'Priority Courier Dispatch',
    ],
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise / Chain Tier',
    badge: 'Multi-Unit',
    badgeClass: 'bg-secondary-container text-on-secondary-container',
    rate: 20,
    label: 'Standard Ecosystem',
    description: 'Default automated multi-split contract with marketing boost, dedicated courier fleet queue, and API POS webhooks.',
    features: [
      'Full Razorpay Route API Automation',
      'Custom Promo & Loyalty Sponsorship',
      'Dedicated 24/7 SLA Support',
    ],
  },
];

export const CommissionFinancialRulesView: React.FC = () => {
  const { financialStats } = useAdmin();

  // Tier Selection State (persisted to localStorage)
  const [selectedTier, setSelectedTier] = useState<'starter' | 'flagship' | 'enterprise'>(() => {
    return (localStorage.getItem('byte_admin_commission_tier') as any) || 'flagship';
  });

  // Simulator State
  const [simGmv, setSimGmv] = useState<number>(50000);
  const [simTakeRate, setSimTakeRate] = useState<number>(() => {
    const saved = localStorage.getItem('byte_admin_commission_tier');
    if (saved === 'starter') return 15;
    if (saved === 'enterprise') return 20;
    return 18;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelectTier = (tier: CommissionTier) => {
    setSelectedTier(tier.id);
    setSimTakeRate(tier.rate);
    localStorage.setItem('byte_admin_commission_tier', tier.id);
    setToastMessage(`Switched active contract to ${tier.name} (${tier.rate}% Take Rate)`);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const projectedCommission = (simGmv * (simTakeRate / 100)).toFixed(2);
  const projectedMerchantNet = (simGmv * ((100 - simTakeRate) / 100)).toFixed(2);

  return (
    <div className="flex flex-col w-full gap-6 pb-12 relative">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-on-surface text-surface py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce border border-surface-container-high">
          <span className="material-symbols-outlined text-[18px] text-tertiary">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

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
              Target
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-on-surface">{financialStats.effectiveTakeRate}%</div>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Effective Margin on Gross Volume</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Gross Merchant Sales</span>
            <span className="text-xs font-bold text-on-surface-variant">Active GMV</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-on-surface">${financialStats.grossMerchantSales.toLocaleString()}</div>
            <p className="text-[11px] text-on-surface-variant mt-0.5">{financialStats.registeredKitchensCount} Registered Kitchens</p>
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
            <div className="text-3xl font-black text-primary">${financialStats.netPlatformCommission.toLocaleString()}</div>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Platform multi-split fee (20%)</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Merchant Retained</span>
            <span className="text-xs font-bold text-tertiary">Direct Settlement</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-tertiary">{financialStats.merchantRetainedRate}%</div>
            <p className="text-[11px] text-on-surface-variant mt-0.5">${financialStats.merchantRetainedAmount.toLocaleString()} settled to stores</p>
          </div>
        </div>
      </div>

      {/* Standard Contracts Tiers (3 Selectable Tiers) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <h2 className="text-base font-extrabold text-on-surface">Standard Partner Commission Contracts</h2>
          </div>
          <span className="text-xs text-on-surface-variant">Click any tier card below to select as active contract</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map(tier => {
            const isSelected = selectedTier === tier.id;

            return (
              <div
                key={tier.id}
                onClick={() => handleSelectTier(tier)}
                className={`p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? 'bg-surface-container-lowest shadow-lg border-2 border-primary ring-4 ring-primary/10 scale-[1.01]'
                    : 'bg-surface-container-lowest shadow-sm border border-surface-container-high hover:border-primary/40 hover:shadow-md hover:bg-surface-container-low/30'
                }`}
              >
                {/* Top Badge Indicators */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-on-surface">{tier.name}</span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Selected
                      </span>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] uppercase tracking-wider ${tier.badgeClass}`}>
                    {tier.badge}
                  </span>
                </div>

                {/* Rate Info */}
                <div className="space-y-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-3xl font-black ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                      {tier.rate}%
                    </span>
                    <span className="text-xs text-on-surface-variant font-semibold">{tier.label}</span>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed min-h-[36px]">
                    {tier.description}
                  </p>

                  {/* Feature checklist */}
                  <div className="pt-3 border-t border-surface-container text-xs text-on-surface space-y-1.5">
                    {tier.features.map(f => (
                      <div key={f} className="flex items-center gap-1.5 text-tertiary font-bold">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action / Select Button */}
                <div className="mt-5 pt-3 border-t border-surface-container">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTier(tier);
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                      isSelected
                        ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>{isSelected ? 'Active Selected Plan' : 'Select This Plan'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Revenue Simulator */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-on-surface">Platform Split & Revenue Simulator</h3>
            <p className="text-xs text-on-surface-variant">
              Forecast platform earnings and merchant payouts in real-time (Linked to active contract tier)
            </p>
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
                <div className="flex items-center gap-1.5">
                  <span>Contract Commission Rate</span>
                  {TIERS.find(t => t.rate === simTakeRate) && (
                    <span className="px-1.5 py-0.2 rounded bg-primary/10 text-primary text-[10px] font-bold">
                      {TIERS.find(t => t.rate === simTakeRate)?.name}
                    </span>
                  )}
                </div>
                <span className="text-primary font-black">{simTakeRate}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                step="1"
                value={simTakeRate}
                onChange={e => {
                  const val = parseInt(e.target.value);
                  setSimTakeRate(val);
                  const matched = TIERS.find(t => t.rate === val);
                  if (matched) setSelectedTier(matched.id);
                }}
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
