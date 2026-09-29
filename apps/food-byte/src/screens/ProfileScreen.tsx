import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface ProfileScreenProps {
  onReorder: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onReorder, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const isDark = theme === 'dark';

  const pastOrders = [
    {
      id: 'ord_sample_101',
      restaurantName: "Tony's Artisan Pizza",
      items: '2x Margherita Classica (Medium 12")',
      date: 'Today, 7:42 PM',
      total: '$40.12',
      status: 'DELIVERED',
    },
    {
      id: 'ord_sample_098',
      restaurantName: 'The Gourmet Burger Lab',
      items: '1x Double Truffle Smash, 1x Loaded Fries',
      date: 'Yesterday, 8:15 PM',
      total: '$26.49',
      status: 'DELIVERED',
    },
  ];

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  return (
    <div className={`flex flex-col min-h-full pb-10 ${isDark ? 'bg-[#131315]' : 'bg-[#fcf9f8]'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 px-4 py-3 flex items-center justify-between backdrop-blur-xl border-b ${isDark ? 'bg-[#131315]/90 border-white/[0.08]' : 'bg-[#fcf9f8]/90 border-black/[0.04]'}`}>
        <h1 className="font-extrabold text-base">Account & Preferences</h1>
        <button className="text-xs font-bold opacity-60 hover:opacity-100">
          Edit Profile
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* User Card */}
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3.5 shadow-sm ${
            isDark ? 'bg-[#1b1b1d] border-white/10' : 'bg-white border-black/10'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-[#bb0021] dark:bg-[#ff1e38] text-white flex items-center justify-center text-xl font-extrabold shadow-md">
            {user?.name ? user.name[0] : 'A'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base leading-tight">{user?.name || 'Alex Morgan'}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-500 flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px] icon-filled">stars</span>
                Gold
              </span>
            </div>
            <p className="text-xs opacity-60 mt-0.5">{user?.email || 'alex@foodbytes.app'}</p>
            <p className="text-[11px] opacity-40 font-mono mt-0.5">+91 98765 43210</p>
          </div>
        </div>

        {/* Theme Mode Switcher Card */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${
            isDark ? 'bg-[#1b1b1d] border-white/10' : 'bg-white border-black/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-[#bb0021] dark:text-[#ff1e38] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">
                {isDark ? 'dark_mode' : 'light_mode'}
              </span>
            </div>
            <div>
              <h3 className="font-extrabold text-sm">Theme Appearance</h3>
              <p className="text-xs opacity-60">
                {isDark ? 'Midnight Gastronomy (Dark)' : 'Food Bites System (Light)'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-full text-xs font-bold text-white transition-all shadow-md active:scale-95 ${
              isDark ? 'bg-[#ff1e38]' : 'bg-[#bb0021]'
            }`}
          >
            {isDark ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>

        {/* Saved Addresses */}
        <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${isDark ? 'bg-[#1b1b1d] border-white/10' : 'bg-white border-black/10'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-60">Saved Addresses</span>
            <button className="text-xs font-bold text-[#bb0021] dark:text-[#ff1e38]">+ Add New</button>
          </div>

          <div className="flex items-start gap-3 pb-2.5 border-b border-black/5 dark:border-white/5">
            <span className="material-symbols-outlined text-rose-500 text-[20px] mt-0.5">home</span>
            <div className="flex-1">
              <h4 className="font-bold text-xs">Home (Default)</h4>
              <p className="text-[11px] opacity-60">Penthouse 4B, MG Road Boulevard, Bangalore 560001</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-500 text-[20px] mt-0.5">work</span>
            <div className="flex-1">
              <h4 className="font-bold text-xs">Work Office</h4>
              <p className="text-[11px] opacity-60">Byte Tech Tower, 5th Floor, Koramangala 4th Block</p>
            </div>
          </div>
        </div>

        {/* Past Orders History */}
        <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${isDark ? 'bg-[#1b1b1d] border-white/10' : 'bg-white border-black/10'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider opacity-60">Past Orders</span>
            <span className="text-xs opacity-60">Showing recent</span>
          </div>

          {pastOrders.map(order => (
            <div
              key={order.id}
              className="p-3 rounded-xl border border-black/5 dark:border-white/5 flex flex-col gap-1.5 bg-black/[0.02] dark:bg-white/[0.02]"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs">{order.restaurantName}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                  {order.status}
                </span>
              </div>
              <p className="text-[11px] opacity-70">{order.items}</p>
              <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5 text-xs font-bold">
                <span className="opacity-50 text-[10px]">{order.date}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[#bb0021] dark:text-[#ff1e38]">{order.total}</span>
                  <button
                    onClick={onReorder}
                    className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#bb0021] dark:bg-[#ff1e38] text-white active:scale-95"
                  >
                    Reorder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl border border-rose-500/20 text-rose-500 text-xs font-bold hover:bg-rose-500/5 active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Sign Out of Account</span>
        </button>
      </div>
    </div>
  );
};
