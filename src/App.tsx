import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Wrench,
  Laptop,
  Printer,
  Globe,
  CreditCard,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  CheckCircle2,
  ChevronDown,
  Settings,
  ExternalLink,
  Smartphone,
  ShieldCheck,
  Navigation,
  X,
} from 'lucide-react';
import {
  Product,
  ProductCategory,
  CartItem,
  ServiceGroup,
  OrderRecord,
  BookingRecord,
  ContactEnquiry,
  BusinessSettings,
} from './types';
import {
  HERO_IMAGE,
  SHOP_OWNER_IMAGE,
  PRODUCT_CATEGORIES,
  ALL_SERVICES,
  TESTIMONIALS,
  FAQS,
} from './data/initialData';
import { dataStore, buildWhatsAppLink } from './services/dataStore';
import { BrandLogo, DynamicIcon } from './components/Icons';
import { ProductCard, GlobalSearchExplorer } from './components/ShopAndSearch';
import { ProductDetailModal, CartCheckoutDrawer } from './components/CartAndModals';
import { AdminDashboardModal } from './components/AdminDashboardModal';

const MOBILE_ELECTRONICS_SUBCATEGORIES = [
  'Mobile Phones',
  'Mobile Covers',
  'Screen Protectors',
  'Chargers',
  'USB Cables',
  'Data Cables',
  'Power Banks',
  'Earphones',
  'Earbuds',
  'Bluetooth Speakers',
  'Handsfree',
  'Smart Watches',
  'Mobile Batteries',
  'Mobile Adapters',
  'Memory Cards',
  'USB Drives/Pen Drives',
  'OTG Devices',
  'Mobile Stands',
  'Other Mobile Accessories',
];

const PRINTING_CHECKLIST = [
  'Photostat / Xerox',
  'Black & White Printing',
  'Colour Printing',
  'Photo Printing',
  'Document Printing',
  'Scanning',
  'Lamination',
  'ID Card Printing',
  'Passport Size Photos',
  'Application Printing',
  'Document Formatting',
  'Resume/CV Printing',
  'School/College Documents',
  'Project Printing',
  'Binding Services',
];

const ONLINE_SERVICES_CHECKLIST = [
  'Online Form Filling',
  'Government Online Services',
  'Exam Forms',
  'Scholarship Forms',
  'Admission Forms',
  'Job Application Forms',
  'Result Checking',
  'Admit Card Download',
  'Certificate/Application Assistance',
  'Online Document Upload',
  'Email Services',
  'Internet Services',
  'PDF Creation',
  'PDF Printing',
  'Document Scanning',
  'Online Registration',
  'Digital Application Assistance',
];

export default function App() {
  // Persistent state initialized from dataStore
  const [products, setProducts] = useState<Product[]>(() => dataStore.getProducts());
  const [settings, setSettings] = useState<BusinessSettings>(() => dataStore.getSettings());
  const [orders, setOrders] = useState<OrderRecord[]>(() => dataStore.getOrders());
  const [bookings, setBookings] = useState<BookingRecord[]>(() => dataStore.getBookings());
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>(() => dataStore.getEnquiries());

  // Cart & UI Modal states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [heroImgError, setHeroImgError] = useState(false);
  const [frontLeftImg, setFrontLeftImg] = useState<string>(() => {
    try {
      return localStorage.getItem('jt_cherpora_front_left_img') || SHOP_OWNER_IMAGE;
    } catch {
      return SHOP_OWNER_IMAGE;
    }
  });

  const handleFrontLeftPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFrontLeftImg(reader.result);
        try {
          localStorage.setItem('jt_cherpora_front_left_img', reader.result);
        } catch {
          // Ignore storage quota
        }
        showToast('Front-left shop photo updated!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Search & Product Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchScope, setSearchScope] = useState<
    'all' | 'products' | 'repairs' | 'printing' | 'online'
  >('all');
  const [activeProductCategory, setActiveProductCategory] = useState<
    'All' | ProductCategory
  >('All');

  // Unified Repair & Service Booking Form state
  const [bookingName, setBookingName] = useState('');
  const [bookingMobile, setBookingMobile] = useState('');
  const [bookingCategory, setBookingCategory] = useState<ServiceGroup>('Mobile Repair');
  const [bookingDevice, setBookingDevice] = useState('');
  const [bookingProblem, setBookingProblem] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState<BookingRecord | null>(null);

  // Contact Form state
  const [contactName, setContactName] = useState('');
  const [contactMobile, setContactMobile] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(product.stock, i.quantity + qty) }
            : i
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, qty) }];
    });
    showToast(`Added "${product.name}" to shopping cart.`);
  };

  const handleBuyNow = (product: Product, qty = 1) => {
    handleAddToCart(product, qty);
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id !== productId) return item;
          const nextQty = item.quantity + delta;
          if (nextQty <= 0) return null;
          return {
            ...item,
            quantity: Math.min(item.product.stock || 99, nextQty),
          };
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handlePlaceOrder = (
    orderData: Omit<OrderRecord, 'id' | 'createdAt' | 'status'>
  ): OrderRecord => {
    const newOrder: OrderRecord = {
      ...orderData,
      id: `JTC-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      status: 'Confirmed',
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    dataStore.saveOrders(updatedOrders);

    // Decrement product stock
    const updatedProducts = products.map((p) => {
      const orderedItem = orderData.items.find((i) => i.productId === p.id);
      if (!orderedItem) return p;
      return {
        ...p,
        stock: Math.max(0, p.stock - orderedItem.quantity),
      };
    });
    setProducts(updatedProducts);
    dataStore.saveProducts(updatedProducts);

    setCart([]);
    return newOrder;
  };

  // WhatsApp Action Handler (Active with +91 7780869615)
  const handleWhatsAppAction = (message: string) => {
    const { url } = buildWhatsAppLink(
      settings.whatsappNumber || '917780869615',
      message
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  // Prefill Service Booking & Smooth Scroll
  const scrollToServiceBooking = (
    category: ServiceGroup,
    prefillRequirement = ''
  ) => {
    setBookingCategory(category);
    if (prefillRequirement) {
      setBookingProblem(prefillRequirement);
    }
    setBookingConfirmed(null);
    const el = document.getElementById('book-service');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingMobile.trim() || !bookingProblem.trim()) {
      showToast('Please fill in your Name, Mobile Number, and Problem/Requirement.');
      return;
    }
    const created: BookingRecord = {
      id: `SRV-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      customerName: bookingName.trim(),
      mobileNumber: bookingMobile.trim(),
      serviceCategory: bookingCategory,
      deviceOrProduct: bookingDevice.trim() || 'Standard Device / Document',
      problemOrRequirement: bookingProblem.trim(),
      preferredDate: bookingDate || 'Today / Earliest Available',
      message: bookingMessage.trim(),
      status: 'Received',
    };
    const next = [created, ...bookings];
    setBookings(next);
    dataStore.saveBookings(next);
    setBookingConfirmed(created);
    setBookingName('');
    setBookingMobile('');
    setBookingDevice('');
    setBookingProblem('');
    setBookingMessage('');
    showToast(`Service request #${created.id} submitted!`);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMobile.trim() || !contactMessage.trim()) {
      showToast('Please complete your Name, Mobile Number, and Message.');
      return;
    }
    const created: ContactEnquiry = {
      id: `ENQ-${Date.now()}`,
      createdAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      name: contactName.trim(),
      mobileNumber: contactMobile.trim(),
      subject: contactSubject.trim() || 'General Shop Enquiry',
      message: contactMessage.trim(),
    };
    const next = [created, ...enquiries];
    setEnquiries(next);
    dataStore.saveEnquiries(next);
    setContactSubmitted(true);
    setContactName('');
    setContactMobile('');
    setContactSubject('');
    setContactMessage('');
    showToast('Thank you! Your message has been recorded.');
  };

  // Filtered products for catalog
  const filteredProducts = products.filter((p) => {
    if (activeProductCategory !== 'All' && p.category !== activeProductCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subType.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const mobileRepairServices = ALL_SERVICES.filter(
    (s) => s.section === 'mobile-repair'
  );
  const laptopRepairServices = ALL_SERVICES.filter(
    (s) => s.section === 'laptop-repair'
  );
  const printingServices = ALL_SERVICES.filter((s) => s.section === 'printing');
  const onlineServices = ALL_SERVICES.filter(
    (s) => s.section === 'online-services'
  );

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* =====================================================================
          TOP BAR CONTRACT (Strict 3-Zone Header: Brand Wordmark | 5 Nav Links | 2 Actions)
          ===================================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="text-lg font-extrabold tracking-tight text-slate-900 font-display whitespace-nowrap"
        >
          Javid Telecom Cherpora
        </a>

        {/* Zone 2: 5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a
            href="#shop"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Shop
          </a>
          <a
            href="#repairs"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Repairs
          </a>
          <a
            href="#printing"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Printing
          </a>
          <a
            href="#online-services"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Online Services
          </a>
          <a
            href="#book-service"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Book Service
          </a>
        </nav>

        {/* Zone 3: 2 primary actions */}
        <div className="flex items-center gap-2.5">
          <a
            href="tel:+917780869615"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 hover:text-blue-700 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 font-mono-tabular"
          >
            <Phone className="w-3.5 h-3.5 text-blue-700" />
            7780869615
          </a>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Cart ({totalCartCount})</span>
          </button>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center justify-between gap-3 text-xs">
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <main id="top" className="flex-1">
        {/* =====================================================================
            2. HERO SECTION (16:9 Storefront Showcase + Tagline + Location + CTAs)
            ===================================================================== */}
        <section className="relative bg-gradient-to-br from-sky-50 via-white to-indigo-50 text-slate-900 overflow-hidden border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Front-Left Shop Photo + Brand Lockup, 3D Display Headline, Intro & Action Buttons */}
              <div className="lg:col-span-7 space-y-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-sky-50/90 to-indigo-50/80 border-2 border-blue-200 shadow-[0_20px_50px_rgba(37,99,235,0.12)]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Front Left Side Shop Photo Showcase */}
                  <div className="relative group shrink-0">
                    <div className="w-36 h-28 sm:w-44 sm:h-36 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-lg bg-slate-100">
                      <img
                        src={frontLeftImg}
                        alt="Javid Telecom Cherpora — Shop Owner & Counter"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label
                      htmlFor="front-left-photo-upload"
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
                    >
                      <span>Change Photo</span>
                      <input
                        id="front-left-photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFrontLeftPhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2.5 bg-gradient-to-r from-blue-50 via-cyan-50 to-purple-50 border border-blue-200 px-3 py-1.5 rounded-2xl w-fit">
                      <BrandLogo className="w-8 h-8 shrink-0" />
                      <div className="text-xs font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 bg-clip-text text-transparent">
                        <span>{settings.tagline}</span>
                        <span className="mx-1.5 text-blue-400">·</span>
                        <span>Call / WhatsApp: +91 7780869615</span>
                      </div>
                    </div>

                    <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase leading-[1.05] bg-gradient-to-r from-blue-700 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-[0_3px_0_rgba(191,219,254,1)] filter">
                      JAVID TELECOM CHERPORA
                    </div>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-teal-800 bg-clip-text text-transparent leading-snug">
                  Your One-Stop Shop for Mobile, Electronics, Printing, Repairing & Online Services
                </h1>

                <p className="text-base text-slate-700 leading-relaxed max-w-2xl">
                  Javid Telecom Cherpora provides a wide range of mobile, electronics, repairing, printing, documentation and digital services under one roof. Customers can purchase products, repair devices, use online services and access printing and documentation facilities conveniently.
                </p>

                {/* Highlighted Point: Payment Transactions / Cash Facility */}
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-300 text-emerald-950 text-sm font-bold shadow-xs">
                  <CreditCard className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    • Payment transactions / Cash facility is also available
                  </span>
                </div>

                {/* Direct Call, WhatsApp & Gmail Hotline Strip */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-mono-tabular bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-200 px-4 py-3.5 rounded-2xl shadow-xs">
                  <a
                    href="tel:+917780869615"
                    className="inline-flex items-center gap-2 font-bold text-blue-800 hover:text-blue-600 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>+91 7780869615</span>
                  </a>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <a
                    href="https://wa.me/917780869615?text=Hello%20Javid%20Telecom%20Cherpora%2C%20I%20would%20like%20to%20enquire%20about%20your%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-bold text-emerald-700 hover:text-emerald-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp: 7780869615</span>
                  </a>
                  <span className="text-slate-300 hidden md:inline">|</span>
                  <a
                    href="mailto:javaidtelecom068@gmail.com"
                    className="inline-flex items-center gap-2 font-bold text-indigo-700 hover:text-indigo-600 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span>javaidtelecom068@gmail.com</span>
                  </a>
                </div>

                {/* Primary Hero CTA & Secondary Action Links */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="#shop"
                    className="px-5 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-bold rounded-xl shadow-md shadow-cyan-500/20 transition-all inline-flex items-center gap-2 whitespace-nowrap"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Shop Now
                  </a>
                  <a
                    href="#repairs"
                    className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-purple-500/20 transition-all whitespace-nowrap"
                  >
                    Our Services
                  </a>
                  <a
                    href="#visit-store"
                    className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all whitespace-nowrap"
                  >
                    Visit Our Shop
                  </a>
                  <a
                    href="#contact"
                    className="px-4 py-3 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white text-sm font-semibold rounded-xl shadow-md shadow-rose-500/20 transition-all whitespace-nowrap"
                  >
                    Contact Us
                  </a>
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white text-sm font-semibold rounded-xl transition-all inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <MapPin className="w-4 h-4 text-amber-300" />
                    Get Directions
                  </a>
                  <a
                    href="https://wa.me/917780869615?text=Hello%20Javid%20Telecom%20Cherpora%2C%20I%20would%20like%20to%20enquire%20about%20your%20products%20and%20digital%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-500/25 transition-all inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Us (7780869615)
                  </a>
                </div>

                {/* Unboxed Department Visual Index (Smartphone, Earbuds, Accessories, Laptop, Printer, Photocopy, Lamination, Online, Payments) */}
                <div className="pt-4 border-t border-blue-200/80 text-xs flex flex-wrap items-center gap-y-1.5">
                  <span className="text-slate-900 font-bold mr-2">Available In-Store:</span>
                  <span className="text-blue-700 font-semibold">Smartphones</span>
                  <span className="mx-2 text-slate-400">·</span>
                  <span className="text-pink-700 font-semibold">Earbuds & Audio</span>
                  <span className="mx-2 text-slate-400">·</span>
                  <span className="text-emerald-700 font-semibold">Mobile Accessories</span>
                  <span className="mx-2 text-slate-400">·</span>
                  <span className="text-amber-700 font-semibold">Laptop Service</span>
                  <span className="mx-2 text-slate-400">·</span>
                  <span className="text-sky-700 font-semibold">Laser Printing</span>
                  <span className="mx-2 text-slate-400">·</span>
                  <span className="text-purple-700 font-semibold">Photocopy / Xerox</span>
                  <span className="mx-2 text-slate-400">·</span>
                  <span className="text-teal-700 font-semibold">Thermal Lamination</span>
                  <span className="mx-2 text-slate-400">·</span>
                  <span className="text-rose-700 font-semibold">Online Form Assistance</span>
                  <span className="mx-2 text-slate-400">·</span>
                  <span className="text-indigo-700 font-semibold">Payment Transactions / Cash Facility</span>
                </div>
              </div>

              {/* Right Column: High-Impact 16:9 Visual Carrier with Scrim & Department Highlights */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-800 aspect-[16/10] shadow-2xl">
                  {!heroImgError ? (
                    <img
                      src={HERO_IMAGE}
                      alt="Javid Telecom Cherpora Storefront and Digital Service Centre"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-8 text-center">
                      <BrandLogo className="w-16 h-16 mb-3" />
                      <div className="text-base font-bold text-white">
                        Javid Telecom Cherpora
                      </div>
                      <div className="text-xs text-blue-300 mt-1">
                        Mean Somu Stand, Cherpora, Shangus, Anantnag
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-5">
                    <div className="text-xs text-blue-300 font-medium">
                      Local Multi-Service Digital & Electronics Centre · Call: 7780869615
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      Mean Somu Stand, Cherpora, Shangus, Anantnag, J&K
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            11. PRODUCT & SERVICE SEARCH BAR
            ===================================================================== */}
        <GlobalSearchExplorer
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedScope={searchScope}
          setSelectedScope={setSearchScope}
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          onBookServiceWithPrefill={scrollToServiceBooking}
        />

        {/* =====================================================================
            3 & 9. MOBILE & ELECTRONICS SHOP + ONLINE SHOPPING CATALOG
            ===================================================================== */}
        <section id="shop" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-semibold text-blue-700 mb-1">
                01. Mobile & Electronics Shop · Online & Offline Shopping
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Smartphones, Audio, Power & Mobile Accessories
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Order online for local delivery or reserve for quick counter pickup at Mean Somu Stand, Cherpora. Prices are editable anytime from the store admin panel.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Settings className="w-3.5 h-3.5 text-blue-700" />
                Edit Prices / Admin
              </button>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                View Cart ({totalCartCount})
              </button>
            </div>
          </div>

          {/* Complete 19-Item Subcategory Directory Strip (Clean Unboxed Typography) */}
          <div className="mb-6 pb-4 border-b border-slate-200 text-xs text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-800 mr-2">
              Complete Stock Range:
            </span>
            {MOBILE_ELECTRONICS_SUBCATEGORIES.map((item, idx) => (
              <span key={item}>
                {idx > 0 && <span className="mx-1.5 text-slate-300">·</span>}
                <button
                  type="button"
                  onClick={() => setSearchQuery(item.replace(/s$/, ''))}
                  className="hover:text-blue-700 hover:underline transition-colors"
                >
                  {item}
                </button>
              </span>
            ))}
          </div>

          {/* Interactive Category Filter Bar */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl overflow-x-auto mb-8">
            <button
              type="button"
              onClick={() => setActiveProductCategory('All')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeProductCategory === 'All'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Categories ({products.length})
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveProductCategory(cat)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeProductCategory === cat
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 3-Column Desktop / 2-Column Tablet Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-sm text-slate-600">
                No products match the current filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveProductCategory('All');
                  setSearchQuery('');
                }}
                className="mt-3 px-4 py-2 bg-blue-700 text-white text-xs font-semibold rounded-lg"
              >
                Show All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onBuyNow={(p) => handleBuyNow(p, 1)}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onWhatsAppEnquire={handleWhatsAppAction}
                />
              ))}
            </div>
          )}
        </section>

        {/* =====================================================================
            4 & 5. MOBILE REPAIRING + LAPTOP & COMPUTER SERVICES
            ===================================================================== */}
        <section
          id="repairs"
          className="py-16 bg-white border-y border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {/* Part A: 4. Mobile Repairing */}
            <div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="text-xs font-semibold text-blue-700 mb-1">
                    02. Mobile Repairing Centre
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Professional Smartphone & Feature Phone Repairs
                  </h2>
                  <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                    Fast, reliable hardware and software troubleshooting using quality replacement parts at Mean Somu Stand, Cherpora.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      scrollToServiceBooking(
                        'Mobile Repair',
                        'Mobile Screen / Hardware Diagnostics'
                      )
                    }
                    className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap"
                  >
                    Book a Repair
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleWhatsAppAction(
                        'Hello Javid Telecom Cherpora, I need to book a mobile repair.'
                      )
                    }
                    className="px-4 py-2.5 border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    Book Repair on WhatsApp
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {mobileRepairServices.map((srv, index) => (
                  <div
                    key={srv.id}
                    className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200/90 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span className="font-mono-tabular font-semibold text-blue-700">
                          {String(index + 1).padStart(2, '0')}. Mobile Service
                        </span>
                        <span>{srv.turnaround}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          scrollToServiceBooking('Mobile Repair', srv.title)
                        }
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900"
                      >
                        Book This Repair →
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleWhatsAppAction(
                            `Hello Javid Telecom Cherpora, I want to enquire about ${srv.title}.`
                          )
                        }
                        className="text-xs text-slate-500 hover:text-emerald-700"
                      >
                        WhatsApp Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Part B: 5. Laptop & Computer Services */}
            <div className="pt-12 border-t border-slate-200">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="text-xs font-semibold text-blue-700 mb-1">
                    03. Laptop & Computer Services
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Laptop Repair, Windows Setup, SSD & RAM Upgrades
                  </h2>
                  <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                    Complete hardware maintenance, OS formatting, software installation, and printer configuration for students, offices, and homes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    scrollToServiceBooking(
                      'Laptop Repair',
                      'Laptop Repair / Windows / SSD Service'
                    )
                  }
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap self-start md:self-auto"
                >
                  Book Laptop Repair
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {laptopRepairServices.map((srv, index) => (
                  <div
                    key={srv.id}
                    className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200/90 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span className="font-mono-tabular font-semibold text-slate-700">
                          {String(index + 1).padStart(2, '0')}. PC & Laptop
                        </span>
                        <span>{srv.turnaround}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          scrollToServiceBooking('Laptop Repair', srv.title)
                        }
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900"
                      >
                        Book Laptop Service →
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleWhatsAppAction(
                            `Hello Javid Telecom Cherpora, I need assistance with ${srv.title}.`
                          )
                        }
                        className="text-xs text-slate-500 hover:text-emerald-700"
                      >
                        Enquire on WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            6 & 7. PRINTING & DOCUMENTATION + ONLINE SERVICES CENTRE
            ===================================================================== */}
        <section id="printing" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* 6. Printing & Document Services */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <div className="text-xs font-semibold text-blue-700 mb-1">
                  04. Printing & Documentation
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  High-Speed Xerox, Colour Printing, Lamination & Photos
                </h2>
                <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                  Send your files via WhatsApp or bring your documents directly to our shop for instant printing, scanning, passport photos, and binding.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleWhatsAppAction(
                    'Hello Javid Telecom Cherpora, I want to send a document for printing / photocopy.'
                  )
                }
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 whitespace-nowrap self-start md:self-auto"
              >
                <MessageCircle className="w-4 h-4" />
                Send File on WhatsApp for Print
              </button>
            </div>

            {/* Complete 15-Service Printing Directory */}
            <div className="mb-6 pb-4 border-b border-slate-200 text-xs text-slate-500 leading-relaxed">
              <span className="font-semibold text-slate-800 mr-2">
                All Printing & Document Facilities:
              </span>
              {PRINTING_CHECKLIST.map((item, idx) => (
                <span key={item}>
                  {idx > 0 && <span className="mx-1.5 text-slate-300">·</span>}
                  <span>{item}</span>
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {printingServices.map((srv) => (
                <div
                  key={srv.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                      <DynamicIcon name={srv.iconKey} className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{srv.turnaround}</span>
                    <button
                      type="button"
                      onClick={() =>
                        scrollToServiceBooking(srv.group, srv.title)
                      }
                      className="font-semibold text-blue-700 hover:text-blue-900"
                    >
                      Request →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Online Services Centre */}
          <div id="online-services" className="pt-12 border-t border-slate-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <div className="text-xs font-semibold text-blue-700 mb-1">
                  05. Online Services Centre
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Online Form Filling, Exam, Scholarship & Citizen Portal Assistance
                </h2>
                <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                  Online assistance and form-filling services available for students, job applicants, and local residents.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  scrollToServiceBooking(
                    'Online Service',
                    'Online Application / Form Filling Assistance'
                  )
                }
                className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl whitespace-nowrap self-start md:self-auto"
              >
                Book Online Service Assistance
              </button>
            </div>

            {/* Mandatory Disclaimer Box */}
            <div className="mb-6 p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-slate-700 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">
                  Service Transparency Notice:
                </span>{' '}
                Online assistance and form-filling services available. Javid Telecom Cherpora is an independent private digital service centre providing internet, document scanning, and portal form-filling assistance for customer convenience.
              </div>
            </div>

            {/* Complete 17-Service Online Assistance Directory */}
            <div className="mb-6 pb-4 border-b border-slate-200 text-xs text-slate-500 leading-relaxed">
              <span className="font-semibold text-slate-800 mr-2">
                Supported Online Services:
              </span>
              {ONLINE_SERVICES_CHECKLIST.map((item, idx) => (
                <span key={item}>
                  {idx > 0 && <span className="mx-1.5 text-slate-300">·</span>}
                  <span>{item}</span>
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {onlineServices.map((srv) => (
                <div
                  key={srv.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-3">
                      <DynamicIcon name={srv.iconKey} className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{srv.turnaround}</span>
                    <button
                      type="button"
                      onClick={() =>
                        scrollToServiceBooking('Online Service', srv.title)
                      }
                      className="font-semibold text-blue-700 hover:text-blue-900"
                    >
                      Book Assistance →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            8. ATM / DIGITAL PAYMENT FACILITY
            ===================================================================== */}
        <section className="py-14 bg-slate-900 text-white border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-3">
                <div className="text-xs font-semibold text-blue-400">
                  06. Banking & Payment Facilities
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  ATM Facility, QR Code & Digital Payment Assistance Available
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Convenient in-store ATM facility, UPI transfers, QR code scan payments, and online fee payment assistance available right at Mean Somu Stand, Cherpora.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
                  <span>• ATM Facility</span>
                  <span>• UPI Payments</span>
                  <span>• QR Code Payments</span>
                  <span>• Digital Payments</span>
                  <span>• Online Payment Assistance</span>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="p-6 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-300">
                      Digital Payment Assistance Available
                    </span>
                    <CreditCard className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white flex items-center justify-between">
                      <span>UPI / BHIM QR</span>
                      <span className="text-[11px] text-emerald-400">Supported</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white flex items-center justify-between">
                      <span>PhonePe</span>
                      <span className="text-[11px] text-emerald-400">Supported</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white flex items-center justify-between">
                      <span>Google Pay (GPay)</span>
                      <span className="text-[11px] text-emerald-400">Supported</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white flex items-center justify-between">
                      <span>Paytm & Cards</span>
                      <span className="text-[11px] text-emerald-400">Supported</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Visit our shop counter at Mean Somu Stand, Cherpora for cash withdrawal assistance, digital bill payments, and online application fee submissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            12 & 4. UNIFIED REPAIR & SERVICE BOOKING SECTION
            ===================================================================== */}
        <section
          id="book-service"
          className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-semibold text-blue-700">
                07. Book a Repair or Digital Service
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Schedule Mobile Repair, Laptop Service, Printing or Online Form Assistance
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Submit your repair or service requirement online to save waiting time at the counter. You can also send your request directly on WhatsApp.
              </p>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs text-slate-600">
                <div className="font-semibold text-slate-900 text-sm">
                  Service Categories Covered:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span>• Mobile Repair</span>
                  <span>• Laptop Repair</span>
                  <span>• Printing & Xerox</span>
                  <span>• Thermal Lamination</span>
                  <span>• Online Service</span>
                  <span>• Document Service</span>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() =>
                      handleWhatsAppAction(
                        'Hello Javid Telecom Cherpora, I would like to book a repair / service appointment.'
                      )
                    }
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Book Repair / Service on WhatsApp
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
                {bookingConfirmed ? (
                  <div className="space-y-4 py-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-mono-tabular font-semibold text-emerald-700">
                      Request Reference #{bookingConfirmed.id}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Your {bookingConfirmed.serviceCategory} Request is Confirmed
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Thank you, {bookingConfirmed.customerName}. Please bring your device or documents to Javid Telecom Cherpora (Mean Somu Stand, Cherpora) on {bookingConfirmed.preferredDate}.
                    </p>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                      <div>
                        <span className="text-slate-500">Device / Product:</span>{' '}
                        <span className="font-semibold text-slate-900">
                          {bookingConfirmed.deviceOrProduct}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Problem / Requirement:</span>{' '}
                        <span className="font-semibold text-slate-900">
                          {bookingConfirmed.problemOrRequirement}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleWhatsAppAction(
                            `Hello Javid Telecom Cherpora, my service booking ID is #${bookingConfirmed.id} for ${bookingConfirmed.serviceCategory} (${bookingConfirmed.deviceOrProduct} - ${bookingConfirmed.problemOrRequirement}).`
                          )
                        }
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Send Booking Details on WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingConfirmed(null)}
                        className="px-4 py-2.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                      >
                        Book Another Service
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Customer Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={bookingMobile}
                          onChange={(e) => setBookingMobile(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-700 focus:outline-none font-mono-tabular"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Service Category *
                        </label>
                        <select
                          value={bookingCategory}
                          onChange={(e) =>
                            setBookingCategory(e.target.value as ServiceGroup)
                          }
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:border-blue-700 focus:outline-none"
                        >
                          <option value="Mobile Repair">Mobile Repair</option>
                          <option value="Laptop Repair">Laptop Repair</option>
                          <option value="Printing">Printing</option>
                          <option value="Lamination">Lamination</option>
                          <option value="Online Service">Online Service</option>
                          <option value="Document Service">Document Service</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Device Name / Model or Document Type *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookingDevice}
                          onChange={(e) => setBookingDevice(e.target.value)}
                          placeholder="e.g., Redmi Note 12 / HP Laptop / A4 Project"
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-700 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Problem / Service Requirement *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookingProblem}
                          onChange={(e) => setBookingProblem(e.target.value)}
                          placeholder="e.g., Screen replacement / Windows install / Form filling"
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-700 focus:outline-none font-mono-tabular"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Additional Message (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={bookingMessage}
                        onChange={(e) => setBookingMessage(e.target.value)}
                        placeholder="Any additional details about your device issue or document requirement"
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:border-blue-700 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      Submit Repair / Service Request
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            15 & 16. ABOUT US + LOCAL CUSTOMER TESTIMONIALS + FAQ
            ===================================================================== */}
        <section
          id="about"
          className="py-16 bg-white border-y border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {/* About Javid Telecom Cherpora */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs font-semibold text-blue-700">
                  08. About Javid Telecom Cherpora
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Serving Cherpora, Shangus & Surrounding Areas of Anantnag
                </h2>
                <p className="text-base text-slate-700 leading-relaxed">
                  Javid Telecom Cherpora is a local multi-service digital and electronics centre serving customers in Cherpora and surrounding areas. The shop provides mobile accessories, repairing services, laptop/computer services, printing, photocopy, lamination, photo printing, online assistance and digital payment facilities at one convenient location.
                </p>
              </div>
              <div className="lg:col-span-5">
                <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3 text-xs">
                  <div className="font-bold text-slate-900 text-sm">
                    Why Customers Visit Our Centre at Mean Somu Stand:
                  </div>
                  <div className="space-y-2 text-slate-600">
                    <div>
                      • Complete mobile & computer hardware repair with transparent turnaround times.
                    </div>
                    <div>
                      • Instant B&W and colour laser printing, Xerox, passport photos, and lamination.
                    </div>
                    <div>
                      • Patient, accurate form-filling assistance for exams, scholarships, and jobs.
                    </div>
                    <div>
                      • Genuine chargers, cables, earbuds, power banks, and protective accessories.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attributable Local Testimonials (Claim-to-Proof Adjacency) */}
            <div className="pt-12 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-6">
                Customer Feedback from Cherpora & Shangus
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between"
                  >
                    <p className="text-xs text-slate-700 leading-relaxed">
                      "{t.outcome}"
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs">
                      <div className="font-bold text-slate-900">{t.name}</div>
                      <div className="text-slate-500">
                        {t.role} · {t.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="pt-12 border-t border-slate-200 max-w-3xl">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Frequently Asked Questions
              </h3>
              <div className="divide-y divide-slate-200 border-y border-slate-200">
                {FAQS.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx} className="py-3.5">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between text-left text-sm font-semibold text-slate-900 hover:text-blue-700"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform duration-150 shrink-0 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            10 & 14. VISIT OUR STORE (OFFLINE SHOPPING) & CONTACT PAGE + GOOGLE MAPS
            ===================================================================== */}
        <section
          id="visit-store"
          className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div id="contact" className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Visit Our Store & Configurable Contact Info */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="text-xs font-semibold text-blue-700 mb-1">
                  09. Visit Our Store & Contact Us
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Visit Javid Telecom Cherpora In-Person
                </h2>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Walk into our physical shop at Mean Somu Stand, Cherpora for direct product purchases, mobile accessories, device repairs, printing, photocopy, lamination, online services, and ATM/digital payment facilities.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 text-xs">
                <div>
                  <div className="text-slate-400 font-medium">Shop Address</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    Mean Somu Stand, Cherpora, Shangus, Anantnag, Jammu & Kashmir, India
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <div className="text-slate-400 font-medium">Phone</div>
                    <a
                      href="tel:+917780869615"
                      className="font-mono-tabular font-bold text-blue-700 hover:underline mt-0.5 block text-sm"
                    >
                      +91 7780869615
                    </a>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">WhatsApp (Active)</div>
                    <a
                      href="https://wa.me/917780869615?text=Hello%20Javid%20Telecom%20Cherpora"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono-tabular font-bold text-emerald-700 hover:underline mt-0.5 block text-sm"
                    >
                      +91 7780869615
                    </a>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Email / Gmail</div>
                    <a
                      href={`mailto:${settings.email || 'javaidtelecom068@gmail.com'}`}
                      className="font-mono-tabular font-bold text-indigo-700 hover:underline mt-0.5 block text-sm break-all"
                    >
                      {settings.email && settings.email !== 'EMAIL_HERE'
                        ? settings.email
                        : 'javaidtelecom068@gmail.com'}
                    </a>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">Business Hours</div>
                    <div className="font-semibold text-slate-900 mt-0.5">
                      {settings.businessHours}
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Get Directions, WhatsApp, Call */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl inline-flex items-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Get Directions
                  </a>
                  <a
                    href="https://wa.me/917780869615?text=Hello%20Javid%20Telecom%20Cherpora%2C%20I%20would%20like%20to%20connect%20with%20your%20shop."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl inline-flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp: 7780869615
                  </a>
                  <a
                    href="tel:+917780869615"
                    className="px-4 py-2.5 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl inline-flex items-center gap-1.5 font-mono-tabular"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-700" />
                    Call: 7780869615
                  </a>
                </div>
              </div>

              {/* Embedded Google Maps Location Frame */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
                <iframe
                  title="Javid Telecom Cherpora Map Location"
                  src="https://www.google.com/maps?q=Cherpora+Shangus+Anantnag+Jammu+and+Kashmir&output=embed"
                  className="w-full h-56 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Right Column: Customer Contact & Enquiry Form */}
            <div className="lg:col-span-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">
                  Send Us a Message or Product Enquiry
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Have a question about mobile stock, repair charges, or documents required for an online form? Send a message below.
                </p>

                {contactSubmitted ? (
                  <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                    <CheckCircle2 className="w-7 h-7 text-emerald-700" />
                    <h4 className="text-base font-bold text-slate-900">
                      Enquiry Received
                    </h4>
                    <p className="text-xs text-slate-600">
                      Thank you for contacting Javid Telecom Cherpora. Your enquiry has been saved and can also be followed up directly at our shop counter.
                    </p>
                    <button
                      type="button"
                      onClick={() => setContactSubmitted(false)}
                      className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactMobile}
                        onChange={(e) => setContactMobile(e.target.value)}
                        placeholder="Enter your mobile number"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-700 focus:outline-none font-mono-tabular"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="e.g., Mobile Price Enquiry / Printing / Online Form"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-700 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Message *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Write your question or requirement here..."
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-700 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          20. QUIET, COMPLETE FOOTER
          ===================================================================== */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: Business Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <BrandLogo className="w-8 h-8" />
                <span className="text-base font-bold text-white font-display">
                  JAVID TELECOM CHERPORA
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                “Your One-Stop Digital, Mobile & Online Service Centre”
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Address: Mean Somu Stand, Cherpora, Shangus, Anantnag, J&K
              </p>
              <div className="pt-1 space-y-1 text-xs font-mono-tabular">
                <a
                  href="tel:+917780869615"
                  className="block text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Phone: +91 7780869615
                </a>
                <a
                  href="https://wa.me/917780869615?text=Hello%20Javid%20Telecom%20Cherpora"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  WhatsApp: +91 7780869615
                </a>
                <a
                  href="mailto:javaidtelecom068@gmail.com"
                  className="block text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Gmail: javaidtelecom068@gmail.com
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-xs font-semibold text-white mb-3">
                Quick Links
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#top" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#shop" className="hover:text-white transition-colors">
                    Products & Shop
                  </a>
                </li>
                <li>
                  <a href="#repairs" className="hover:text-white transition-colors">
                    Services & Repairs
                  </a>
                </li>
                <li>
                  <a href="#online-services" className="hover:text-white transition-colors">
                    Online Services
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Services */}
            <div>
              <h3 className="text-xs font-semibold text-white mb-3">
                Services
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#repairs" className="hover:text-white transition-colors">
                    Mobile Repair
                  </a>
                </li>
                <li>
                  <a href="#repairs" className="hover:text-white transition-colors">
                    Laptop Repair
                  </a>
                </li>
                <li>
                  <a href="#printing" className="hover:text-white transition-colors">
                    Xerox & Printing
                  </a>
                </li>
                <li>
                  <a href="#printing" className="hover:text-white transition-colors">
                    Lamination & Photo Printing
                  </a>
                </li>
                <li>
                  <a href="#online-services" className="hover:text-white transition-colors">
                    Online Services
                  </a>
                </li>
                <li>
                  <a href="#visit-store" className="hover:text-white transition-colors">
                    ATM / Digital Payment
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Store Management & Legal */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-white">
                Store Administration & Legal
              </h3>
              <p className="text-xs text-slate-400">
                Manage product prices, stock levels, repair requests, and contact placeholders:
              </p>
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-blue-400" />
                Open Admin Dashboard
              </button>
              <div className="pt-2 flex items-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => setLegalModal('privacy')}
                  className="hover:text-white underline underline-offset-4"
                >
                  Privacy Policy
                </button>
                <button
                  type="button"
                  onClick={() => setLegalModal('terms')}
                  className="hover:text-white underline underline-offset-4"
                >
                  Terms & Conditions
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 Javid Telecom Cherpora. All Rights Reserved.
            </div>
            <div>
              Mean Somu Stand, Cherpora, Shangus, Anantnag, Jammu & Kashmir
            </div>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          MODALS & DRAWERS
          ===================================================================== */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onWhatsAppEnquire={handleWhatsAppAction}
      />

      <CartCheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onPlaceOrder={handlePlaceOrder}
        settings={settings}
        onWhatsAppOrder={handleWhatsAppAction}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onSaveProducts={(updated) => {
          setProducts(updated);
          dataStore.saveProducts(updated);
          showToast('Product inventory and prices updated.');
        }}
        settings={settings}
        onSaveSettings={(updated) => {
          setSettings(updated);
          dataStore.saveSettings(updated);
          showToast('Shop contact details and settings updated.');
        }}
        orders={orders}
        onUpdateOrderStatus={(orderId, status) => {
          const updated = orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          );
          setOrders(updated);
          dataStore.saveOrders(updated);
        }}
        bookings={bookings}
        onUpdateBookingStatus={(bookingId, status) => {
          const updated = bookings.map((b) =>
            b.id === bookingId ? { ...b, status } : b
          );
          setBookings(updated);
          dataStore.saveBookings(updated);
        }}
        enquiries={enquiries}
        onResetDemoData={() => {
          const { products: defProds, settings: defSettings } =
            dataStore.resetToDefaults();
          setProducts(defProds);
          setSettings(defSettings);
          showToast('Reset products and business settings to defaults.');
        }}
      />

      {/* Legal Policy Modal (Privacy Policy / Terms & Conditions) */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {legalModal === 'privacy'
                  ? 'Privacy Policy — Javid Telecom Cherpora'
                  : 'Terms & Conditions — Javid Telecom Cherpora'}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              {legalModal === 'privacy' ? (
                <>
                  <p>
                    Javid Telecom Cherpora respects your privacy. Customer names, phone numbers, addresses, and documents shared for printing, form filling, or device repair are used strictly to fulfill your requested service or order.
                  </p>
                  <p>
                    Documents sent via WhatsApp or email for printing and online application assistance are deleted after job completion upon customer request. We never sell or share customer data with third parties.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    1. Product prices and stock availability listed online are subject to in-store verification at Javid Telecom Cherpora, Mean Somu Stand, Cherpora.
                  </p>
                  <p>
                    2. For mobile and laptop repairs, customers are requested to back up sensitive data where possible. Repair turnaround times depend on spare part availability.
                  </p>
                  <p>
                    3. Javid Telecom Cherpora provides independent private online form-filling and portal assistance based on information supplied and verified by the applicant.
                  </p>
                </>
              )}
            </div>
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
