import React, { useState } from 'react';

interface OtpPasswordSetupScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const OtpPasswordSetupScreen: React.FC<OtpPasswordSetupScreenProps> = ({
  onSuccess,
  onBack,
}) => {
  const [otp, setOtp] = useState(['7', '4', '2', '8', '', '']);
  const [password, setPassword] = useState('SecretPin2026!');
  const [confirmPassword, setConfirmPassword] = useState('SecretPin2026!');

  const handleCellChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);
  };

  const isFormValid = otp.join('').length >= 4 && password.length >= 6;

  return (
    <div className="flex flex-col w-full relative min-h-full pb-10">
      {/* Header */}
      <header className="w-full px-4 pt-4 pb-2 flex items-center justify-between border-b border-surface-container-high bg-surface sticky top-0 z-30">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              sports_motorsports
            </span>
          </div>
          <span className="text-xs font-bold text-on-surface">Drive Byte</span>
        </div>
        <div className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
          Step 2 of 4
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between relative max-w-xs mx-auto py-1">
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-surface-container -z-0" />
          <div className="absolute left-4 w-1/3 top-1/2 -translate-y-1/2 h-1 bg-primary -z-0" />

          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs shadow-sm">
              <span className="material-symbols-outlined text-[14px]">check</span>
            </div>
            <span className="text-[10px] text-on-surface-variant">Account</span>
          </div>

          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs ring-4 ring-primary-fixed shadow-md">
              <span className="material-symbols-outlined text-[14px]">lock_open</span>
            </div>
            <span className="text-[10px] font-bold text-primary">Security</span>
          </div>

          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-xs">
              <span className="material-symbols-outlined text-[14px]">badge</span>
            </div>
            <span className="text-[10px] text-on-surface-variant">KYC Gear</span>
          </div>

          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-xs">
              <span className="material-symbols-outlined text-[14px]">rocket_launch</span>
            </div>
            <span className="text-[10px] text-on-surface-variant">Ready</span>
          </div>
        </div>

        {/* Title */}
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-bold mb-1.5">
            <span className="material-symbols-outlined text-[13px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            Partner Verification
          </div>
          <h1 className="text-xl font-extrabold text-on-surface tracking-tight">Verify Phone & Secure Account</h1>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            We sent a 6-digit verification code to <span className="font-semibold text-on-surface">+91 98765 43210</span>.
          </p>
        </div>

        {/* OTP Input Grid */}
        <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Enter 6-Digit OTP Code
            </span>
            <span className="text-xs font-semibold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              00:45s
            </span>
          </div>

          <div className="grid grid-cols-6 gap-2 w-full">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleCellChange(idx, e.target.value)}
                className={`h-12 text-center text-lg font-bold rounded-xl border transition-all ${
                  idx === 4
                    ? 'bg-primary-fixed border-primary text-primary animate-pulse'
                    : 'bg-surface-container-low border-surface-container text-on-surface'
                } focus:outline-none focus:ring-2 focus:ring-primary`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-xl text-xs">
            <div className="flex items-center gap-1.5 text-tertiary font-semibold">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span>SMS Dispatch Auth Verified</span>
            </div>
            <button type="button" className="text-primary font-bold text-xs">Resend</button>
          </div>
        </section>

        {/* Password Setup */}
        <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3">
          <div>
            <h2 className="text-sm font-bold text-on-surface">Create Courier Access PIN / Password</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Set a secure password for daily driver shift console login and instant earnings withdrawals.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase">New Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface text-sm px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface text-sm px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </section>

        {/* CTA */}
        <div className="pt-2">
          <button
            onClick={onSuccess}
            disabled={!isFormValid}
            className={`w-full h-14 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(255,30,56,0.28)] transition-all ${
              isFormValid
                ? 'bg-primary text-on-primary active:scale-[0.98]'
                : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
            }`}
            type="button"
          >
            <span>Confirm & Continue to KYC</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
