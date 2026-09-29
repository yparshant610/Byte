import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
export const HomeScreen = ({ onSelectRestaurant, onNavigateExplore, }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const isDark = theme === 'dark';
    const categories = [
        {
            name: 'Pizza',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeVIQtKPYMee5d0yGX0Cb2DAweFdGIc6U1qUV90kelEj3kYItVHuVtlVGo4xf4v48c9lXXu-f5MgKEVATtRCyVJGfOHfldE2njmzUhxBfD1V2OlHX0Ng_CzvOuAxGeB9PV3dFbe_xDUmrsb5tJKj2v0pKfo7237vYUOdiKaxiQUYp_3F33lgqJxgYmWkjcGR0EfpV4WX4ut1zZrRh7glJ7YTNlqsaGti7Rv1cWzwAGkRS0mFCVPZ0',
        },
        {
            name: 'Burgers',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpXNaOS-z9EyRSqKak3w-f1cjkh6V7lOFlc_8tXdKeNQaqAkHha7f9g1zc6W3A31L0X9zBO83WEMZF9vAKEXO87bXbYhnNBdebMti0i02tc0nL9tyycEglaBEl4JdmiNOujApmAUsZDhpqBGhkpqyESKbTh0PjDrfT1oh6d3-GE9E_fQ-rCd9CLCt_gRt5M6hfpR7BX-uxZKG3lp3oR_UiSZ0hifX-8U5IvNG8UoO86Hsvcdg28N0',
        },
        {
            name: 'Indian',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbfsaTS7SYazlSZC9-NH3Vo9wKVNl-LjXRL6KXk8hg_202WgGv6NI-EXqO8FSbnQfiOIHbYeIlmyKxkTrIfs6OAvvz0nBwkzAmMeToNPFD78_5xGKcB0J7K2J_TDT4mtEAR901YwRcCqA_nQ6YJCMsVdVrsp1nnweCPFyMCe632l0Y7hZzgotw5nbGj9VnAjU_FgN7fogYqwDN4LMTIipl7BMc0aDt0X3vkZKM7qaDVoRq1k8onN8',
        },
        {
            name: 'Sushi',
            image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=80',
        },
        {
            name: 'Desserts',
            image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&auto=format&fit=crop&q=80',
        },
        {
            name: 'Bowls',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
        },
    ];
    const featuredRestaurants = [
        {
            id: '30000000-0000-0000-0000-000000000001',
            name: "Tony's Artisan Pizza",
            cuisine: ['Italian', 'Wood-fired Pizza', 'Pasta'],
            rating: 4.8,
            reviews: '1.2k+',
            prepTime: '20-25 mins',
            distance: '0.9 km',
            deliveryFee: '$2.49',
            badge: "Chef's Choice",
            bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeVIQtKPYMee5d0yGX0Cb2DAweFdGIc6U1qUV90kelEj3kYItVHuVtlVGo4xf4v48c9lXXu-f5MgKEVATtRCyVJGfOHfldE2njmzUhxBfD1V2OlHX0Ng_CzvOuAxGeB9PV3dFbe_xDUmrsb5tJKj2v0pKfo7237vYUOdiKaxiQUYp_3F33lgqJxgYmWkjcGR0EfpV4WX4ut1zZrRh7glJ7YTNlqsaGti7Rv1cWzwAGkRS0mFCVPZ0',
        },
        {
            id: '30000000-0000-0000-0000-000000000002',
            name: 'The Gourmet Burger Lab',
            cuisine: ['American', 'Craft Burgers', 'Loaded Fries'],
            rating: 4.7,
            reviews: '850+',
            prepTime: '25-30 mins',
            distance: '1.2 km',
            deliveryFee: '$1.99',
            badge: 'Bestseller',
            bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpXNaOS-z9EyRSqKak3w-f1cjkh6V7lOFlc_8tXdKeNQaqAkHha7f9g1zc6W3A31L0X9zBO83WEMZF9vAKEXO87bXbYhnNBdebMti0i02tc0nL9tyycEglaBEl4JdmiNOujApmAUsZDhpqBGhkpqyESKbTh0PjDrfT1oh6d3-GE9E_fQ-rCd9CLCt_gRt5M6hfpR7BX-uxZKG3lp3oR_UiSZ0hifX-8U5IvNG8UoO86Hsvcdg28N0',
        },
        {
            id: '30000000-0000-0000-0000-000000000003',
            name: 'Sakura Sushi House',
            cuisine: ['Japanese', 'Fresh Sashimi', 'Ramen'],
            rating: 4.9,
            reviews: '2.1k+',
            prepTime: '30-35 mins',
            distance: '3.4 km',
            deliveryFee: '$3.49',
            badge: 'Michelin Guide',
            bannerUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
        },
    ];
    return (_jsxs("div", { className: `flex flex-col min-h-full pb-8 ${isDark ? 'bg-[#131315]' : 'bg-[#fcf9f8]'}`, children: [_jsxs("header", { className: `sticky top-0 z-30 px-4 py-3 flex items-center justify-between backdrop-blur-xl border-b ${isDark
                    ? 'bg-[#131315]/90 border-white/[0.08]'
                    : 'bg-[#fcf9f8]/90 border-black/[0.04] shadow-[0_1px_8px_rgba(0,0,0,0.03)]'}`, children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-[#bb0021] dark:bg-[#ff1e38] flex items-center justify-center text-white shadow-sm", children: _jsx("span", { className: "material-symbols-outlined text-[18px]", children: "restaurant" }) }), _jsxs("div", { className: "flex flex-col", children: [_jsxs("div", { className: "flex items-center gap-1 text-[11px] font-bold text-[#bb0021] dark:text-[#ff1e38] uppercase tracking-wider", children: [_jsx("span", { children: "Delivering to" }), _jsx("span", { className: "material-symbols-outlined text-[14px]", children: "keyboard_arrow_down" })] }), _jsx("span", { className: "font-extrabold text-sm truncate max-w-[150px]", children: "Penthouse 4B, MG Road" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-[19px]", children: "notifications" }) }), _jsx("div", { className: "w-8 h-8 rounded-full bg-[#bb0021] dark:bg-[#ff1e38] flex items-center justify-center text-white text-xs font-bold", children: user?.name ? user.name[0] : 'A' })] })] }), _jsx("section", { className: `relative px-4 pt-4 pb-6 rounded-b-[2rem] shadow-lg overflow-hidden ${isDark
                    ? 'bg-gradient-to-b from-[#bd001a] to-[#8d0013] border-b border-white/[0.08]'
                    : 'bg-[#bb0021] text-white shadow-[#bb0021]/15'}`, children: _jsxs("div", { className: "relative z-10 flex flex-col gap-3", children: [_jsxs("div", { onClick: onNavigateExplore, className: `w-full h-12 px-4 rounded-full flex items-center gap-3 cursor-pointer shadow-md transition-all active:scale-[0.99] ${isDark ? 'bg-[#131315] border border-white/15 text-white' : 'bg-white text-[#1c1b1b]'}`, children: [_jsx("span", { className: "material-symbols-outlined text-[20px] opacity-60 text-[#bb0021] dark:text-[#ff1e38]", children: "search" }), _jsx("span", { className: "text-xs opacity-60 font-medium", children: "Search pizza, burgers, sushi..." }), _jsx("div", { className: "ml-auto w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-[18px]", children: "tune" }) })] }), _jsxs("div", { className: "flex items-center justify-between text-white text-xs font-bold px-1 pt-1", children: [_jsxs("div", { className: "flex items-center gap-1.5 opacity-95", children: [_jsx("span", { className: "material-symbols-outlined text-[16px] text-[#ffb77a]", children: "bolt" }), _jsx("span", { children: "Fastest in 25 mins" })] }), _jsxs("div", { className: "flex items-center gap-1.5 opacity-95", children: [_jsx("span", { className: "material-symbols-outlined text-[16px] text-[#ffb77a]", children: "local_activity" }), _jsx("span", { children: "Zero delivery on $15+" })] })] })] }) }), _jsxs("section", { className: "mt-4 flex flex-col", children: [_jsxs("div", { className: "px-4 flex items-center justify-between mb-2", children: [_jsx("h2", { className: "font-extrabold text-sm", children: "Categories" }), _jsxs("button", { onClick: onNavigateExplore, className: "text-xs font-bold text-[#bb0021] dark:text-[#ff1e38] flex items-center", children: ["See All ", _jsx("span", { className: "material-symbols-outlined text-[14px]", children: "chevron_right" })] })] }), _jsx("div", { className: "flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar", children: categories.map((c, idx) => (_jsxs("button", { onClick: onNavigateExplore, className: "flex flex-col items-center gap-1.5 flex-shrink-0 group active:scale-95 transition-transform", children: [_jsx("div", { className: `w-14 h-14 rounded-full p-0.5 shadow-sm overflow-hidden flex items-center justify-center ${isDark ? 'bg-[#1b1b1d] border border-white/10' : 'bg-white border border-black/5'}`, children: _jsx("img", { src: c.image, alt: c.name, className: "w-full h-full object-cover rounded-full" }) }), _jsx("span", { className: "text-[11px] font-bold tracking-tight opacity-90", children: c.name })] }, idx))) })] }), _jsx("section", { className: "px-4 mt-3", children: _jsxs("div", { className: `w-full p-4 rounded-2xl relative overflow-hidden flex items-center justify-between shadow-md ${isDark
                        ? 'bg-gradient-to-r from-[#201f21] via-[#2a2a2c] to-[#201f21] border border-white/10'
                        : 'bg-gradient-to-r from-[#fff3e0] via-[#ffe0b2] to-[#ffcc80] border border-amber-200'}`, children: [_jsxs("div", { className: "flex flex-col max-w-[65%] z-10", children: [_jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-widest text-[#bb0021] dark:text-[#ff1e38]", children: "Limited Time Feast" }), _jsx("h3", { className: "font-extrabold text-sm mt-0.5 leading-snug", children: "20% OFF Gourmet Wood-Fired Pizzas" }), _jsxs("div", { className: "inline-flex items-center gap-1 mt-2 text-[10px] font-bold opacity-80", children: [_jsx("span", { children: "Use Code:" }), _jsx("span", { className: "px-2 py-0.5 rounded-md bg-[#bb0021] dark:bg-[#ff1e38] text-white", children: "BYTEFIRST" })] })] }), _jsx("div", { className: "w-20 h-20 rounded-full overflow-hidden shadow-lg flex-shrink-0", children: _jsx("img", { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeVIQtKPYMee5d0yGX0Cb2DAweFdGIc6U1qUV90kelEj3kYItVHuVtlVGo4xf4v48c9lXXu-f5MgKEVATtRCyVJGfOHfldE2njmzUhxBfD1V2OlHX0Ng_CzvOuAxGeB9PV3dFbe_xDUmrsb5tJKj2v0pKfo7237vYUOdiKaxiQUYp_3F33lgqJxgYmWkjcGR0EfpV4WX4ut1zZrRh7glJ7YTNlqsaGti7Rv1cWzwAGkRS0mFCVPZ0", alt: "Deal", className: "w-full h-full object-cover" }) })] }) }), _jsxs("section", { className: "px-4 mt-5 flex flex-col gap-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "font-extrabold text-base", children: "Popular Restaurants Near You" }), _jsx("span", { className: "text-xs font-semibold opacity-60", children: "Within 10 km" })] }), _jsx("div", { className: "flex flex-col gap-4", children: featuredRestaurants.map(r => (_jsxs("div", { onClick: () => onSelectRestaurant(r.id), className: `rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm ${isDark
                                ? 'bg-[#1b1b1d] border border-white/[0.08]'
                                : 'bg-white border border-black/[0.05] shadow-[0_4px_16px_rgba(0,0,0,0.04)]'}`, children: [_jsxs("div", { className: "relative w-full h-36 overflow-hidden", children: [_jsx("img", { src: r.bannerUrl, alt: r.name, className: "w-full h-full object-cover" }), _jsx("div", { className: "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md", children: r.badge }), _jsxs("div", { className: "absolute bottom-3 right-3 px-2 py-1 rounded-lg text-xs font-bold text-white bg-black/70 backdrop-blur-md flex items-center gap-1", children: [_jsx("span", { className: "material-symbols-outlined text-[14px]", children: "schedule" }), _jsx("span", { children: r.prepTime })] })] }), _jsxs("div", { className: "p-3.5 flex flex-col gap-1.5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-extrabold text-sm truncate", children: r.name }), _jsxs("div", { className: "flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 font-extrabold text-xs", children: [_jsx("span", { className: "material-symbols-outlined text-[14px] icon-filled", children: "star" }), _jsx("span", { children: r.rating })] })] }), _jsx("p", { className: "text-xs opacity-60 truncate", children: r.cuisine.join(' • ') }), _jsxs("div", { className: "flex items-center justify-between text-[11px] font-semibold opacity-80 pt-1 border-t border-black/5 dark:border-white/5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "flex items-center gap-0.5", children: [_jsx("span", { className: "material-symbols-outlined text-[13px]", children: "near_me" }), r.distance] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: ["Delivery ", r.deliveryFee] })] }), _jsx("span", { className: "font-bold text-[#bb0021] dark:text-[#ff1e38]", children: "View Menu \u2192" })] })] })] }, r.id))) })] })] }));
};
//# sourceMappingURL=HomeScreen.js.map