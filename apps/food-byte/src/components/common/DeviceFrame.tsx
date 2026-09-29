import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';

interface DeviceFrameProps {
  children: React.ReactNode;
  activeScreen: string;
  setActiveScreen: (screen: any) => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  activeScreen,
  setActiveScreen,
}) => {
  const { theme, toggleTheme, viewportMode, toggleViewportMode } = useTheme();
  const { cart } = useCart();

  const isDark = theme === 'dark';

  const screens = [
    { id: 'auth', label: 'Auth & Onboarding', icon: 'lock' },
    { id: 'home', label: 'Home Feed', icon: 'home' },
    { id: 'explore', label: 'Explore & Search', icon: 'search' },
    { id: 'menu', label: 'Restaurant Menu', icon: 'restaurant_menu' },
    { id: 'cart', label: 'Cart & Checkout', icon: 'shopping_bag', badge: cart?.itemCount },
    { id: 'tracking', label: 'Live Tracking', icon: 'near_me' },
    { id: 'chat', label: 'Courier Chat', icon: 'chat' },
    { id: 'review', label: 'Rating & Feedback', icon: 'star' },
    { id: 'profile', label: 'Profile & Settings', icon: 'person' },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 flex flex-col items-center justify-center ${
        isDark ? 'bg-[#0a0a0c] text-white' : 'bg-[#f4efe9] text-[#1c1b1b]'
      }`}
    >
      {/* Top Floating Control Bar */}
      <header className="w-full max-w-5xl py-3 px-4 flex flex-wrap items-center justify-between gap-3 border-b border-black/5 dark:border-white/10 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#bb0021] dark:bg-[#ff1e38] flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-[18px]">restaurant</span>
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
              <span>FOOD BYTE</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-rose-500/10 text-[#bb0021] dark:text-[#ff1e38] dark:bg-rose-500/20">
                Consumer App (4.1)
              </span>
            </h1>
            <p className="text-[11px] opacity-70">10 Screen Pairs • Light & Dark Modes • Connected to Backend</p>
          </div>
        </div>

        {/* Quick Screen Selector Dropdown & Theme Toggles */}
        <div className="flex items-center gap-2">
          {/* Quick Jump Bar */}
          <div className="hidden md:flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
            {screens.slice(0, 5).map(s => (
              <button
                key={s.id}
                onClick={() => setActiveScreen(s.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  activeScreen === s.id
                    ? 'bg-[#bb0021] dark:bg-[#ff1e38] text-white shadow-sm'
                    : 'hover:bg-black/5 dark:hover:bg-white/10 opacity-80'
                }`}
              >
                <span>{s.label.split(' ')[0]}</span>
                {s.badge ? (
                  <span className="w-4 h-4 rounded-full bg-white text-[#bb0021] text-[10px] flex items-center justify-center font-bold">
                    {s.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {/* Screen Jump Select for Mobile / Compact */}
          <select
            value={activeScreen}
            onChange={e => setActiveScreen(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/20 bg-white/80 dark:bg-white/10 focus:outline-none"
          >
            {screens.map(s => (
              <option key={s.id} value={s.id} className="text-black dark:text-white dark:bg-[#1a1a1d]">
                {s.label}
              </option>
            ))}
          </select>

          {/* Theme Mode Switcher */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10 hover:scale-105 active:scale-95 transition-all shadow-sm"
            title="Toggle between Food Bites (Light) and Midnight Gastronomy (Dark)"
          >
            <span className="material-symbols-outlined text-[16px] text-[#ff1e38]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="hidden sm:inline">{isDark ? 'Midnight Dark' : 'Food Bites Light'}</span>
          </button>

          {/* Viewport Frame Toggle */}
          <button
            onClick={toggleViewportMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/10 hover:scale-105 active:scale-95 transition-all shadow-sm"
            title="Toggle mobile device frame vs responsive full-width"
          >
            <span className="material-symbols-outlined text-[16px]">
              {viewportMode === 'mobile-frame' ? 'smartphone' : 'fit_screen'}
            </span>
            <span className="hidden sm:inline">{viewportMode === 'mobile-frame' ? 'Phone Frame' : 'Full Width'}</span>
          </button>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="w-full flex-1 flex items-center justify-center p-0 sm:p-4">
        {viewportMode === 'mobile-frame' ? (
          /* Realistic Smartphone Bezel Container (390px x 844px) */
          <div className="relative w-full max-w-[390px] h-[854px] rounded-[3.25rem] bg-[#1a1a1e] p-[10px] shadow-[0_25px_70px_rgba(0,0,0,0.45)] ring-1 ring-white/20 overflow-hidden flex flex-col">
            {/* Outer Rim Details & Side Buttons */}
            <div className="absolute -left-[14px] top-28 w-[4px] h-12 bg-[#2d2d34] rounded-l-md" />
            <div className="absolute -left-[14px] top-44 w-[4px] h-12 bg-[#2d2d34] rounded-l-md" />
            <div className="absolute -right-[14px] top-36 w-[4px] h-16 bg-[#2d2d34] rounded-r-md" />

            {/* Inner Phone Screen Display */}
            <div
              className={`relative w-full h-full rounded-[2.6rem] overflow-hidden flex flex-col ${
                isDark ? 'bg-[#131315] text-[#fcf9f8]' : 'bg-[#fcf9f8] text-[#1c1b1b]'
              }`}
            >
              {/* Dynamic Island & Status Bar */}
              <div className="w-full h-11 px-7 flex items-center justify-between z-50 pointer-events-none select-none">
                <span className="text-xs font-bold tracking-tight">9:41</span>
                {/* Dynamic Island Pill */}
                <div className="w-24 h-5 rounded-full bg-black flex items-center justify-center gap-1.5 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-black ring-1 ring-white/10" />
                  <div className="w-2 h-2 rounded-full bg-[#1c1c1f]" />
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="material-symbols-outlined text-[14px]">signal_cellular_4_bar</span>
                  <span className="material-symbols-outlined text-[14px]">wifi</span>
                  <span className="material-symbols-outlined text-[16px]">battery_5_bar</span>
                </div>
              </div>

              {/* Screen Content Container with Smooth Scrolling */}
              <div className="flex-1 w-full overflow-y-auto no-scrollbar relative flex flex-col">
                {children}
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="w-full h-6 flex items-center justify-center z-50 pointer-events-none bg-transparent">
                <div
                  className={`w-36 h-1 rounded-full ${isDark ? 'bg-white/40' : 'bg-black/30'}`}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Full Responsive Mode */
          <div
            className={`w-full max-w-4xl min-h-[850px] rounded-3xl shadow-xl border overflow-hidden flex flex-col ${
              isDark ? 'bg-[#131315] text-[#fcf9f8] border-white/10' : 'bg-[#fcf9f8] text-[#1c1b1b] border-black/10'
            }`}
          >
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
