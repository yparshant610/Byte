import React from 'react';
interface DeviceFrameProps {
    children: React.ReactNode;
    activeScreen: string;
    setActiveScreen: (screen: any) => void;
}
export declare const DeviceFrame: React.FC<DeviceFrameProps>;
export {};
