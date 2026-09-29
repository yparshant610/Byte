import React from 'react';
interface ExploreScreenProps {
    onSelectRestaurant: (restaurantId: string) => void;
    onOpenCustomization: (item: any) => void;
}
export declare const ExploreScreen: React.FC<ExploreScreenProps>;
export {};
