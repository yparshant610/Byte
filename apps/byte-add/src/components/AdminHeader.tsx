import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

export const AdminHeader: React.FC = () => {
  const { alertBanner, dismissAlert, broadcastAlert } = useAdmin();
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (broadcastMessage.trim()) {
      broadcastAlert(broadcastMessage.trim());
      setBroadcastMessage('');
      setShowBroadcastModal(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-64 xl:left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-6 border-b border-surface-container-high">
        {/* Search & Health */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search restaurants, drivers, order disputes, payouts..."
              className="w-full h-10 bg-surface-container-low rounded-full pl-9 pr-4 text-xs text-on-surface placeholder:text-on-surface-variant outline-none focus:bg-surface-container-lowest transition-colors shadow-sm"
            />
          </div>

          <div className="hidden xl:flex items-center gap-2 bg-surface-container-low px-3.5 py-1.5 rounded-full text-xs font-semibold text-on-surface">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span>Platform Health: 99.98% • All Systems Operational</span>
          </div>
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-1.5 bg-error-container text-on-error-container px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-error hover:text-on-error transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">campaign</span>
            <span>Broadcast Alert</span>
          </button>

          <button
            type="button"
            className="relative p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-container" />
          </button>

          <div className="h-5 w-px bg-surface-container-highest" />

          {/* Profile */}
          <div className="flex items-center gap-2 pl-1">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs shadow-sm">
              MV
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-on-surface leading-tight">Marcus Vance</span>
              <span className="text-[10px] text-on-surface-variant">Head of Platform Ops</span>
            </div>
          </div>
        </div>
      </header>

      {/* Global Alert Notification Banner */}
      {alertBanner && (
        <div className="fixed top-16 left-64 xl:left-72 right-0 z-30 bg-primary text-on-primary px-6 py-2 flex items-center justify-between text-xs font-bold shadow-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">cell_tower</span>
            <span>{alertBanner}</span>
          </div>
          <button onClick={dismissAlert} className="text-white hover:opacity-80">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">campaign</span>
                <span>Fleet-Wide Push Broadcast</span>
              </h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                  Alert Content (Delivered to all Online Drivers & Merchants)
                </label>
                <textarea
                  required
                  rows={3}
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  placeholder="e.g. Heavy rain surge warning in Sector 4: +$3.00 payout bonus active on all deliveries."
                  className="w-full bg-surface-container-low text-on-surface text-xs p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-primary text-on-primary font-bold text-xs shadow-md"
                >
                  Send Push Alert
                </button>
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2.5 rounded-full bg-surface-container text-on-surface font-semibold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
