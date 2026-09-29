import React, { useState } from 'react';
import { useAdmin, LiveFleetMarker } from '../context/AdminContext';

export const DeliveryActivityMonitorView: React.FC = () => {
  const { fleetMarkers, simulateFleetReroute, activeZone, setActiveZone } = useAdmin();
  const [selectedMarker, setSelectedMarker] = useState<LiveFleetMarker | null>(fleetMarkers[0]);

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* Telemetry Header */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high">
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-ping" />
                Live GPS Polling • 5s Pulse
              </span>
              <span className="text-on-surface-variant text-xs">| Latency: 28ms</span>
            </div>
            <h1 className="text-2xl font-black text-on-surface tracking-tight">
              Live Delivery Activity & Dispatch Radar
            </h1>
            <p className="text-xs text-on-surface-variant">
              Real-time telemetry of 186 active couriers, 42 live in-flight orders, geofence heatmaps, and platform transit SLAs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={activeZone}
              onChange={e => setActiveZone(e.target.value)}
              className="bg-surface-container-low text-on-surface text-xs font-bold px-4 py-2.5 rounded-full shadow-sm outline-none cursor-pointer"
            >
              <option value="all">Zone: All Metropolitan</option>
              <option value="downtown">Zone: Downtown Core</option>
              <option value="westside">Zone: Westside Campus</option>
              <option value="northbay">Zone: North Bay Waterfront</option>
            </select>

            <button
              type="button"
              onClick={simulateFleetReroute}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">alt_route</span>
              <span>Simulate Re-routing</span>
            </button>
          </div>
        </div>

        {/* Telemetry Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                Active In-Transit
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-on-surface">42</span>
                <span className="text-xs font-bold text-tertiary">orders</span>
              </div>
              <span className="text-[11px] text-on-surface-variant mt-1 block">Avg ETA: 18.4 mins (Normal)</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">moped</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                Online Couriers
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-on-surface">186</span>
                <span className="text-xs font-bold text-tertiary">84% load</span>
              </div>
              <span className="text-[11px] text-on-surface-variant mt-1 block">156 active / 30 ready</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[20px]">sports_motorsports</span>
            </div>
          </div>

          <div className="bg-error-container/20 p-4 rounded-2xl shadow-sm border border-error-container flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-error uppercase tracking-wider block">
                Delayed Orders (&gt;30m)
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-error">1</span>
                <span className="text-xs font-bold text-error">Action Needed</span>
              </div>
              <span className="text-[11px] text-error font-medium mt-1 block">Auto re-route offered</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
                Platform Transit SLA
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-tertiary">96.8%</span>
                <span className="text-xs font-bold text-tertiary">▲ +0.4%</span>
              </div>
              <span className="text-[11px] text-on-surface-variant mt-1 block">On-time fulfillment today</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Map + Side Feed Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Interactive Vector GIS Map (8 cols) */}
        <div className="xl:col-span-8 bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <h3 className="font-extrabold text-sm text-on-surface">Metropolitan Telemetry Grid</h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary" /> En Route
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary" /> Picked Up
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-tertiary" /> Idle / Standby
              </span>
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full h-[480px] bg-[#121318] rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
            {/* Ambient Map Grids */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#222430" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Major Arterial Roads */}
              <path d="M 0 160 Q 240 180, 480 140 T 960 200" fill="none" stroke="#2e3144" strokeWidth="6" />
              <path d="M 280 0 L 320 480" fill="none" stroke="#2e3144" strokeWidth="5" />
              <path d="M 640 0 Q 600 240, 680 480" fill="none" stroke="#2e3144" strokeWidth="4" />

              {/* Active Delivery Route Polyline */}
              <path
                d="M 200 240 L 360 210 L 480 290 L 620 230"
                fill="none"
                stroke="#bb0021"
                strokeWidth="3.5"
                strokeDasharray="6,4"
                className="animate-pulse"
              />

              {/* Restaurant Hub Center */}
              <circle cx="200" cy="240" r="16" fill="#bb0021" fillOpacity="0.2" />
              <circle cx="200" cy="240" r="6" fill="#bb0021" />

              {/* Customer Drop Pin */}
              <circle cx="620" cy="230" r="14" fill="#008379" fillOpacity="0.25" />
              <circle cx="620" cy="230" r="5" fill="#008379" />
            </svg>

            {/* Positioned Driver Markers */}
            <div className="absolute inset-0 pointer-events-auto">
              {fleetMarkers.map((marker, index) => {
                const isSelected = selectedMarker?.id === marker.id;
                // Scatter positions across canvas
                const leftPositions = ['28%', '45%', '65%', '78%'];
                const topPositions = ['42%', '36%', '58%', '30%'];
                return (
                  <div
                    key={marker.id}
                    onClick={() => setSelectedMarker(marker)}
                    style={{ left: leftPositions[index], top: topPositions[index] }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'
                    }`}
                  >
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-xl ${
                          marker.isDelayed
                            ? 'bg-error ring-4 ring-error/30 animate-bounce'
                            : marker.status === 'EN_ROUTE'
                            ? 'bg-primary ring-4 ring-primary/30'
                            : marker.status === 'PICKED_UP'
                            ? 'bg-secondary ring-4 ring-secondary/30'
                            : 'bg-tertiary ring-4 ring-tertiary/30'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">sports_motorsports</span>
                      </div>
                      <span className="mt-1 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white whitespace-nowrap shadow">
                        {marker.etaMins}m • {marker.orderNumber}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Trip Inspector Panel (4 cols) */}
        <div className="xl:col-span-4 bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container-high space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <h3 className="font-extrabold text-sm text-on-surface">Trip Telemetry Inspector</h3>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
              Live Stream
            </span>
          </div>

          {selectedMarker ? (
            <div className="space-y-3.5 text-xs">
              <div className="bg-surface-container-low p-3.5 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-sm text-on-surface">{selectedMarker.driverName}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedMarker.isDelayed ? 'bg-error text-white' : 'bg-tertiary text-white'
                    }`}
                  >
                    {selectedMarker.status}
                  </span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Assigned Order:</span>
                  <strong className="text-on-surface">{selectedMarker.orderNumber}</strong>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Target SLA ETA:</span>
                  <strong className={selectedMarker.isDelayed ? 'text-error' : 'text-tertiary'}>
                    {selectedMarker.etaMins} minutes
                  </strong>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Coordinates:</span>
                  <span>{selectedMarker.lat}, {selectedMarker.lng}</span>
                </div>
              </div>

              {selectedMarker.isDelayed && (
                <div className="p-3 rounded-xl bg-error-container/30 border border-error/20 text-error space-y-1">
                  <div className="flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    <span>Transit SLA Breached (+12 mins)</span>
                  </div>
                  <p className="text-[11px]">
                    Heavy traffic detected along MG Road connector. Priority dynamic re-routing ready.
                  </p>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={simulateFleetReroute}
                  className="w-full py-2.5 rounded-full bg-primary text-on-primary font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">alt_route</span>
                  <span>Deploy Instant Dynamic Re-Route</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant text-center py-6">
              Click a driver marker on the radar map to view telemetry.
            </p>
          )}

          {/* Quick Roster Mini Feed */}
          <div className="space-y-2 pt-2 border-t border-surface-container">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block">
              Active In-Flight Roster
            </span>
            <div className="space-y-2">
              {fleetMarkers.map(m => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMarker(m)}
                  className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors ${
                    selectedMarker?.id === m.id
                      ? 'bg-primary-container text-on-primary-container font-bold'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
                    <span>{m.driverName.split(' ')[0]} • {m.orderNumber}</span>
                  </div>
                  <span>{m.etaMins}m ETA</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
