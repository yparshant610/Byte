import React from 'react';
interface HomeScreenProps {
    onSelectRestaurant: (restaurantId: string) => void;
    onNavigateExplore: () => void;
}
export declare const HomeScreen: React.FC<HomeScreenProps>;
export {};
