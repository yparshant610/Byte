import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { apiClient } from '@repo/api-client';
export const RatingReviewScreen = ({ onDone }) => {
    const { theme } = useTheme();
    const { activeOrder } = useCart();
    const isDark = theme === 'dark';
    const [foodRating, setFoodRating] = useState(5);
    const [driverRating, setDriverRating] = useState(5);
    const [selectedTags, setSelectedTags] = useState([
        '⚡ Lightning Fast',
        '🔥 Piping Hot',
        '🌿 Fresh Ingredients',
    ]);
    const [foodReview, setFoodReview] = useState('The truffle oil fragrance and crispy wood-fired crust were phenomenal! Arrived hot and fresh.');
    const [driverReview, setDriverReview] = useState('Rajesh was prompt, courteous and followed building delivery notes perfectly.');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const complimentChips = [
        '⚡ Lightning Fast',
        '📦 Perfect Packaging',
        '🔥 Piping Hot',
        '🌿 Fresh Ingredients',
        '😊 Courteous Driver',
        '⭐ Top Presentation',
    ];
    const toggleChip = (chip) => {
        setSelectedTags(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]);
    };
    const handleSubmit = async () => {
        setSubmitting(true);
        const orderId = activeOrder?.id || 'ord_sample_101';
        try {
            await apiClient.submitReview(orderId, {
                foodRating,
                driverRating,
                foodReview,
                driverReview,
                complimentTags: selectedTags,
            });
            setIsSubmitted(true);
        }
        catch {
            // Optimistic completion for demo
            setIsSubmitted(true);
        }
        finally {
            setSubmitting(false);
        }
    };
    if (isSubmitted) {
        return (_jsxs("div", { className: `flex flex-col items-center justify-center min-h-[500px] p-6 text-center ${isDark ? 'bg-[#131315] text-white' : 'bg-[#fcf9f8] text-[#1c1b1b]'}`, children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4", children: _jsx("span", { className: "material-symbols-outlined text-[36px]", children: "verified" }) }), _jsx("h2", { className: "font-extrabold text-xl", children: "Thank You for Your Feedback!" }), _jsx("p", { className: "text-xs opacity-60 mt-1 max-w-xs", children: "Your dual reviews help both the restaurant chefs and delivery partners maintain Michelin-standard culinary excellence." }), _jsx("button", { onClick: onDone, className: "mt-6 px-8 py-3 rounded-full text-xs font-bold text-white bg-[#bb0021] dark:bg-[#ff1e38] shadow-md active:scale-95", children: "Back to Home" })] }));
    }
    return (_jsxs("div", { className: `flex flex-col min-h-full pb-10 ${isDark ? 'bg-[#131315]' : 'bg-[#fcf9f8]'}`, children: [_jsxs("div", { className: `sticky top-0 z-30 px-4 py-3 flex items-center justify-between backdrop-blur-xl border-b ${isDark ? 'bg-[#131315]/90 border-white/[0.08]' : 'bg-[#fcf9f8]/90 border-black/[0.04]'}`, children: [_jsx("h1", { className: "font-extrabold text-base", children: "Rate Your Experience" }), _jsx("button", { onClick: onDone, className: "text-xs font-bold opacity-60 hover:opacity-100", children: "Skip" })] }), _jsxs("div", { className: "p-4 flex flex-col gap-5", children: [_jsxs("div", { className: `p-4 rounded-2xl flex items-center gap-3.5 border ${isDark
                            ? 'bg-gradient-to-r from-[#201f21] to-[#2a2a2c] border-white/10'
                            : 'bg-gradient-to-r from-rose-50 to-orange-50 border-rose-100'}`, children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-rose-500/10 text-[#bb0021] dark:text-[#ff1e38] flex items-center justify-center flex-shrink-0", children: _jsx("span", { className: "material-symbols-outlined text-[28px]", children: "celebration" }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-extrabold text-sm", children: "Order Delivered Successfully!" }), _jsx("p", { className: "text-xs opacity-60", children: "Delivered by Rajesh Kumar from Tony's Artisan Pizza" })] })] }), _jsxs("div", { className: `p-4 rounded-2xl border flex flex-col gap-3 ${isDark ? 'bg-[#1b1b1d] border-white/10' : 'bg-white border-black/10'}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs font-extrabold uppercase tracking-wider text-[#bb0021] dark:text-[#ff1e38]", children: "1. Food Quality & Flavor" }), _jsx("span", { className: "text-xs font-bold opacity-60", children: "Tony's Artisan Pizza" })] }), _jsx("div", { className: "flex justify-center gap-2 py-1", children: [1, 2, 3, 4, 5].map(star => (_jsx("button", { type: "button", onClick: () => setFoodRating(star), className: "text-amber-400 hover:scale-110 active:scale-95 transition-transform", children: _jsx("span", { className: `material-symbols-outlined text-[34px] ${star <= foodRating ? 'icon-filled' : ''}`, children: "star" }) }, star))) }), _jsx("textarea", { value: foodReview, onChange: e => setFoodReview(e.target.value), placeholder: "Tell us about the crust, temperature, sauce and flavor...", rows: 2, className: `w-full p-3 rounded-xl text-xs outline-none border resize-none ${isDark ? 'bg-[#201f21] border-white/10 text-white' : 'bg-[#f6f3f2] border-black/10 text-black'}` })] }), _jsxs("div", { className: `p-4 rounded-2xl border flex flex-col gap-3 ${isDark ? 'bg-[#1b1b1d] border-white/10' : 'bg-white border-black/10'}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs font-extrabold uppercase tracking-wider text-[#bb0021] dark:text-[#ff1e38]", children: "2. Delivery Partner" }), _jsx("span", { className: "text-xs font-bold opacity-60", children: "Rajesh Kumar" })] }), _jsx("div", { className: "flex justify-center gap-2 py-1", children: [1, 2, 3, 4, 5].map(star => (_jsx("button", { type: "button", onClick: () => setDriverRating(star), className: "text-amber-400 hover:scale-110 active:scale-95 transition-transform", children: _jsx("span", { className: `material-symbols-outlined text-[34px] ${star <= driverRating ? 'icon-filled' : ''}`, children: "star" }) }, star))) }), _jsx("textarea", { value: driverReview, onChange: e => setDriverReview(e.target.value), placeholder: "How was the delivery speed and courier handling?...", rows: 2, className: `w-full p-3 rounded-xl text-xs outline-none border resize-none ${isDark ? 'bg-[#201f21] border-white/10 text-white' : 'bg-[#f6f3f2] border-black/10 text-black'}` })] }), _jsxs("div", { className: `p-4 rounded-2xl border flex flex-col gap-2.5 ${isDark ? 'bg-[#1b1b1d] border-white/10' : 'bg-white border-black/10'}`, children: [_jsx("span", { className: "text-xs font-bold opacity-70", children: "Add Compliment Tags" }), _jsx("div", { className: "flex flex-wrap gap-2", children: complimentChips.map(chip => {
                                    const isSelected = selectedTags.includes(chip);
                                    return (_jsx("button", { type: "button", onClick: () => toggleChip(chip), className: `px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${isSelected
                                            ? isDark
                                                ? 'border-[#ff1e38] bg-[#ff1e38]/15 text-[#ff1e38]'
                                                : 'border-[#bb0021] bg-[#bb0021]/10 text-[#bb0021]'
                                            : isDark
                                                ? 'border-white/10 bg-[#252528] text-white/70'
                                                : 'border-black/10 bg-[#f6f3f2] text-black/70'}`, children: chip }, chip));
                                }) })] }), _jsx("button", { onClick: handleSubmit, disabled: submitting, className: `w-full py-3.5 rounded-full font-bold text-sm tracking-wide text-white shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all ${isDark ? 'bg-[#ff1e38] shadow-[#ff1e38]/30 hover:bg-[#ff344c]' : 'bg-[#bb0021] shadow-[#bb0021]/30 hover:bg-[#d60026]'}`, children: submitting ? 'Submitting Dual Review...' : 'Submit Ratings & Reviews' })] })] }));
};
//# sourceMappingURL=RatingReviewScreen.js.map