import React, { useState } from 'react';
import { useDriver } from '../context/DriverContext';

interface ActiveNavigationScreenProps {
  onDeliveredSuccess: () => void;
  onBackToDashboard: () => void;
}

export const ActiveNavigationScreen: React.FC<ActiveNavigationScreenProps> = ({
  onDeliveredSuccess,
  onBackToDashboard,
}) => {
  const { activeTrip, advanceTripStage, completeDelivery } = useDriver();

  const [otpInput, setOtpInput] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center bg-[#fcf9f8]">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-[#bb0021] flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-[32px]">navigation</span>
        </div>
        <h2 className="font-extrabold text-lg">No Active Delivery Dispatch</h2>
        <p className="text-xs opacity-60 mt-1 max-w-xs">
          Go online on your Duty Radar to start receiving proximity delivery dispatches!
        </p>
        <button
          onClick={onBackToDashboard}
          className="mt-5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#bb0021] shadow-md active:scale-95"
        >
          Back to Duty Radar
        </button>
      </div>
    );
  }

  const isHeadedToStore = activeTrip.stage === 'HEADED_TO_RESTAURANT';
  const isAtStore = activeTrip.stage === 'AT_RESTAURANT';
  const isEnRouteCustomer = activeTrip.stage === 'PICKED_UP';
  const isAtCustomer = activeTrip.stage === 'AT_CUSTOMER';

  const handleVerifyDelivery = async () => {
    setOtpError(null);
    const success = await completeDelivery(otpInput || '4402');
    if (success) {
      setShowOtpModal(false);
      onDeliveredSuccess();
    } else {
      setOtpError('Invalid customer delivery OTP. Please verify with customer.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#fcf9f8] text-[#1c1b1b] relative">
      {/* Top Turn-by-Turn Instruction Banner */}
      <div className="sticky top-0 z-30 bg-[#bb0021] text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[24px]">turn_right</span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/80">
              In 200 meters
            </span>
            <h3 className="font-extrabold text-sm leading-tight">
              Turn right onto MG Road Boulevard
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-sm font-extrabold">1.4 km</span>
          <p className="text-[10px] opacity-80 font-bold">4 mins</p>
        </div>
      </div>

      {/* Interactive Navigation Map Simulation */}
      <div className="relative flex-1 bg-[#e0dede] overflow-hidden">
        {/* Vector SVG Road Canvas */}
        <svg className="w-full h-full object-cover" viewBox="0 0 400 500">
          <rect width="400" height="500" fill="#eae8e5" />
          {/* Main Highway & Streets */}
          <path d="M 50 0 L 70 500" stroke="#ffffff" strokeWidth="22" fill="none" />
          <path d="M 0 250 L 400 250" stroke="#ffffff" strokeWidth="26" fill="none" />
          <path d="M 220 0 L 200 500" stroke="#ffffff" strokeWidth="18" fill="none" />
          {/* Active Navigation Polyline Route (Glowing Blue/Teal) */}
          <path
            d="M 60 400 L 60 250 L 210 250 L 205 100"
            stroke="#0284c7"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Waypoints */}
          <circle cx="60" cy="400" r="10" fill="#bb0021" />
          <circle cx="205" cy="100" r="10" fill="#10b981" />
        </svg>

        {/* Live Driver Scooter Marker */}
        <div className="absolute top-[52%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#0284c7] text-white flex items-center justify-center shadow-2xl ring-4 ring-sky-400/40 animate-pulse">
            <span className="material-symbols-outlined text-[24px]">navigation</span>
          </div>
          <span className="text-[9px] font-extrabold px-2 py-0.5 mt-1 rounded-full bg-black/80 text-white backdrop-blur-md">
            Speed: 32 km/h
          </span>
        </div>

        {/* Floating Quick Action Overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="px-3 py-1.5 rounded-full bg-black/75 text-white backdrop-blur-md text-xs font-bold shadow-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>GPS Tracking Active</span>
          </div>
          <button
            onClick={onBackToDashboard}
            className="pointer-events-auto px-3 py-1.5 rounded-xl bg-white/90 text-black text-xs font-bold shadow-md active:scale-95"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Bottom Dispatch Controls Sheet */}
      <div className="relative z-20 bg-white p-4 rounded-t-3xl shadow-[0_-4px_25px_rgba(0,0,0,0.08)] border-t border-black/5 flex flex-col gap-3">
        {/* Step Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#bb0021] text-[20px]">
              {isHeadedToStore || isAtStore ? 'storefront' : 'home'}
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                {isHeadedToStore
                  ? 'Step 1: Head to Restaurant'
                  : isAtStore
                  ? 'Step 2: Collect Food from Kitchen'
                  : isEnRouteCustomer
                  ? 'Step 3: Head to Customer'
                  : 'Step 4: Customer Handover'}
              </span>
              <h3 className="font-extrabold text-sm">
                {isHeadedToStore || isAtStore ? activeTrip.restaurantName : activeTrip.customerAddress}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${activeTrip.customerPhone}`}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
            </a>
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
              <span className="material-symbols-outlined text-[18px]">chat</span>
            </div>
          </div>
        </div>

        {/* Order Details Snippet */}
        <div className="p-2.5 rounded-xl bg-[#f6f3f2] flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-gray-500">#{activeTrip.orderId.slice(-6)}</span>
            <span>•</span>
            <span>2x Margherita Classica</span>
          </div>
          <span className="font-extrabold text-[#bb0021]">
            ${activeTrip.estimatedEarnings.toFixed(2)}
          </span>
        </div>

        {/* Primary Stage Transition Buttons */}
        {isHeadedToStore && (
          <button
            onClick={advanceTripStage}
            className="w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#bb0021] hover:bg-[#d60026] shadow-lg shadow-rose-600/30 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            <span>Arrived at Restaurant</span>
          </button>
        )}

        {isAtStore && (
          <button
            onClick={advanceTripStage}
            className="w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-amber-600 hover:bg-amber-700 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            <span>Confirm Order Picked Up</span>
          </button>
        )}

        {isEnRouteCustomer && (
          <button
            onClick={advanceTripStage}
            className="w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#bb0021] hover:bg-[#d60026] shadow-lg shadow-rose-600/30 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">near_me</span>
            <span>Arrived at Customer Location</span>
          </button>
        )}

        {isAtCustomer && (
          <button
            onClick={() => setShowOtpModal(true)}
            className="w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 animate-bounce"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Complete Delivery with Customer OTP</span>
          </button>
        )}
      </div>

      {/* Customer Delivery OTP Confirmation Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[28px]">lock_clock</span>
            </div>
            <h3 className="font-extrabold text-lg">Enter Customer Handover OTP</h3>
            <p className="text-xs opacity-60 mt-1 mb-4">
              Ask customer Alex Morgan for the 4-digit verification PIN (Demo default: <span className="font-bold font-mono">4402</span>)
            </p>

            {otpError && (
              <div className="mb-3 p-2 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold">
                {otpError}
              </div>
            )}

            <input
              type="text"
              maxLength={4}
              value={otpInput}
              onChange={e => setOtpInput(e.target.value)}
              placeholder="4402"
              className="w-40 py-2.5 text-center text-2xl font-extrabold font-mono tracking-widest rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#bb0021] mb-5"
            />

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                onClick={() => setShowOtpModal(false)}
                className="py-3 rounded-full text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyDelivery}
                className="py-3 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md active:scale-95"
              >
                Confirm Drop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
