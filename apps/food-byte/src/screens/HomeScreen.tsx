import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface HomeScreenProps {
  onSelectRestaurant: (restaurantId: string) => void;
  onNavigateExplore: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectRestaurant,
  onNavigateExplore,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  const categories = [
    {
      name: 'Pizza',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBeVIQtKPYMee5d0yGX0Cb2DAweFdGIc6U1qUV90kelEj3kYItVHuVtlVGo4xf4v48c9lXXu-f5MgKEVATtRCyVJGfOHfldE2njmzUhxBfD1V2OlHX0Ng_CzvOuAxGeB9PV3dFbe_xDUmrsb5tJKj2v0pKfo7237vYUOdiKaxiQUYp_3F33lgqJxgYmWkjcGR0EfpV4WX4ut1zZrRh7glJ7YTNlqsaGti7Rv1cWzwAGkRS0mFCVPZ0',
    },
    {
      name: 'Burgers',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBpXNaOS-z9EyRSqKak3w-f1cjkh6V7lOFlc_8tXdKeNQaqAkHha7f9g1zc6W3A31L0X9zBO83WEMZF9vAKEXO87bXbYhnNBdebMti0i02tc0nL9tyycEglaBEl4JdmiNOujApmAUsZDhpqBGhkpqyESKbTh0PjDrfT1oh6d3-GE9E_fQ-rCd9CLCt_gRt5M6hfpR7BX-uxZKG3lp3oR_UiSZ0hifX-8U5IvNG8UoO86Hsvcdg28N0',
    },
    {
      name: 'Indian',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAbfsaTS7SYazlSZC9-NH3Vo9wKVNl-LjXRL6KXk8hg_202WgGv6NI-EXqO8FSbnQfiOIHbYeIlmyKxkTrIfs6OAvvz0nBwkzAmMeToNPFD78_5xGKcB0J7K2J_TDT4mtEAR901YwRcCqA_nQ6YJCMsVdVrsp1nnweCPFyMCe632l0Y7hZzgotw5nbGj9VnAjU_FgN7fogYqwDN4LMTIipl7BMc0aDt0X3vkZKM7qaDVoRq1k8onN8',
    },
    {
      name: 'Sushi',
      image:
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Desserts',
      image:
        'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&auto=format&fit=crop&q=80',
    },
    {
      name: 'Bowls',
      image:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
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
      bannerUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBeVIQtKPYMee5d0yGX0Cb2DAweFdGIc6U1qUV90kelEj3kYItVHuVtlVGo4xf4v48c9lXXu-f5MgKEVATtRCyVJGfOHfldE2njmzUhxBfD1V2OlHX0Ng_CzvOuAxGeB9PV3dFbe_xDUmrsb5tJKj2v0pKfo7237vYUOdiKaxiQUYp_3F33lgqJxgYmWkjcGR0EfpV4WX4ut1zZrRh7glJ7YTNlqsaGti7Rv1cWzwAGkRS0mFCVPZ0',
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
      bannerUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBpXNaOS-z9EyRSqKak3w-f1cjkh6V7lOFlc_8tXdKeNQaqAkHha7f9g1zc6W3A31L0X9zBO83WEMZF9vAKEXO87bXbYhnNBdebMti0i02tc0nL9tyycEglaBEl4JdmiNOujApmAUsZDhpqBGhkpqyESKbTh0PjDrfT1oh6d3-GE9E_fQ-rCd9CLCt_gRt5M6hfpR7BX-uxZKG3lp3oR_UiSZ0hifX-8U5IvNG8UoO86Hsvcdg28N0',
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
      bannerUrl:
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className={`flex flex-col min-h-full pb-8 ${isDark ? 'bg-[#131315]' : 'bg-[#fcf9f8]'}`}>
      {/* App Header */}
      <header
        className={`sticky top-0 z-30 px-4 py-3 flex items-center justify-between backdrop-blur-xl border-b ${
          isDark
            ? 'bg-[#131315]/90 border-white/[0.08]'
            : 'bg-[#fcf9f8]/90 border-black/[0.04] shadow-[0_1px_8px_rgba(0,0,0,0.03)]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#bb0021] dark:bg-[#ff1e38] flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[18px]">restaurant</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#bb0021] dark:text-[#ff1e38] uppercase tracking-wider">
              <span>Delivering to</span>
              <span className="material-symbols-outlined text-[14px]">keyboard_arrow_down</span>
            </div>
            <span className="font-extrabold text-sm truncate max-w-[150px]">
              Penthouse 4B, MG Road
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[19px]">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-[#bb0021] dark:bg-[#ff1e38] flex items-center justify-center text-white text-xs font-bold">
            {user?.name ? user.name[0] : 'A'}
          </div>
        </div>
      </header>

      {/* Red Brand Hero Section */}
      <section
        className={`relative px-4 pt-4 pb-6 rounded-b-[2rem] shadow-lg overflow-hidden ${
          isDark
            ? 'bg-gradient-to-b from-[#bd001a] to-[#8d0013] border-b border-white/[0.08]'
            : 'bg-[#bb0021] text-white shadow-[#bb0021]/15'
        }`}
      >
        <div className="relative z-10 flex flex-col gap-3">
          {/* Search Trigger Input */}
          <div
            onClick={onNavigateExplore}
            className={`w-full h-12 px-4 rounded-full flex items-center gap-3 cursor-pointer shadow-md transition-all active:scale-[0.99] ${
              isDark ? 'bg-[#131315] border border-white/15 text-white' : 'bg-white text-[#1c1b1b]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] opacity-60 text-[#bb0021] dark:text-[#ff1e38]">
              search
            </span>
            <span className="text-xs opacity-60 font-medium">Search pizza, burgers, sushi...</span>
            <div className="ml-auto w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </div>
          </div>

          {/* Quick Perks Badge Bar */}
          <div className="flex items-center justify-between text-white text-xs font-bold px-1 pt-1">
            <div className="flex items-center gap-1.5 opacity-95">
              <span className="material-symbols-outlined text-[16px] text-[#ffb77a]">bolt</span>
              <span>Fastest in 25 mins</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-95">
              <span className="material-symbols-outlined text-[16px] text-[#ffb77a]">local_activity</span>
              <span>Zero delivery on $15+</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Horizontal Carousel */}
      <section className="mt-4 flex flex-col">
        <div className="px-4 flex items-center justify-between mb-2">
          <h2 className="font-extrabold text-sm">Categories</h2>
          <button
            onClick={onNavigateExplore}
            className="text-xs font-bold text-[#bb0021] dark:text-[#ff1e38] flex items-center"
          >
            See All <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
          {categories.map((c, idx) => (
            <button
              key={idx}
              onClick={onNavigateExplore}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group active:scale-95 transition-transform"
            >
              <div
                className={`w-14 h-14 rounded-full p-0.5 shadow-sm overflow-hidden flex items-center justify-center ${
                  isDark ? 'bg-[#1b1b1d] border border-white/10' : 'bg-white border border-black/5'
                }`}
              >
                <img src={c.image} alt={c.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-[11px] font-bold tracking-tight opacity-90">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Deals Carousel Banner */}
      <section className="px-4 mt-3">
        <div
          className={`w-full p-4 rounded-2xl relative overflow-hidden flex items-center justify-between shadow-md ${
            isDark
              ? 'bg-gradient-to-r from-[#201f21] via-[#2a2a2c] to-[#201f21] border border-white/10'
              : 'bg-gradient-to-r from-[#fff3e0] via-[#ffe0b2] to-[#ffcc80] border border-amber-200'
          }`}
        >
          <div className="flex flex-col max-w-[65%] z-10">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#bb0021] dark:text-[#ff1e38]">
              Limited Time Feast
            </span>
            <h3 className="font-extrabold text-sm mt-0.5 leading-snug">
              20% OFF Gourmet Wood-Fired Pizzas
            </h3>
            <div className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold opacity-80">
              <span>Use Code:</span>
              <span className="px-2 py-0.5 rounded-md bg-[#bb0021] dark:bg-[#ff1e38] text-white">
                BYTEFIRST
              </span>
            </div>
          </div>
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg flex-shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeVIQtKPYMee5d0yGX0Cb2DAweFdGIc6U1qUV90kelEj3kYItVHuVtlVGo4xf4v48c9lXXu-f5MgKEVATtRCyVJGfOHfldE2njmzUhxBfD1V2OlHX0Ng_CzvOuAxGeB9PV3dFbe_xDUmrsb5tJKj2v0pKfo7237vYUOdiKaxiQUYp_3F33lgqJxgYmWkjcGR0EfpV4WX4ut1zZrRh7glJ7YTNlqsaGti7Rv1cWzwAGkRS0mFCVPZ0"
              alt="Deal"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Popular Restaurants Feed */}
      <section className="px-4 mt-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-base">Popular Restaurants Near You</h2>
          <span className="text-xs font-semibold opacity-60">Within 10 km</span>
        </div>

        <div className="flex flex-col gap-4">
          {featuredRestaurants.map(r => (
            <div
              key={r.id}
              onClick={() => onSelectRestaurant(r.id)}
              className={`rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm ${
                isDark
                  ? 'bg-[#1b1b1d] border border-white/[0.08]'
                  : 'bg-white border border-black/[0.05] shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
              }`}
            >
              {/* Cover Image with Badges */}
              <div className="relative w-full h-36 overflow-hidden">
                <img src={r.bannerUrl} alt={r.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md">
                  {r.badge}
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg text-xs font-bold text-white bg-black/70 backdrop-blur-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span>{r.prepTime}</span>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-3.5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm truncate">{r.name}</h3>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 font-extrabold text-xs">
                    <span className="material-symbols-outlined text-[14px] icon-filled">star</span>
                    <span>{r.rating}</span>
                  </div>
                </div>

                <p className="text-xs opacity-60 truncate">{r.cuisine.join(' • ')}</p>

                <div className="flex items-center justify-between text-[11px] font-semibold opacity-80 pt-1 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">near_me</span>
                      {r.distance}
                    </span>
                    <span>•</span>
                    <span>Delivery {r.deliveryFee}</span>
                  </div>
                  <span className="font-bold text-[#bb0021] dark:text-[#ff1e38]">View Menu →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
