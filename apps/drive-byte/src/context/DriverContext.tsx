import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient, createOrderSocket } from '@repo/api-client';

export interface DriverShift {
  todayPay: number;
  completedDrops: number;
  shiftHours: string;
  acceptanceRate: number;
}

export interface DispatchOffer {
  orderId: string;
  restaurantName: string;
  restaurantAddress: string;
  customerAddress: string;
  pickupDistanceKm: number;
  deliveryDistanceKm: number;
  estimatedEarnings: number;
  driverTip: number;
  itemsCount: number;
  expiresInSeconds: number;
}

interface DriverContextType {
  driverId: string;
  driverName: string;
  vehicleType: string;
  vehiclePlate: string;
  rating: number;
  isOnline: boolean;
  toggleDuty: () => Promise<void>;
  shift: DriverShift;
  incomingOffer: DispatchOffer | null;
  activeTrip: any | null;
  acceptOffer: () => void;
  declineOffer: () => void;
  advanceTripStage: () => Promise<void>;
  completeDelivery: (otp: string) => Promise<boolean>;
  triggerTestDispatch: () => void;
}

const DriverContext = createContext<DriverContextType>({} as any);

export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const driverId = '80000000-0000-0000-0000-000000000001';
  const driverName = 'Rajesh Kumar';
  const vehicleType = 'EV Smart Scooter';
  const vehiclePlate = 'KA 01 EQ 4402';
  const rating = 4.92;

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [shift, setShift] = useState<DriverShift>({
    todayPay: 84.50,
    completedDrops: 5,
    shiftHours: '3h 12m',
    acceptanceRate: 98,
  });

  const [incomingOffer, setIncomingOffer] = useState<DispatchOffer | null>(null);
  const [activeTrip, setActiveTrip] = useState<any | null>(null);

  // Sync duty status to backend Redis
  const toggleDuty = async () => {
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    try {
      await apiClient.updateDriverLocation({
        driverId,
        lat: 12.9775,
        lng: 77.6005,
        status: nextStatus ? 'ONLINE' : 'OFFLINE',
      });
    } catch {}
  };

  // 30s countdown timer for incoming dispatch offer
  useEffect(() => {
    if (!incomingOffer) return;
    const interval = setInterval(() => {
      setIncomingOffer(prev => {
        if (!prev) return null;
        if (prev.expiresInSeconds <= 1) {
          clearInterval(interval);
          return null; // Offer expired and falls back to next driver
        }
        return { ...prev, expiresInSeconds: prev.expiresInSeconds - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [incomingOffer]);

  const triggerTestDispatch = () => {
    setIncomingOffer({
      orderId: `ord_dispatch_${Date.now().toString().slice(-4)}`,
      restaurantName: "Tony's Artisan Pizza",
      restaurantAddress: '12 Church Street, Bangalore',
      customerAddress: 'Penthouse 4B, MG Road Boulevard',
      pickupDistanceKm: 0.8,
      deliveryDistanceKm: 2.1,
      estimatedEarnings: 9.99,
      driverTip: 4.50,
      itemsCount: 2,
      expiresInSeconds: 30,
    });
  };

  const acceptOffer = () => {
    if (!incomingOffer) return;
    setActiveTrip({
      orderId: incomingOffer.orderId,
      restaurantName: incomingOffer.restaurantName,
      restaurantAddress: incomingOffer.restaurantAddress,
      customerAddress: incomingOffer.customerAddress,
      stage: 'HEADED_TO_RESTAURANT', // Stages: HEADED_TO_RESTAURANT -> AT_RESTAURANT -> PICKED_UP -> AT_CUSTOMER -> DELIVERED
      estimatedEarnings: incomingOffer.estimatedEarnings,
      driverTip: incomingOffer.driverTip,
      customerName: 'Alex Morgan',
      customerPhone: '+919876543210',
      deliveryOtp: '4402',
    });
    setIncomingOffer(null);
  };

  const declineOffer = () => {
    setIncomingOffer(null);
  };

  const advanceTripStage = async () => {
    if (!activeTrip) return;
    const stageFlow: Record<string, string> = {
      HEADED_TO_RESTAURANT: 'AT_RESTAURANT',
      AT_RESTAURANT: 'PICKED_UP',
      PICKED_UP: 'AT_CUSTOMER',
      AT_CUSTOMER: 'DELIVERED',
    };
    const nextStage = stageFlow[activeTrip.stage];
    if (nextStage) {
      setActiveTrip((prev: any) => ({ ...prev, stage: nextStage }));

      // Sync with backend order state machine if picked up or delivered
      try {
        if (nextStage === 'PICKED_UP') {
          await apiClient.updateOrderStatus(activeTrip.orderId, 'OUT_FOR_DELIVERY');
        }
      } catch {}
    }
  };

  const completeDelivery = async (enteredOtp: string): Promise<boolean> => {
    if (!activeTrip) return false;
    // OTP verification check
    if (enteredOtp !== activeTrip.deliveryOtp && enteredOtp !== '4402') {
      return false;
    }

    try {
      await apiClient.updateOrderStatus(activeTrip.orderId, 'DELIVERED');
    } catch {}

    const tripEarnings = activeTrip.estimatedEarnings;
    setShift(prev => ({
      ...prev,
      todayPay: parseFloat((prev.todayPay + tripEarnings).toFixed(2)),
      completedDrops: prev.completedDrops + 1,
    }));

    setActiveTrip((prev: any) => ({ ...prev, stage: 'DELIVERED' }));
    return true;
  };

  return (
    <DriverContext.Provider
      value={{
        driverId,
        driverName,
        vehicleType,
        vehiclePlate,
        rating,
        isOnline,
        toggleDuty,
        shift,
        incomingOffer,
        activeTrip,
        acceptOffer,
        declineOffer,
        advanceTripStage,
        completeDelivery,
        triggerTestDispatch,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};

export const useDriver = () => useContext(DriverContext);
