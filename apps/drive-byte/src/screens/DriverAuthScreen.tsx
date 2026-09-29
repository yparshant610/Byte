import React, { useState } from 'react';

interface DriverAuthScreenProps {
  onLoginSuccess: () => void;
  onRegisterClick: () => void;
}

export const DriverAuthScreen: React.FC<DriverAuthScreenProps> = ({
  onLoginSuccess,
  onRegisterClick,
}) => {
  const [courierId, setCourierId] = useState('driver1@foodbytes.app');
  const [pin, setPin] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [stayOnShift, setStayOnShift] = useState(true);

  return (
    <div className="flex flex-col w-full relative min-h-full pb-10">
      <div className="p-4 space-y-4">
        {/* Logo & Portal Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-2">
          <div className="relative w-16 h-16 rounded-full shadow-md p-1 bg-surface-container-lowest flex items-center justify-center mb-2">
            <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
              DB
            </div>
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                electric_moped
              </span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed mb-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Courier Fleet Portal</span>
          </div>
          <h1 className="text-xl font-extrabold text-on-surface">Drive Byte Partner</h1>
          <p className="text-xs text-on-surface-variant">Empowering Food Bites Delivery Heroes</p>
        </div>

        {/* Tab Pills */}
        <div className="w-full bg-surface-container p-1 rounded-full flex items-center">
          <button
            type="button"
            className="flex-1 py-2 rounded-full text-xs font-bold bg-primary text-on-primary shadow-sm flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">badge</span>
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={onRegisterClick}
            className="flex-1 py-2 rounded-full text-xs font-bold text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>New Partner</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Courier Identity
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px]">
                directions_bike
              </span>
              <input
                type="text"
                value={courierId}
                onChange={e => setCourierId(e.target.value)}
                placeholder="Email or Courier ID"
                className="w-full bg-surface-container-low text-on-surface text-xs pl-10 pr-9 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {courierId && (
                <button
                  type="button"
                  onClick={() => setCourierId('')}
                  className="absolute right-3 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                Access PIN / Password
              </label>
              <button type="button" className="text-[11px] text-primary hover:underline font-semibold">
                Forgot PIN?
              </button>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[18px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="Enter secret PIN"
                className="w-full bg-surface-container-low text-on-surface text-xs pl-10 pr-9 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={stayOnShift}
                onChange={e => setStayOnShift(e.target.checked)}
                className="w-4 h-4 rounded text-primary accent-primary"
              />
              <span className="text-xs text-on-surface-variant">Stay on ready shift</span>
            </label>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-tertiary">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              GPS Ready
            </span>
          </div>

          <button
            type="button"
            onClick={onLoginSuccess}
            className="w-full h-12 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-95 transition-all mt-1"
          >
            <span>Log In to Duty</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow h-px bg-surface-container-highest"></div>
          <span className="mx-3 text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">or</span>
          <div className="flex-grow h-px bg-surface-container-highest"></div>
        </div>

        {/* SMS Login */}
        <button
          type="button"
          onClick={onRegisterClick}
          className="w-full py-3 px-4 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-primary text-[18px]">sms</span>
          <span>Send Instant SMS Login Code</span>
        </button>

        {/* Earnings Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container-high via-surface-container-low to-secondary-fixed/20 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <span className="inline-block px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-wider mb-1">
                High Earnings
              </span>
              <h2 className="text-sm font-extrabold text-on-surface">Become a Food Bites Courier</h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[22px]">paid</span>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant mb-3">
            Make up to <strong className="text-on-surface font-bold">$28/hr</strong> + keep <strong className="text-primary font-bold">100%</strong> of customer tips!
          </p>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-surface-container-lowest/80 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[16px]">verified</span>
              <span className="text-[11px] font-bold text-on-surface">Instant Approval</span>
            </div>
            <div className="bg-surface-container-lowest/80 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[16px]">bolt</span>
              <span className="text-[11px] font-bold text-on-surface">Daily Cashout</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onRegisterClick}
            className="w-full py-3 px-4 rounded-full bg-secondary-container text-on-secondary-container font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
            <span>Register as a Delivery Partner</span>
          </button>
        </div>
      </div>
    </div>
  );
};
