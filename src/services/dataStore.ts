import {
  Product,
  OrderRecord,
  BookingRecord,
  ContactEnquiry,
  BusinessSettings,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'jt_cherpora_products_v1',
  ORDERS: 'jt_cherpora_orders_v1',
  BOOKINGS: 'jt_cherpora_bookings_v1',
  ENQUIRIES: 'jt_cherpora_enquiries_v1',
  SETTINGS: 'jt_cherpora_settings_v3',
  CART: 'jt_cherpora_cart_v1',
};

/**
 * Cleanly structured data repository.
 * Uses local persistent storage by default and exposes environment checks so
 * Firebase Firestore & Auth can be connected seamlessly via VITE_FIREBASE_* env vars.
 */
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
};

export const dataStore = {
  getProducts(): Product[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(raw) as Product[];
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // Ignore storage quota errors in restricted sandboxes
    }
  },

  getSettings(): BusinessSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
        return INITIAL_SETTINGS;
      }
      return { ...INITIAL_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: BusinessSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore storage errors
    }
  },

  getOrders(): OrderRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return raw ? (JSON.parse(raw) as OrderRecord[]) : [];
    } catch {
      return [];
    }
  },

  saveOrders(orders: OrderRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // Ignore
    }
  },

  getBookings(): BookingRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return raw ? (JSON.parse(raw) as BookingRecord[]) : [];
    } catch {
      return [];
    }
  },

  saveBookings(bookings: BookingRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch {
      // Ignore
    }
  },

  getEnquiries(): ContactEnquiry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return raw ? (JSON.parse(raw) as ContactEnquiry[]) : [];
    } catch {
      return [];
    }
  },

  saveEnquiries(enquiries: ContactEnquiry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    } catch {
      // Ignore
    }
  },

  resetToDefaults(): { products: Product[]; settings: BusinessSettings } {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    } catch {
      // Ignore
    }
    return { products: INITIAL_PRODUCTS, settings: INITIAL_SETTINGS };
  },
};

export function buildWhatsAppLink(
  whatsappNumber: string,
  message: string
): { url: string; isPlaceholder: boolean } {
  const cleaned = whatsappNumber.trim();
  let digits = cleaned.replace(/[^\d]/g, '');
  if (!digits || digits.length < 10) {
    digits = '917780869615';
  } else if (digits.length === 10) {
    digits = `91${digits}`;
  }
  const encoded = encodeURIComponent(message);
  return {
    url: `https://wa.me/${digits}?text=${encoded}`,
    isPlaceholder: false,
  };
}
