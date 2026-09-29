import React, { useState } from 'react';
import { useMerchant, KdsOrder } from '../context/MerchantContext';

export const LiveKitchenKdsView: React.FC = () => {
  const {
    activeOrders,
    acceptOrder,
    declineOrder,
    markOrderReady,
    autoAccept,
    toggleAutoAccept,
    audioChimeEnabled,
    toggleAudioChime,
  } = useMerchant();

  const [selectedOrder, setSelectedOrder] = useState<KdsOrder | null>(
    activeOrders[0] || null
  );
  const [stationFilter, setStationFilter] = useState<string>('all');

  const incomingOrders = activeOrders.filter(o => o.status === 'PENDING');
  const preparingOrders = activeOrders.filter(o => o.status === 'PREPARING');
  const readyOrders = activeOrders.filter(o => o.status === 'READY_FOR_PICKUP');

  return (
    <div className="flex flex-col w-full gap-5 pb-12">
      {/* Top Controls Bar */}
      <section className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Active Pipeline Badge */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-primary-container text-on-primary-container shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-surface-container-lowest animate-ping" />
            <span className="text-base font-extrabold leading-none">{activeOrders.length}</span>
            <span className="text-xs font-bold uppercase tracking-wider">Live Pipeline</span>
          </div>

          {/* Rush Mode Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container">
            <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
            <span className="text-xs font-bold">Rush Mode Active</span>
          </div>

          {/* Station Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {[
              { id: 'all', label: `All Stations (${activeOrders.length})` },
              { id: 'oven1', label: 'Pizza Deck Oven (4)' },
              { id: 'oven2', label: 'Rotary Deck (3)' },
              { id: 'cold', label: 'Salad & Apps (2)' },
              { id: 'expo', label: 'Expo Counter (2)' },
            ].map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStationFilter(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  stationFilter === s.id
                    ? 'bg-on-surface text-surface shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 self-end xl:self-auto">
          {/* Auto Accept Switch */}
          <button
            type="button"
            onClick={toggleAutoAccept}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              autoAccept
                ? 'bg-tertiary/10 text-tertiary border-tertiary/30'
                : 'bg-surface-container text-on-surface-variant border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {autoAccept ? 'check_circle' : 'radio_button_unchecked'}
            </span>
            <span>Auto-Accept</span>
          </button>

          {/* Chime Switch */}
          <button
            type="button"
            onClick={toggleAudioChime}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
              audioChimeEnabled
                ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {audioChimeEnabled ? 'notifications_active' : 'notifications_off'}
            </span>
            <span>Chime: {audioChimeEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </section>

      {/* Main KDS Grid Layout: Kanban Columns (8 cols) + Detail Drawer (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Kanban 3-Column Board */}
        <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* COLUMN 1: NEW INCOMING */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between bg-surface-container-low px-3.5 py-2.5 rounded-xl border border-surface-container">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-extrabold text-on-surface">New Incoming</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-xs font-bold">
                {incomingOrders.length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {incomingOrders.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-xl p-6 text-center text-xs text-on-surface-variant border border-dashed border-surface-container-highest">
                  No new orders waiting. Click "+ Demo Order" to trigger incoming ticket.
                </div>
              ) : (
                incomingOrders.map(order => {
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm relative cursor-pointer hover:shadow-md transition-all border ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-surface-container-high'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface text-xs font-bold">
                            {order.orderNumber}
                          </span>
                          <span className="text-[11px] text-on-surface-variant">{order.placedAt}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">timer</span>
                          <span>{order.rejectSecondsLeft || 45}s</span>
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-1 my-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="font-bold text-on-surface">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-on-surface-variant">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {order.specialInstructions && (
                        <div className="bg-surface-container-low rounded-lg p-2 my-2 flex items-start gap-1.5 text-xs text-secondary">
                          <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5">sticky_note_2</span>
                          <p className="italic line-clamp-2">"{order.specialInstructions}"</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-2 border-t border-surface-container">
                        <span>{order.orderType} • {order.customerName}</span>
                        <span className="text-xs font-bold text-on-surface">${order.totalAmount.toFixed(2)}</span>
                      </div>

                      {/* Action CTAs */}
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-surface-container-high">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            acceptOrder(order.id, 15);
                          }}
                          className="col-span-2 py-2 rounded-full bg-primary text-on-primary font-bold text-xs hover:bg-primary-container shadow-md flex items-center justify-center gap-1 active:scale-95 transition-all"
                        >
                          <span className="material-symbols-outlined text-[15px]">check_circle</span>
                          <span>Accept (15m)</span>
                        </button>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            declineOrder(order.id);
                          }}
                          className="py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:text-error hover:bg-error-container font-bold text-xs transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* COLUMN 2: IN KITCHEN PREPARING */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between bg-surface-container-low px-3.5 py-2.5 rounded-xl border border-surface-container">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-sm font-extrabold text-on-surface">Kitchen Prep</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                {preparingOrders.length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {preparingOrders.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-xl p-6 text-center text-xs text-on-surface-variant border border-dashed border-surface-container-highest">
                  No orders currently in the oven.
                </div>
              ) : (
                preparingOrders.map(order => {
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm relative cursor-pointer hover:shadow-md transition-all border ${
                        isSelected
                          ? 'border-secondary ring-2 ring-secondary/20'
                          : 'border-surface-container-high'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                          {order.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[11px] font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-secondary">mode_heat</span>
                          <span>Prep: {order.prepMinutes}m</span>
                        </span>
                      </div>

                      <div className="space-y-1 my-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="font-bold text-on-surface">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-on-surface-variant">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {order.specialInstructions && (
                        <p className="text-[11px] text-secondary italic bg-surface-container-low p-2 rounded-lg my-1">
                          "{order.specialInstructions}"
                        </p>
                      )}

                      <div className="mt-3 pt-2 border-t border-surface-container-high">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            markOrderReady(order.id);
                          }}
                          className="w-full py-2 rounded-full bg-tertiary text-on-tertiary font-bold text-xs hover:opacity-90 shadow-sm flex items-center justify-center gap-1 active:scale-95 transition-all"
                        >
                          <span className="material-symbols-outlined text-[15px]">done_all</span>
                          <span>Mark Ready on Expo</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* COLUMN 3: READY FOR PICKUP / EXPO */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between bg-surface-container-low px-3.5 py-2.5 rounded-xl border border-surface-container">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse" />
                <span className="text-sm font-extrabold text-on-surface">Ready on Expo</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-bold">
                {readyOrders.length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {readyOrders.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-xl p-6 text-center text-xs text-on-surface-variant border border-dashed border-surface-container-highest">
                  No orders waiting for courier pickup.
                </div>
              ) : (
                readyOrders.map(order => {
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm relative cursor-pointer hover:shadow-md transition-all border ${
                        isSelected
                          ? 'border-tertiary ring-2 ring-tertiary/20'
                          : 'border-surface-container-high'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">
                          {order.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[11px] font-bold">
                          Bagged & Sealed
                        </span>
                      </div>

                      <div className="space-y-1 my-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="font-bold text-on-surface">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-on-surface-variant">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Driver Status */}
                      <div className="mt-2.5 p-2 rounded-lg bg-surface-container-low flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-on-surface">
                          <span className="material-symbols-outlined text-primary text-[16px]">two_wheeler</span>
                          <span className="font-bold">Driver Rajesh K.</span>
                        </div>
                        <span className="text-[10px] font-bold text-tertiary">At Counter</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* DETAIL INSPECTOR DRAWER (4 cols on XL) */}
        <div className="xl:col-span-4 bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container-high space-y-4 sticky top-20">
          {selectedOrder ? (
            <>
              <div className="flex items-center justify-between border-b border-surface-container pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-on-surface">{selectedOrder.orderNumber}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {selectedOrder.status}
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant">Customer: {selectedOrder.customerName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface"
                  title="Print Kitchen Ticket"
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                </button>
              </div>

              {/* Items Detail */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
                  Kitchen Ticket Details
                </span>
                <div className="space-y-2 bg-surface-container-low p-3.5 rounded-xl">
                  {selectedOrder.items.map((it, i) => (
                    <div key={i} className="flex justify-between items-start text-xs border-b border-surface-container-high/50 pb-2 last:border-b-0 last:pb-0">
                      <div>
                        <span className="font-extrabold text-on-surface">{it.quantity}x {it.name}</span>
                        {it.notes && <p className="text-[11px] text-on-surface-variant mt-0.5">{it.notes}</p>}
                      </div>
                      <span className="font-bold text-on-surface">${it.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.specialInstructions && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                    <span>Chef Notes / Instructions</span>
                  </div>
                  <p className="italic">"{selectedOrder.specialInstructions}"</p>
                </div>
              )}

              {/* Payout & Bill Breakdown */}
              <div className="bg-surface-container-low p-3.5 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Gross Order Value</span>
                  <span className="font-semibold">${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Platform Commission (20%)</span>
                  <span className="font-semibold text-error">-${(selectedOrder.totalAmount * 0.20).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-surface pt-1.5 border-t border-surface-container font-bold text-sm">
                  <span>Merchant Net Food (80%)</span>
                  <span className="text-tertiary">${(selectedOrder.totalAmount * 0.80).toFixed(2)}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 pt-2">
                {selectedOrder.status === 'PENDING' && (
                  <button
                    type="button"
                    onClick={() => acceptOrder(selectedOrder.id, 15)}
                    className="w-full py-3 rounded-full bg-primary text-on-primary font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Accept Order (15 min)</span>
                  </button>
                )}

                {selectedOrder.status === 'PREPARING' && (
                  <button
                    type="button"
                    onClick={() => markOrderReady(selectedOrder.id)}
                    className="w-full py-3 rounded-full bg-tertiary text-on-tertiary font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">done_all</span>
                    <span>Mark Ready for Pickup</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-xs text-on-surface-variant">
              Select an order from the Kanban columns to inspect ticket details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
