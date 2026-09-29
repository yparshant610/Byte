import React from 'react';
import { useAdmin } from '../context/AdminContext';

interface AdminSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const { disputes, merchants, drivers } = useAdmin();

  const openDisputesCount = disputes.filter(d => d.status === 'OPEN').length;
  const pendingMerchantsCount = merchants.filter(m => m.status === 'PENDING').length;
  const pendingDriversCount = drivers.filter(d => d.kycStatus === 'PENDING_AUDIT').length;

  const coreNav = [
    {
      id: 'restaurants',
      label: 'Restaurant Management',
      icon: 'storefront',
      badge: pendingMerchantsCount > 0 ? pendingMerchantsCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'telemetry',
      label: 'Delivery Activity & Radar',
      icon: 'radar',
      badge: 42,
      badgeColor: 'bg-primary text-white',
    },
    {
      id: 'fleet',
      label: 'Driver Onboarding & Fleet',
      icon: 'two_wheeler',
      badge: pendingDriversCount > 0 ? pendingDriversCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'disputes',
      label: 'Dispute & Arbitration',
      icon: 'balance',
      badge: openDisputesCount > 0 ? openDisputesCount : undefined,
      badgeColor: 'bg-error text-white',
    },
    {
      id: 'commissions',
      label: 'Commission & Financials',
      icon: 'payments',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 xl:w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between py-6 border-r border-surface-container-high">
      <div className="flex flex-col gap-4">
        {/* Brand */}
        <div className="px-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-black text-sm shadow-md">
            BA
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base text-primary tracking-tight">Byte Add</span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Ops & Master Admin
            </span>
          </div>
        </div>

        {/* Section 1: Operations Core */}
        <div className="px-5 pt-2">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">
            Operations Core
          </span>
          <nav className="flex flex-col gap-1">
            {coreNav.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-full transition-all text-xs font-semibold text-left ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container shadow-sm font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section 2: Platform Governance */}
        <div className="px-5 pt-2">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">
            Platform Governance
          </span>
          <nav className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setCurrentTab('telemetry')}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container text-left"
            >
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              <span>System Logs & Audit</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('commissions')}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container text-left"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              <span>Admin Settings</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Gateway Status Badge */}
      <div className="px-5">
        <div className="bg-surface-container-low rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <div>
              <span className="text-xs font-bold text-on-surface block leading-none">Ops Gateway</span>
              <span className="text-[10px] text-on-surface-variant">v4.18.2 Stable Live</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-tertiary text-[18px]">verified_user</span>
        </div>
      </div>
    </aside>
  );
};
