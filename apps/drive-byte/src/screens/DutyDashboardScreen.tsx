import React from 'react';
import { useDriver } from '../context/DriverContext';

interface DutyDashboardScreenProps {
  onAcceptSuccess: () => void;
  onNavigateEarnings: () => void;
}

export const DutyDashboardScreen: React.FC<DutyDashboardScreenProps> = ({
  onAcceptSuccess,
  onNavigateEarnings,
}) => {
  const {
    driverName,
    vehicleType,
    vehiclePlate,
    rating,
    isOnline,
    toggleDuty,
    shift,
    incomingOffer,
    acceptOffer,
    declineOffer,
    triggerTestDispatch,
  } = useDriver();

  const handleAccept = () => {
    acceptOffer();
    onAcceptSuccess();
  };

  return (
    <div className="flex flex-col min-h-full pb-8 bg-[#fcf9f8] text-[#1c1b1b]">
      {/* App Header */}
      <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between bg-white/90 backdrop-blur-xl border-b border-black/[0.04] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#bb0021] flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-sm text-[#bb0021]">Drive Byte</span>
              <span
                className={`h-2 w-2 rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                }`}
              />
            </div>
            <span className="text-[11px] font-bold opacity-60">Duty Radar</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            onClick={toggleDuty}
            className={`cursor-pointer px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all shadow-xs ${
              isOnline ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-200 text-gray-600'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#bb0021] flex items-center justify-center text-white text-xs font-bold">
            {driverName[0]}
          </div>
        </div>
      </header>

      <div className="p-4 flex flex-col gap-4">
        {/* Top Duty Status Card */}
        <section className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-black/5 flex flex-col gap-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center">
                {isOnline && <span className="absolute w-4 h-4 rounded-full bg-emerald-500/30 animate-ping" />}
                <span className={`w-3 h-3 rounded-full relative ${isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              </div>
              <div>
                <h2 className="font-extrabold text-sm tracking-tight">
                  {isOnline ? 'YOU ARE ONLINE' : 'YOU ARE OFFLINE'}
                </h2>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">sensors</span>
                  {isOnline ? 'Accepting dispatches in Bangalore' : 'Radar paused'}
                </span>
              </div>
            </div>

            <button
              onClick={toggleDuty}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 active:scale-95 shadow-xs ${
                isOnline
                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">power_settings_new</span>
              <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
            </button>
          </div>

          {/* Shift Snapshot Tiles */}
          <div className="grid grid-cols-3 gap-2 bg-[#f6f3f2] p-2.5 rounded-xl text-center">
            <div
              onClick={onNavigateEarnings}
              className="flex flex-col items-center justify-center cursor-pointer hover:opacity-80"
            >
              <span className="text-[10px] font-bold opacity-60">Today's Pay</span>
              <span className="text-base font-extrabold text-[#bb0021] mt-0.5">
                ${shift.todayPay.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center bg-white rounded-lg p-1 shadow-xs">
              <span className="text-[10px] font-bold opacity-60">Completed</span>
              <span className="text-sm font-extrabold mt-0.5">{shift.completedDrops} Drops</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold opacity-60">Active Shift</span>
              <span className="text-sm font-extrabold mt-0.5">{shift.shiftHours}</span>
            </div>
          </div>
        </section>

        {/* High Demand Surge Alert Banner */}
        <section className="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white text-[20px] icon-filled">bolt</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs">Downtown Core Surge</span>
                <span className="bg-[#bb0021] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                  +$2.50 / Drop
                </span>
              </div>
              <p className="text-[11px] opacity-90 leading-tight mt-0.5">
                Surge multiplier active in MG Road & Indiranagar sector
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-white/50 text-[18px]">trending_up</span>
        </section>

        {/* Driver Fleet Vehicle Details */}
        <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-[#bb0021] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">electric_scooter</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm">{vehicleType}</h3>
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold text-[10px]">
                  Verified
                </span>
              </div>
              <span className="text-xs opacity-60 font-mono">{vehiclePlate}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-0.5 text-amber-500 font-extrabold text-xs">
              <span className="material-symbols-outlined text-[14px] icon-filled">star</span>
              <span>{rating}</span>
            </div>
            <span className="text-[10px] opacity-50 font-bold">{shift.acceptanceRate}% Accept Rate</span>
          </div>
        </div>

        {/* Live Radar Area Map Preview */}
        <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-60">High Demand Zones</span>
            <span className="text-xs font-bold text-[#bb0021]">Live Heatmap</span>
          </div>
          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
            {/* SVG Mini Heatmap */}
            <svg className="w-full h-full object-cover" viewBox="0 0 350 150">
              <rect width="350" height="150" fill="#eae8e5" />
              <path d="M 0 75 Q 175 40 350 75" stroke="#ffffff" strokeWidth="12" fill="none" />
              <circle cx="175" cy="75" r="45" fill="#f87171" opacity="0.4" />
              <circle cx="175" cy="75" r="25" fill="#ef4444" opacity="0.6" />
              <circle cx="70" cy="50" r="20" fill="#fbbf24" opacity="0.5" />
              <circle cx="280" cy="90" r="30" fill="#f87171" opacity="0.3" />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 text-white text-[10px] font-bold backdrop-blur-md shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>You are in High-Demand Zone</span>
            </div>
          </div>
        </div>

        {/* Dispatch Trigger Test Button */}
        <button
          onClick={triggerTestDispatch}
          className="w-full py-3.5 rounded-2xl border-2 border-dashed border-[#bb0021]/30 hover:border-[#bb0021] text-[#bb0021] font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 hover:bg-rose-50/50"
        >
          <span className="material-symbols-outlined text-[18px]">cell_tower</span>
          <span>Simulate Incoming Order Dispatch</span>
        </button>
      </div>

      {/* 30-SECOND COUNTDOWN DISPATCH MODAL */}
      {incomingOffer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-white p-5 shadow-2xl flex flex-col gap-4 border border-black/10">
            {/* Top Timer & Earnings Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  New Delivery Offer
                </span>
                <h3 className="font-extrabold text-xl text-[#bb0021] mt-0.5">
                  ${incomingOffer.estimatedEarnings.toFixed(2)}
                </h3>
                <span className="text-[11px] opacity-60">Includes ${incomingOffer.driverTip.toFixed(2)} Tip</span>
              </div>

              {/* 30s Countdown Circular Ring */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#bb0021] transition-all duration-1000"
                    strokeDasharray={`${(incomingOffer.expiresInSeconds / 30) * 100}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-sm font-extrabold text-rose-600 leading-none">
                    {incomingOffer.expiresInSeconds}s
                  </span>
                </div>
              </div>
            </div>

            {/* Trip Details Card */}
            <div className="p-3.5 rounded-2xl bg-[#f6f3f2] flex flex-col gap-3">
              {/* Pickup */}
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#bb0021] text-[18px] mt-0.5">restaurant</span>
                <div>
                  <h4 className="font-extrabold text-xs">{incomingOffer.restaurantName}</h4>
                  <p className="text-[11px] opacity-60">{incomingOffer.restaurantAddress}</p>
                  <span className="text-[10px] font-bold text-emerald-600">
                    {incomingOffer.pickupDistanceKm} km from you
                  </span>
                </div>
              </div>

              {/* Dropoff */}
              <div className="flex items-start gap-2.5 pt-2 border-t border-black/5">
                <span className="material-symbols-outlined text-emerald-600 text-[18px] mt-0.5">location_on</span>
                <div>
                  <h4 className="font-extrabold text-xs">Customer Dropoff</h4>
                  <p className="text-[11px] opacity-60">{incomingOffer.customerAddress}</p>
                  <span className="text-[10px] font-bold opacity-60">
                    {incomingOffer.deliveryDistanceKm} km delivery trip
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                onClick={declineOffer}
                className="py-3 rounded-full text-xs font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 active:scale-95 transition-all"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="py-3 rounded-full text-xs font-bold text-white bg-[#bb0021] hover:bg-[#d60026] shadow-lg shadow-rose-600/30 active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <span>Accept ({incomingOffer.expiresInSeconds}s)</span>
                <span className="material-symbols-outlined text-[16px]">check</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
