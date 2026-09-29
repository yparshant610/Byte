import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
export const ItemCustomizationModal = ({ item, onClose, onAdded, }) => {
    const { theme } = useTheme();
    const { addItem } = useCart();
    const isDark = theme === 'dark';
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState({ name: '12 inch Medium', price: 3.50 });
    const [selectedCrust, setSelectedCrust] = useState({ name: 'Classic Hand-Tossed', price: 0 });
    const [selectedToppings, setSelectedToppings] = useState({
        'Extra Buffalo Mozzarella': 2.00,
    });
    const [instructions, setInstructions] = useState('');
    const sizes = [
        { name: '10 inch Personal', price: 0 },
        { name: '12 inch Medium', price: 3.50 },
        { name: '14 inch Large', price: 6.00 },
    ];
    const crusts = [
        { name: 'Classic Hand-Tossed', price: 0 },
        { name: 'Thin & Crispy', price: 0 },
        { name: 'Stuffed Cheese Crust', price: 2.50 },
    ];
    const toppings = [
        { name: 'Extra Buffalo Mozzarella', price: 2.00 },
        { name: 'Black Truffle Glaze', price: 1.50 },
        { name: 'Fresh Sweet Basil', price: 0.75 },
        { name: 'Sliced Spicy Pepperoni', price: 2.50 },
    ];
    const toggleTopping = (name, price) => {
        setSelectedToppings(prev => {
            const next = { ...prev };
            if (next[name] !== undefined) {
                delete next[name];
            }
            else {
                next[name] = price;
            }
            return next;
        });
    };
    const toppingsSum = Object.values(selectedToppings).reduce((acc, p) => acc + p, 0);
    const unitPrice = item.price + selectedSize.price + selectedCrust.price + toppingsSum;
    const totalPrice = parseFloat((unitPrice * quantity).toFixed(2));
    const handleAddToCart = async () => {
        const options = [
            { groupName: 'Size', choiceName: selectedSize.name, additionalPrice: selectedSize.price },
            { groupName: 'Crust', choiceName: selectedCrust.name, additionalPrice: selectedCrust.price },
            ...Object.entries(selectedToppings).map(([name, price]) => ({
                groupName: 'Topping',
                choiceName: name,
                additionalPrice: price,
            })),
        ];
        await addItem({
            restaurantId: item.restaurantId,
            restaurantName: item.restaurantName,
            itemId: item.id,
            name: item.name,
            quantity,
            basePrice: item.price,
            selectedOptions: options,
        });
        onAdded();
        onClose();
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4", children: _jsxs("div", { className: `w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col no-scrollbar ${isDark
                ? 'bg-[#1b1b1d] text-white border border-white/10'
                : 'bg-white text-[#1c1b1b] border border-black/10'}`, children: [_jsxs("div", { className: "relative w-full h-48 overflow-hidden flex-shrink-0", children: [_jsx("img", { src: item.imageUrl, alt: item.name, className: "w-full h-full object-cover" }), _jsx("button", { onClick: onClose, className: "absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 active:scale-95", children: _jsx("span", { className: "material-symbols-outlined text-[20px]", children: "close" }) })] }), _jsxs("div", { className: "p-5 flex flex-col gap-4 flex-1", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-extrabold text-lg", children: item.name }), _jsx("p", { className: "text-xs opacity-60 mt-0.5 leading-relaxed", children: item.description })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs font-bold uppercase tracking-wider opacity-80", children: "Choose Size" }), _jsx("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-[#bb0021] dark:text-[#ff1e38]", children: "Required" })] }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: sizes.map(s => {
                                        const isSelected = selectedSize.name === s.name;
                                        return (_jsxs("button", { type: "button", onClick: () => setSelectedSize(s), className: `py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center ${isSelected
                                                ? isDark
                                                    ? 'border-[#ff1e38] bg-[#ff1e38]/10 text-[#ff1e38]'
                                                    : 'border-[#bb0021] bg-[#bb0021]/10 text-[#bb0021]'
                                                : isDark
                                                    ? 'border-white/10 bg-[#252528] text-white/70'
                                                    : 'border-black/10 bg-[#f6f3f2] text-black/70'}`, children: [_jsx("span", { children: s.name.split(' ')[0] }), _jsx("span", { className: "text-[10px] font-medium opacity-80", children: s.price === 0 ? 'Base' : `+$${s.price.toFixed(2)}` })] }, s.name));
                                    }) })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-xs font-bold uppercase tracking-wider opacity-80", children: "Crust Type" }), _jsx("div", { className: "flex flex-col gap-1.5", children: crusts.map(c => {
                                        const isSelected = selectedCrust.name === c.name;
                                        return (_jsxs("div", { onClick: () => setSelectedCrust(c), className: `p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${isSelected
                                                ? isDark
                                                    ? 'border-[#ff1e38] bg-[#ff1e38]/10 text-[#ff1e38]'
                                                    : 'border-[#bb0021] bg-[#bb0021]/10 text-[#bb0021]'
                                                : isDark
                                                    ? 'border-white/10 bg-[#252528]'
                                                    : 'border-black/10 bg-[#f6f3f2]'}`, children: [_jsx("span", { className: "text-xs font-bold", children: c.name }), _jsx("span", { className: "text-xs font-medium", children: c.price === 0 ? 'Free' : `+$${c.price.toFixed(2)}` })] }, c.name));
                                    }) })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "text-xs font-bold uppercase tracking-wider opacity-80", children: "Extra Toppings" }), _jsx("div", { className: "flex flex-col gap-1.5", children: toppings.map(t => {
                                        const isSelected = selectedToppings[t.name] !== undefined;
                                        return (_jsxs("div", { onClick: () => toggleTopping(t.name, t.price), className: `p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${isSelected
                                                ? isDark
                                                    ? 'border-[#ff1e38] bg-[#ff1e38]/10 text-[#ff1e38]'
                                                    : 'border-[#bb0021] bg-[#bb0021]/10 text-[#bb0021]'
                                                : isDark
                                                    ? 'border-white/10 bg-[#252528]'
                                                    : 'border-black/10 bg-[#f6f3f2]'}`, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-[18px]", children: isSelected ? 'check_box' : 'check_box_outline_blank' }), _jsx("span", { className: "text-xs font-bold", children: t.name })] }), _jsxs("span", { className: "text-xs font-medium", children: ["+$", t.price.toFixed(2)] })] }, t.name));
                                    }) })] }), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("span", { className: "text-xs font-bold opacity-80", children: "Special Kitchen Notes" }), _jsx("input", { type: "text", value: instructions, onChange: e => setInstructions(e.target.value), placeholder: "e.g. Well-done crust, slice in 8...", className: `w-full p-3 rounded-xl text-xs outline-none border ${isDark ? 'bg-[#201f21] border-white/10 text-white' : 'bg-[#f6f3f2] border-black/10 text-black'}` })] })] }), _jsxs("div", { className: `sticky bottom-0 p-4 border-t flex items-center justify-between gap-3 ${isDark ? 'bg-[#1b1b1d] border-white/10' : 'bg-white border-black/10'}`, children: [_jsxs("div", { className: `flex items-center gap-3 px-3 py-2 rounded-full ${isDark ? 'bg-[#252528]' : 'bg-[#f0edec]'}`, children: [_jsx("button", { onClick: () => setQuantity(Math.max(1, quantity - 1)), className: "w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm active:scale-90", children: "-" }), _jsx("span", { className: "font-extrabold text-sm", children: quantity }), _jsx("button", { onClick: () => setQuantity(quantity + 1), className: "w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm active:scale-90", children: "+" })] }), _jsxs("button", { onClick: handleAddToCart, className: `flex-1 py-3.5 px-4 rounded-full font-bold text-xs tracking-wider uppercase text-white shadow-lg flex items-center justify-between active:scale-95 transition-all ${isDark ? 'bg-[#ff1e38] shadow-[#ff1e38]/30' : 'bg-[#bb0021] shadow-[#bb0021]/30'}`, children: [_jsx("span", { children: "Add to Cart" }), _jsxs("span", { children: ["$", totalPrice.toFixed(2)] })] })] })] }) }));
};
//# sourceMappingURL=ItemCustomizationModal.js.map