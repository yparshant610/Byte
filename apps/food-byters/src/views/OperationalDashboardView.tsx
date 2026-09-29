import React from 'react';
import { useMerchant } from '../context/MerchantContext';

export const OperationalDashboardView: React.FC = () => {
  const {
    restaurantName,
    isOpen,
    prepBuffer,
    isRushSurge,
    toggleRushSurge,
    activeOrders,
  } = useMerchant();

  const inKitchenCount = activeOrders.filter(o => o.status === 'PREPARING').length;
  const newIncomingCount = activeOrders.filter(o => o.status === 'PENDING').length;

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* Store Command & Operational Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-surface-container-high">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_pizza
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-on-surface">{restaurantName}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
                  Live Online
                </span>
              </div>
              <p className="text-xs text-on-surface-variant flex items-center gap-2 mt-0.5">
                <span>Downtown Main Flagship</span>
                <span>•</span>
                <span className="text-secondary font-bold">Peak Dinner Rush Preparation</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Prep Buffer Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low text-on-surface">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">timer</span>
              <span className="text-xs font-semibold">Prep Buffer:</span>
              <span className="text-sm font-extrabold text-primary">{prepBuffer}m</span>
            </div>

            {/* Rush Surge Switch */}
            <button
              type="button"
              onClick={toggleRushSurge}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border ${
                isRushSurge
                  ? 'bg-secondary text-white border-secondary shadow-md'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span className="text-xs font-bold">Rush Surge (+10m)</span>
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isRushSurge ? 'bg-amber-300 animate-pulse' : 'bg-surface-container-highest'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Grid (5 core metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Gross Sales */}
        <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Gross Sales</span>
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">payments</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-on-surface tracking-tight">$4,820.50</div>
            <div className="flex items-center gap-1 mt-1 text-tertiary text-xs font-bold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+18.4% vs last Tue</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-surface-container">
            <span className="text-[11px] text-on-surface-variant">Net Food (80%): <strong>$3,856.40</strong></span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Total Orders</span>
            <span className="w-7 h-7 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">receipt</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-on-surface tracking-tight">142</div>
            <p className="text-xs text-on-surface-variant mt-1">
              <strong className="text-on-surface">128</strong> done • <strong className="text-primary">{newIncomingCount + inKitchenCount}</strong> live
            </p>
          </div>
          <div className="mt-2 w-full bg-surface-container rounded-full h-1.5 overflow-hidden flex">
            <div className="bg-tertiary h-full" style={{ width: '85%' }} />
            <div className="bg-primary h-full" style={{ width: '15%' }} />
          </div>
        </div>

        {/* Ticket Size */}
        <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Avg Ticket Size</span>
            <span className="w-7 h-7 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-on-surface tracking-tight">$33.95</div>
            <div className="flex items-center gap-1 mt-1 text-tertiary text-xs font-bold">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              <span>+$2.40 growth</span>
            </div>
          </div>
          <div className="mt-2 text-on-surface-variant text-[11px] flex justify-between">
            <span>Target: $30.00</span>
            <span className="text-tertiary font-bold">113%</span>
          </div>
        </div>

        {/* Kitchen Prep Time */}
        <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Avg Prep Time</span>
            <span className="w-7 h-7 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">avg_pace</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-on-surface tracking-tight">12m 30s</div>
            <div className="flex items-center gap-1 mt-1 text-tertiary text-xs font-bold">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>Healthy (&lt;15m)</span>
            </div>
          </div>
          <div className="mt-2 w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div className="bg-tertiary h-full rounded-full" style={{ width: '70%' }} />
          </div>
        </div>

        {/* CSAT Score */}
        <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Customer CSAT</span>
            <span className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">star</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-on-surface tracking-tight">4.92 / 5</div>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} className="material-symbols-outlined text-[14px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              ))}
              <span className="text-xs font-bold ml-1 text-tertiary">98% positive</span>
            </div>
          </div>
          <div className="mt-2 text-on-surface-variant text-[11px]">
            Based on 94 customer reviews
          </div>
        </div>
      </div>

      {/* Two Column Layout: Kitchen Stations & Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Station Readiness */}
        <div className="lg:col-span-2 rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container-high space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-on-surface">Kitchen Station Workload</h3>
              <p className="text-xs text-on-surface-variant">Live load balancing across line prep stations</p>
            </div>
            <span className="text-xs font-bold text-tertiary bg-tertiary/10 px-2.5 py-1 rounded-full">
              All 4 Stations Operational
            </span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Deck Oven 1 (Artisanal)', items: 4, load: '75%', color: 'bg-primary' },
              { name: 'Deck Oven 2 (High Temp)', items: 3, load: '55%', color: 'bg-secondary' },
              { name: 'Garde Manger & Salads', items: 2, load: '30%', color: 'bg-tertiary' },
              { name: 'Expo Counter & Assembly', items: 2, load: '40%', color: 'bg-tertiary' },
            ].map(station => (
              <div key={station.name} className="bg-surface-container-low p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-on-surface block">{station.name}</span>
                  <span className="text-[11px] text-on-surface-variant">{station.items} active tickets in flight</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${station.color}`} style={{ width: station.load }} />
                  </div>
                  <span className="text-xs font-bold text-on-surface w-8 text-right">{station.load}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Kitchen Feed */}
        <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container-high space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-on-surface">Real-Time Alerts</h3>
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span>Low Inventory Alert</span>
              </div>
              <p>Fresh Fior di Latte Mozzarella stock is at 15%. Consider replenishment.</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface">Driver Rajesh K. Arrived</span>
                <span className="text-[10px] text-on-surface-variant">2m ago</span>
              </div>
              <p className="text-on-surface-variant">Assigned to order #FB-9101 at pickup counter.</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface">80/20 Payout Transferred</span>
                <span className="text-[10px] text-on-surface-variant">10:00 AM</span>
              </div>
              <p className="text-on-surface-variant">$3,528.00 settled to Chase Commercial ••8829.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
