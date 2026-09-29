import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

interface CartScreenProps {
  onCheckoutSuccess: () => void;
  onContinueShopping: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  onCheckoutSuccess,
  onContinueShopping,
}) => {
  const { theme } = useTheme();
  const { cart, updateQuantity, clearCart, checkout } = useCart();
  const isDark = theme === 'dark';

  const [promoCode, setPromoCode] = useState('BYTEFIRST');
  const [promoApplied, setPromoApplied] = useState(true);
  const [selectedTip, setSelectedTip] = useState(3.00);
  const [isProcessing, setIsProcessing] = useState(false);

  const tips = [2.00, 3.00, 5.00];

  const subtotal = cart?.subtotal || 0;
  const discount = promoApplied ? parseFloat((subtotal * 0.20).toFixed(2)) : 0;
  const taxableSubtotal = Math.max(0, subtotal - discount);
  const taxAmount = parseFloat((taxableSubtotal * 0.05).toFixed(2));
  const deliveryFee = 2.49;
  const totalAmount = parseFloat((taxableSubtotal + taxAmount + deliveryFee + selectedTip).toFixed(2));

  // 80/20 Split Breakdown Calculation
  const platformCommission = parseFloat(((taxableSubtotal + deliveryFee) * 0.20).toFixed(2));
  const restaurantPayout = parseFloat((taxableSubtotal * 0.80).toFixed(2));
  const driverPayout = parseFloat(((deliveryFee * 0.80) + selectedTip).toFixed(2));
  const vendorDriverTotalPayout = parseFloat((restaurantPayout + driverPayout).toFixed(2));

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      await checkout({
        deliveryAddress: 'Penthouse 4B, MG Road Boulevard, Bangalore',
        destinationLat: 12.9716,
        destinationLng: 77.5946,
        deliveryNotes: 'Leave with front desk security',
        driverTip: selectedTip,
      });
      onCheckoutSuccess();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[500px] p-6 text-center ${isDark ? 'bg-[#131315] text-white' : 'bg-[#fcf9f8] text-[#1c1b1b]'}`}>
        <div className="w-20 h-20 rounded-full bg-rose-500/10 text-[#bb0021] dark:text-[#ff1e38] flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[36px]">shopping_bag</span>
        </div>
        <h2 className="font-extrabold text-lg">Your Cart is Empty</h2>
        <p className="text-xs opacity-60 mt-1 max-w-xs">
          Explore delicious dishes from top-rated restaurants and add them to your feast!
        </p>
        <button
          onClick={onContinueShopping}
          className="mt-6 px-6 py-3 rounded-full text-xs font-bold text-white bg-[#bb0021] dark:bg-[#ff1e38] shadow-md active:scale-95"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-full pb-10 ${isDark ? 'bg-[#131315]' : 'bg-[#fcf9f8]'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 px-4 py-3 flex items-center justify-between backdrop-blur-xl border-b ${isDark ? 'bg-[#131315]/90 border-white/[0.08]' : 'bg-[#fcf9f8]/90 border-black/[0.04]'}`}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#bb0021] dark:text-[#ff1e38]">shopping_bag</span>
          <h1 className="font-extrabold text-base">Cart & Summary</h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold opacity-60 hover:opacity-100 hover:text-rose-500"
        >
          Clear
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Restaurant Header */}
        <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-[#1b1b1d] border-white/10' : 'bg-white border-black/10'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-[#bb0021] dark:text-[#ff1e38] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">storefront</span>
            </div>
            <div>
              <h2 className="font-extrabold text-sm">{cart.restaurantName}</h2>
              <span className="text-[11px] opacity-60">Delivering in 20-25 mins</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
            Open
          </span>
        </div>

        {/* Itemized Cart List */}
        <div className={`p-4 rounded-2xl border flex flex-col gap-3.5 ${isDark ? 'bg-[#1b1b1d] border-white/10' : 'bg-white border-black/10'}`}>
          <span className="text-xs font-bold uppercase tracking-wider opacity-60">Your Items</span>
          {cart.items.map(item => (
            <div key={item.itemId} className="flex items-start justify-between gap-3 pb-3 border-b border-black/5 dark:border-white/5 last:border-0 last:pb-0">
              <div className="flex-1">
                <h3 className="font-extrabold text-sm">{item.name}</h3>
                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <p className="text-[11px] opacity-60 mt-0.5">
                    {item.selectedOptions.map(o => o.choiceName).join(' • ')}
                  </p>
                )}
                <span className="font-bold text-xs text-[#bb0021] dark:text-[#ff1e38] mt-1 inline-block">
                  ${item.itemTotal.toFixed(2)}
                </span>
              </div>

              {/* Stepper */}
              <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full ${isDark ? 'bg-[#252528]' : 'bg-[#f0edec]'}`}>
                <button
                  onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                  className="w-5 h-5 flex items-center justify-center font-bold text-xs"
                >
                  -
                </button>
                <span className="text-xs font-bold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                  className="w-5 h-5 flex items-center justify-center font-bold text-xs"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Promo Code Coupon Card */}
        <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 ${isDark ? 'bg-[#1b1b1d] border-white/10' : 'bg-white border-black/10'}`}>
          <div className="flex items-center gap-2 flex-1">
            <span className="material-symbols-outlined text-amber-500 text-[20px]">local_offer</span>
            <input
              type="text"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value.toUpperCase())}
              placeholder="ENTER PROMO CODE"
              className="bg-transparent text-xs font-bold outline-none uppercase w-full"
            />
          </div>
          <button
            onClick={() => setPromoApplied(!promoApplied)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              promoApplied
                ? 'bg-emerald-500/10 text-emerald-500'
                : isDark
                ? 'bg-[#ff1e38] text-white'
                : 'bg-[#bb0021] text-white'
            }`}
          >
            {promoApplied ? 'Applied ✓' : 'Apply'}
          </button>
        </div>

        {/* Driver Tipping Pills */}
        <div className={`p-4 rounded-2xl border flex flex-col gap-2.5 ${isDark ? 'bg-[#1b1b1d] border-white/10' : 'bg-white border-black/10'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold">Say Thanks with a Tip</span>
            <span className="text-[10px] opacity-60">100% goes to your driver</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {tips.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTip(t)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedTip === t
                    ? isDark
                      ? 'border-[#ff1e38] bg-[#ff1e38]/15 text-[#ff1e38]'
                      : 'border-[#bb0021] bg-[#bb0021]/10 text-[#bb0021]'
                    : isDark
                    ? 'border-white/10 bg-[#252528]'
                    : 'border-black/10 bg-[#f6f3f2]'
                }`}
              >
                ${t.toFixed(2)}
              </button>
            ))}
            <button
              onClick={() => setSelectedTip(selectedTip + 1)}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                !tips.includes(selectedTip)
                  ? isDark
                    ? 'border-[#ff1e38] bg-[#ff1e38]/15 text-[#ff1e38]'
                    : 'border-[#bb0021] bg-[#bb0021]/10 text-[#bb0021]'
                  : isDark
                  ? 'border-white/10 bg-[#252528]'
                  : 'border-black/10 bg-[#f6f3f2]'
              }`}
            >
              +${selectedTip > 5 ? selectedTip.toFixed(2) : 'Other'}
            </button>
          </div>
        </div>

        {/* Detailed Bill Breakdown */}
        <div className={`p-4 rounded-2xl border flex flex-col gap-2 text-xs ${isDark ? 'bg-[#1b1b1d] border-white/10' : 'bg-white border-black/10'}`}>
          <span className="font-bold uppercase tracking-wider opacity-60 mb-1">Bill Details</span>
          <div className="flex justify-between opacity-80">
            <span>Item Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {promoApplied && (
            <div className="flex justify-between text-emerald-500 font-semibold">
              <span>Promotion (BYTEFIRST 20%)</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between opacity-80">
            <span>Taxes (5% GST)</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between opacity-80">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between opacity-80">
            <span>Driver Tip</span>
            <span>${selectedTip.toFixed(2)}</span>
          </div>

          <div className="border-t border-black/10 dark:border-white/10 pt-2.5 mt-1 flex justify-between font-extrabold text-sm">
            <span>To Pay</span>
            <span className="text-[#bb0021] dark:text-[#ff1e38]">${totalAmount.toFixed(2)}</span>
          </div>

          {/* 80/20 Split Breakdown Card */}
          <div className="mt-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[11px] flex flex-col gap-1">
            <span className="font-bold text-[#bb0021] dark:text-[#ff1e38] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
              Razorpay Route 80/20 Split Transparency
            </span>
            <div className="flex justify-between opacity-70">
              <span>Restaurant Payout (80% Food):</span>
              <span>${restaurantPayout.toFixed(2)}</span>
            </div>
            <div className="flex justify-between opacity-70">
              <span>Driver Payout (80% Delivery + 100% Tip):</span>
              <span>${driverPayout.toFixed(2)}</span>
            </div>
            <div className="flex justify-between opacity-70 font-semibold">
              <span>Byte Add Platform Fee (20%):</span>
              <span>${platformCommission.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className={`w-full py-4 rounded-full font-bold text-sm tracking-wider uppercase text-white shadow-xl flex items-center justify-between px-6 active:scale-95 transition-all ${
            isDark ? 'bg-[#ff1e38] shadow-[#ff1e38]/30 hover:bg-[#ff344c]' : 'bg-[#bb0021] shadow-[#bb0021]/30 hover:bg-[#d60026]'
          }`}
        >
          <span>{isProcessing ? 'Processing Split...' : 'Razorpay Secure Checkout'}</span>
          <div className="flex items-center gap-1">
            <span>${totalAmount.toFixed(2)}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </div>
        </button>
      </div>
    </div>
  );
};
