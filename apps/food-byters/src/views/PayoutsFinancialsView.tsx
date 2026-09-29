import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';

export const PayoutsFinancialsView: React.FC = () => {
  const { settlements } = useMerchant();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('3856.40');
  const [transferDone, setTransferDone] = useState(false);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferDone(true);
    setTimeout(() => {
      setTransferDone(false);
      setShowTransferModal(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* Hero Payouts Header */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container-high p-6 sm:p-8">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gradient-to-br from-primary/10 via-primary-container/5 to-transparent blur-2xl pointer-events-none" />
        <div className="relative flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-xs font-bold text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                Merchant ID: #TN-104-FIN
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container/15 text-tertiary text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                80/20 Multi-Split Engine Active
              </span>
            </div>
            <h1 className="text-2xl font-black text-on-surface tracking-tight">Payouts & Settlement Financials</h1>
            <p className="text-xs text-on-surface-variant">
              Real-time Razorpay multi-split reconciliation, verified banking rails, and automated 80% food payouts.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full xl:w-auto">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-container-low shadow-sm w-full sm:w-auto">
              <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[22px]">account_balance</span>
              </div>
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-on-surface truncate">Chase Commercial ••8829</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-tertiary/15 text-tertiary text-[10px] font-bold">
                    Verified
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[13px] text-secondary">schedule</span>
                  <span>Daily Auto-Settlement (10:00 AM)</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTransferModal(true)}
              className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Instant Transfer</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Financial Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Available Balance */}
        <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Available Balance</span>
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed/30 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-on-surface tracking-tight mb-1">$6,420.80</div>
            <p className="text-xs text-tertiary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">event_available</span>
              <span>Tomorrow at 10:00 AM</span>
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>Ready for ACH sweep</span>
            <span className="font-bold text-on-surface">Auto</span>
          </div>
        </div>

        {/* Gross Sales */}
        <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Gross Sales (Week)</span>
            <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-on-surface tracking-tight mb-1">$24,180.50</div>
            <p className="text-xs text-tertiary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span>+12.3% vs prev week</span>
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>Completed tickets</span>
            <span className="font-bold text-on-surface">914 orders</span>
          </div>
        </div>

        {/* Platform Commission 20% */}
        <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Byte Commission</span>
            <div className="w-8 h-8 rounded-full bg-surface-container text-outline flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">percent</span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-error tracking-tight mb-1">-$4,836.10</div>
            <p className="text-xs text-on-surface-variant">20% Platform Take Rate</p>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>Split Automation</span>
            <span className="font-bold text-outline">Fixed 20%</span>
          </div>
        </div>

        {/* Funded Promos */}
        <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Funded Promos</span>
            <div className="w-8 h-8 rounded-full bg-secondary-fixed/40 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">loyalty</span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-secondary tracking-tight mb-1">-$412.00</div>
            <p className="text-xs text-on-surface-variant">BYTEFIRST coupon share</p>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>Voucher claims</span>
            <span className="font-bold text-secondary">38 applied</span>
          </div>
        </div>

        {/* Net 80% Payout */}
        <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">Net Food (80%)</span>
            <div className="w-8 h-8 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">savings</span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-tertiary tracking-tight mb-1">$19,344.40</div>
            <p className="text-xs text-tertiary font-bold">100% Payout Integrity</p>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>Settled to Bank</span>
            <span className="font-bold text-tertiary">ACH Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container-high space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-on-surface">Daily Settlement Batches</h3>
            <p className="text-xs text-on-surface-variant">Automated multi-split settlement logs</p>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-xs font-bold text-on-surface hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[15px]">download</span>
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-container-low text-on-surface-variant uppercase font-bold text-[11px]">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Settlement Ref</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Gross Sales</th>
                <th className="px-4 py-3">Byte Fee (20%)</th>
                <th className="px-4 py-3">Net Payout (80%)</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {settlements.map(record => (
                <tr key={record.id} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3.5 font-bold text-on-surface">{record.id}</td>
                  <td className="px-4 py-3.5 text-on-surface-variant">{record.date}</td>
                  <td className="px-4 py-3.5 font-semibold text-on-surface">{record.ordersCount}</td>
                  <td className="px-4 py-3.5 font-bold text-on-surface">${record.grossAmount.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-error font-semibold">-${record.commissionFee.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-tertiary font-bold">${record.netPayout.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-on-surface-variant">{record.bankRef}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        record.status === 'SETTLED'
                          ? 'bg-tertiary/15 text-tertiary'
                          : 'bg-secondary-fixed text-on-secondary-fixed'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instant Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-on-surface">Initiate Instant Payout</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {transferDone ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[28px]">check_circle</span>
                </div>
                <h4 className="font-bold text-sm text-on-surface">Transfer Executed!</h4>
                <p className="text-xs text-on-surface-variant">
                  ${transferAmount} sent to Chase Commercial ••8829 via IMPS / Real-time Rails.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                    Transfer Amount (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={transferAmount}
                    onChange={e => setTransferAmount(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface text-lg font-bold px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-[11px] text-on-surface-variant mt-1 block">
                    Available for immediate transfer: $6,420.80
                  </span>
                </div>

                <div className="bg-surface-container-low p-3 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Destination Rail:</span>
                    <span className="font-bold text-on-surface">Chase Commercial ••8829</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Transfer Fee (1%):</span>
                    <span className="font-semibold text-on-surface">$0.00 (Waived for Tier 1)</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold text-xs shadow-md"
                  >
                    Confirm Instant Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="px-4 py-3 rounded-full bg-surface-container text-on-surface font-semibold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
