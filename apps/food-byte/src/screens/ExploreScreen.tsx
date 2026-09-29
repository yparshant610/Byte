import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

interface ExploreScreenProps {
  onSelectRestaurant: (restaurantId: string) => void;
  onOpenCustomization: (item: any) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onSelectRestaurant,
  onOpenCustomization,
}) => {
  const { theme } = useTheme();
  const { addItem } = useCart();
  const isDark = theme === 'dark';

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Pizza', 'Burgers', 'Vegetarian', 'Top Rated 4.5+', 'Under 25 mins'];

  const exploreDishes = [
    {
      id: 'dish_margherita_01',
      restaurantId: '30000000-0000-0000-0000-000000000001',
      restaurantName: "Tony's Artisan Pizza",
      name: 'Margherita Classica',
      description: 'San Marzano tomato sauce, fresh buffalo mozzarella, aromatic sweet basil leaves.',
      price: 12.99,
      rating: 4.9,
      isVegetarian: true,
      category: 'Pizza',
      prepTime: '20 mins',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBeVIQtKPYMee5d0yGX0Cb2DAweFdGIc6U1qUV90kelEj3kYItVHuVtlVGo4xf4v48c9lXXu-f5MgKEVATtRCyVJGfOHfldE2njmzUhxBfD1V2OlHX0Ng_CzvOuAxGeB9PV3dFbe_xDUmrsb5tJKj2v0pKfo7237vYUOdiKaxiQUYp_3F33lgqJxgYmWkjcGR0EfpV4WX4ut1zZrRh7glJ7YTNlqsaGti7Rv1cWzwAGkRS0mFCVPZ0',
    },
    {
      id: 'dish_diavola_02',
      restaurantId: '30000000-0000-0000-0000-000000000001',
      restaurantName: "Tony's Artisan Pizza",
      name: 'Diavola Piccante',
      description: 'Spicy Calabrian salami, chili-infused organic blossom honey, smoked fior di latte.',
      price: 15.49,
      rating: 4.8,
      category: 'Pizza',
      prepTime: '22 mins',
      imageUrl:
        'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'dish_burger_03',
      restaurantId: '30000000-0000-0000-0000-000000000002',
      restaurantName: 'The Gourmet Burger Lab',
      name: 'Double Truffle Smash Burger',
      description: 'Double Angus beef patties, truffle aioli dip, caramelized shallots, brioche bun.',
      price: 14.50,
      rating: 4.8,
      category: 'Burgers',
      prepTime: '18 mins',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBpXNaOS-z9EyRSqKak3w-f1cjkh6V7lOFlc_8tXdKeNQaqAkHha7f9g1zc6W3A31L0X9zBO83WEMZF9vAKEXO87bXbYhnNBdebMti0i02tc0nL9tyycEglaBEl4JdmiNOujApmAUsZDhpqBGhkpqyESKbTh0PjDrfT1oh6d3-GE9E_fQ-rCd9CLCt_gRt5M6hfpR7BX-uxZKG3lp3oR_UiSZ0hifX-8U5IvNG8UoO86Hsvcdg28N0',
    },
    {
      id: 'dish_biryani_04',
      restaurantId: '30000000-0000-0000-0000-000000000004',
      restaurantName: 'Royal Awadh Kitchen',
      name: 'Dum Pukht Chicken Biryani',
      description: 'Aged basmati rice, tender farm chicken, saffron threads, mint leaves, and burani raita.',
      price: 16.99,
      rating: 4.9,
      category: 'Indian',
      prepTime: '25 mins',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAbfsaTS7SYazlSZC9-NH3Vo9wKVNl-LjXRL6KXk8hg_202WgGv6NI-EXqO8FSbnQfiOIHbYeIlmyKxkTrIfs6OAvvz0nBwkzAmMeToNPFD78_5xGKcB0J7K2J_TDT4mtEAR901YwRcCqA_nQ6YJCMsVdVrsp1nnweCPFyMCe632l0Y7hZzgotw5nbGj9VnAjU_FgN7fogYqwDN4LMTIipl7BMc0aDt0X3vkZKM7qaDVoRq1k8onN8',
    },
  ];

  const filtered = exploreDishes.filter(d => {
    const matchesQuery =
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.description.toLowerCase().includes(query.toLowerCase()) ||
      d.restaurantName.toLowerCase().includes(query.toLowerCase());
    if (!matchesQuery) return false;
    if (activeFilter === 'Vegetarian') return d.isVegetarian;
    if (activeFilter === 'Pizza') return d.category === 'Pizza';
    if (activeFilter === 'Burgers') return d.category === 'Burgers';
    if (activeFilter === 'Top Rated 4.5+') return d.rating >= 4.8;
    return true;
  });

  return (
    <div className={`flex flex-col min-h-full pb-8 ${isDark ? 'bg-[#131315]' : 'bg-[#fcf9f8]'}`}>
      {/* Search Header */}
      <div
        className={`sticky top-0 z-30 px-4 pt-3 pb-3 backdrop-blur-xl border-b ${
          isDark ? 'bg-[#131315]/90 border-white/[0.08]' : 'bg-[#fcf9f8]/90 border-black/[0.04]'
        }`}
      >
        <div
          className={`w-full h-12 px-4 rounded-full flex items-center gap-2.5 shadow-sm ${
            isDark ? 'bg-[#201f21] border border-white/10 text-white' : 'bg-white border border-black/10 text-black'
          }`}
        >
          <span className="material-symbols-outlined text-[20px] opacity-60 text-[#bb0021] dark:text-[#ff1e38]">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search food, groceries, dietary cravings..."
            className="w-full bg-transparent border-0 outline-none text-xs font-medium placeholder:opacity-40"
          />
          {query && (
            <button onClick={() => setQuery('')} className="opacity-50 hover:opacity-100">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Chips Bar */}
        <div className="flex gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar">
          {filters.map(f => {
            const isSelected = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                  isSelected
                    ? isDark
                      ? 'bg-[#ff1e38] text-white shadow-md'
                      : 'bg-[#bb0021] text-white shadow-sm'
                    : isDark
                    ? 'bg-[#1b1b1d] border border-white/10 text-white/80 hover:bg-[#252528]'
                    : 'bg-white border border-black/10 text-[#1c1b1b] hover:bg-[#f0edec]'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results List */}
      <div className="px-4 mt-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold opacity-70">
            {filtered.length} {filtered.length === 1 ? 'Dish' : 'Dishes'} Available
          </span>
          <span className="text-[11px] font-bold text-[#bb0021] dark:text-[#ff1e38]">
            Sorted by Best Match
          </span>
        </div>

        {filtered.map(d => (
          <div
            key={d.id}
            className={`p-3 rounded-2xl flex gap-3.5 items-center transition-all shadow-sm ${
              isDark
                ? 'bg-[#1b1b1d] border border-white/[0.08]'
                : 'bg-white border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
            }`}
          >
            {/* Dish Thumbnail */}
            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
              <img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover" />
              {d.isVegetarian && (
                <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-sm bg-white p-0.5 shadow-sm flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                </div>
              )}
            </div>

            {/* Dish Info */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div
                onClick={() => onSelectRestaurant(d.restaurantId)}
                className="text-[10px] font-bold text-[#bb0021] dark:text-[#ff1e38] uppercase tracking-wider cursor-pointer hover:underline truncate"
              >
                {d.restaurantName}
              </div>
              <h3 className="font-extrabold text-sm truncate">{d.name}</h3>
              <p className="text-[11px] opacity-60 line-clamp-2 leading-tight">{d.description}</p>

              <div className="flex items-center justify-between mt-1">
                <span className="font-extrabold text-sm text-[#bb0021] dark:text-[#ff1e38]">
                  ${d.price.toFixed(2)}
                </span>
                <button
                  onClick={() => onOpenCustomization(d)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1 active:scale-95 ${
                    isDark
                      ? 'bg-[#ff1e38] text-white hover:bg-[#ff344c]'
                      : 'bg-[#bb0021] text-white hover:bg-[#d60026]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
