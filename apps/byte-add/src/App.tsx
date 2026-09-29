import React, { useState } from 'react';
import { AdminProvider } from './context/AdminContext';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { RestaurantManagementView } from './views/RestaurantManagementView';
import { DeliveryActivityMonitorView } from './views/DeliveryActivityMonitorView';
import { DriverFleetManagementView } from './views/DriverFleetManagementView';
import { DisputeArbitrationCenterView } from './views/DisputeArbitrationCenterView';
import { CommissionFinancialRulesView } from './views/CommissionFinancialRulesView';

const ByteAddInner: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('restaurants');

  const renderContent = () => {
    switch (currentTab) {
      case 'telemetry':
        return <DeliveryActivityMonitorView />;
      case 'fleet':
        return <DriverFleetManagementView />;
      case 'disputes':
        return <DisputeArbitrationCenterView />;
      case 'commissions':
        return <CommissionFinancialRulesView />;
      case 'restaurants':
      default:
        return <RestaurantManagementView />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans text-on-surface">
      {/* Sidebar */}
      <AdminSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Container */}
      <div className="pl-64 xl:pl-72 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="w-full pt-20 px-6 sm:px-8 py-6 bg-surface flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AdminProvider>
      <ByteAddInner />
    </AdminProvider>
  );
};
