import React, { createContext, useContext, useState } from 'react';
import { apiClient } from '@repo/api-client';

export interface AdminMerchant {
  id: string;
  name: string;
  category: string;
  location: string;
  ownerName: string;
  rating: number;
  ordersCount30d: number;
  gmv30d: number;
  commissionRate: number;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  joinedDate: string;
}

export interface AdminDriver {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'E-Bike' | 'Motorcycle' | 'Car';
  plate: string;
  rating: number;
  completedTrips: number;
  kycStatus: 'VERIFIED' | 'PENDING_AUDIT' | 'SUSPENDED';
  dutyStatus: 'ONLINE' | 'BUSY' | 'OFFLINE';
  zone: string;
}

export interface AdminDispute {
  id: string;
  orderId: string;
  customerName: string;
  merchantName: string;
  courierName: string;
  claimAmount: number;
  reason: string;
  slaMinutesLeft: number;
  status: 'OPEN' | 'RESOLVED_REFUND' | 'RESOLVED_REJECTED';
  evidenceProof: string;
}

export interface LiveFleetMarker {
  id: string;
  driverName: string;
  lat: number;
  lng: number;
  status: 'PICKED_UP' | 'EN_ROUTE' | 'READY';
  orderNumber: string;
  etaMins: number;
  isDelayed?: boolean;
}

interface AdminContextType {
  merchants: AdminMerchant[];
  drivers: AdminDriver[];
  disputes: AdminDispute[];
  fleetMarkers: LiveFleetMarker[];
  activeZone: string;
  setActiveZone: (zone: string) => void;
  approveMerchant: (id: string) => void;
  suspendMerchant: (id: string) => void;
  updateCommissionRate: (id: string, rate: number) => void;
  approveDriverKyc: (id: string) => void;
  suspendDriver: (id: string) => void;
  resolveDisputeWithRefund: (disputeId: string) => Promise<void>;
  rejectDispute: (disputeId: string) => void;
  simulateFleetReroute: () => void;
  broadcastAlert: (msg: string) => void;
  alertBanner: string | null;
  dismissAlert: () => void;
}

const AdminContext = createContext<AdminContextType>({} as any);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeZone, setActiveZone] = useState<string>('all');
  const [alertBanner, setAlertBanner] = useState<string | null>(null);

  const [merchants, setMerchants] = useState<AdminMerchant[]>([
    {
      id: '10000000-0000-0000-0000-000000000001',
      name: "Tony's Artisan Pizza #104",
      category: 'Artisanal Italian & Pizza',
      location: 'Downtown Main Flagship',
      ownerName: 'Tony Romano',
      rating: 4.88,
      ordersCount30d: 1420,
      gmv30d: 48200.00,
      commissionRate: 20,
      status: 'ACTIVE',
      joinedDate: 'Jan 2026',
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      name: 'Kyoto Sushi & Robata',
      category: 'Japanese & Raw Bar',
      location: 'Westside Marina Blvd',
      ownerName: 'Kenji Sato',
      rating: 4.95,
      ordersCount30d: 980,
      gmv30d: 52400.00,
      commissionRate: 18,
      status: 'ACTIVE',
      joinedDate: 'Feb 2026',
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      name: 'Burger & Smoke Co.',
      category: 'American Smokehouse',
      location: 'Metro Eastside Arcade',
      ownerName: 'Marcus Bell',
      rating: 4.62,
      ordersCount30d: 610,
      gmv30d: 19800.00,
      commissionRate: 15,
      status: 'PENDING',
      joinedDate: 'Sep 2026',
    },
    {
      id: '10000000-0000-0000-0000-000000000004',
      name: 'La Taqueria 1988',
      category: 'Mexican Street Food',
      location: 'Mission Strip',
      ownerName: 'Elena Gomez',
      rating: 4.79,
      ordersCount30d: 840,
      gmv30d: 26300.00,
      commissionRate: 20,
      status: 'ACTIVE',
      joinedDate: 'Mar 2026',
    },
    {
      id: '10000000-0000-0000-0000-000000000005',
      name: 'Green Goddess Bowls',
      category: 'Organic & Vegan',
      location: 'North Bay Waterfront',
      ownerName: 'Chloe Bennett',
      rating: 4.31,
      ordersCount30d: 310,
      gmv30d: 8400.00,
      commissionRate: 20,
      status: 'SUSPENDED',
      joinedDate: 'May 2026',
    },
  ]);

  const [drivers, setDrivers] = useState<AdminDriver[]>([
    {
      id: '80000000-0000-0000-0000-000000000001',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      vehicleType: 'E-Bike',
      plate: 'KA 01 EQ 4402',
      rating: 4.92,
      completedTrips: 342,
      kycStatus: 'VERIFIED',
      dutyStatus: 'ONLINE',
      zone: 'Downtown Core',
    },
    {
      id: '80000000-0000-0000-0000-000000000002',
      name: 'Carlos Mendez',
      phone: '+1 (555) 742-1100',
      vehicleType: 'Motorcycle',
      plate: 'CA 89 XFD',
      rating: 4.88,
      completedTrips: 512,
      kycStatus: 'VERIFIED',
      dutyStatus: 'BUSY',
      zone: 'Westside Campus',
    },
    {
      id: '80000000-0000-0000-0000-000000000003',
      name: 'Vikram Singh',
      phone: '+91 98221 88301',
      vehicleType: 'Car',
      plate: 'KA 03 MZ 9912',
      rating: 4.75,
      completedTrips: 184,
      kycStatus: 'PENDING_AUDIT',
      dutyStatus: 'OFFLINE',
      zone: 'North Bay',
    },
    {
      id: '80000000-0000-0000-0000-000000000004',
      name: 'Elena Rostova',
      phone: '+1 (555) 302-9988',
      vehicleType: 'E-Bike',
      plate: 'EB-2026-9',
      rating: 4.96,
      completedTrips: 620,
      kycStatus: 'VERIFIED',
      dutyStatus: 'ONLINE',
      zone: 'Downtown Core',
    },
  ]);

  const [disputes, setDisputes] = useState<AdminDispute[]>([
    {
      id: 'DISP-8910',
      orderId: 'ord_demo_9104',
      customerName: 'Michael Chang',
      merchantName: "Tony's Artisan Pizza",
      courierName: 'Rajesh Kumar',
      claimAmount: 44.50,
      reason: 'Missing Truffle Fries and pizza arrived cold',
      slaMinutesLeft: 8,
      status: 'OPEN',
      evidenceProof: 'Doorstep drop photo submitted. Itemized receipt missing fry ticket stamp.',
    },
    {
      id: 'DISP-8902',
      orderId: 'ord_demo_8821',
      customerName: 'Aisha Khan',
      merchantName: 'Kyoto Sushi',
      courierName: 'Carlos Mendez',
      claimAmount: 62.00,
      reason: 'Driver dropped package at wrong building gate',
      slaMinutesLeft: 14,
      status: 'OPEN',
      evidenceProof: 'GPS coordinates show 80m distance from customer address pin.',
    },
    {
      id: 'DISP-8890',
      orderId: 'ord_demo_7712',
      customerName: 'Liam O’Connor',
      merchantName: 'Burger & Smoke Co.',
      courierName: 'Vikram Singh',
      claimAmount: 28.00,
      reason: 'Incorrect sauce and allergen breach',
      slaMinutesLeft: 0,
      status: 'RESOLVED_REFUND',
      evidenceProof: 'Merchant acknowledged order line error. Full $28.00 refunded.',
    },
  ]);

  const [fleetMarkers, setFleetMarkers] = useState<LiveFleetMarker[]>([
    {
      id: 'fl-1',
      driverName: 'Rajesh K. (KA 01 EQ 4402)',
      lat: 12.9775,
      lng: 77.6005,
      status: 'EN_ROUTE',
      orderNumber: '#FB-9104',
      etaMins: 6,
    },
    {
      id: 'fl-2',
      driverName: 'Carlos M. (CA 89 XFD)',
      lat: 12.9698,
      lng: 77.6120,
      status: 'PICKED_UP',
      orderNumber: '#FB-9105',
      etaMins: 11,
    },
    {
      id: 'fl-3',
      driverName: 'Elena R. (EB-2026-9)',
      lat: 12.9810,
      lng: 77.5950,
      status: 'READY',
      orderNumber: '#FB-9108',
      etaMins: 2,
    },
    {
      id: 'fl-4',
      driverName: 'Vikram S. (KA 03 MZ 9912)',
      lat: 12.9550,
      lng: 77.6250,
      status: 'EN_ROUTE',
      orderNumber: '#FB-9099',
      etaMins: 32,
      isDelayed: true,
    },
  ]);

  const approveMerchant = (id: string) => {
    setMerchants(prev =>
      prev.map(m => (m.id === id ? { ...m, status: 'ACTIVE' } : m))
    );
  };

  const suspendMerchant = (id: string) => {
    setMerchants(prev =>
      prev.map(m => (m.id === id ? { ...m, status: 'SUSPENDED' } : m))
    );
  };

  const updateCommissionRate = (id: string, rate: number) => {
    setMerchants(prev =>
      prev.map(m => (m.id === id ? { ...m, commissionRate: rate } : m))
    );
  };

  const approveDriverKyc = (id: string) => {
    setDrivers(prev =>
      prev.map(d => (d.id === id ? { ...d, kycStatus: 'VERIFIED' } : d))
    );
  };

  const suspendDriver = (id: string) => {
    setDrivers(prev =>
      prev.map(d => (d.id === id ? { ...d, kycStatus: 'SUSPENDED' } : d))
    );
  };

  const resolveDisputeWithRefund = async (disputeId: string) => {
    const disp = disputes.find(d => d.id === disputeId);
    if (disp) {
      try {
        await apiClient.refundOrder(disp.orderId, disp.reason, disp.claimAmount);
      } catch {}
    }
    setDisputes(prev =>
      prev.map(d =>
        d.id === disputeId ? { ...d, status: 'RESOLVED_REFUND' } : d
      )
    );
  };

  const rejectDispute = (disputeId: string) => {
    setDisputes(prev =>
      prev.map(d =>
        d.id === disputeId ? { ...d, status: 'RESOLVED_REJECTED' } : d
      )
    );
  };

  const simulateFleetReroute = () => {
    setFleetMarkers(prev =>
      prev.map(m => ({
        ...m,
        lat: +(m.lat + (Math.random() - 0.5) * 0.005).toFixed(4),
        lng: +(m.lng + (Math.random() - 0.5) * 0.005).toFixed(4),
        etaMins: Math.max(1, m.etaMins - 1),
      }))
    );
    setAlertBanner('Optimal traffic dispatch re-routing deployed across 42 active vehicles.');
  };

  const broadcastAlert = (msg: string) => {
    setAlertBanner(`Fleet Wide Notification: ${msg}`);
  };

  const dismissAlert = () => setAlertBanner(null);

  return (
    <AdminContext.Provider
      value={{
        merchants,
        drivers,
        disputes,
        fleetMarkers,
        activeZone,
        setActiveZone,
        approveMerchant,
        suspendMerchant,
        updateCommissionRate,
        approveDriverKyc,
        suspendDriver,
        resolveDisputeWithRefund,
        rejectDispute,
        simulateFleetReroute,
        broadcastAlert,
        alertBanner,
        dismissAlert,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
