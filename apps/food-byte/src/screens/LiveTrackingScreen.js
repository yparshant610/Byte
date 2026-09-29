import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { createOrderSocket } from '@repo/api-client';
export const LiveTrackingScreen = ({ onOpenChat, onOpenReview, }) => {
    const { theme } = useTheme();
    const { activeOrder, setActiveOrder } = useCart();
    const isDark = theme === 'dark';
    const [driverPos, setDriverPos] = useState({ lat: 12.9750, lng: 77.5980 });
    const [etaMinutes, setEtaMinutes] = useState(18);
    const stages = [
        { key: 'PENDING', label: 'Order Placed', icon: 'receipt' },
        { key: 'ACCEPTED', label: 'Accepted', icon: 'check_circle' },
        { key: 'PREPARING', label: 'Kitchen Prep', icon: 'soup_kitchen' },
        { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', icon: 'inventory' },
        { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: 'delivery_dining' },
        { key: 'DELIVERED', label: 'Delivered', icon: 'task_alt' },
    ];
    const currentStatus = activeOrder?.status || 'PREPARING';
    const currentStageIndex = stages.findIndex(s => s.key === currentStatus);
    // Live WebSocket Connection
    useEffect(() => {
        if (!activeOrder?.id)
            return;
        const socket = createOrderSocket();
        socket.emit('join_order', { orderId: activeOrder.id });
        socket.on('order:status_updated', (data) => {
            if (data?.newStatus) {
                setActiveOrder(prev => (prev ? { ...prev, status: data.newStatus } : null));
            }
        });
        socket.on('driver:location_broadcast', (telemetry) => {
            if (telemetry?.lat && telemetry?.lng) {
                setDriverPos({ lat: telemetry.lat, lng: telemetry.lng });
            }
        });
        return () => {
            socket.disconnect();
        };
    }, [activeOrder?.id, setActiveOrder]);
    // Simulate smooth driver movement
    useEffect(() => {
        const interval = setInterval(() => {
            setDriverPos(prev => ({
                lat: prev.lat + (Math.random() - 0.5) * 0.0005,
                lng: prev.lng + (Math.random() - 0.5) * 0.0005,
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    const advanceStage = (next) => {
        setActiveOrder(prev => (prev ? { ...prev, status: next } : null));
    };
    return (_jsxs("div", { className: `flex flex-col min-h-full pb-8 ${isDark ? 'bg-[#131315]' : 'bg-[#fcf9f8]'}`, children: [_jsxs("div", { className: "relative w-full h-72 overflow-hidden bg-[#e0dede] dark:bg-[#1a1a1f]", children: [_jsxs("svg", { className: "w-full h-full object-cover opacity-60 dark:opacity-40", viewBox: "0 0 400 300", children: [_jsx("rect", { width: "400", height: "300", fill: isDark ? '#1a1a1e' : '#f0edea' }), _jsx("path", { d: "M 0 150 Q 200 120 400 150", stroke: isDark ? '#2e2d33' : '#ffffff', strokeWidth: "18", fill: "none" }), _jsx("path", { d: "M 120 0 L 140 300", stroke: isDark ? '#2e2d33' : '#ffffff', strokeWidth: "14", fill: "none" }), _jsx("path", { d: "M 280 0 L 260 300", stroke: isDark ? '#2e2d33' : '#ffffff', strokeWidth: "14", fill: "none" }), _jsx("path", { d: "M 0 60 L 400 240", stroke: isDark ? '#2e2d33' : '#ffffff', strokeWidth: "10", fill: "none" }), _jsx("rect", { x: "30", y: "20", width: "70", height: "80", rx: "8", fill: isDark ? '#1d2a24' : '#e2ede7' }), _jsx("rect", { x: "290", y: "40", width: "80", height: "90", rx: "8", fill: isDark ? '#22232a' : '#e6e4e2' }), _jsx("rect", { x: "150", y: "180", width: "90", height: "70", rx: "8", fill: isDark ? '#22232a' : '#e6e4e2' })] }), _jsxs("div", { className: "absolute top-16 left-12 flex flex-col items-center", children: [_jsx("div", { className: "w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg ring-2 ring-white", children: _jsx("span", { className: "material-symbols-outlined text-[18px]", children: "restaurant" }) }), _jsx("span", { className: "text-[10px] font-extrabold px-2 py-0.5 mt-1 rounded-md bg-black/70 text-white backdrop-blur-md", children: "Tony's Pizza" })] }), _jsxs("div", { className: "absolute bottom-16 right-12 flex flex-col items-center", children: [_jsx("div", { className: "w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg ring-2 ring-white", children: _jsx("span", { className: "material-symbols-outlined text-[18px]", children: "home" }) }), _jsx("span", { className: "text-[10px] font-extrabold px-2 py-0.5 mt-1 rounded-md bg-black/70 text-white backdrop-blur-md", children: "Your Home" })] }), _jsxs("div", { className: "absolute top-[48%] left-[45%] flex flex-col items-center -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-11 h-11 rounded-full bg-[#bb0021] dark:bg-[#ff1e38] text-white flex items-center justify-center shadow-xl ring-4 ring-rose-500/30 animate-pulse-subtle", children: _jsx("span", { className: "material-symbols-outlined text-[22px]", children: "two_wheeler" }) }), _jsx("div", { className: "absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" })] }), _jsx("span", { className: "text-[10px] font-extrabold px-2 py-0.5 mt-1 rounded-full bg-[#bb0021] dark:bg-[#ff1e38] text-white shadow-md", children: "Rajesh \u2022 18 min" })] }), _jsxs("div", { className: "absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none", children: [_jsxs("div", { className: "px-3.5 py-1.5 rounded-full bg-black/70 text-white backdrop-blur-md flex items-center gap-1.5 text-xs font-bold shadow-lg", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-ping" }), _jsx("span", { children: "Live GPS Telemetry" })] }), _jsxs("div", { className: "px-3 py-1.5 rounded-xl bg-black/70 text-white backdrop-blur-md text-xs font-bold", children: ["Order #", activeOrder?.id?.slice(-6) || '101'] })] })] }), _jsx("div", { className: "relative -mt-6 mx-4 z-20", children: _jsxs("div", { className: `p-4 rounded-2xl shadow-xl flex flex-col gap-3.5 ${isDark ? 'bg-[#1b1b1d] border border-white/10 text-white' : 'bg-white border border-black/5 text-[#1c1b1b]'}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-wider text-[#bb0021] dark:text-[#ff1e38]", children: "Estimated Delivery" }), _jsx("h2", { className: "text-xl font-extrabold tracking-tight mt-0.5", children: currentStatus === 'DELIVERED' ? 'Order Delivered! 🎉' : `${etaMinutes} mins • 8:24 PM` })] }), _jsx("div", { className: "w-12 h-12 rounded-2xl bg-rose-500/10 text-[#bb0021] dark:text-[#ff1e38] flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-[26px]", children: currentStatus === 'DELIVERED' ? 'celebration' : 'timer' }) })] }), _jsxs("div", { className: "flex items-center justify-between relative mt-2 mb-2", children: [_jsx("div", { className: "absolute left-2 right-2 top-3 h-0.5 bg-black/10 dark:bg-white/10 -z-0" }), stages.map((st, idx) => {
                                    const isPast = idx <= currentStageIndex;
                                    const isCurrent = idx === currentStageIndex;
                                    return (_jsxs("div", { className: "flex flex-col items-center gap-1 z-10", children: [_jsx("div", { className: `w-6 h-6 rounded-full flex items-center justify-center text-[12px] transition-all ${isPast
                                                    ? 'bg-[#bb0021] dark:bg-[#ff1e38] text-white font-bold ring-2 ring-rose-500/20 shadow-sm'
                                                    : isDark
                                                        ? 'bg-[#252528] text-white/40'
                                                        : 'bg-[#f0edec] text-black/30'}`, children: _jsx("span", { className: "material-symbols-outlined text-[13px]", children: st.icon }) }), _jsx("span", { className: `text-[9px] text-center font-bold tracking-tight max-w-[50px] ${isCurrent
                                                    ? 'text-[#bb0021] dark:text-[#ff1e38]'
                                                    : isPast
                                                        ? 'opacity-80'
                                                        : 'opacity-40'}`, children: st.label })] }, st.key));
                                })] }), _jsxs("div", { className: `p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-[#252528] border-white/10' : 'bg-[#f6f3f2] border-black/5'}`, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx("img", { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", alt: "Driver", className: "w-11 h-11 rounded-full object-cover ring-2 ring-[#bb0021] dark:ring-[#ff1e38]" }), _jsx("div", { className: "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-extrabold text-sm", children: "Rajesh Kumar" }), _jsxs("div", { className: "flex items-center gap-1.5 text-[11px] opacity-70", children: [_jsxs("span", { className: "flex items-center text-amber-500 font-bold", children: [_jsx("span", { className: "material-symbols-outlined text-[12px] icon-filled", children: "star" }), "4.9"] }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: "EV Scooter \u2022 KA 01 EQ 4402" })] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: onOpenChat, className: "w-9 h-9 rounded-full bg-[#bb0021] dark:bg-[#ff1e38] text-white flex items-center justify-center shadow-md active:scale-95 transition-all", title: "Open In-App Chat", children: _jsx("span", { className: "material-symbols-outlined text-[18px]", children: "chat" }) }), _jsx("a", { href: "tel:+919876543210", className: `w-9 h-9 rounded-full flex items-center justify-center border active:scale-95 transition-all ${isDark ? 'border-white/15 bg-white/10 text-white' : 'border-black/10 bg-white text-black'}`, children: _jsx("span", { className: "material-symbols-outlined text-[18px]", children: "call" }) })] })] }), currentStatus === 'DELIVERED' && (_jsxs("button", { onClick: onOpenReview, className: "w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all animate-bounce", children: [_jsx("span", { className: "material-symbols-outlined text-[18px]", children: "star" }), _jsx("span", { children: "Rate Food & Delivery Driver" })] })), _jsxs("div", { className: "mt-1 pt-2 border-t border-black/5 dark:border-white/5 flex flex-col gap-1.5", children: [_jsx("span", { className: "text-[10px] font-bold opacity-50 uppercase tracking-wider", children: "Simulate Live State Machine Transition:" }), _jsx("div", { className: "flex gap-1.5 overflow-x-auto no-scrollbar", children: stages.map(st => (_jsx("button", { onClick: () => advanceStage(st.key), className: `px-2 py-1 rounded-md text-[10px] font-bold border transition-all whitespace-nowrap ${currentStatus === st.key
                                            ? 'bg-[#bb0021] dark:bg-[#ff1e38] text-white border-transparent'
                                            : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 opacity-70'}`, children: st.label }, st.key))) })] })] }) })] }));
};
//# sourceMappingURL=LiveTrackingScreen.js.map