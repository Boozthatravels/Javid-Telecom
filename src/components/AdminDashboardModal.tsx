import React, { useState } from 'react';
import {
  Settings,
  Package,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  RotateCcw,
  ShoppingBag,
  Wrench,
  MessageSquare,
  Save,
  Database,
} from 'lucide-react';
import {
  Product,
  ProductCategory,
  OrderRecord,
  BookingRecord,
  ContactEnquiry,
  BusinessSettings,
} from '../types';
import { PRODUCT_CATEGORIES } from '../data/initialData';
import { isFirebaseConfigured } from '../services/dataStore';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProducts: (products: Product[]) => void;
  settings: BusinessSettings;
  onSaveSettings: (settings: BusinessSettings) => void;
  orders: OrderRecord[];
  onUpdateOrderStatus: (orderId: string, status: OrderRecord['status']) => void;
  bookings: BookingRecord[];
  onUpdateBookingStatus: (bookingId: string, status: BookingRecord['status']) => void;
  enquiries: ContactEnquiry[];
  onResetDemoData: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProducts,
  settings,
  onSaveSettings,
  orders,
  onUpdateOrderStatus,
  bookings,
  onUpdateBookingStatus,
  enquiries,
  onResetDemoData,
}) => {
  const [activeTab, setActiveTab] = useState<
    'products' | 'orders' | 'bookings' | 'enquiries' | 'settings'
  >('products');

  // Inline editing state for products
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [editName, setEditName] = useState<string>('');
  const [editImage, setEditImage] = useState<string>('');
  const [editFeatured, setEditFeatured] = useState<boolean>(false);

  // New Product form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('Mobile Accessories');
  const [newProdSubType, setNewProdSubType] = useState('Mobile Accessories');
  const [newProdPrice, setNewProdPrice] = useState('499');
  const [newProdStock, setNewProdStock] = useState('15');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  // Business Settings form state
  const [formSettings, setFormSettings] = useState<BusinessSettings>(settings);
  const [settingsSavedBanner, setSettingsSavedBanner] = useState(false);

  if (!isOpen) return null;

  const startEditProduct = (p: Product) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditPrice(p.price);
    setEditStock(p.stock);
    setEditImage(p.image || '');
    setEditFeatured(p.featured);
  };

  const saveEditProduct = (id: string) => {
    const updated = products.map((p) =>
      p.id === id
        ? {
            ...p,
            name: editName.trim() || p.name,
            price: Number(editPrice) >= 0 ? Number(editPrice) : p.price,
            stock: Number(editStock) >= 0 ? Number(editStock) : p.stock,
            image: editImage.trim() || undefined,
            featured: editFeatured,
          }
        : p
    );
    onSaveProducts(updated);
    setEditingId(null);
  };

  const handleDeleteProduct = (id: string) => {
    onSaveProducts(products.filter((p) => p.id !== id));
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      category: newProdCategory,
      subType: newProdSubType.trim() || newProdCategory,
      description:
        newProdDesc.trim() ||
        'Quality tested product available at Javid Telecom Cherpora.',
      price: Number(newProdPrice) || 0,
      priceNote: 'Admin updated price',
      stock: Number(newProdStock) || 10,
      featured: true,
      image: newProdImage.trim() || undefined,
      iconKey: 'smartphone',
      specs: ['Genuine Quality', 'Shop Warranty Support'],
    };
    onSaveProducts([created, ...products]);
    setNewProdName('');
    setNewProdDesc('');
    setNewProdImage('');
    setShowAddProduct(false);
  };

  const handleSaveBusinessSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formSettings);
    setSettingsSavedBanner(true);
    setTimeout(() => setSettingsSavedBanner(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-6xl w-full h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold">
                Javid Telecom Cherpora — Store & Service Admin Dashboard
              </h2>
              <p className="text-xs text-slate-400">
                Manage Products, Editable Prices, Stock, Orders, Repair Requests & Contact Placeholders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300 hidden sm:inline-flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              {isFirebaseConfigured()
                ? 'Firebase Cloud Connected'
                : 'Local Store Active (Firebase Ready)'}
            </span>
            <button
              type="button"
              onClick={onResetDemoData}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              aria-label="Close Admin Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
          {(
            [
              { id: 'products', label: `Products & Prices (${products.length})` },
              { id: 'orders', label: `Customer Orders (${orders.length})` },
              { id: 'bookings', label: `Repair & Service Requests (${bookings.length})` },
              { id: 'enquiries', label: `Contact Enquiries (${enquiries.length})` },
              { id: 'settings', label: 'Contact, WhatsApp & Hours Settings' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === t.id
                  ? 'bg-blue-700 text-white'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: PRODUCTS & PRICES */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Product Inventory & Instant Price Editor
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click "Edit" on any row to update prices, stock counts, product images, or featured status immediately.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add New Product
                </button>
              </div>

              {showAddProduct && (
                <form
                  onSubmit={handleCreateProduct}
                  className="p-5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g., 65W Type-C Fast Charger"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      {PRODUCT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Sub-Type Label
                    </label>
                    <input
                      type="text"
                      value={newProdSubType}
                      onChange={(e) => setNewProdSubType(e.target.value)}
                      placeholder="e.g., Chargers"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono-tabular"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono-tabular"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      placeholder="Leave empty for clean SVG icon fallback"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Short Description
                    </label>
                    <input
                      type="text"
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      placeholder="Brief product features and warranty note"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg"
                    >
                      Save Product
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="px-3 py-2 border border-slate-300 text-slate-600 text-xs rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500">
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price (₹)</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Featured</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {products.map((p) => {
                      const isEditing = editingId === p.id;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80">
                          <td className="py-3 px-4 font-medium text-slate-900">
                            {isEditing ? (
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded"
                                />
                                <input
                                  type="text"
                                  value={editImage}
                                  onChange={(e) => setEditImage(e.target.value)}
                                  placeholder="Image URL"
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-[11px]"
                                />
                              </div>
                            ) : (
                              p.name
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {p.category} · {p.subType}
                          </td>
                          <td className="py-3 px-4 font-mono-tabular font-semibold text-slate-900">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                className="w-24 px-2 py-1 border border-blue-600 rounded font-mono-tabular"
                              />
                            ) : (
                              `₹${p.price.toLocaleString('en-IN')}`
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono-tabular">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editStock}
                                onChange={(e) => setEditStock(Number(e.target.value))}
                                className="w-20 px-2 py-1 border border-blue-600 rounded font-mono-tabular"
                              />
                            ) : (
                              <span>{p.stock} units</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {isEditing ? (
                              <input
                                type="checkbox"
                                checked={editFeatured}
                                onChange={(e) => setEditFeatured(e.target.checked)}
                              />
                            ) : (
                              <span className="text-slate-600">
                                {p.featured ? 'Yes' : 'No'}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            {isEditing ? (
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => saveEditProduct(p.id)}
                                  className="px-2.5 py-1 bg-emerald-600 text-white rounded font-medium inline-flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  className="px-2 py-1 border border-slate-300 text-slate-600 rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => startEditProduct(p)}
                                  className="text-blue-700 hover:text-blue-900 font-medium inline-flex items-center gap-1"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  Edit Price/Stock
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Customer Online & Pickup Orders
              </h3>
              {orders.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                  No orders placed yet. Test placing an order from the shopping cart to view it here.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 text-xs">
                        <div className="font-mono-tabular font-bold text-blue-700">
                          Order #{o.id} · {o.createdAt}
                        </div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {o.customerName} ({o.mobileNumber})
                        </div>
                        <div className="text-slate-600">
                          Address: {o.address} · Mode: {o.fulfillmentMethod} · Payment: {o.paymentMethod}
                        </div>
                        <div className="text-slate-700 pt-1">
                          {o.items.map((i, idx) => (
                            <span key={idx} className="mr-3">
                              • {i.quantity}x {i.productName} (₹{i.unitPrice})
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Total</div>
                          <div className="text-base font-bold font-mono-tabular text-slate-900">
                            ₹{o.totalAmount.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <select
                          value={o.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(
                              o.id,
                              e.target.value as OrderRecord['status']
                            )
                          }
                          className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg bg-slate-50"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Ready for Pickup">Ready for Pickup</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REPAIR & SERVICE BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Repair & Digital Service Booking Requests
              </h3>
              {bookings.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                  No repair or service requests submitted yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 text-xs">
                        <div className="font-mono-tabular font-bold text-blue-700">
                          Booking #{b.id} · Preferred Date: {b.preferredDate || 'Flexible'}
                        </div>
                        <div className="text-sm font-semibold text-slate-900">
                          {b.customerName} · {b.mobileNumber}
                        </div>
                        <div className="text-slate-700 font-medium">
                          Category: {b.serviceCategory} · Device/Item: {b.deviceOrProduct}
                        </div>
                        <div className="text-slate-600">
                          Problem/Requirement: {b.problemOrRequirement}
                        </div>
                        {b.message && (
                          <div className="text-slate-500">Note: {b.message}</div>
                        )}
                      </div>
                      <div className="shrink-0">
                        <select
                          value={b.status}
                          onChange={(e) =>
                            onUpdateBookingStatus(
                              b.id,
                              e.target.value as BookingRecord['status']
                            )
                          }
                          className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg bg-slate-50"
                        >
                          <option value="Received">Received</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CONTACT ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Customer Contact Messages
              </h3>
              {enquiries.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                  No contact messages received yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white text-xs space-y-1"
                    >
                      <div className="text-slate-400 font-mono-tabular">
                        {enq.createdAt}
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        {enq.name} ({enq.mobileNumber}) — {enq.subject}
                      </div>
                      <p className="text-slate-600">{enq.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CONFIGURABLE BUSINESS SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveBusinessSettings} className="max-w-2xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Configurable Contact, WhatsApp & Business Settings
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Replace the default placeholders (PHONE_NUMBER_HERE, WHATSAPP_NUMBER_HERE, EMAIL_HERE, BUSINESS_HOURS_HERE) with actual shop credentials anytime.
                </p>
              </div>

              {settingsSavedBanner && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                  Business settings updated across the website!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formSettings.phoneNumber}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, phoneNumber: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Number (with country code, e.g., 91XXXXXXXXXX)
                  </label>
                  <input
                    type="text"
                    value={formSettings.whatsappNumber}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, whatsappNumber: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="text"
                    value={formSettings.email}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Hours
                  </label>
                  <input
                    type="text"
                    value={formSettings.businessHours}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        businessHours: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Shop Address
                </label>
                <input
                  type="text"
                  value={formSettings.fullAddress}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, fullAddress: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Google Maps Directions Link
                </label>
                <input
                  type="text"
                  value={formSettings.googleMapsUrl}
                  onChange={(e) =>
                    setFormSettings({ ...formSettings, googleMapsUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Business Settings
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
