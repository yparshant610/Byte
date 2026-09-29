import React from 'react';
import { useDriver } from '../context/DriverContext';

interface DriverDeviceFrameProps {
  children: React.ReactNode;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

export const DriverDeviceFrame: React.FC<DriverDeviceFrameProps> = ({
  children,
  activeScreen,
  setActiveScreen,
}) => {
  const { isOnline, toggleDuty, triggerTestDispatch } = useDriver();

  const screens = [
    { id: 'duty', label: 'Duty Radar', icon: 'radar' },
    { id: 'navigation', label: 'Navigation', icon: 'navigation' },
    { id: 'earnings', label: 'Earnings', icon: 'payments' },
    { id: 'kyc', label: 'KYC & Docs', icon: 'badge' },
    { id: 'permissions', label: 'Permissions', icon: 'security' },
    { id: 'auth', label: 'Login & Auth', icon: 'lock' },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e12] text-[#fcf9f8] flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Floating Control Bar */}
      <header className="w-full max-w-4xl py-2.5 px-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#bb0021] flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
              <span>DRIVE BYTE</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400">
                Driver App (4.2)
              </span>
            </h1>
            <p className="text-[11px] opacity-60">Redis Proximity Dispatch • 30s Countdown • Real-time Telemetry</p>
          </div>
        </div>

        {/* Quick Screen Select & Test Dispatch Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerTestDispatch}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 active:scale-95 transition-all flex items-center gap-1 shadow-md"
            title="Simulate incoming dispatch request from user-service"
          >
            <span className="material-symbols-outlined text-[15px]">sensors</span>
            <span>Simulate 30s Dispatch</span>
          </button>

          <select
            value={activeScreen}
            onChange={e => setActiveScreen(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/20 bg-[#1e1e24] text-white focus:outline-none"
          >
            {screens.map(s => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Smartphone Device Frame (390px x 844px) */}
      <main className="w-full flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-[390px] h-[854px] rounded-[3.25rem] bg-[#1a1a20] p-[10px] shadow-[0_25px_70px_rgba(0,0,0,0.6)] ring-1 ring-white/20 overflow-hidden flex flex-col">
          {/* Inner Phone Screen Display */}
          <div className="relative w-full h-full rounded-[2.6rem] bg-[#fcf9f8] text-[#1c1b1b] overflow-hidden flex flex-col">
            {/* Status Bar */}
            <div className="w-full h-11 px-7 flex items-center justify-between z-50 pointer-events-none select-none bg-white/40 backdrop-blur-md">
              <span className="text-xs font-bold tracking-tight">9:41</span>
              {/* Dynamic Island */}
              <div className="w-24 h-5 rounded-full bg-black flex items-center justify-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#008379] animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="material-symbols-outlined text-[14px]">signal_cellular_4_bar</span>
                <span className="material-symbols-outlined text-[14px]">wifi</span>
                <span className="material-symbols-outlined text-[16px]">battery_full</span>
              </div>
            </div>

            {/* Screen Content */}
            <div className="flex-1 w-full overflow-y-auto no-scrollbar relative flex flex-col">
              {children}
            </div>

            {/* Bottom Home Indicator */}
            <div className="w-full h-5 flex items-center justify-center z-50 pointer-events-none bg-white/30">
              <div className="w-36 h-1 rounded-full bg-black/30" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
