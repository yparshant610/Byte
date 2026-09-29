import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@repo/api-client';

export interface KdsOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; notes?: string; price: number }>;
  totalAmount: number;
  status: 'PENDING' | 'PREPARING' | 'READY_FOR_PICKUP' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  orderType: 'Delivery' | 'Takeout' | 'Dine-In';
  placedAt: string;
  prepMinutes: number;
  specialInstructions?: string;
  rejectSecondsLeft?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  prepTime: string;
  inStock: boolean;
  image: string;
  station: string;
  dietary: string[];
}

export interface SettlementRecord {
  id: string;
  date: string;
  ordersCount: number;
  grossAmount: number;
  commissionFee: number; // 20%
  netPayout: number; // 80%
  status: 'SETTLED' | 'PROCESSING' | 'SCHEDULED';
  bankRef: string;
}

interface MerchantContextType {
  restaurantName: string;
  restaurantId: string;
  isOpen: boolean;
  prepBuffer: number;
  isRushSurge: boolean;
  autoAccept: boolean;
  audioChimeEnabled: boolean;
  activeOrders: KdsOrder[];
  menuItems: MenuItem[];
  settlements: SettlementRecord[];
  toggleStoreOpen: () => void;
  toggleRushSurge: () => void;
  toggleAutoAccept: () => void;
  toggleAudioChime: () => void;
  playOrderChime: () => void;
  acceptOrder: (orderId: string, prepMinutes?: number) => Promise<void>;
  declineOrder: (orderId: string) => Promise<void>;
  markOrderReady: (orderId: string) => Promise<void>;
  toggleItemStock: (itemId: string) => void;
  saveDish: (dish: MenuItem) => void;
  triggerIncomingDemoOrder: () => void;
}

const MerchantContext = createContext<MerchantContextType>({} as any);

export const MerchantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const restaurantName = "Tony's Artisan Pizza #104";
  const restaurantId = '10000000-0000-0000-0000-000000000001';

  const [isOpen, setIsOpen] = useState(true);
  const [prepBuffer, setPrepBuffer] = useState(15);
  const [isRushSurge, setIsRushSurge] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);
  const [audioChimeEnabled, setAudioChimeEnabled] = useState(true);

  // Initial Demo KDS Orders
  const [activeOrders, setActiveOrders] = useState<KdsOrder[]>([
    {
      id: 'ord_kds_9104',
      orderNumber: '#FB-9104',
      customerName: 'Michael Chang',
      items: [
        { name: 'Pepperoni Classic (16")', quantity: 2, price: 18.00 },
        { name: 'White Truffle Parmesan Fries', quantity: 1, price: 8.50 },
      ],
      totalAmount: 44.50,
      status: 'PENDING',
      orderType: 'Delivery',
      placedAt: '1m ago',
      prepMinutes: 15,
      specialInstructions: 'Extra crispy on deck oven, please slice into 8 even triangles.',
      rejectSecondsLeft: 45,
    },
    {
      id: 'ord_kds_9105',
      orderNumber: '#FB-9105',
      customerName: 'Sarah Jenkins',
      items: [
        { name: 'Margherita D.O.P (14")', quantity: 1, price: 16.50 },
        { name: 'Classic House Tiramisu', quantity: 1, price: 11.50 },
      ],
      totalAmount: 28.00,
      status: 'PENDING',
      orderType: 'Delivery',
      placedAt: '2m ago',
      prepMinutes: 12,
    },
    {
      id: 'ord_kds_9102',
      orderNumber: '#FB-9102',
      customerName: 'Alex Morgan',
      items: [
        { name: 'Wood-Fired Truffle Funghi (14")', quantity: 1, price: 21.00 },
        { name: 'Burrata Caprese Salad', quantity: 1, price: 13.00 },
      ],
      totalAmount: 34.00,
      status: 'PREPARING',
      orderType: 'Delivery',
      placedAt: '8m ago',
      prepMinutes: 15,
      specialInstructions: 'Balsamic reduction on the side please.',
    },
    {
      id: 'ord_kds_9101',
      orderNumber: '#FB-9101',
      customerName: 'David Lee',
      items: [
        { name: 'Calzone Supreme', quantity: 1, price: 17.50 },
        { name: 'San Pellegrino Sparkling (500ml)', quantity: 2, price: 4.00 },
      ],
      totalAmount: 25.50,
      status: 'READY_FOR_PICKUP',
      orderType: 'Delivery',
      placedAt: '18m ago',
      prepMinutes: 15,
    },
  ]);

  // Initial Menu Catalog
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 'item_1',
      name: 'Margherita Pizza D.O.P',
      sku: 'PZ-101',
      category: 'Signature Pizzas',
      price: 16.99,
      prepTime: '12m',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=60',
      station: 'Deck Oven 1',
      dietary: ['Veg'],
    },
    {
      id: 'item_2',
      name: 'Double Truffle Funghi',
      sku: 'PZ-102',
      category: 'Signature Pizzas',
      price: 21.50,
      prepTime: '14m',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
      station: 'Deck Oven 1',
      dietary: ['Veg'],
    },
    {
      id: 'item_3',
      name: 'Diavola Pepperoni Crunch',
      sku: 'PZ-103',
      category: 'Signature Pizzas',
      price: 19.50,
      prepTime: '15m',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60',
      station: 'Deck Oven 2',
      dietary: ['Spicy'],
    },
    {
      id: 'item_4',
      name: 'Burrata Heirloom Salad',
      sku: 'APP-201',
      category: 'Appetizers & Sides',
      price: 13.99,
      prepTime: '6m',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60',
      station: 'Garde Manger',
      dietary: ['Veg', 'Gluten-Free'],
    },
    {
      id: 'item_5',
      name: 'White Truffle Garlic Fries',
      sku: 'APP-202',
      category: 'Appetizers & Sides',
      price: 8.50,
      prepTime: '8m',
      inStock: false, // 86'd demo
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60',
      station: 'Fry Station',
      dietary: ['Veg'],
    },
    {
      id: 'item_6',
      name: 'Classic Venetian Tiramisu',
      sku: 'DES-301',
      category: 'Desserts',
      price: 9.99,
      prepTime: '4m',
      inStock: true,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60',
      station: 'Pastry Station',
      dietary: ['Veg'],
    },
  ]);

  // Settlements Data (80% net to restaurant, 20% Byte commission)
  const settlements: SettlementRecord[] = [
    {
      id: 'SETTL-8829-01',
      date: 'Today, 10:00 AM',
      ordersCount: 142,
      grossAmount: 4820.50,
      commissionFee: 964.10, // 20%
      netPayout: 3856.40, // 80%
      status: 'PROCESSING',
      bankRef: 'ACH-CHASE-••8829',
    },
    {
      id: 'SETTL-8829-02',
      date: 'Yesterday, 10:00 AM',
      ordersCount: 138,
      grossAmount: 4410.00,
      commissionFee: 882.00,
      netPayout: 3528.00,
      status: 'SETTLED',
      bankRef: 'ACH-CHASE-••8829',
    },
    {
      id: 'SETTL-8829-03',
      date: 'Sep 27, 2026',
      ordersCount: 165,
      grossAmount: 5690.00,
      commissionFee: 1138.00,
      netPayout: 4552.00,
      status: 'SETTLED',
      bankRef: 'ACH-CHASE-••8829',
    },
  ];

  // Web Audio Synthetic Kitchen Chime
  const playOrderChime = () => {
    if (!audioChimeEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {}
  };

  const toggleStoreOpen = () => setIsOpen(prev => !prev);

  const toggleRushSurge = () => {
    setIsRushSurge(prev => {
      const next = !prev;
      setPrepBuffer(next ? 25 : 15);
      return next;
    });
  };

  const toggleAutoAccept = () => setAutoAccept(prev => !prev);
  const toggleAudioChime = () => setAudioChimeEnabled(prev => !prev);

  const acceptOrder = async (orderId: string, customMinutes = 15) => {
    setActiveOrders(prev =>
      prev.map(ord =>
        ord.id === orderId ? { ...ord, status: 'PREPARING', prepMinutes: customMinutes } : ord
      )
    );
    try {
      await apiClient.updateOrderStatus(orderId, 'PREPARING');
    } catch {}
  };

  const declineOrder = async (orderId: string) => {
    setActiveOrders(prev => prev.filter(ord => ord.id !== orderId));
    try {
      await apiClient.updateOrderStatus(orderId, 'CANCELLED');
    } catch {}
  };

  const markOrderReady = async (orderId: string) => {
    setActiveOrders(prev =>
      prev.map(ord =>
        ord.id === orderId ? { ...ord, status: 'READY_FOR_PICKUP' } : ord
      )
    );
    try {
      await apiClient.updateOrderStatus(orderId, 'READY_FOR_PICKUP');
    } catch {}
  };

  const toggleItemStock = (itemId: string) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, inStock: !item.inStock } : item
      )
    );
  };

  const saveDish = (dish: MenuItem) => {
    setMenuItems(prev => {
      const exists = prev.some(item => item.id === dish.id);
      if (exists) {
        return prev.map(item => (item.id === dish.id ? dish : item));
      }
      return [dish, ...prev];
    });
  };

  const triggerIncomingDemoOrder = () => {
    const num = Math.floor(1000 + Math.random() * 9000);
    const newOrd: KdsOrder = {
      id: `ord_live_${Date.now()}`,
      orderNumber: `#FB-${num}`,
      customerName: 'Priya Sharma',
      items: [
        { name: 'Diavola Pepperoni Crunch (16")', quantity: 1, price: 19.50 },
        { name: 'Burrata Heirloom Salad', quantity: 1, price: 13.99 },
      ],
      totalAmount: 33.49,
      status: 'PENDING',
      orderType: 'Delivery',
      placedAt: 'Just now',
      prepMinutes: 15,
      specialInstructions: 'Crispy crust please, extra oregano.',
      rejectSecondsLeft: 60,
    };
    setActiveOrders(prev => [newOrd, ...prev]);
    playOrderChime();
  };

  return (
    <MerchantContext.Provider
      value={{
        restaurantName,
        restaurantId,
        isOpen,
        prepBuffer,
        isRushSurge,
        autoAccept,
        audioChimeEnabled,
        activeOrders,
        menuItems,
        settlements,
        toggleStoreOpen,
        toggleRushSurge,
        toggleAutoAccept,
        toggleAudioChime,
        playOrderChime,
        acceptOrder,
        declineOrder,
        markOrderReady,
        toggleItemStock,
        saveDish,
        triggerIncomingDemoOrder,
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
};

export const useMerchant = () => useContext(MerchantContext);
