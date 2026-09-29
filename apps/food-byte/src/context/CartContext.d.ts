import React from 'react';
import { Cart, MenuItemOption, Order } from '@repo/api-client';
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
export declare const CartProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useCart: () => CartContextType;
export {};
