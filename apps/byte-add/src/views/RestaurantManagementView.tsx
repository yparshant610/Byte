import React, { useState } from 'react';
import { useAdmin, AdminMerchant } from '../context/AdminContext';

export const RestaurantManagementView: React.FC = () => {
  const { merchants, approveMerchant, suspendMerchant, updateCommissionRate } = useAdmin();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inspectMerchant, setInspectMerchant] = useState<AdminMerchant | null>(null);
  const [editingCommissionId, setEditingCommissionId] = useState<string | null>(null);
  const [tempRate, setTempRate] = useState<number>(20);

  const filtered = merchants.filter(m => {
    const matchFilter = filterStatus === 'ALL' || m.status === filterStatus;
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>Operations Core</span>
            <span>/</span>
            <span className="text-primary">Network Governance</span>
          </div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight">
            Restaurant Network & Merchant Governance
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5 max-w-3xl">
            Audit 342 active merchant partners, review pending onboardings, configure commission take-rates, and enforce hygiene compliance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container-lowest hover:bg-surface-container text-xs font-bold text-on-surface shadow-sm border border-surface-container-high"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export Directory</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Active Merchants</span>
            <span className="material-symbols-outlined text-primary text-[20px]">store</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-on-surface">342</span>
            <span className="text-xs font-bold text-tertiary flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +12 this wk
            </span>
          </div>
          <div className="mt-2 w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Pending Verification</span>
            <span className="px-2 py-0.5 rounded-full bg-error-container text-error text-[10px] font-bold uppercase animate-pulse">
              Action Req
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-error">8</span>
            <span className="text-xs font-semibold text-on-surface-variant">Awaiting KYC/Audit</span>
          </div>
          <div className="mt-2 text-[11px] text-on-surface-variant flex justify-between">
            <span>Target turnaround: &lt; 24h</span>
            <span className="text-error font-bold">3 over SLA</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Avg Store Rating</span>
            <span className="material-symbols-outlined text-amber-500 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-on-surface">4.78</span>
            <div className="flex text-amber-500 items-center text-xs">
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              ))}
            </div>
          </div>
          <div className="mt-2 text-[11px] text-on-surface-variant">Across 94,120 customer reviews</div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">30D Churn Rate</span>
            <span className="material-symbols-outlined text-outline text-[20px]">shield_with_heart</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-on-surface">0.6%</span>
            <span className="text-xs font-semibold text-on-surface-variant">(2 flagged stores)</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-tertiary font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
            <span>99.4% Platform retention index</span>
          </div>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {[
            { id: 'ALL', label: `All Merchants (${merchants.length})` },
            { id: 'PENDING', label: `Pending Approval (${merchants.filter(m => m.status === 'PENDING').length})` },
            { id: 'ACTIVE', label: `Active Live (${merchants.filter(m => m.status === 'ACTIVE').length})` },
            { id: 'SUSPENDED', label: `Suspended (${merchants.filter(m => m.status === 'SUSPENDED').length})` },
          ].map(pill => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setFilterStatus(pill.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filterStatus === pill.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search restaurant or owner..."
            className="w-full pl-9 pr-3 py-1.5 rounded-full bg-surface-container-low text-xs text-on-surface placeholder:text-on-surface-variant outline-none focus:bg-surface-container-lowest transition-colors"
          />
        </div>
      </div>

      {/* Merchants Table */}
      <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container-high">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-container-low text-on-surface-variant uppercase font-bold text-[11px]">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Restaurant & Cuisine</th>
                <th className="px-4 py-3">Hub Location</th>
                <th className="px-4 py-3">Owner / Partner</th>
                <th className="px-4 py-3">30D Orders</th>
                <th className="px-4 py-3">30D GMV</th>
                <th className="px-4 py-3">Take Rate</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3.5">
                    <div>
                      <span className="font-extrabold text-on-surface text-sm block">{m.name}</span>
                      <span className="text-[11px] text-on-surface-variant">{m.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-on-surface-variant">{m.location}</td>
                  <td className="px-4 py-3.5 font-semibold text-on-surface">{m.ownerName}</td>
                  <td className="px-4 py-3.5 font-bold text-on-surface">{m.ordersCount30d}</td>
                  <td className="px-4 py-3.5 font-extrabold text-on-surface">${m.gmv30d.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    {editingCommissionId === m.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={tempRate}
                          onChange={e => setTempRate(parseInt(e.target.value) || 20)}
                          className="w-14 px-2 py-0.5 rounded border border-primary text-xs font-bold"
                        />
                        <button
                          onClick={() => {
                            updateCommissionRate(m.id, tempRate);
                            setEditingCommissionId(null);
                          }}
                          className="text-tertiary font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingCommissionId(m.id);
                          setTempRate(m.commissionRate);
                        }}
                        className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-container-high"
                        title="Click to edit take rate"
                      >
                        {m.commissionRate}%
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <span className="material-symbols-outlined text-[13px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      {m.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        m.status === 'ACTIVE'
                          ? 'bg-tertiary/15 text-tertiary'
                          : m.status === 'PENDING'
                          ? 'bg-amber-500/15 text-amber-700'
                          : 'bg-error-container text-error'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setInspectMerchant(m)}
                        className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
                        title="Inspect Dossier"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>

                      {m.status === 'PENDING' && (
                        <button
                          onClick={() => approveMerchant(m.id)}
                          className="px-2.5 py-1 rounded-full bg-tertiary text-on-tertiary text-[11px] font-bold hover:opacity-90 shadow-sm"
                        >
                          Approve
                        </button>
                      )}

                      {m.status === 'ACTIVE' && (
                        <button
                          onClick={() => suspendMerchant(m.id)}
                          className="p-1 rounded-full hover:bg-error-container text-on-surface-variant hover:text-error"
                          title="Suspend Merchant"
                        >
                          <span className="material-symbols-outlined text-[18px]">block</span>
                        </button>
                      )}

                      {m.status === 'SUSPENDED' && (
                        <button
                          onClick={() => approveMerchant(m.id)}
                          className="px-2.5 py-1 rounded-full bg-tertiary text-on-tertiary text-[11px] font-bold hover:opacity-90"
                        >
                          Reinstate
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

      {/* Dossier Inspection Modal */}
      {inspectMerchant && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <h3 className="font-black text-lg text-on-surface">{inspectMerchant.name}</h3>
                <span className="text-xs text-on-surface-variant">{inspectMerchant.category} • Joined {inspectMerchant.joinedDate}</span>
              </div>
              <button onClick={() => setInspectMerchant(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-surface-container-low p-3 rounded-xl">
                <div>
                  <span className="text-[11px] text-on-surface-variant uppercase font-bold block">Operator Owner</span>
                  <span className="font-extrabold text-on-surface text-sm">{inspectMerchant.ownerName}</span>
                </div>
                <div>
                  <span className="text-[11px] text-on-surface-variant uppercase font-bold block">Hub Territory</span>
                  <span className="font-extrabold text-on-surface text-sm">{inspectMerchant.location}</span>
                </div>
                <div>
                  <span className="text-[11px] text-on-surface-variant uppercase font-bold block">Commission Take Rate</span>
                  <span className="font-extrabold text-primary text-sm">{inspectMerchant.commissionRate}% Contract</span>
                </div>
                <div>
                  <span className="text-[11px] text-on-surface-variant uppercase font-bold block">Food Safety & Hygiene Score</span>
                  <span className="font-extrabold text-tertiary text-sm">Grade A (98/100)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-on-surface uppercase text-[11px]">Compliance Documents</span>
                <div className="p-2.5 rounded-xl border border-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
                    <span>City Health Dept Operating Permit 2026</span>
                  </div>
                  <span className="text-tertiary font-bold text-[10px] uppercase">Active Valid</span>
                </div>
                <div className="p-2.5 rounded-xl border border-surface-container flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
                    <span>Razorpay Multi-Split Merchant Linked Account</span>
                  </div>
                  <span className="text-tertiary font-bold text-[10px] uppercase">Route Linked</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInspectMerchant(null)}
                className="px-5 py-2.5 rounded-full bg-surface-container text-on-surface font-bold text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
