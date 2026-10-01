import React from 'react';
import { useMerchant } from '../context/MerchantContext';

interface MerchantSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MerchantSidebar: React.FC<MerchantSidebarProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const { restaurantName, activeOrders, isOpen, logout } = useMerchant();

  const pendingCount = activeOrders.filter(o => o.status === 'PENDING').length;
  const inKitchenCount = activeOrders.filter(o => o.status === 'PREPARING').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    {
      id: 'kds',
      label: 'Live Orders & KDS',
      icon: 'soup_kitchen',
      badge: pendingCount + inKitchenCount,
      badgeColor: 'bg-primary text-on-primary',
    },
    { id: 'history', label: 'Order History & Logs', icon: 'receipt_long' },
    { id: 'menu', label: 'Menu & Inventory', icon: 'restaurant_menu' },
    { id: 'payouts', label: 'Payouts & Financials', icon: 'account_balance_wallet' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications', dot: true },
    { id: 'support', label: 'Support & Queries', icon: 'support_agent' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 xl:w-72 bg-surface-container-lowest shadow-[0_1px_12px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between pt-5 pb-6 border-r border-surface-container-high">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="px-6 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-black text-sm shadow-md">
              FB
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-on-surface leading-tight">Food Byters</span>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Merchant Partner
              </span>
            </div>
          </div>
        </div>

        {/* Live Store Pill */}
        <div className="px-4 py-2">
          <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOpen ? 'bg-tertiary animate-pulse' : 'bg-outline'
                }`}
              />
              <div>
                <p className="font-bold text-xs text-on-surface leading-tight truncate max-w-[130px]">
                  {restaurantName}
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  {isOpen ? 'Kitchen Live • Active' : 'Store Offline'}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">store</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 px-4 mt-3">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all font-semibold text-xs text-left ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container shadow-sm font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-primary text-white'}`}>
                    {item.badge}
                  </span>
                )}
                {item.dot && <span className="w-2 h-2 rounded-full bg-primary" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="px-4 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => setCurrentTab('menu')}
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>Store Settings</span>
        </button>

        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors w-full"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Sign Out / Log Out</span>
        </button>

        <div className="pt-2 border-t border-surface-container-high">
          <div className="bg-surface-container-low p-2.5 rounded-xl flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-on-surface">POS Synced</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-tertiary">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              99.9% Uptime
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
