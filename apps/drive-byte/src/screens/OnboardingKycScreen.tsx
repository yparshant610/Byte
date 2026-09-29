import React, { useState } from 'react';

interface OnboardingKycScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const OnboardingKycScreen: React.FC<OnboardingKycScreenProps> = ({
  onNext,
  onBack,
}) => {
  const [vehicleMode, setVehicleMode] = useState<'bike' | 'moto' | 'car'>('bike');

  return (
    <div className="flex flex-col w-full relative min-h-full pb-10">
      {/* Top Stepper Indicator */}
      <div className="w-full px-4 pt-3 pb-3 border-b border-surface-container-high bg-surface sticky top-0 z-30">
        <div className="flex items-center justify-between relative max-w-xs mx-auto">
          {/* Track line */}
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-surface-container-high rounded-full -z-0">
            <div className="w-2/3 h-full bg-primary rounded-full"></div>
          </div>

          {/* Step 1 */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs shadow-sm">
              <span className="material-symbols-outlined text-[15px]">check</span>
            </div>
            <span className="text-[10px] text-on-surface">Account</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs shadow-sm">
              <span className="material-symbols-outlined text-[15px]">check</span>
            </div>
            <span className="text-[10px] text-on-surface">OTP Phone</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs ring-4 ring-primary-fixed shadow-md animate-pulse">
              <span className="font-bold">3</span>
            </div>
            <span className="text-[10px] font-bold text-primary">KYC & Gear</span>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-xs">
              <span>4</span>
            </div>
            <span className="text-[10px] text-on-surface-variant opacity-70">Ready</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Courier Identity Card */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-primary/10 flex items-center justify-center text-primary font-black text-base">
              RK
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-on-surface">Rajesh Kumar</span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  Verified
                </span>
              </div>
              <span className="text-xs text-on-surface-variant">Fleet ID #FB-4091 • Partner Tier 1</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[18px]">badge</span>
          </div>
        </div>

        {/* Review Notice Banner */}
        <div className="w-full bg-secondary-fixed/50 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-on-secondary-fixed">Application Under Review</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                  SLA &lt; 2h
                </span>
              </div>
              <p className="text-xs text-on-secondary-fixed-variant mt-1 leading-relaxed">
                Regional onboarding operations is validating your packet against local transport regulations.
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle Mode Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Registered Vehicle Mode</span>
            <span className="text-xs text-primary font-semibold">Change Mode</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setVehicleMode('bike')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
                vehicleMode === 'bike'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant opacity-70'
              }`}
            >
              <span className="material-symbols-outlined text-[24px] mb-1">pedal_bike</span>
              <span className="text-xs font-semibold">E-Bike / Bike</span>
            </button>

            <button
              type="button"
              onClick={() => setVehicleMode('moto')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
                vehicleMode === 'moto'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant opacity-70'
              }`}
            >
              <span className="material-symbols-outlined text-[24px] mb-1">two_wheeler</span>
              <span className="text-xs font-semibold">Motorcycle</span>
            </button>

            <button
              type="button"
              onClick={() => setVehicleMode('car')}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
                vehicleMode === 'car'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant opacity-70'
              }`}
            >
              <span className="material-symbols-outlined text-[24px] mb-1">directions_car</span>
              <span className="text-xs font-semibold">Car / Van</span>
            </button>
          </div>
        </div>

        {/* KYC & Gear Checklist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider">KYC & Gear Checklist</span>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary text-[10px] font-bold">
                3 of 3 Verified
              </span>
            </div>
            <span className="material-symbols-outlined text-tertiary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              task_alt
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Item 1 */}
            <div className="w-full bg-surface-container-lowest rounded-xl p-3.5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-container-low text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">contact_emergency</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-on-surface block">Driver's License / National ID</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-tertiary font-semibold">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    <span>Government Validated • Exp: 09/2028</span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
            </div>

            {/* Item 2 */}
            <div className="w-full bg-surface-container-lowest rounded-xl p-3.5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-container-low text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-on-surface block">Vehicle Registration & Insurance</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-tertiary font-semibold">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    <span>KA 01 EQ 4402 • Commercial Active</span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
            </div>

            {/* Item 3 */}
            <div className="w-full bg-surface-container-lowest rounded-xl p-3.5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-container-low text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-on-surface block">Thermal Insulated Delivery Bag</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-tertiary font-semibold">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    <span>Photo AI Confirmed • Sealed standard</span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <button
            onClick={onNext}
            className="w-full h-14 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(255,30,56,0.28)] active:scale-[0.98] transition-all"
            type="button"
          >
            <span>Proceed to Permissions Gateway</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
