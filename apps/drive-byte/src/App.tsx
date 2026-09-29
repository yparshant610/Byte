import React, { useState } from 'react';
import { DriverProvider, useDriver } from './context/DriverContext';
import { DriverDeviceFrame } from './components/DriverDeviceFrame';
import { DutyDashboardScreen } from './screens/DutyDashboardScreen';
import { ActiveNavigationScreen } from './screens/ActiveNavigationScreen';
import { EarningsSummaryScreen } from './screens/EarningsSummaryScreen';
import { OnboardingKycScreen } from './screens/OnboardingKycScreen';
import { PermissionsScreen } from './screens/PermissionsScreen';
import { DriverAuthScreen } from './screens/DriverAuthScreen';
import { OtpPasswordSetupScreen } from './screens/OtpPasswordSetupScreen';

const DriverAppInner: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<string>('duty');
  const { activeTrip } = useDriver();

  const renderScreen = () => {
    switch (activeScreen) {
      case 'auth':
        return (
          <DriverAuthScreen
            onLoginSuccess={() => setActiveScreen('duty')}
            onRegisterClick={() => setActiveScreen('otp_setup')}
          />
        );
      case 'otp_setup':
        return (
          <OtpPasswordSetupScreen
            onSuccess={() => setActiveScreen('kyc')}
            onBack={() => setActiveScreen('auth')}
          />
        );
      case 'kyc':
        return (
          <OnboardingKycScreen
            onNext={() => setActiveScreen('permissions')}
            onBack={() => setActiveScreen('auth')}
          />
        );
      case 'permissions':
        return (
          <PermissionsScreen
            onContinue={() => setActiveScreen('duty')}
            onBack={() => setActiveScreen('kyc')}
          />
        );
      case 'navigation':
        return (
          <ActiveNavigationScreen
            onDeliveredSuccess={() => setActiveScreen('earnings')}
            onBackToDashboard={() => setActiveScreen('duty')}
          />
        );
      case 'earnings':
        return (
          <EarningsSummaryScreen
            onBackToRadar={() => setActiveScreen('duty')}
            onGoOffline={() => setActiveScreen('duty')}
          />
        );
      case 'duty':
      default:
        return (
          <DutyDashboardScreen
            onAcceptSuccess={() => setActiveScreen('navigation')}
            onNavigateEarnings={() => setActiveScreen('earnings')}
          />
        );
    }
  };

  return (
    <DriverDeviceFrame activeScreen={activeScreen} setActiveScreen={setActiveScreen}>
      {renderScreen()}
    </DriverDeviceFrame>
  );
};

export const App: React.FC = () => {
  return (
    <DriverProvider>
      <DriverAppInner />
    </DriverProvider>
  );
};
