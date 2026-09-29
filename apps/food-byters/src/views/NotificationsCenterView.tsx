import React from 'react';

export const NotificationsCenterView: React.FC = () => {
  const notifications = [
    {
      id: 1,
      type: 'DISPATCH',
      title: 'Peak Rush Alert Activated',
      desc: 'Demand in Downtown Main is up 40%. Prep buffer automatically suggested +10m.',
      time: '12m ago',
      icon: 'local_fire_department',
      color: 'bg-secondary text-white',
    },
    {
      id: 2,
      type: 'PAYOUT',
      title: 'Daily Payout Succeeded',
      desc: '$3,856.40 (80% net food sales) deposited to Chase Commercial ••8829.',
      time: '2 hours ago',
      icon: 'account_balance_wallet',
      color: 'bg-tertiary text-white',
    },
    {
      id: 3,
      type: 'INVENTORY',
      title: 'Low Stock: Buffalo Mozzarella',
      desc: 'Supply has dropped under threshold (15%). Reorder to avoid 86ing Margherita D.O.P.',
      time: '4 hours ago',
      icon: 'inventory_2',
      color: 'bg-amber-600 text-white',
    },
    {
      id: 4,
      type: 'REVIEW',
      title: 'New 5-Star Customer Review',
      desc: 'Michael Chang rated order #FB-9104 5.0 stars: "Best crust in the city, fast pickup!"',
      time: 'Yesterday',
      icon: 'star',
      color: 'bg-primary text-white',
    },
  ];

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high">
        <h2 className="text-xl font-extrabold text-on-surface">Store Notification Center</h2>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Real-time updates regarding payouts, line prep alerts, inventory limits, and customer reviews.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map(item => (
          <div
            key={item.id}
            className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high flex items-start gap-3.5 hover:shadow-md transition-all"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${item.color}`}>
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-on-surface">{item.title}</h4>
                <span className="text-[11px] text-on-surface-variant">{item.time}</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
