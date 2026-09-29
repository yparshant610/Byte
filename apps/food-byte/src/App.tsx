import React, { useState } from 'react';
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

type ScreenId =
  | 'auth'
  | 'home'
  | 'explore'
  | 'menu'
  | 'cart'
  | 'tracking'
  | 'chat'
  | 'review'
  | 'profile';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [customizingItem, setCustomizingItem] = useState<any | null>(null);

  // Default sample customizable item
  const sampleDish = {
    id: 'dish_margherita_01',
    restaurantId: '30000000-0000-0000-0000-000000000001',
    restaurantName: "Tony's Artisan Pizza",
    name: 'Margherita Classica',
    description: 'San Marzano tomato coulis, fresh buffalo mozzarella, aromatic sweet basil leaves, EVOO.',
    price: 12.99,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBeVIQtKPYMee5d0yGX0Cb2DAweFdGIc6U1qUV90kelEj3kYItVHuVtlVGo4xf4v48c9lXXu-f5MgKEVATtRCyVJGfOHfldE2njmzUhxBfD1V2OlHX0Ng_CzvOuAxGeB9PV3dFbe_xDUmrsb5tJKj2v0pKfo7237vYUOdiKaxiQUYp_3F33lgqJxgYmWkjcGR0EfpV4WX4ut1zZrRh7glJ7YTNlqsaGti7Rv1cWzwAGkRS0mFCVPZ0',
  };

  const showBottomNav = ['home', 'explore', 'cart', 'tracking', 'profile'].includes(activeScreen);

  return (
    <DeviceFrame activeScreen={activeScreen} setActiveScreen={setActiveScreen}>
      <div className="flex-1 flex flex-col relative">
        {/* Screen Switcher */}
        {activeScreen === 'auth' && (
          <AuthScreen onSuccess={() => setActiveScreen('home')} />
        )}

        {activeScreen === 'home' && (
          <HomeScreen
            onSelectRestaurant={() => setActiveScreen('menu')}
            onNavigateExplore={() => setActiveScreen('explore')}
          />
        )}

        {activeScreen === 'explore' && (
          <ExploreScreen
            onSelectRestaurant={() => setActiveScreen('menu')}
            onOpenCustomization={item => setCustomizingItem(item)}
          />
        )}

        {activeScreen === 'menu' && (
          <RestaurantMenuScreen
            onBack={() => setActiveScreen('home')}
            onOpenCustomization={item => setCustomizingItem(item)}
          />
        )}

        {activeScreen === 'cart' && (
          <CartScreen
            onCheckoutSuccess={() => setActiveScreen('tracking')}
            onContinueShopping={() => setActiveScreen('home')}
          />
        )}

        {activeScreen === 'tracking' && (
          <LiveTrackingScreen
            onOpenChat={() => setActiveScreen('chat')}
            onOpenReview={() => setActiveScreen('review')}
          />
        )}

        {activeScreen === 'chat' && (
          <CourierChatScreen onBack={() => setActiveScreen('tracking')} />
        )}

        {activeScreen === 'review' && (
          <RatingReviewScreen onDone={() => setActiveScreen('home')} />
        )}

        {activeScreen === 'profile' && (
          <ProfileScreen
            onReorder={() => setActiveScreen('cart')}
            onLogout={() => setActiveScreen('auth')}
          />
        )}

        {/* Item Detail Customization Modal Sheet */}
        {customizingItem && (
          <ItemCustomizationModal
            item={customizingItem}
            onClose={() => setCustomizingItem(null)}
            onAdded={() => {
              setCustomizingItem(null);
              setActiveScreen('cart');
            }}
          />
        )}
      </div>

      {/* Persistent Bottom Tab Bar */}
      {showBottomNav && (
        <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      )}
    </DeviceFrame>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
export default App;
