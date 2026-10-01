import React, { useState } from 'react';
import { useMerchant, MenuItem } from '../context/MerchantContext';

interface MenuInventoryCrudViewProps {
  onAddNewDish?: () => void;
}

export const MenuInventoryCrudView: React.FC<MenuInventoryCrudViewProps> = () => {
  const { menuItems, toggleItemStock, saveDish, deleteDish, loadMenu, menuLoading, uploadMenuImage } = useMerchant();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('Signature Pizzas');
  const [formPrice, setFormPrice] = useState('16.99');
  const [formPrepTime, setFormPrepTime] = useState('15m');
  const [formStation, setFormStation] = useState('Deck Oven 1');
  const [formDescription, setFormDescription] = useState('');
  const [formDietary, setFormDietary] = useState<string[]>(['Veg']);
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60');

  // S3 2-Step Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadStep, setUploadStep] = useState<'IDLE' | 'STEP1_PRESIGNED' | 'STEP2_UPLOADING' | 'STEP3_VERIFIED' | 'ERROR'>('IDLE');
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const categories = ['All', 'Signature Pizzas', 'Appetizers & Sides', 'Desserts', 'Beverages'];

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

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
    setEditingDish(null);
    setFormName('');
    setFormSku(`PZ-${Math.floor(100 + Math.random() * 900)}`);
    setFormCategory('Signature Pizzas');
    setFormPrice('18.50');
    setFormPrepTime('15m');
    setFormStation('Deck Oven 1');
    setFormDescription('Artisanal craft crust with San Marzano tomato sauce and fresh herbs.');
    setFormDietary(['Veg']);
    setFormImage('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60');
    setSelectedFile(null);
    setImagePreview(null);
    setUploadStep('IDLE');
    setUploadMessage(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingDish(item);
    setFormName(item.name);
    setFormSku(item.sku);
    setFormCategory(item.category);
    setFormPrice(item.price.toString());
    setFormPrepTime(item.prepTime);
    setFormStation(item.station);
    setFormDescription(item.description || '');
    setFormDietary(item.dietary || ['Veg']);
    setFormImage(item.image);
    setSelectedFile(null);
    setImagePreview(item.image);
    setUploadStep('STEP3_VERIFIED');
    setUploadMessage('Existing dish image');
    setShowAddModal(true);
  };

  const handleToggleDietary = (tag: string) => {
    setFormDietary(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  };

  // 2-Step S3 Upload Pipeline
  const handlePerformS3Upload = async (fileToUpload?: File): Promise<string> => {
    const file = fileToUpload || selectedFile;
    if (!file) return formImage;

    setUploadingImage(true);
    try {
      // Step 1: Generate presigned upload URL from backend
      setUploadStep('STEP1_PRESIGNED');
      setUploadMessage('Step 1: Requesting S3 Presigned URL from Backend...');

      // Step 2 & 3: Direct PUT upload to S3 and backend verification
      setUploadStep('STEP2_UPLOADING');
      setUploadMessage(`Step 2: Uploading "${file.name}" to AWS S3 bucket (food-byte)...`);

      const result = await uploadMenuImage(file);

      if (!result.verified) {
        setUploadStep('ERROR');
        setUploadMessage(result.message || 'AWS S3 AccessDenied: IAM user deployement_user lacks PutObject permissions on food-byte.');
        showToast('S3 upload verification failed. Please check AWS IAM permissions.');
        return formImage;
      }

      // Step 3 Confirmed
      setUploadStep('STEP3_VERIFIED');
      setUploadMessage(`Step 3: Verified! S3 Key: ${result.fileKey}`);
      setFormImage(result.publicUrl);
      showToast('Image uploaded & verified on AWS S3 bucket!');
      return result.publicUrl;
    } catch (err: any) {
      console.error('S3 upload pipeline error:', err);
      setUploadStep('ERROR');
      setUploadMessage(`Notice: ${err.message || 'AWS S3 upload failed'}`);
      showToast(`S3 upload error: ${err.message || 'Access Denied'}`);
      return formImage;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('Please enter a valid price (greater than $0.00)');
      return;
    }
    if (priceNum > 99999.99) {
      showToast('Maximum price allowed by database is $99,999.99');
      return;
    }

    let finalImageUrl = formImage;

    // If an image file was selected and not yet verified, execute the 2-step S3 pipeline
    if (selectedFile && uploadStep !== 'STEP3_VERIFIED') {
      finalImageUrl = await handlePerformS3Upload(selectedFile);
    }

    const newDish: MenuItem = {
      id: editingDish ? editingDish.id : `item_${Date.now()}`,
      name: formName || 'New Artisan Dish',
      sku: formSku || 'PZ-999',
      category: formCategory,
      price: Math.min(priceNum, 99999.99),
      prepTime: formPrepTime || '15m',
      inStock: editingDish ? editingDish.inStock : true,
      image: finalImageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
      station: formStation,
      dietary: formDietary,
      description: formDescription,
    };

    try {
      await saveDish(newDish);
      setShowAddModal(false);
      setEditingDish(null);
      showToast(editingDish ? `Dish "${newDish.name}" updated in Supabase!` : `New dish "${newDish.name}" saved to Supabase!`);
    } catch (saveErr: any) {
      showToast(`Error saving dish: ${saveErr.message || 'Database error'}`);
    }
  };

  const handleDeleteItem = async (item: MenuItem) => {
    if (window.confirm(`Are you sure you want to remove "${item.name}" from your restaurant menu?`)) {
      await deleteDish(item.id);
      showToast(`Removed "${item.name}" from menu`);
    }
  };

  const handleToggleStock = async (item: MenuItem) => {
    await toggleItemStock(item.id);
    showToast(`"${item.name}" is now ${item.inStock ? "86'd (Sold Out)" : "In Stock"}`);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-on-surface text-surface py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce border border-surface-container-high">
          <span className="material-symbols-outlined text-[18px] text-tertiary">check_circle</span>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Top Action & Meta Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-surface-container-high">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              restaurant_menu
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-extrabold text-on-surface">Menu & Inventory Catalogue</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                Live Supabase Sync
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {menuItems.length} Total Items • {menuItems.filter(i => !i.inStock).length} Out-of-Stock (86'd) • Instant Cloud Persistence
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={loadMenu}
            disabled={menuLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs transition-colors"
            title="Refresh menu catalog from Supabase cloud database"
          >
            <span className={`material-symbols-outlined text-[18px] ${menuLoading ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{menuLoading ? 'Syncing...' : 'Sync Catalog'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-md transition-all active:scale-95"
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
                ? 'bg-primary text-on-primary shadow-primary/20'
                : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface'
            }`}
          >
            <span>{cat}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
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
        <div className="flex items-center gap-3 w-full md:w-96 bg-surface-container-low px-4 py-2.5 rounded-full">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by dish name, SKU, or ingredients..."
            className="bg-transparent text-on-surface placeholder:text-on-surface-variant text-xs w-full focus:outline-none"
          />
        </div>

        {/* Stock Filter Pills */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider pl-1">
            Filter Stock:
          </span>
          <button
            type="button"
            onClick={() => setStockFilter('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              stockFilter === 'ALL'
                ? 'bg-surface-container-highest text-on-surface'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All Items ({menuItems.length})
          </button>
          <button
            type="button"
            onClick={() => setStockFilter('IN_STOCK')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              stockFilter === 'IN_STOCK'
                ? 'bg-tertiary-container text-on-tertiary-container'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            In Stock ({menuItems.filter(i => i.inStock).length})
          </button>
          <button
            type="button"
            onClick={() => setStockFilter('OUT_OF_STOCK')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              stockFilter === 'OUT_OF_STOCK'
                ? 'bg-red-100 text-red-800'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            86'd Out of Stock ({menuItems.filter(i => !i.inStock).length})
          </button>
        </div>
      </div>

      {/* Grid of Dishes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`bg-surface-container-lowest p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
              item.inStock
                ? 'border-surface-container-high shadow-sm hover:shadow-md'
                : 'border-red-200 bg-red-50/20 opacity-80'
            }`}
          >
            <div>
              <div className="flex items-start gap-3.5 mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60';
                  }}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-sm"
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
                    {item.dietary?.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {item.description && (
                <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                  {item.description}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-surface-container flex items-center justify-between">
              <span className="text-base font-black text-primary">${item.price.toFixed(2)}</span>

              <div className="flex items-center gap-1.5">
                {/* Instant 86'd Stock Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleStock(item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-sm ${
                    item.inStock
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                  title={item.inStock ? "Click to 86 this item (Mark Sold Out in database)" : "Click to restock in database"}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {item.inStock ? 'check_circle' : 'block'}
                  </span>
                  <span>{item.inStock ? 'In Stock' : "86'd (Out)"}</span>
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors"
                  title="Edit dish"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item)}
                  className="w-8 h-8 rounded-full bg-surface-container hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-on-surface-variant transition-colors"
                  title="Delete dish from database"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-surface-container-high">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div>
                <h3 className="font-black text-lg text-on-surface">
                  {editingDish ? 'Edit Dish Details' : '+ Create New Menu Dish'}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Persists immediately into Supabase database & syncs across portals
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingDish(null);
                }}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                  Dish Title
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Truffle Funghi Supreme Pizza"
                  className="w-full bg-surface-container-low text-on-surface text-xs font-semibold px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
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
                    placeholder="PZ-204"
                    className="w-full bg-surface-container-low text-on-surface text-xs font-semibold px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="99999.99"
                    required
                    value={formPrice}
                    onChange={e => setFormPrice(e.target.value)}
                    placeholder="18.50"
                    className="w-full bg-surface-container-low text-on-surface text-xs font-semibold px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-[10px] text-on-surface-variant block mt-0.5 font-medium">
                    Max: $99,999.99 (PostgreSQL precision)
                  </span>
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
                    className="w-full bg-surface-container-low text-on-surface text-xs font-semibold px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Signature Pizzas">Signature Pizzas</option>
                    <option value="Appetizers & Sides">Appetizers & Sides</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                    Kitchen Station
                  </label>
                  <select
                    value={formStation}
                    onChange={e => setFormStation(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface text-xs font-semibold px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Deck Oven 1">Deck Oven 1</option>
                    <option value="Deck Oven 2">Deck Oven 2</option>
                    <option value="Garde Manger">Garde Manger</option>
                    <option value="Pastry Station">Pastry Station</option>
                    <option value="Fry Station">Fry Station</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1">
                  Dish Description & Ingredients
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Slow fermented dough, imported Fior di Latte, fresh basil..."
                  className="w-full bg-surface-container-low text-on-surface text-xs font-medium px-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface-variant uppercase block mb-1.5">
                  Dietary Flags
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {['Veg', 'Non-Veg', 'Vegan', 'Gluten-Free', 'Spicy'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleDietary(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        formDietary.includes(tag)
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* S3 Image Upload Pipeline (2-Step) */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">cloud_upload</span>
                    <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">
                      AWS S3 Dish Image Pipeline
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-mono font-bold">
                    food-byte (us-east-1)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-primary/30 hover:border-primary rounded-2xl cursor-pointer bg-surface-container hover:bg-surface-container-high transition-all text-xs font-semibold text-primary">
                    <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
                    <span>{selectedFile ? `File: ${selectedFile.name}` : 'Choose Local Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setImagePreview(URL.createObjectURL(file));
                          setUploadStep('IDLE');
                          setUploadMessage(`Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB). Ready for 2-step S3 pipeline.`);
                        }
                      }}
                    />
                  </label>

                  {selectedFile && uploadStep !== 'STEP3_VERIFIED' && (
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => handlePerformS3Upload()}
                      className="px-4 py-3 rounded-2xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 disabled:opacity-50 transition-all shrink-0"
                    >
                      {uploadingImage ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">upload</span>
                          <span>Upload to S3 Now</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Live Preview & Status */}
                {(imagePreview || formImage) && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container border border-surface-container-high">
                    <img
                      src={imagePreview || formImage}
                      alt="Dish preview"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60';
                      }}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-surface-container-high"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center gap-2">
                        {uploadStep === 'STEP3_VERIFIED' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            Verified on AWS S3 Bucket
                          </span>
                        ) : uploadStep === 'ERROR' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            AWS S3 Permission Error (AccessDenied)
                          </span>
                        ) : selectedFile ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            Ready for 2-step S3 upload
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-on-surface-variant">Default / External URL</span>
                        )}
                      </div>
                      <p className="text-[11px] text-on-surface font-mono truncate mt-0.5">
                        {selectedFile ? selectedFile.name : formImage}
                      </p>
                      {uploadMessage && (
                        <p className={`text-[10px] font-medium mt-0.5 ${uploadStep === 'ERROR' ? 'text-rose-600' : 'text-primary'}`}>
                          {uploadMessage}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Direct Image URL Accordion / Fallback */}
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">
                    Or Dish Image URL (Direct / Fallback)
                  </label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={e => setFormImage(e.target.value)}
                    placeholder="https://food-byte.s3.us-east-1.amazonaws.com/..."
                    className="w-full bg-surface-container text-on-surface text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3 border-t border-surface-container">
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-[0.98]"
                >
                  {editingDish ? 'Save Changes to Supabase' : 'Create Dish & Save to Database'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3.5 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs"
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
