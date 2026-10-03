import React, { useState } from 'react';
import {
  ShoppingBag,
  Wrench,
  Printer,
  Globe,
  CreditCard,
  MapPin,
  Search,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Phone,
  Clock,
  ShieldCheck,
  Laptop,
  Smartphone,
  SlidersHorizontal,
  X,
  Eye,
  Settings,
  Package,
  Calendar,
  FileText,
  HelpCircle,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import {
  Product,
  ProductCategory,
  CartItem,
  ServiceItem,
  ServiceGroup,
  OrderRecord,
  BookingRecord,
  ContactEnquiry,
  BusinessSettings,
} from '../types';
import {
  HERO_IMAGE,
  PRODUCT_CATEGORIES,
  ALL_SERVICES,
  TESTIMONIALS,
  FAQS,
} from '../data/initialData';
import { DynamicIcon } from './Icons';

// ============================================================================
// 1. PRODUCT CARD COMPONENT (Strict E-Commerce Visual Rules & Zero-Broken-Image)
// ============================================================================
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onWhatsAppEnquire: (text: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  onWhatsAppEnquire,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-transform duration-150 hover:-translate-y-0.5 flex flex-col justify-between">
      <div>
        {/* 65-75% visual height container on neutral backdrop with Zero-Broken-Image fallback */}
        <div
          onClick={() => onSelectProduct(product)}
          className="relative aspect-[4/3] w-full bg-[#F1F5F9] overflow-hidden cursor-pointer flex items-center justify-center"
        >
          {product.image && !imgError ? (
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-blue-300 mb-3">
                <DynamicIcon name={product.iconKey} className="w-7 h-7" />
              </div>
              <span className="text-xs font-medium text-slate-300 tracking-wide">
                {product.subType}
              </span>
            </div>
          )}
        </div>

        {/* Clean Unboxed Metadata */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.subType}</span>
            <span aria-hidden="true">·</span>
            <span className={product.stock > 0 ? 'text-emerald-700 font-medium' : 'text-rose-600 font-medium'}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-sm text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Price Baseline */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
            <div>
              <span className="text-lg font-bold text-slate-900 font-mono-tabular">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.priceNote && (
                <span className="block text-[11px] text-slate-400">
                  {product.priceNote}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onSelectProduct(product)}
              className="text-xs font-medium text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 whitespace-nowrap"
            >
              <Eye className="w-3.5 h-3.5" />
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons: Buy Now, Add to Cart, Enquire on WhatsApp */}
      <div className="px-5 pb-5 pt-1 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => onBuyNow(product)}
            className="py-2 px-3 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            Buy Now
          </button>
          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => onAddToCart(product)}
            className="py-2 px-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            Add to Cart
          </button>
        </div>
        <button
          type="button"
          onClick={() =>
            onWhatsAppEnquire(
              `Hello Javid Telecom Cherpora, I want to enquire about "${product.name}" (Listed Price: ₹${product.price}). Is it available at the shop?`
            )
          }
          className="w-full py-2 px-3 border border-slate-200 hover:border-emerald-600 hover:text-emerald-700 text-slate-700 text-xs font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          Enquire on WhatsApp
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 2. GLOBAL SEARCH & MULTI-SERVICE HUB MODAL / SECTION
// ============================================================================
interface GlobalSearchBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedScope: 'all' | 'products' | 'repairs' | 'printing' | 'online';
  setSelectedScope: (s: 'all' | 'products' | 'repairs' | 'printing' | 'online') => void;
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onBookServiceWithPrefill: (category: ServiceGroup, requirement: string) => void;
}

export const GlobalSearchExplorer: React.FC<GlobalSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedScope,
  setSelectedScope,
  products,
  onSelectProduct,
  onAddToCart,
  onBookServiceWithPrefill,
}) => {
  const q = searchQuery.trim().toLowerCase();

  const matchingProducts =
    selectedScope === 'all' || selectedScope === 'products'
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.subType.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        )
      : [];

  const matchingServices = ALL_SERVICES.filter((s) => {
    if (selectedScope === 'products') return false;
    if (selectedScope === 'repairs' && s.section !== 'mobile-repair' && s.section !== 'laptop-repair')
      return false;
    if (selectedScope === 'printing' && s.section !== 'printing') return false;
    if (selectedScope === 'online' && s.section !== 'online-services') return false;
    return (
      s.title.toLowerCase().includes(q) ||
      s.group.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  });

  return (
    <section id="search-hub" className="py-10 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <label htmlFor="global-search-input" className="sr-only">
            Search products and services
          </label>
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products and services… (e.g., 5G phone, screen replacement, xerox, lamination, scholarship form)"
              className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-700 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Interactive Filter Controls */}
          <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
              {(
                [
                  { id: 'all', label: 'All Offerings' },
                  { id: 'products', label: 'Products & Accessories' },
                  { id: 'repairs', label: 'Mobile & Laptop Repair' },
                  { id: 'printing', label: 'Printing & Xerox' },
                  { id: 'online', label: 'Online Services' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedScope(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    selectedScope === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-mono-tabular">
              {matchingProducts.length} Products · {matchingServices.length} Services
            </div>
          </div>
        </div>

        {/* Live Search Results Panel when user types a query */}
        {q.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900">
                Search Results for "{searchQuery}"
              </h3>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-medium text-blue-700 hover:text-blue-900"
              >
                Close Results
              </button>
            </div>

            {matchingProducts.length === 0 && matchingServices.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-600">
                  No exact matches found for "{searchQuery}". Try searching for mobile covers, chargers, screen repair, lamination, or online forms.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Matching Products */}
                {matchingProducts.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h4 className="text-xs font-semibold text-slate-500 mb-3">
                      Matching Products ({matchingProducts.length})
                    </h4>
                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {matchingProducts.map((p) => (
                        <div
                          key={p.id}
                          className="bg-white p-3 rounded-lg border border-slate-200/80 flex items-center justify-between gap-3"
                        >
                          <div>
                            <button
                              type="button"
                              onClick={() => onSelectProduct(p)}
                              className="text-sm font-semibold text-slate-900 hover:text-blue-700 text-left"
                            >
                              {p.name}
                            </button>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {p.category} · {p.subType} ·{' '}
                              <span className="font-semibold text-slate-900 font-mono-tabular">
                                ₹{p.price.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => onAddToCart(p)}
                            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium rounded-lg whitespace-nowrap shrink-0"
                          >
                            Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Services */}
                {matchingServices.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h4 className="text-xs font-semibold text-slate-500 mb-3">
                      Matching Repair, Printing & Online Services ({matchingServices.length})
                    </h4>
                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {matchingServices.map((s) => (
                        <div
                          key={s.id}
                          className="bg-white p-3 rounded-lg border border-slate-200/80 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {s.title}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {s.group} · Turnaround: {s.turnaround}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => onBookServiceWithPrefill(s.group, s.title)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg whitespace-nowrap shrink-0"
                          >
                            Book Service
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
