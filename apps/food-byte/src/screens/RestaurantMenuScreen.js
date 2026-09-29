import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
export const RestaurantMenuScreen = ({ onBack, onOpenCustomization, }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeTab, setActiveTab] = useState('Pizzas');
    const categories = ['Popular', 'Pizzas', 'Starters', 'Beverages', 'Desserts'];
    const dishes = [
        {
            id: 'dish_margherita_01',
            restaurantId: '30000000-0000-0000-0000-000000000001',
            restaurantName: "Tony's Artisan Pizza",
            name: 'Margherita Classica',
            description: 'San Marzano tomato coulis, fresh buffalo mozzarella, aromatic sweet basil leaves, EVOO.',
            price: 12.99,
            rating: 4.9,
            isVegetarian: true,
            category: 'Pizzas',
            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeVIQtKPYMee5d0yGX0Cb2DAweFdGIc6U1qUV90kelEj3kYItVHuVtlVGo4xf4v48c9lXXu-f5MgKEVATtRCyVJGfOHfldE2njmzUhxBfD1V2OlHX0Ng_CzvOuAxGeB9PV3dFbe_xDUmrsb5tJKj2v0pKfo7237vYUOdiKaxiQUYp_3F33lgqJxgYmWkjcGR0EfpV4WX4ut1zZrRh7glJ7YTNlqsaGti7Rv1cWzwAGkRS0mFCVPZ0',
        },
        {
            id: 'dish_diavola_02',
            restaurantId: '30000000-0000-0000-0000-000000000001',
            restaurantName: "Tony's Artisan Pizza",
            name: 'Diavola Piccante',
            description: 'Spicy artisanal salami, Calabrian chili oil, smoked fior di latte, aged pecorino.',
            price: 15.49,
            rating: 4.8,
            category: 'Pizzas',
            imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=80',
        },
        {
            id: 'dish_burrata_03',
            restaurantId: '30000000-0000-0000-0000-000000000001',
            restaurantName: "Tony's Artisan Pizza",
            name: 'Truffle Burrata Pugliese',
            description: 'Creamy burrata heart, black summer truffle carpaccio, heirloom baby tomatoes.',
            price: 16.99,
            rating: 4.9,
            isVegetarian: true,
            category: 'Starters',
            imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69102553?w=500&auto=format&fit=crop&q=80',
        },
        {
            id: 'dish_tiramisu_04',
            restaurantId: '30000000-0000-0000-0000-000000000001',
            restaurantName: "Tony's Artisan Pizza",
            name: 'Signature Venetian Tiramisu',
            description: 'Savoiardi soaked in dark espresso & amaretto, velvety mascarpone cream, dark cocoa.',
            price: 8.50,
            rating: 5.0,
            isVegetarian: true,
            category: 'Desserts',
            imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=80',
        },
    ];
    const displayedDishes = activeTab === 'Popular' ? dishes : dishes.filter(d => d.category === activeTab);
    return (_jsxs("div", { className: `flex flex-col min-h-full pb-10 ${isDark ? 'bg-[#131315]' : 'bg-[#fcf9f8]'}`, children: [_jsxs("div", { className: "relative w-full h-56 overflow-hidden", children: [_jsx("img", { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeVIQtKPYMee5d0yGX0Cb2DAweFdGIc6U1qUV90kelEj3kYItVHuVtlVGo4xf4v48c9lXXu-f5MgKEVATtRCyVJGfOHfldE2njmzUhxBfD1V2OlHX0Ng_CzvOuAxGeB9PV3dFbe_xDUmrsb5tJKj2v0pKfo7237vYUOdiKaxiQUYp_3F33lgqJxgYmWkjcGR0EfpV4WX4ut1zZrRh7glJ7YTNlqsaGti7Rv1cWzwAGkRS0mFCVPZ0", alt: "Tony's Artisan Pizza", className: "w-full h-full object-cover" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" }), _jsxs("div", { className: "absolute top-4 left-4 right-4 flex items-center justify-between z-10", children: [_jsx("button", { onClick: onBack, className: "w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 active:scale-95 transition-all", children: _jsx("span", { className: "material-symbols-outlined text-[20px]", children: "arrow_back" }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 active:scale-95 transition-all", children: _jsx("span", { className: "material-symbols-outlined text-[18px]", children: "share" }) }), _jsx("button", { className: "w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 active:scale-95 transition-all", children: _jsx("span", { className: "material-symbols-outlined text-[18px]", children: "bookmark_border" }) })] })] })] }), _jsx("div", { className: "relative -mt-6 mx-4 z-20", children: _jsxs("div", { className: `p-4 rounded-2xl shadow-lg flex flex-col gap-2 ${isDark
                        ? 'bg-[#1b1b1d] border border-white/[0.08] text-white'
                        : 'bg-white border border-black/[0.04] text-[#1c1b1b]'}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "font-extrabold text-lg tracking-tight", children: "Tony's Artisan Pizza" }), _jsx("span", { className: "px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-[#bb0021] dark:text-[#ff1e38]", children: "Chef's Pick" })] }), _jsx("p", { className: "text-xs opacity-60", children: "Italian \u2022 Hand-tossed Neapolitan Crust \u2022 Wood Fired" }), _jsxs("div", { className: "flex items-center gap-3 text-xs font-bold pt-2 border-t border-black/5 dark:border-white/5", children: [_jsxs("div", { className: "flex items-center gap-1 text-amber-500", children: [_jsx("span", { className: "material-symbols-outlined text-[15px] icon-filled", children: "star" }), _jsx("span", { children: "4.8 (1.2k+)" })] }), _jsx("span", { children: "\u2022" }), _jsxs("div", { className: "flex items-center gap-1 opacity-80", children: [_jsx("span", { className: "material-symbols-outlined text-[15px]", children: "schedule" }), _jsx("span", { children: "20-25 mins" })] }), _jsx("span", { children: "\u2022" }), _jsx("span", { className: "opacity-80", children: "0.9 km" })] })] }) }), _jsx("div", { className: "sticky top-0 z-30 px-4 mt-4 py-2 backdrop-blur-xl border-b border-black/5 dark:border-white/5 flex gap-2 overflow-x-auto no-scrollbar", children: categories.map(cat => (_jsx("button", { onClick: () => setActiveTab(cat), className: `px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${activeTab === cat
                        ? isDark
                            ? 'bg-[#ff1e38] text-white shadow-md'
                            : 'bg-[#bb0021] text-white shadow-sm'
                        : 'opacity-70 hover:opacity-100 bg-black/5 dark:bg-white/10'}`, children: cat }, cat))) }), _jsx("div", { className: "px-4 mt-4 flex flex-col gap-4", children: displayedDishes.map(dish => (_jsxs("div", { className: `p-3.5 rounded-2xl flex gap-3.5 items-center transition-all shadow-sm ${isDark
                        ? 'bg-[#1b1b1d] border border-white/[0.08]'
                        : 'bg-white border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)]'}`, children: [_jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [dish.isVegetarian && (_jsx("div", { className: "w-3.5 h-3.5 rounded-sm bg-white p-0.5 shadow-xs flex items-center justify-center border border-emerald-600", children: _jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-600" }) })), _jsx("h3", { className: "font-extrabold text-sm truncate", children: dish.name })] }), _jsx("p", { className: "text-[11px] opacity-60 line-clamp-2 leading-tight", children: dish.description }), _jsxs("div", { className: "flex items-center justify-between mt-2", children: [_jsxs("span", { className: "font-extrabold text-sm text-[#bb0021] dark:text-[#ff1e38]", children: ["$", dish.price.toFixed(2)] }), _jsxs("button", { onClick: () => onOpenCustomization(dish), className: `px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1 active:scale-95 ${isDark
                                                ? 'bg-[#ff1e38] text-white hover:bg-[#ff344c]'
                                                : 'bg-[#bb0021] text-white hover:bg-[#d60026]'}`, children: [_jsx("span", { className: "material-symbols-outlined text-[14px]", children: "add" }), _jsx("span", { children: "Add" })] })] })] }), _jsx("div", { className: "relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0", children: _jsx("img", { src: dish.imageUrl, alt: dish.name, className: "w-full h-full object-cover" }) })] }, dish.id))) })] }));
};
//# sourceMappingURL=RestaurantMenuScreen.js.map