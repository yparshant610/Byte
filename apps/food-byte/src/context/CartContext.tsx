import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient, Cart, CartItem, MenuItemOption, Order } from '@repo/api-client';

interface CartContextType {
  cart: Cart | null;
  activeOrder: Order | null;
  setActiveOrder: React.Dispatch<React.SetStateAction<Order | null>>;
  addItem: (item: {
    restaurantId: string;
    restaurantName: string;
    itemId: string;
    name: string;
    quantity: number;
    basePrice: number;
    selectedOptions?: MenuItemOption[];
  }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: (details: {
    deliveryAddress: string;
    destinationLat: number;
    destinationLng: number;
    deliveryNotes?: string;
    driverTip?: number;
  }) => Promise<Order>;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  activeOrder: null,
  setActiveOrder: () => {},
  addItem: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
  checkout: async () => ({} as Order),
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(() => {
    // Seed initial demo cart so user sees pre-populated tasty item if desired
    return {
      userId: 'u0000001-0000-0000-0000-000000000001',
      restaurantId: '30000000-0000-0000-0000-000000000001',
      restaurantName: "Tony's Artisan Pizza",
      items: [
        {
          itemId: 'dish_margherita_01',
          name: 'Margherita Classica',
          quantity: 2,
          basePrice: 12.99,
          unitPrice: 16.49,
          itemTotal: 32.98,
          selectedOptions: [
            { groupName: 'Size', choiceName: '12 inch Medium', additionalPrice: 3.50 },
          ],
        },
      ],
      subtotal: 32.98,
      itemCount: 2,
      updatedAt: Date.now(),
    };
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    return {
      id: 'ord_sample_101',
      userId: '10000000-0000-0000-0000-000000000001',
      restaurantId: '30000000-0000-0000-0000-000000000001',
      restaurantName: "Tony's Artisan Pizza",
      driverId: '80000000-0000-0000-0000-000000000001',
      status: 'PREPARING',
      items: [
        {
          itemId: '50000000-0000-0000-0000-000000000001',
          name: 'Margherita Classica',
          quantity: 2,
          unitPrice: 16.49,
          totalPrice: 32.98,
          options: [{ groupName: 'Size', choiceName: '12 inch Medium', additionalPrice: 3.50 }],
        },
      ],
      subtotal: 32.98,
      taxAmount: 1.65,
      deliveryFee: 2.49,
      driverTip: 3.00,
      totalAmount: 40.12,
      split: {
        platformCommission: 7.09,
        restaurantPayout: 26.38,
        driverPayout: 4.99,
        vendorDriverTotalPayout: 31.37,
      },
      deliveryAddress: 'Penthouse 4B, MG Road Boulevard, Bangalore',
      deliveryNotes: 'Leave with front desk security',
      createdAt: Date.now() - 15 * 60 * 1000,
      updatedAt: Date.now() - 5 * 60 * 1000,
    };
  });

  // Try fetching cart from backend
  useEffect(() => {
    apiClient
      .getCart()
      .then(serverCart => {
        if (serverCart && serverCart.items.length > 0) {
          setCart(serverCart);
        }
      })
      .catch(() => {});
  }, []);

  const addItem = async (item: {
    restaurantId: string;
    restaurantName: string;
    itemId: string;
    name: string;
    quantity: number;
    basePrice: number;
    selectedOptions?: MenuItemOption[];
  }) => {
    try {
      const serverCart = await apiClient.addItemToCart({ ...item, clearExisting: false });
      setCart(serverCart);
    } catch {
      // Local optimistic update
      const optionSum = (item.selectedOptions || []).reduce((acc, o) => acc + o.additionalPrice, 0);
      const unitPrice = parseFloat((item.basePrice + optionSum).toFixed(2));
      const itemTotal = parseFloat((unitPrice * item.quantity).toFixed(2));

      setCart(prev => {
        const isDifferentRestaurant = prev && prev.restaurantId !== item.restaurantId;
        const currentItems = isDifferentRestaurant || !prev ? [] : [...prev.items];
        currentItems.push({
          itemId: item.itemId,
          name: item.name,
          quantity: item.quantity,
          basePrice: item.basePrice,
          unitPrice,
          itemTotal,
          selectedOptions: item.selectedOptions,
        });
        const subtotal = parseFloat(currentItems.reduce((acc, it) => acc + it.itemTotal, 0).toFixed(2));
        const itemCount = currentItems.reduce((acc, it) => acc + it.quantity, 0);

        return {
          userId: 'u0000001-0000-0000-0000-000000000001',
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName,
          items: currentItems,
          subtotal,
          itemCount,
          updatedAt: Date.now(),
        };
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const updated = await apiClient.updateCartItem(itemId, quantity);
      setCart(updated);
    } catch {
      setCart(prev => {
        if (!prev) return null;
        let items: CartItem[] = [];
        if (quantity <= 0) {
          items = prev.items.filter(i => i.itemId !== itemId);
        } else {
          items = prev.items.map(i =>
            i.itemId === itemId
              ? { ...i, quantity, itemTotal: parseFloat((i.unitPrice * quantity).toFixed(2)) }
              : i,
          );
        }
        if (items.length === 0) return null;
        const subtotal = parseFloat(items.reduce((acc, it) => acc + it.itemTotal, 0).toFixed(2));
        const itemCount = items.reduce((acc, it) => acc + it.quantity, 0);
        return { ...prev, items, subtotal, itemCount };
      });
    }
  };

  const removeItem = async (itemId: string) => {
    updateQuantity(itemId, 0);
  };

  const clearCart = async () => {
    try {
      await apiClient.clearCart();
    } catch {}
    setCart(null);
  };

  const checkout = async (details: {
    deliveryAddress: string;
    destinationLat: number;
    destinationLng: number;
    deliveryNotes?: string;
    driverTip?: number;
  }): Promise<Order> => {
    try {
      const res = await apiClient.checkout(details);
      setActiveOrder(res.order);
      setCart(null);
      return res.order;
    } catch (err: any) {
      // Local demo fallback order
      const subtotal = cart?.subtotal || 32.98;
      const taxAmount = parseFloat((subtotal * 0.05).toFixed(2));
      const deliveryFee = 2.49;
      const driverTip = details.driverTip || 3.00;
      const totalAmount = parseFloat((subtotal + taxAmount + deliveryFee + driverTip).toFixed(2));

      const fallbackOrder: Order = {
        id: `ord_${Date.now()}`,
        userId: 'u0000001-0000-0000-0000-000000000001',
        restaurantId: cart?.restaurantId || '30000000-0000-0000-0000-000000000001',
        restaurantName: cart?.restaurantName || "Tony's Artisan Pizza",
        driverId: '80000000-0000-0000-0000-000000000001',
        status: 'PENDING',
        items: cart?.items.map(i => ({
          itemId: i.itemId,
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalPrice: i.itemTotal,
          options: i.selectedOptions,
        })) || [],
        subtotal,
        taxAmount,
        deliveryFee,
        driverTip,
        totalAmount,
        split: {
          platformCommission: parseFloat(((subtotal + deliveryFee) * 0.20).toFixed(2)),
          restaurantPayout: parseFloat((subtotal * 0.80).toFixed(2)),
          driverPayout: parseFloat(((deliveryFee * 0.80) + driverTip).toFixed(2)),
          vendorDriverTotalPayout: parseFloat(((subtotal * 0.80) + (deliveryFee * 0.80) + driverTip).toFixed(2)),
        },
        deliveryAddress: details.deliveryAddress,
        deliveryNotes: details.deliveryNotes,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setActiveOrder(fallbackOrder);
      setCart(null);
      return fallbackOrder;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        activeOrder,
        setActiveOrder,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
