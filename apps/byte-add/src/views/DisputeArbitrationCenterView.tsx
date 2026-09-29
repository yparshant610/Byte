import React, { useState } from 'react';
import { useAdmin, AdminDispute } from '../context/AdminContext';

export const DisputeArbitrationCenterView: React.FC = () => {
  const { disputes, resolveDisputeWithRefund, rejectDispute } = useAdmin();
  const [selectedDispute, setSelectedDispute] = useState<AdminDispute | null>(
    disputes[0] || null
  );
  const [actionDoneMsg, setActionDoneMsg] = useState<string | null>(null);

  const handleRefund = async (id: string) => {
    await resolveDisputeWithRefund(id);
    setActionDoneMsg(`Full customer refund of $${selectedDispute?.claimAmount.toFixed(2)} dispatched via Razorpay payment rail.`);
    setTimeout(() => setActionDoneMsg(null), 3000);
  };

  const handleReject = (id: string) => {
    rejectDispute(id);
    setActionDoneMsg('Claim rejected due to verified photo and GPS dropoff evidence.');
    setTimeout(() => setActionDoneMsg(null), 3000);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* Executive Header */}
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">gavel</span>
              Tier 3 Arbiter
            </span>
            <span className="text-on-surface-variant text-xs">Food Bites Liability & Settlement Core</span>
          </div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight mt-1">
            Dispute Arbitration & Resolution Center
          </h1>
          <p className="text-xs text-on-surface-variant max-w-2xl mt-0.5">
            Cross-party arbitration between Customers, Restaurants, and Couriers. Review CCTV packaging evidence, GPS drop breadcrumbs, and issue clawbacks or automated refunds.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low border border-surface-container-high text-xs">
            <span className="material-symbols-outlined text-primary text-[16px] animate-spin" style={{ animationDuration: '4s' }}>
              timelapse
            </span>
            <span className="font-bold">Target SLA: &lt; 15 mins</span>
          </div>
        </div>
      </div>

      {actionDoneMsg && (
        <div className="bg-tertiary text-on-tertiary p-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{actionDoneMsg}</span>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Active Open Claims</span>
            <span className="w-8 h-8 rounded-full bg-error-container text-error flex items-center justify-center font-bold">
              !
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-on-surface">{disputes.filter(d => d.status === 'OPEN').length}</span>
            <span className="px-2 py-0.5 rounded-full bg-error-container text-error text-[10px] font-bold">
              SLA Priority
            </span>
          </div>
          <span className="text-[11px] text-on-surface-variant mt-1">Prompt arbiter intervention required</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Dispute Rate (30D)</span>
            <span className="material-symbols-outlined text-tertiary text-[20px]">verified</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black text-tertiary">0.38%</span>
            <span className="text-xs text-on-surface-variant">/ orders</span>
          </div>
          <span className="text-[11px] text-tertiary font-bold mt-1">Threshold target is &lt;0.50%</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Disputed Capital</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">account_balance_wallet</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black text-on-surface">$482.50</span>
            <span className="text-[11px] text-on-surface-variant">escrow</span>
          </div>
          <span className="text-[11px] text-on-surface-variant mt-1">Includes driver tip holds</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Resolution Ratio</span>
            <span className="material-symbols-outlined text-primary text-[20px]">balance</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black text-on-surface">94.2%</span>
            <span className="text-xs text-tertiary font-bold">Closed</span>
          </div>
          <span className="text-[11px] text-on-surface-variant mt-1">Avg turnaround: 9m 14s</span>
        </div>
      </div>

      {/* Two Column Layout: Claims Queue (6 cols) + Investigation Workbench (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Claims List (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="font-extrabold text-sm text-on-surface">Active Claims Docket</h3>
          {disputes.map(disp => {
            const isSelected = selectedDispute?.id === disp.id;
            return (
              <div
                key={disp.id}
                onClick={() => setSelectedDispute(disp)}
                className={`p-4 rounded-2xl bg-surface-container-lowest shadow-sm border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 shadow-md'
                    : 'border-surface-container-high hover:border-surface-container'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-xs font-bold">
                      {disp.id}
                    </span>
                    <span className="text-xs font-bold text-on-surface">{disp.customerName}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      disp.status === 'OPEN'
                        ? 'bg-error-container text-error'
                        : disp.status === 'RESOLVED_REFUND'
                        ? 'bg-tertiary/15 text-tertiary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {disp.status}
                  </span>
                </div>

                <p className="text-xs text-on-surface font-semibold mb-2">"{disp.reason}"</p>

                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-2 border-t border-surface-container">
                  <span>Store: {disp.merchantName} • Courier: {disp.courierName}</span>
                  <span className="text-xs font-black text-primary">${disp.claimAmount.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Arbitration Inspector (6 cols) */}
        <div className="lg:col-span-6 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high space-y-4 sticky top-20">
          {selectedDispute ? (
            <>
              <div className="flex items-center justify-between border-b border-surface-container pb-3">
                <div>
                  <h3 className="font-black text-lg text-on-surface">{selectedDispute.id} Case File</h3>
                  <span className="text-xs text-on-surface-variant">Order Ref: {selectedDispute.orderId}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-on-surface-variant block uppercase font-bold">Claimed Amount</span>
                  <span className="text-xl font-black text-primary">${selectedDispute.claimAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Cross-party dossier */}
              <div className="space-y-3 text-xs">
                <div className="bg-surface-container-low p-3.5 rounded-xl space-y-2">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-bold">Customer:</span>
                    <span className="font-semibold text-on-surface">{selectedDispute.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-bold">Merchant:</span>
                    <span className="font-semibold text-on-surface">{selectedDispute.merchantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-bold">Courier:</span>
                    <span className="font-semibold text-on-surface">{selectedDispute.courierName}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                    Customer Stated Grievance
                  </span>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 font-semibold">
                    "{selectedDispute.reason}"
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                    System Telemetry & Evidence Verification
                  </span>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container text-on-surface leading-relaxed">
                    {selectedDispute.evidenceProof}
                  </div>
                </div>
              </div>

              {/* Arbiter Decision Buttons */}
              {selectedDispute.status === 'OPEN' ? (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-surface-container">
                  <button
                    type="button"
                    onClick={() => handleRefund(selectedDispute.id)}
                    className="py-3 rounded-full bg-primary text-on-primary font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>Issue Full Refund (${selectedDispute.claimAmount.toFixed(2)})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReject(selectedDispute.id)}
                    className="py-3 rounded-full bg-surface-container-high hover:bg-surface-container text-on-surface font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                    <span>Reject Claim</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-surface-container-low text-center text-xs font-bold text-on-surface-variant">
                  This arbitration ticket is finalized ({selectedDispute.status}).
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-on-surface-variant text-center py-8">Select a dispute from the queue.</p>
          )}
        </div>
      </div>
    </div>
  );
};
