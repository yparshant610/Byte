import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { MenuItemOption } from '@repo/api-client';

interface ItemCustomizationModalProps {
  item: any;
  onClose: () => void;
  onAdded: () => void;
}

export const ItemCustomizationModal: React.FC<ItemCustomizationModalProps> = ({
  item,
  onClose,
  onAdded,
}) => {
  const { theme } = useTheme();
  const { addItem } = useCart();
  const isDark = theme === 'dark';

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState({ name: '12 inch Medium', price: 3.50 });
  const [selectedCrust, setSelectedCrust] = useState({ name: 'Classic Hand-Tossed', price: 0 });
  const [selectedToppings, setSelectedToppings] = useState<Record<string, number>>({
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

  const toggleTopping = (name: string, price: number) => {
    setSelectedToppings(prev => {
      const next = { ...prev };
      if (next[name] !== undefined) {
        delete next[name];
      } else {
        next[name] = price;
      }
      return next;
    });
  };

  const toppingsSum = Object.values(selectedToppings).reduce((acc, p) => acc + p, 0);
  const unitPrice = item.price + selectedSize.price + selectedCrust.price + toppingsSum;
  const totalPrice = parseFloat((unitPrice * quantity).toFixed(2));

  const handleAddToCart = async () => {
    const options: MenuItemOption[] = [
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div
        className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col no-scrollbar ${
          isDark
            ? 'bg-[#1b1b1d] text-white border border-white/10'
            : 'bg-white text-[#1c1b1b] border border-black/10'
        }`}
      >
        {/* Modal Image Header */}
        <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-4 flex-1">
          <div>
            <h2 className="font-extrabold text-lg">{item.name}</h2>
            <p className="text-xs opacity-60 mt-0.5 leading-relaxed">{item.description}</p>
          </div>

          {/* Size Choice */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">Choose Size</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-[#bb0021] dark:text-[#ff1e38]">
                Required
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map(s => {
                const isSelected = selectedSize.name === s.name;
                return (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center ${
                      isSelected
                        ? isDark
                          ? 'border-[#ff1e38] bg-[#ff1e38]/10 text-[#ff1e38]'
                          : 'border-[#bb0021] bg-[#bb0021]/10 text-[#bb0021]'
                        : isDark
                        ? 'border-white/10 bg-[#252528] text-white/70'
                        : 'border-black/10 bg-[#f6f3f2] text-black/70'
                    }`}
                  >
                    <span>{s.name.split(' ')[0]}</span>
                    <span className="text-[10px] font-medium opacity-80">
                      {s.price === 0 ? 'Base' : `+$${s.price.toFixed(2)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Crust Choice */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Crust Type</span>
            <div className="flex flex-col gap-1.5">
              {crusts.map(c => {
                const isSelected = selectedCrust.name === c.name;
                return (
                  <div
                    key={c.name}
                    onClick={() => setSelectedCrust(c)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? isDark
                          ? 'border-[#ff1e38] bg-[#ff1e38]/10 text-[#ff1e38]'
                          : 'border-[#bb0021] bg-[#bb0021]/10 text-[#bb0021]'
                        : isDark
                        ? 'border-white/10 bg-[#252528]'
                        : 'border-black/10 bg-[#f6f3f2]'
                    }`}
                  >
                    <span className="text-xs font-bold">{c.name}</span>
                    <span className="text-xs font-medium">
                      {c.price === 0 ? 'Free' : `+$${c.price.toFixed(2)}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Toppings Choice */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Extra Toppings</span>
            <div className="flex flex-col gap-1.5">
              {toppings.map(t => {
                const isSelected = selectedToppings[t.name] !== undefined;
                return (
                  <div
                    key={t.name}
                    onClick={() => toggleTopping(t.name, t.price)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? isDark
                          ? 'border-[#ff1e38] bg-[#ff1e38]/10 text-[#ff1e38]'
                          : 'border-[#bb0021] bg-[#bb0021]/10 text-[#bb0021]'
                        : isDark
                        ? 'border-white/10 bg-[#252528]'
                        : 'border-black/10 bg-[#f6f3f2]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">
                        {isSelected ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span className="text-xs font-bold">{t.name}</span>
                    </div>
                    <span className="text-xs font-medium">+${t.price.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold opacity-80">Special Kitchen Notes</span>
            <input
              type="text"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="e.g. Well-done crust, slice in 8..."
              className={`w-full p-3 rounded-xl text-xs outline-none border ${
                isDark ? 'bg-[#201f21] border-white/10 text-white' : 'bg-[#f6f3f2] border-black/10 text-black'
              }`}
            />
          </div>
        </div>

        {/* Floating Bottom Add Bar */}
        <div
          className={`sticky bottom-0 p-4 border-t flex items-center justify-between gap-3 ${
            isDark ? 'bg-[#1b1b1d] border-white/10' : 'bg-white border-black/10'
          }`}
        >
          {/* Quantity Stepper */}
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-full ${
              isDark ? 'bg-[#252528]' : 'bg-[#f0edec]'
            }`}
          >
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm active:scale-90"
            >
              -
            </button>
            <span className="font-extrabold text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm active:scale-90"
            >
              +
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3.5 px-4 rounded-full font-bold text-xs tracking-wider uppercase text-white shadow-lg flex items-center justify-between active:scale-95 transition-all ${
              isDark ? 'bg-[#ff1e38] shadow-[#ff1e38]/30' : 'bg-[#bb0021] shadow-[#bb0021]/30'
            }`}
          >
            <span>Add to Cart</span>
            <span>${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
