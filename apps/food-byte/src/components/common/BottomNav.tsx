import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';

interface BottomNavProps {
  activeScreen: string;
  setActiveScreen: (screen: any) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  const { theme } = useTheme();
  const { cart } = useCart();
  const isDark = theme === 'dark';

  const navItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'explore', label: 'Explore', icon: 'search' },
    { id: 'cart', label: 'Cart', icon: 'shopping_bag', badge: cart?.itemCount },
    { id: 'tracking', label: 'Orders', icon: 'receipt_long' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav
      className={`sticky bottom-0 w-full z-40 backdrop-blur-xl border-t transition-colors duration-200 ${
        isDark
          ? 'bg-[#131315]/95 border-white/[0.08]'
          : 'bg-[#fcf9f8]/95 border-black/[0.06] shadow-[0_-2px_12px_rgba(0,0,0,0.03)]'
      }`}
    >
      <div className="h-16 px-4 flex items-center justify-around">
        {navItems.map(item => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-all relative flex-1 py-1 active:scale-90 ${
                isActive
                  ? isDark
                    ? 'text-[#ff1e38]'
                    : 'text-[#bb0021]'
                  : isDark
                  ? 'text-[#a0a0a5] hover:text-[#fcf9f8]'
                  : 'text-[#5e3f3d] hover:text-[#1c1b1b]'
              }`}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[24px] ${isActive ? 'icon-filled' : ''}`}
                >
                  {item.icon}
                </span>
                {item.badge ? (
                  <span
                    className={`absolute -top-1 -right-2 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${
                      isDark ? 'bg-[#ff1e38]' : 'bg-[#bb0021]'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'font-extrabold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
