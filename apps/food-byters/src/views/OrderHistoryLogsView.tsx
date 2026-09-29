import React, { useState } from 'react';

export const OrderHistoryLogsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const historyOrders = [
    {
      id: 'FB-9098',
      date: 'Today, 12:45 PM',
      customer: 'Carlos Mendez',
      items: '2x Margherita D.O.P, 1x Tiramisu',
      total: 44.50,
      payout: 35.60,
      driver: 'Rajesh K. (KA 01 EQ 4402)',
      status: 'DELIVERED',
      rating: 5.0,
    },
    {
      id: 'FB-9095',
      date: 'Today, 11:30 AM',
      customer: 'Anita Desai',
      items: '1x Diavola Pepperoni Crunch',
      total: 19.50,
      payout: 15.60,
      driver: 'Vikram S.',
      status: 'DELIVERED',
      rating: 4.8,
    },
    {
      id: 'FB-9091',
      date: 'Yesterday, 9:15 PM',
      customer: 'Johnathan Wright',
      items: '3x Double Truffle Funghi, 2x Salad',
      total: 82.00,
      payout: 65.60,
      driver: 'Rajesh K.',
      status: 'DELIVERED',
      rating: 5.0,
    },
    {
      id: 'FB-9088',
      date: 'Yesterday, 7:20 PM',
      customer: 'Pooja Iyer',
      items: '1x Margherita D.O.P',
      total: 16.50,
      payout: 0.00,
      driver: 'Unassigned',
      status: 'CANCELLED',
      rating: null,
    },
  ];

  const filtered = historyOrders.filter(o => {
    const matchSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterType === 'ALL' || o.status === filterType;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high">
        <div>
          <h2 className="text-xl font-extrabold text-on-surface">Order History & Financial Logs</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Full audit trail of settled orders, assigned delivery couriers, and customer reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface"
        >
          <span className="material-symbols-outlined text-[16px]">print</span>
          <span>Print Summary</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-container-lowest p-3.5 rounded-2xl shadow-sm border border-surface-container-high">
        <div className="flex items-center gap-2 w-full sm:w-80 bg-surface-container-low px-3.5 py-2 rounded-full">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search order ID or customer..."
            className="bg-transparent text-xs w-full text-on-surface placeholder:text-on-surface-variant focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'DELIVERED', 'CANCELLED'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                filterType === type
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container-high">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-container-low text-on-surface-variant uppercase font-bold text-[11px]">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Order #</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items Summary</th>
                <th className="px-4 py-3">Total Paid</th>
                <th className="px-4 py-3">Net 80% Payout</th>
                <th className="px-4 py-3">Courier</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filtered.map(ord => (
                <tr key={ord.id} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3.5 font-bold text-on-surface">{ord.id}</td>
                  <td className="px-4 py-3.5 text-on-surface-variant">{ord.date}</td>
                  <td className="px-4 py-3.5 font-semibold text-on-surface">{ord.customer}</td>
                  <td className="px-4 py-3.5 text-on-surface-variant truncate max-w-[200px]">{ord.items}</td>
                  <td className="px-4 py-3.5 font-bold text-on-surface">${ord.total.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-tertiary font-extrabold">${ord.payout.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-on-surface-variant">{ord.driver}</td>
                  <td className="px-4 py-3.5">
                    {ord.rating ? (
                      <span className="flex items-center gap-1 font-bold text-amber-600">
                        <span className="material-symbols-outlined text-[13px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        {ord.rating}
                      </span>
                    ) : (
                      <span className="text-on-surface-variant">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ord.status === 'DELIVERED'
                          ? 'bg-tertiary/15 text-tertiary'
                          : 'bg-error-container text-error'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
