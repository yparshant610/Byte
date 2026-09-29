import React, { useState } from 'react';

interface PermissionsScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

export const PermissionsScreen: React.FC<PermissionsScreenProps> = ({
  onContinue,
  onBack,
}) => {
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [dispatchAlerts, setDispatchAlerts] = useState(true);
  const [backgroundRouting, setBackgroundRouting] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleAllowAll = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      onContinue();
    }, 800);
  };

  return (
    <div className="flex flex-col w-full relative min-h-full pb-10">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-surface-container-high bg-surface/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h1 className="font-bold text-base text-on-surface">Permissions Gateway</h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
          <span className="material-symbols-outlined text-[18px]">person</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Banner */}
        <section className="relative overflow-hidden bg-surface-container-lowest rounded-2xl p-4 shadow-sm">
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-tertiary-container/15 text-tertiary">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </span>
              <span className="text-[11px] font-bold text-tertiary bg-tertiary-container/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Approved & Verified
              </span>
            </div>
            <span className="text-[11px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
              ID #8942
            </span>
          </div>

          <h2 className="text-lg font-bold text-on-surface mb-0.5">Application Approved!</h2>
          <p className="text-xs text-on-surface-variant mb-3">
            Welcome to Drive Byte! Your courier profile is activated and ready for dispatch.
          </p>

          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-bold text-primary">Express Dispatch Ready</span>
            <span className="material-symbols-outlined text-[14px] text-primary ml-auto">bolt</span>
          </div>
        </section>

        {/* Permissions Count */}
        <div className="flex items-baseline justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">Required Permissions</h3>
          <span className="text-xs font-bold text-primary">3 of 3 Recommended</span>
        </div>

        {/* Permission Cards */}
        <div className="space-y-3">
          {/* 1: GPS */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    near_me
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-on-surface">Real-Time GPS Tracking</h4>
                    <span className="bg-primary text-on-primary text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                      Mandatory
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Background and foreground GPS required for turn-by-turn routing and live customer tracking.
                  </p>
                </div>
              </div>

              {/* Switch */}
              <button
                type="button"
                onClick={() => setGpsEnabled(!gpsEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                  gpsEnabled ? 'bg-primary' : 'bg-surface-container-highest'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    gpsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between bg-surface-container-low px-3 py-1.5 rounded-lg text-xs">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span>High-precision location mode</span>
              </div>
              <span className={`font-bold ${gpsEnabled ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                {gpsEnabled ? 'Active' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* 2: Alerts */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    notifications_active
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-on-surface">Instant Dispatch Alerts</h4>
                    <span className="bg-primary text-on-primary text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                      Mandatory
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Push notifications with audio chime to receive incoming 30s high-payout dispatch offers.
                  </p>
                </div>
              </div>

              {/* Switch */}
              <button
                type="button"
                onClick={() => setDispatchAlerts(!dispatchAlerts)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                  dispatchAlerts ? 'bg-primary' : 'bg-surface-container-highest'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    dispatchAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between bg-surface-container-low px-3 py-1.5 rounded-lg text-xs">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span>Audio chime & overlay enabled</span>
              </div>
              <span className={`font-bold ${dispatchAlerts ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                {dispatchAlerts ? 'Active' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* 3: Background Routing */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container/15 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    screen_lock_rotation
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-on-surface">Background Routing</h4>
                    <span className="bg-surface-container-high text-on-surface-variant text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Keeps route navigation synced even when screen is locked in bike mount or cradle.
                  </p>
                </div>
              </div>

              {/* Switch */}
              <button
                type="button"
                onClick={() => setBackgroundRouting(!backgroundRouting)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                  backgroundRouting ? 'bg-primary' : 'bg-surface-container-highest'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    backgroundRouting ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between bg-surface-container-low px-3 py-1.5 rounded-lg text-xs">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span>Continuous cradle tracking</span>
              </div>
              <span className={`font-bold ${backgroundRouting ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                {backgroundRouting ? 'Active' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="bg-surface-container-low rounded-xl p-3 flex items-center gap-2.5">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">lock</span>
          <p className="text-[11px] text-on-surface-variant leading-snug">
            Your data is encrypted. Location tracking is only active during scheduled shifts and accepted deliveries.
          </p>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <button
            onClick={handleAllowAll}
            disabled={isConnecting}
            className="w-full h-14 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(255,30,56,0.28)] active:scale-[0.98] transition-all"
            type="button"
          >
            {isConnecting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                <span>Connecting to Dispatch...</span>
              </>
            ) : (
              <>
                <span>Allow All & Continue to Duty</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
