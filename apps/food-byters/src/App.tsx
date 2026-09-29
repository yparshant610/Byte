import React, { useState } from 'react';
import { MerchantProvider } from './context/MerchantContext';
import { MerchantSidebar } from './components/MerchantSidebar';
import { MerchantHeader } from './components/MerchantHeader';
import { OperationalDashboardView } from './views/OperationalDashboardView';
import { LiveKitchenKdsView } from './views/LiveKitchenKdsView';
import { MenuInventoryCrudView } from './views/MenuInventoryCrudView';
import { PayoutsFinancialsView } from './views/PayoutsFinancialsView';
import { OrderHistoryLogsView } from './views/OrderHistoryLogsView';
import { NotificationsCenterView } from './views/NotificationsCenterView';

const FoodBytersInner: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  const renderContent = () => {
    switch (currentTab) {
      case 'kds':
        return <LiveKitchenKdsView />;
      case 'menu':
        return <MenuInventoryCrudView />;
      case 'payouts':
        return <PayoutsFinancialsView />;
      case 'history':
        return <OrderHistoryLogsView />;
      case 'notifications':
        return <NotificationsCenterView />;
      case 'dashboard':
      default:
        return <OperationalDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans text-on-surface">
      {/* Fixed Sidebar */}
      <MerchantSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area (offset left by sidebar width) */}
      <div className="pl-64 xl:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <MerchantHeader onNewItemClick={() => setCurrentTab('menu')} />

        {/* Scrollable Page Body */}
        <main className="w-full pt-20 px-6 sm:px-8 py-6 bg-surface flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MerchantProvider>
      <FoodBytersInner />
    </MerchantProvider>
  );
};
