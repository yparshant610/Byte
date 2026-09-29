import React, { useState } from 'react';
import { useAdmin, AdminDriver } from '../context/AdminContext';

export const DriverFleetManagementView: React.FC = () => {
  const { drivers, approveDriverKyc, suspendDriver } = useAdmin();

  const [vehicleFilter, setVehicleFilter] = useState<string>('ALL');
  const [inspectDriver, setInspectDriver] = useState<AdminDriver | null>(null);

  const filtered = drivers.filter(d => {
    if (vehicleFilter === 'ALL') return true;
    return d.vehicleType.toUpperCase() === vehicleFilter.toUpperCase();
  });

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>Operations Core</span>
            <span>/</span>
            <span className="text-primary">Courier Operations</span>
          </div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight">
            Driver Onboarding & Fleet Compliance
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Fleet roster governance, identity verification, background check audits, and performance tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'E-Bike', 'Motorcycle', 'Car'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setVehicleFilter(type)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                vehicleFilter === type
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-surface-container-high'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Table */}
      <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container-high">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-container-low text-on-surface-variant uppercase font-bold text-[11px]">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Courier Name</th>
                <th className="px-4 py-3">Phone & Region</th>
                <th className="px-4 py-3">Vehicle Mode & Plate</th>
                <th className="px-4 py-3">Completed Trips</th>
                <th className="px-4 py-3">Driver Rating</th>
                <th className="px-4 py-3">Duty Status</th>
                <th className="px-4 py-3">KYC Clearance</th>
                <th className="px-4 py-3 rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3.5 font-bold text-on-surface text-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                        {d.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{d.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-on-surface-variant">
                    <div>
                      <span className="font-semibold text-on-surface">{d.phone}</span>
                      <span className="block text-[11px]">{d.zone}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-on-surface block">{d.vehicleType}</span>
                    <span className="text-[11px] text-on-surface-variant font-mono">{d.plate}</span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-on-surface">{d.completedTrips} drops</td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <span className="material-symbols-outlined text-[13px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      {d.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        d.dutyStatus === 'ONLINE'
                          ? 'bg-tertiary/15 text-tertiary'
                          : d.dutyStatus === 'BUSY'
                          ? 'bg-secondary-fixed text-on-secondary-fixed'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {d.dutyStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        d.kycStatus === 'VERIFIED'
                          ? 'bg-tertiary/15 text-tertiary'
                          : d.kycStatus === 'PENDING_AUDIT'
                          ? 'bg-amber-500/15 text-amber-700'
                          : 'bg-error-container text-error'
                      }`}
                    >
                      {d.kycStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setInspectDriver(d)}
                        className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant"
                        title="View KYC Dossier"
                      >
                        <span className="material-symbols-outlined text-[18px]">badge</span>
                      </button>

                      {d.kycStatus === 'PENDING_AUDIT' && (
                        <button
                          onClick={() => approveDriverKyc(d.id)}
                          className="px-2.5 py-1 rounded-full bg-tertiary text-on-tertiary text-[11px] font-bold"
                        >
                          Verify KYC
                        </button>
                      )}

                      {d.kycStatus === 'VERIFIED' && (
                        <button
                          onClick={() => suspendDriver(d.id)}
                          className="p-1 rounded-full hover:bg-error-container text-on-surface-variant hover:text-error"
                          title="Suspend Driver"
                        >
                          <span className="material-symbols-outlined text-[18px]">block</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Dossier Modal */}
      {inspectDriver && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <h3 className="font-black text-base text-on-surface">{inspectDriver.name}</h3>
                <span className="text-xs text-on-surface-variant">{inspectDriver.phone} • {inspectDriver.zone}</span>
              </div>
              <button onClick={() => setInspectDriver(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-surface-container-low space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Registered Vehicle:</span>
                  <span className="font-bold text-on-surface">{inspectDriver.vehicleType} ({inspectDriver.plate})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Total Lifetime Deliveries:</span>
                  <span className="font-bold text-on-surface">{inspectDriver.completedTrips}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Driver Rating:</span>
                  <span className="font-bold text-amber-600">{inspectDriver.rating} / 5.0</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold uppercase text-[11px] text-on-surface">Verified Documents</span>
                <div className="p-2.5 rounded-xl border border-surface-container flex items-center justify-between">
                  <span>Driver's License (Exp: 2028)</span>
                  <span className="text-tertiary font-bold text-[10px]">VERIFIED</span>
                </div>
                <div className="p-2.5 rounded-xl border border-surface-container flex items-center justify-between">
                  <span>Motor Vehicle Insurance Policy</span>
                  <span className="text-tertiary font-bold text-[10px]">ACTIVE</span>
                </div>
                <div className="p-2.5 rounded-xl border border-surface-container flex items-center justify-between">
                  <span>Insulated Thermal Delivery Bag Inspection</span>
                  <span className="text-tertiary font-bold text-[10px]">PASSED</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectDriver(null)}
                className="px-5 py-2.5 rounded-full bg-surface-container text-on-surface font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
