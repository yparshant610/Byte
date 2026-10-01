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
  description?: string;
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

export interface MerchantUser {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  phone?: string;
  restaurantId?: string;
  restaurantName?: string;
}

interface MerchantContextType {
  // Auth state & methods
  user: MerchantUser | null;
  token: string | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;
  restaurantName: string;
  restaurantId: string;
  requestOtp: (email: string, restaurantName?: string, ownerName?: string) => Promise<{ success: boolean; message: string; debugOtp?: string }>;
  verifyOtpSignup: (payload: { email: string; otp: string; password?: string; fullName?: string; phone?: string; restaurantName?: string }) => Promise<void>;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;

  // Store Controls
  isOpen: boolean;
  prepBuffer: number;
  isRushSurge: boolean;
  autoAccept: boolean;
  audioChimeEnabled: boolean;
  toggleStoreOpen: () => Promise<void>;
  toggleRushSurge: () => Promise<void>;
  toggleAutoAccept: () => void;
  toggleAudioChime: () => void;
  playOrderChime: () => void;

  // Menu & Catalog
  menuItems: MenuItem[];
  menuLoading: boolean;
  loadMenu: () => Promise<void>;
  toggleItemStock: (itemId: string) => Promise<void>;
  saveDish: (dish: MenuItem) => Promise<void>;
  deleteDish: (itemId: string) => Promise<void>;
  uploadMenuImage: (file: File) => Promise<{ verified: boolean; publicUrl: string; fileKey: string; message?: string }>;

  // Settlements & KDS
  settlements: SettlementRecord[];
  activeOrders: KdsOrder[];
  acceptOrder: (orderId: string, prepMinutes?: number) => Promise<void>;
  declineOrder: (orderId: string) => Promise<void>;
  markOrderReady: (orderId: string) => Promise<void>;
  triggerIncomingDemoOrder: () => void;
}

const MerchantContext = createContext<MerchantContextType>({} as any);

export const MerchantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Auth State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('foodbytes_merchant_token'));
  const [user, setUser] = useState<MerchantUser | null>(() => {
    const saved = localStorage.getItem('foodbytes_merchant_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [restaurantId, setRestaurantId] = useState<string>(() => {
    return localStorage.getItem('foodbytes_merchant_restaurant_id') || '10000000-0000-0000-0000-000000000001';
  });
  const [restaurantName, setRestaurantName] = useState<string>(() => {
    return localStorage.getItem('foodbytes_merchant_restaurant_name') || "Tony's Artisan Pizza #104";
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // 2. Operational Store Status
  const [isOpen, setIsOpen] = useState(true);
  const [prepBuffer, setPrepBuffer] = useState(15);
  const [isRushSurge, setIsRushSurge] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);
  const [audioChimeEnabled, setAudioChimeEnabled] = useState(true);

  // 3. Menu Catalog State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);

  // 4. KDS Orders State (Mock/Demo)
  const [activeOrders, setActiveOrders] = useState<KdsOrder[]>([
    {
      id: 'ord_kds_9104',
      orderNumber: '#FB-9104',
      customerName: 'Michael Chang',
      items: [
        { name: 'Pepperoni Classic (16")', quantity: 2, price: 18.0 },
        { name: 'White Truffle Parmesan Fries', quantity: 1, price: 8.5 },
      ],
      totalAmount: 44.5,
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
        { name: 'Margherita D.O.P (14")', quantity: 1, price: 16.5 },
        { name: 'Classic House Tiramisu', quantity: 1, price: 11.5 },
      ],
      totalAmount: 28.0,
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
        { name: 'Wood-Fired Truffle Funghi (14")', quantity: 1, price: 21.0 },
        { name: 'Burrata Caprese Salad', quantity: 1, price: 13.0 },
      ],
      totalAmount: 34.0,
      status: 'PREPARING',
      orderType: 'Delivery',
      placedAt: '8m ago',
      prepMinutes: 15,
      specialInstructions: 'Balsamic reduction on the side please.',
    },
  ]);

  // 5. Settlements Data (80% net to restaurant, 20% Byte commission)
  const [settlements, setSettlements] = useState<SettlementRecord[]>([
    {
      id: 'SETTL-8829-01',
      date: 'Today, 10:00 AM',
      ordersCount: 142,
      grossAmount: 4820.5,
      commissionFee: 964.1,
      netPayout: 3856.4,
      status: 'PROCESSING',
      bankRef: 'ACH-CHASE-••8829',
    },
    {
      id: 'SETTL-8829-02',
      date: 'Yesterday, 10:00 AM',
      ordersCount: 138,
      grossAmount: 4410.0,
      commissionFee: 882.0,
      netPayout: 3528.0,
      status: 'SETTLED',
      bankRef: 'ACH-CHASE-••8829',
    },
    {
      id: 'SETTL-8829-03',
      date: 'Sep 27, 2026',
      ordersCount: 165,
      grossAmount: 5690.0,
      commissionFee: 1138.0,
      netPayout: 4552.0,
      status: 'SETTLED',
      bankRef: 'ACH-CHASE-••8829',
    },
  ]);

  // Load Menu from Backend API
  const loadMenu = async () => {
    setMenuLoading(true);
    try {
      const data = await apiClient.getRestaurantMenu(restaurantId);
      if (Array.isArray(data)) {
        setMenuItems(data);
      }
    } catch (err) {
      console.warn('Failed to load menu from server:', err);
    } finally {
      setMenuLoading(false);
    }
  };

  // Sync token to API client and load menu whenever token or restaurantId changes
  useEffect(() => {
    if (token) {
      apiClient.setAuth(token, user?.id || '', 'RESTAURANT_OWNER');
      loadMenu();
    }
  }, [token, restaurantId]);

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

  // Authentication Handlers
  const requestOtp = async (email: string, restName?: string, ownerName?: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await apiClient.signup(email, 'RESTAURANT_OWNER');
      return res;
    } catch (err: any) {
      setAuthError(err.message || 'Failed to dispatch verification code');
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyOtpSignup = async (payload: {
    email: string;
    otp: string;
    password?: string;
    fullName?: string;
    phone?: string;
    restaurantName?: string;
  }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await apiClient.verifyOtp({
        ...payload,
        role: 'RESTAURANT_OWNER',
      });
      const jwt = res.accessToken;
      const u = res.user as MerchantUser;
      const rId = res.restaurantId || u.restaurantId || '10000000-0000-0000-0000-000000000001';
      const rName = res.restaurantName || u.restaurantName || payload.restaurantName || "Tony's Artisan Pizza #104";

      setToken(jwt);
      setUser(u);
      setRestaurantId(rId);
      setRestaurantName(rName);

      localStorage.setItem('foodbytes_merchant_token', jwt);
      localStorage.setItem('foodbytes_merchant_user', JSON.stringify(u));
      localStorage.setItem('foodbytes_merchant_restaurant_id', rId);
      localStorage.setItem('foodbytes_merchant_restaurant_name', rName);
    } catch (err: any) {
      setAuthError(err.message || 'Invalid verification OTP');
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (email: string, password = 'SecurePassword123!') => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await apiClient.signin(email, password);
      const jwt = res.accessToken;
      const u = res.user as MerchantUser;
      const rId = res.restaurantId || u.restaurantId || '10000000-0000-0000-0000-000000000001';
      const rName = res.restaurantName || u.restaurantName || "Tony's Artisan Pizza #104";

      setToken(jwt);
      setUser(u);
      setRestaurantId(rId);
      setRestaurantName(rName);

      localStorage.setItem('foodbytes_merchant_token', jwt);
      localStorage.setItem('foodbytes_merchant_user', JSON.stringify(u));
      localStorage.setItem('foodbytes_merchant_restaurant_id', rId);
      localStorage.setItem('foodbytes_merchant_restaurant_name', rName);
    } catch (err: any) {
      setAuthError(err.message || 'Invalid email or password');
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch {}
    setToken(null);
    setUser(null);
    localStorage.removeItem('foodbytes_merchant_token');
    localStorage.removeItem('foodbytes_merchant_user');
    localStorage.removeItem('foodbytes_merchant_restaurant_id');
    localStorage.removeItem('foodbytes_merchant_restaurant_name');
  };

  // Store Controls
  const toggleStoreOpen = async () => {
    const next = !isOpen;
    setIsOpen(next);
    try {
      await apiClient.updateRestaurantSettings(restaurantId, { isOpen: next });
    } catch (e) {
      console.warn('Failed to update store status on backend:', e);
    }
  };

  const toggleRushSurge = async () => {
    const nextSurge = !isRushSurge;
    const nextBuffer = nextSurge ? 25 : 15;
    setIsRushSurge(nextSurge);
    setPrepBuffer(nextBuffer);
    try {
      await apiClient.updateRestaurantSettings(restaurantId, { prepBuffer: nextBuffer });
    } catch (e) {
      console.warn('Failed to update prep buffer on backend:', e);
    }
  };

  const toggleAutoAccept = () => setAutoAccept(prev => !prev);
  const toggleAudioChime = () => setAudioChimeEnabled(prev => !prev);

  // Menu Management Handlers (Persisted to Backend + Supabase)
  const toggleItemStock = async (itemId: string) => {
    const target = menuItems.find(i => i.id === itemId);
    const newStock = target ? !target.inStock : true;

    // Optimistic UI update
    setMenuItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, inStock: newStock } : item)),
    );

    try {
      await apiClient.toggleMenuItemAvailability(restaurantId, itemId, newStock);
    } catch (err) {
      console.warn('Failed to toggle stock on server:', err);
    }
  };

  const saveDish = async (dish: MenuItem) => {
    // Optimistic local update
    setMenuItems(prev => {
      const exists = prev.some(item => item.id === dish.id);
      if (exists) {
        return prev.map(item => (item.id === dish.id ? dish : item));
      }
      return [dish, ...prev];
    });

    try {
      const exists = menuItems.some(item => item.id === dish.id);
      if (exists) {
        await apiClient.updateMenuItem(restaurantId, dish.id, dish);
      } else {
        const saved = await apiClient.createMenuItem(restaurantId, dish);
        if (saved?.id) {
          setMenuItems(prev => prev.map(i => (i.id === dish.id ? { ...dish, id: saved.id } : i)));
        }
      }
    } catch (err) {
      console.warn('Failed to persist dish on backend:', err);
    }
  };

  const deleteDish = async (itemId: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== itemId));
    try {
      await apiClient.deleteMenuItem(restaurantId, itemId);
    } catch (err) {
      console.warn('Failed to delete dish on backend:', err);
    }
  };

  const uploadMenuImage = async (file: File): Promise<{ verified: boolean; publicUrl: string; fileKey: string; message?: string }> => {
    // Step 1: Request S3 presigned PUT URL from backend
    const presigned = await apiClient.getMenuImageUploadUrl(restaurantId, file.name, file.type || 'image/jpeg');

    // Step 2: Upload file directly to S3 via presigned URL
    let putErrorMessage = '';
    try {
      const uploadRes = await fetch(presigned.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'image/jpeg',
        },
        body: file,
      });
      if (!uploadRes.ok) {
        console.warn(`S3 direct upload status: ${uploadRes.status}`);
        putErrorMessage = `AWS S3 PUT rejected (${uploadRes.status} AccessDenied).`;
      }
    } catch (uploadErr: any) {
      console.warn('Direct S3 PUT warning:', uploadErr);
      putErrorMessage = uploadErr.message || 'Direct S3 PUT failed';
    }

    // Step 3: Send back confirmation response to backend to verify data is uploaded
    const verifyRes = await apiClient.verifyMenuImageUpload(restaurantId, presigned.fileKey);

    return {
      verified: verifyRes.verified,
      publicUrl: verifyRes.publicUrl || presigned.publicUrl,
      fileKey: presigned.fileKey,
      message: verifyRes.message || putErrorMessage,
    };
  };

  // Demo KDS actions
  const acceptOrder = async (orderId: string, customMinutes = 15) => {
    setActiveOrders(prev =>
      prev.map(ord =>
        ord.id === orderId ? { ...ord, status: 'PREPARING', prepMinutes: customMinutes } : ord,
      ),
    );
  };

  const declineOrder = async (orderId: string) => {
    setActiveOrders(prev => prev.filter(ord => ord.id !== orderId));
  };

  const markOrderReady = async (orderId: string) => {
    setActiveOrders(prev =>
      prev.map(ord =>
        ord.id === orderId ? { ...ord, status: 'READY_FOR_PICKUP' } : ord,
      ),
    );
  };

  const triggerIncomingDemoOrder = () => {
    const num = Math.floor(1000 + Math.random() * 9000);
    const newOrd: KdsOrder = {
      id: `ord_live_${Date.now()}`,
      orderNumber: `#FB-${num}`,
      customerName: 'Priya Sharma',
      items: [
        { name: 'Diavola Pepperoni Crunch (16")', quantity: 1, price: 19.5 },
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
        user,
        token,
        isAuthenticated: !!token,
        authLoading,
        authError,
        restaurantName,
        restaurantId,
        requestOtp,
        verifyOtpSignup,
        login,
        logout,

        isOpen,
        prepBuffer,
        isRushSurge,
        autoAccept,
        audioChimeEnabled,
        toggleStoreOpen,
        toggleRushSurge,
        toggleAutoAccept,
        toggleAudioChime,
        playOrderChime,

        menuItems,
        menuLoading,
        loadMenu,
        toggleItemStock,
        saveDish,
        deleteDish,
        uploadMenuImage,

        settlements,
        activeOrders,
        acceptOrder,
        declineOrder,
        markOrderReady,
        triggerIncomingDemoOrder,
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
};

export const useMerchant = () => useContext(MerchantContext);
