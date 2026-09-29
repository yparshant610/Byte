import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { BottomNav } from './components/common/BottomNav';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { RestaurantMenuScreen } from './screens/RestaurantMenuScreen';
import { ItemCustomizationModal } from './components/ItemCustomizationModal';
import { CartScreen } from './screens/CartScreen';
import { LiveTrackingScreen } from './screens/LiveTrackingScreen';
import { CourierChatScreen } from './screens/CourierChatScreen';
import { RatingReviewScreen } from './screens/RatingReviewScreen';
import { ProfileScreen } from './screens/ProfileScreen';
const AppContent = () => {
    const { isAuthenticated } = useAuth();
    const [activeScreen, setActiveScreen] = useState('home');
    const [customizingItem, setCustomizingItem] = useState(null);
    // Default sample customizable item
    const sampleDish = {
        id: 'dish_margherita_01',
        restaurantId: '30000000-0000-0000-0000-000000000001',
        restaurantName: "Tony's Artisan Pizza",
        name: 'Margherita Classica',
        description: 'San Marzano tomato coulis, fresh buffalo mozzarella, aromatic sweet basil leaves, EVOO.',
        price: 12.99,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeVIQtKPYMee5d0yGX0Cb2DAweFdGIc6U1qUV90kelEj3kYItVHuVtlVGo4xf4v48c9lXXu-f5MgKEVATtRCyVJGfOHfldE2njmzUhxBfD1V2OlHX0Ng_CzvOuAxGeB9PV3dFbe_xDUmrsb5tJKj2v0pKfo7237vYUOdiKaxiQUYp_3F33lgqJxgYmWkjcGR0EfpV4WX4ut1zZrRh7glJ7YTNlqsaGti7Rv1cWzwAGkRS0mFCVPZ0',
    };
    const showBottomNav = ['home', 'explore', 'cart', 'tracking', 'profile'].includes(activeScreen);
    return (_jsxs(DeviceFrame, { activeScreen: activeScreen, setActiveScreen: setActiveScreen, children: [_jsxs("div", { className: "flex-1 flex flex-col relative", children: [activeScreen === 'auth' && (_jsx(AuthScreen, { onSuccess: () => setActiveScreen('home') })), activeScreen === 'home' && (_jsx(HomeScreen, { onSelectRestaurant: () => setActiveScreen('menu'), onNavigateExplore: () => setActiveScreen('explore') })), activeScreen === 'explore' && (_jsx(ExploreScreen, { onSelectRestaurant: () => setActiveScreen('menu'), onOpenCustomization: item => setCustomizingItem(item) })), activeScreen === 'menu' && (_jsx(RestaurantMenuScreen, { onBack: () => setActiveScreen('home'), onOpenCustomization: item => setCustomizingItem(item) })), activeScreen === 'cart' && (_jsx(CartScreen, { onCheckoutSuccess: () => setActiveScreen('tracking'), onContinueShopping: () => setActiveScreen('home') })), activeScreen === 'tracking' && (_jsx(LiveTrackingScreen, { onOpenChat: () => setActiveScreen('chat'), onOpenReview: () => setActiveScreen('review') })), activeScreen === 'chat' && (_jsx(CourierChatScreen, { onBack: () => setActiveScreen('tracking') })), activeScreen === 'review' && (_jsx(RatingReviewScreen, { onDone: () => setActiveScreen('home') })), activeScreen === 'profile' && (_jsx(ProfileScreen, { onReorder: () => setActiveScreen('cart'), onLogout: () => setActiveScreen('auth') })), customizingItem && (_jsx(ItemCustomizationModal, { item: customizingItem, onClose: () => setCustomizingItem(null), onAdded: () => {
                            setCustomizingItem(null);
                            setActiveScreen('cart');
                        } }))] }), showBottomNav && (_jsx(BottomNav, { activeScreen: activeScreen, setActiveScreen: setActiveScreen }))] }));
};
export const App = () => {
    return (_jsx(ThemeProvider, { children: _jsx(AuthProvider, { children: _jsx(CartProvider, { children: _jsx(AppContent, {}) }) }) }));
};
export default App;
//# sourceMappingURL=App.js.map