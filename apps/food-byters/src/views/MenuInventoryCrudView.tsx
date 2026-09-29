import React, { useState } from 'react';
import { useMerchant, MenuItem } from '../context/MerchantContext';

interface MenuInventoryCrudViewProps {
  onAddNewDish?: () => void;
}

export const MenuInventoryCrudView: React.FC<MenuInventoryCrudViewProps> = () => {
  const { menuItems, toggleItemStock, saveDish } = useMerchant();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('Signature Pizzas');
  const [formPrice, setFormPrice] = useState('14.99');
  const [formPrepTime, setFormPrepTime] = useState('12m');
  const [formStation, setFormStation] = useState('Deck Oven 1');

  const categories = ['All', 'Signature Pizzas', 'Appetizers & Sides', 'Desserts'];

  const filteredItems = menuItems.filter(item => {
    const matchCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStock =
      stockFilter === 'ALL' ||
      (stockFilter === 'IN_STOCK' && item.inStock) ||
      (stockFilter === 'OUT_OF_STOCK' && !item.inStock);
    return matchCategory && matchQuery && matchStock;
  });

  const handleOpenAdd = () => {
    setFormName('');
    setFormSku(`PZ-${Math.floor(100 + Math.random() * 900)}`);
    setFormCategory('Signature Pizzas');
    setFormPrice('16.99');
    setFormPrepTime('12m');
    setFormStation('Deck Oven 1');
    setShowAddModal(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const newDish: MenuItem = {
      id: editingDish ? editingDish.id : `item_${Date.now()}`,
      name: formName || 'New Artisan Dish',
      sku: formSku || 'PZ-999',
      category: formCategory,
      price: parseFloat(formPrice) || 14.99,
      prepTime: formPrepTime || '15m',
      inStock: editingDish ? editingDish.inStock : true,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
      station: formStation,
      dietary: ['Veg'],
    };
    saveDish(newDish);
    setShowAddModal(false);
    setEditingDish(null);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* Top Action & Meta Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              restaurant_menu
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-extrabold text-on-surface">Menu & Inventory Catalogue</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold uppercase tracking-wider">
                Sync Active
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {menuItems.length} Total Items • {menuItems.filter(i => !i.inStock).length} Out-of-Stock (86'd) • Instant Customer Sync
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
              activeCategory === cat
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface'
            }`}
          >
            <span>{cat}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeCategory === cat
                  ? 'bg-surface-container-lowest text-primary'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {cat === 'All'
                ? menuItems.length
                : menuItems.filter(i => i.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Stock Toggles */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-surface-container-lowest p-3.5 rounded-2xl shadow-sm border border-surface-container-high">
        <div className="flex items-center gap-3 w-full md:w-96 bg-surface-container-low px-3.5 py-2 rounded-full">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter by dish title, SKU code, or tag..."
            className="bg-transparent text-on-surface placeholder:text-on-surface-variant text-xs w-full focus:outline-none"
          />
        </div>

        {/* Stock Filter Pills */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider pl-1">
            Stock:
          </span>
          <button
            type="button"
            onClick={() => setStockFilter('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              stockFilter === 'ALL'
                ? 'bg-on-surface text-surface'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            All ({menuItems.length})
          </button>
          <button
            type="button"
            onClick={() => setStockFilter('IN_STOCK')}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              stockFilter === 'IN_STOCK'
                ? 'bg-tertiary text-on-tertiary'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span>In Stock ({menuItems.filter(i => i.inStock).length})</span>
          </button>
          <button
            type="button"
            onClick={() => setStockFilter('OUT_OF_STOCK')}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              stockFilter === 'OUT_OF_STOCK'
                ? 'bg-error text-on-error'
                : 'bg-error-container text-on-error-container'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-error"></span>
            <span>86'd / Sold Out ({menuItems.filter(i => !i.inStock).length})</span>
          </button>
        </div>
      </div>

      {/* Dish Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`rounded-2xl p-4 shadow-sm border transition-all flex flex-col justify-between ${
              item.inStock
                ? 'bg-surface-container-lowest border-surface-container-high hover:shadow-md'
                : 'bg-surface-container-low/50 border-error/20 opacity-80'
            }`}
          >
            <div>
              <div className="flex items-start gap-3.5 mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-on-surface truncate">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-on-surface-variant block mt-0.5">
                    {item.sku} • {item.category}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[10px] font-bold">
                      {item.station}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[10px] font-bold">
                      Prep: {item.prepTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-container flex items-center justify-between">
              <span className="text-base font-black text-primary">${item.price.toFixed(2)}</span>

              <div className="flex items-center gap-2">
                {/* Instant 86'd Stock Toggle */}
                <button
                  type="button"
                  onClick={() => toggleItemStock(item.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                    item.inStock
                      ? 'bg-tertiary/10 text-tertiary hover:bg-error-container hover:text-error'
                      : 'bg-error-container text-error hover:bg-tertiary/10 hover:text-tertiary'
                  }`}
                  title={item.inStock ? "Click to 86 this item (Mark Sold Out)" : "Click to restock"}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {item.inStock ? 'check_circle' : 'block'}
                  </span>
                  <span>{item.inStock ? 'In Stock' : "86'd"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingDish(item);
                    setFormName(item.name);
                    setFormSku(item.sku);
                    setFormCategory(item.category);
                    setFormPrice(item.price.toString());
                    setFormPrepTime(item.prepTime);
                    setFormStation(item.station);
                    setShowAddModal(true);
                  }}
                  className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-on-surface">
                {editingDish ? 'Edit Dish Details' : 'Add New Culinary Dish'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingDish(null);
                }}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                  Dish Title
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Quattro Formaggi Artisan"
                  className="w-full bg-surface-container-low text-on-surface text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={e => setFormSku(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={e => setFormPrice(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Signature Pizzas">Signature Pizzas</option>
                    <option value="Appetizers & Sides">Appetizers & Sides</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                    Kitchen Station
                  </label>
                  <select
                    value={formStation}
                    onChange={e => setFormStation(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Deck Oven 1">Deck Oven 1</option>
                    <option value="Deck Oven 2">Deck Oven 2</option>
                    <option value="Garde Manger">Garde Manger</option>
                    <option value="Pastry Station">Pastry Station</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-primary text-on-primary font-bold text-xs shadow-md"
                >
                  Save Dish to Menu
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-full bg-surface-container text-on-surface font-semibold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
