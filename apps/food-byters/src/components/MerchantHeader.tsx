import React from 'react';
import { useMerchant } from '../context/MerchantContext';

interface MerchantHeaderProps {
  onNewItemClick?: () => void;
}

export const MerchantHeader: React.FC<MerchantHeaderProps> = ({ onNewItemClick }) => {
  const {
    isOpen,
    toggleStoreOpen,
    audioChimeEnabled,
    toggleAudioChime,
    triggerIncomingDemoOrder,
    user,
    restaurantName,
    logout,
  } = useMerchant();

  const userInitials = (user?.fullName || 'Tony Romano')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="fixed top-0 left-64 xl:left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-6 border-b border-surface-container-high">
      {/* Left Search & Open State */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container">
          <span
            className={`w-2 h-2 rounded-full ${
              isOpen ? 'bg-tertiary animate-pulse' : 'bg-outline'
            }`}
          />
          <span className="text-xs font-bold text-on-surface">
            {isOpen ? 'Open • Accepting Orders' : 'Store Paused'}
          </span>
          <button
            type="button"
            onClick={toggleStoreOpen}
            className={`w-8 h-4 rounded-full relative cursor-pointer ml-1 flex items-center px-0.5 transition-colors ${
              isOpen ? 'bg-tertiary-container' : 'bg-surface-container-highest'
            }`}
          >
            <div
              className={`w-3 h-3 bg-surface-container-lowest rounded-full shadow-sm transition-transform ${
                isOpen ? 'ml-auto' : 'ml-0'
              }`}
            />
          </button>
        </div>

        <div className="relative w-full max-w-md hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="search"
            placeholder="Search order #, customer, dish, ticket..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant text-xs focus:outline-none focus:bg-surface-container-lowest transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Simulate incoming live order button */}
        <button
          type="button"
          onClick={triggerIncomingDemoOrder}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 font-bold text-xs transition-colors"
          title="Simulate incoming real-time customer order to test KDS + Kitchen chime"
        >
          <span className="material-symbols-outlined text-[16px] animate-bounce">ring_volume</span>
          <span>+ Demo Order</span>
        </button>

        {onNewItemClick && (
          <button
            type="button"
            onClick={onNewItemClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-colors shadow-[0_4px_12px_rgba(187,0,33,0.2)]"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Item</span>
          </button>
        )}

        <button
          type="button"
          onClick={toggleStoreOpen}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] text-secondary">
            {isOpen ? 'pause_circle' : 'play_circle'}
          </span>
          <span>{isOpen ? 'Pause Store' : 'Resume Store'}</span>
        </button>

        <button
          type="button"
          onClick={toggleAudioChime}
          className="relative p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-surface"
          title={audioChimeEnabled ? 'Audio Chime ON' : 'Audio Chime OFF'}
        >
          <span className="material-symbols-outlined text-[20px]">
            {audioChimeEnabled ? 'volume_up' : 'volume_off'}
          </span>
          {audioChimeEnabled && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border border-surface" />
          )}
        </button>

        <div className="h-5 w-px bg-surface-container-highest" />

        {/* Profile & Logout */}
        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden sm:block">
            <p className="font-bold text-xs text-on-surface leading-tight">
              {user?.fullName || 'Tony Romano'}
            </p>
            <p className="text-[10px] text-on-surface-variant truncate max-w-[120px]">
              {restaurantName}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs shadow-sm">
            {userInitials}
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors border border-red-200"
            title="Sign Out of Kitchen Portal"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
