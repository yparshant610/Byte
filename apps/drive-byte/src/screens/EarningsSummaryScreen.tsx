import React, { useState } from 'react';
import { useDriver } from '../context/DriverContext';

interface EarningsSummaryScreenProps {
  onBackToRadar: () => void;
  onGoOffline: () => void;
}

export const EarningsSummaryScreen: React.FC<EarningsSummaryScreenProps> = ({
  onBackToRadar,
  onGoOffline,
}) => {
  const { shift, activeTrip } = useDriver();
  const [showShiftModal, setShowShiftModal] = useState(false);

  const earnings = activeTrip?.estimatedEarnings || 14.50;
  const tip = activeTrip?.driverTip || 4.00;
  const basePay = 6.50;
  const distanceSurge = 1.50;
  const peakSurge = Math.max(0, +(earnings - basePay - distanceSurge - tip).toFixed(2));

  return (
    <div className="flex flex-col w-full relative min-h-full pb-20">
      {/* Top Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-surface-container-high bg-surface/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs">
            DB
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-label-lg font-bold text-primary text-sm">Drive Byte</span>
              <span className="h-2 w-2 rounded-full bg-tertiary animate-pulse"></span>
            </div>
            <p className="text-[11px] text-on-surface-variant">Completed Drop</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-container px-2.5 py-1 rounded-full gap-1.5">
            <span className="h-2 w-2 rounded-full bg-tertiary"></span>
            <span className="text-[11px] font-bold text-on-surface">ONLINE</span>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Celebration Hero Card */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-sm text-center flex flex-col items-center">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-secondary-fixed/40 blur-xl pointer-events-none" />

          {/* Animated Success Badge */}
          <div className="relative mb-4 flex items-center justify-center">
            <div className="absolute -inset-2 rounded-full bg-primary/10 animate-ping" />
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-[0_8px_20px_rgba(255,30,56,0.28)] z-10">
              <span className="material-symbols-outlined text-on-primary text-[42px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                task_alt
              </span>
            </div>
            <span className="material-symbols-outlined text-secondary text-[24px] absolute -top-1 -right-2 animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
              stars
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-tertiary-fixed/40 text-on-tertiary-fixed px-3.5 py-1 rounded-full mb-2">
            <span className="material-symbols-outlined text-[16px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider">Doorstep Drop • OTP Verified</span>
          </div>

          <h1 className="text-2xl font-extrabold text-on-surface mb-1">Delivery Completed!</h1>
          <p className="text-sm text-on-surface-variant max-w-xs">
            Order <span className="font-semibold text-on-surface">#{activeTrip?.orderId || 'FB-9104'}</span> successfully handed to <span className="font-semibold text-on-surface">{activeTrip?.customerName || 'Michael Chang'}</span>.
          </p>

          {/* Proof of Delivery Snapshot Preview */}
          <div className="mt-4 w-full bg-surface-container-low rounded-xl p-3 flex items-center gap-3 text-left">
            <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden shrink-0 relative flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
              <span className="absolute bottom-0.5 right-0.5 bg-on-surface/75 text-surface-bright rounded-full p-0.5 flex items-center justify-center">
                <span className="material-symbols-outlined text-[10px]">photo_camera</span>
              </span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-on-surface truncate">Dropoff Timestamp & GPS</span>
              <span className="text-[11px] text-on-surface-variant">Logged just now • Handover OTP Match 100%</span>
            </div>
            <span className="material-symbols-outlined text-tertiary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
        </div>

        {/* Payout Card */}
        <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Trip Net Payout</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-on-surface tracking-tight">${earnings.toFixed(2)}</span>
                <span className="text-xs font-semibold text-on-surface-variant">USD</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-tertiary/10 text-tertiary px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
              <span className="text-xs font-bold">Instant Payout</span>
            </div>
          </div>

          <div className="mt-2 inline-flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-tertiary text-[16px]">account_balance_wallet</span>
            <span className="text-xs">Deposited instantly to Driver Wallet</span>
          </div>

          {/* Itemized Breakdown */}
          <div className="mt-4 space-y-2 pt-3 bg-surface-container-low rounded-xl p-3.5">
            <div className="flex justify-between items-center text-sm text-on-surface-variant">
              <span>Base Delivery Pay</span>
              <span className="font-semibold text-on-surface">${basePay.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-on-surface-variant">
              <span>Distance Surcharge (2.2 mi)</span>
              <span className="font-semibold text-on-surface">${distanceSurge.toFixed(2)}</span>
            </div>
            {peakSurge > 0 && (
              <div className="flex justify-between items-center text-sm text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    local_fire_department
                  </span>
                  <span>Peak Surge (Downtown East)</span>
                </div>
                <span className="font-semibold text-secondary">+${peakSurge.toFixed(2)}</span>
              </div>
            )}
            {/* 100% Tip highlight pill */}
            <div className="mt-2 bg-surface-container-lowest rounded-lg p-2.5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    volunteer_activism
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-on-surface block">Customer Tip</span>
                  <span className="text-[11px] text-tertiary font-medium">100% directly to you</span>
                </div>
              </div>
              <span className="text-base font-bold text-on-surface">+${tip.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Bento Strip */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-surface-container-lowest p-3.5 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-primary">
              <span className="material-symbols-outlined text-[20px]">route</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-bold text-on-surface">2.2 <span className="text-xs text-on-surface-variant">mi</span></span>
              <span className="text-[11px] text-on-surface-variant truncate">Smooth transit</span>
            </div>
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-3.5 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-tertiary-fixed/60 flex items-center justify-center shrink-0 text-tertiary">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                timer
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-bold text-on-surface">14 <span className="text-xs text-on-surface-variant">min</span></span>
              <span className="text-[11px] text-tertiary font-bold truncate">3m faster than SLA</span>
            </div>
          </div>
        </div>

        {/* Customer Review Snippet */}
        <div className="rounded-xl bg-surface-container-lowest p-3.5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                MC
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface block">Michael C.</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className="material-symbols-outlined text-[13px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                  <span className="text-[10px] font-bold text-on-surface ml-1">5.0</span>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-secondary/40 text-[24px]">format_quote</span>
          </div>
          <p className="text-xs text-on-surface-variant italic pl-10">
            "Super fast delivery! Food was piping hot and safely placed right at my entrance. Thank you!"
          </p>
        </div>

        {/* Hotspot Teaser Card */}
        <div className="rounded-xl bg-gradient-to-r from-secondary-fixed/50 to-primary-fixed/40 p-3.5 relative overflow-hidden flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[22px] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
              radar
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-on-surface">Westside Hub is buzzing!</span>
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            </div>
            <span className="text-[11px] text-on-surface-variant truncate">+4 high-surge orders within 0.5 miles</span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2.5">
          <button
            onClick={onBackToRadar}
            className="w-full h-14 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(255,30,56,0.28)] active:scale-[0.98] transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">near_me</span>
            <span>Back to Orders Radar (Stay Online)</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setShowShiftModal(true)}
              className="w-full h-11 rounded-full bg-surface-container-lowest text-on-surface font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">assessment</span>
              <span>Shift Summary</span>
            </button>
            <button
              onClick={onGoOffline}
              className="w-full h-11 rounded-full bg-surface-container-high text-on-surface-variant font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">power_settings_new</span>
              <span>Go Offline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Shift Summary Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-on-surface">Today's Shift Performance</h3>
              <button onClick={() => setShowShiftModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-surface-container-low p-3 rounded-xl">
                <span className="text-[11px] text-on-surface-variant block uppercase">Total Earnings</span>
                <span className="text-xl font-extrabold text-tertiary">${shift.todayPay.toFixed(2)}</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-xl">
                <span className="text-[11px] text-on-surface-variant block uppercase">Completed Drops</span>
                <span className="text-xl font-extrabold text-on-surface">{shift.completedDrops}</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-xl">
                <span className="text-[11px] text-on-surface-variant block uppercase">Shift Time</span>
                <span className="text-xl font-extrabold text-on-surface">{shift.shiftHours}</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-xl">
                <span className="text-[11px] text-on-surface-variant block uppercase">Acceptance Rate</span>
                <span className="text-xl font-extrabold text-primary">{shift.acceptanceRate}%</span>
              </div>
            </div>

            <button
              onClick={() => setShowShiftModal(false)}
              className="w-full py-3 rounded-full bg-primary text-on-primary font-bold text-xs shadow-md"
            >
              Close Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
