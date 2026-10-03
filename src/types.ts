export type ProductCategory =
  | 'Mobile Accessories'
  | 'Earbuds & Audio'
  | 'Chargers & Cables'
  | 'Power Banks'
  | 'Smart Watches'
  | 'Memory Cards'
  | 'USB Drives'
  | 'Mobile Covers'
  | 'Electronics'
  | 'Other Accessories';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subType: string;
  description: string;
  price: number;
  priceNote?: string;
  stock: number;
  featured: boolean;
  image?: string;
  iconKey: string;
  specs: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ServiceGroup =
  | 'Mobile Repair'
  | 'Laptop Repair'
  | 'Printing'
  | 'Lamination'
  | 'Online Service'
  | 'Document Service'
  | 'Other';

export interface ServiceItem {
  id: string;
  title: string;
  group: ServiceGroup;
  section: 'mobile-repair' | 'laptop-repair' | 'printing' | 'online-services';
  description: string;
  turnaround: string;
  iconKey: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  customerName: string;
  mobileNumber: string;
  address: string;
  fulfillmentMethod: 'Pickup at Shop' | 'Local Delivery';
  paymentMethod: 'Cash on Delivery / Pay at Shop' | 'UPI' | 'Online Payment';
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  status: 'Confirmed' | 'Ready for Pickup' | 'Out for Delivery' | 'Completed';
}

export interface BookingRecord {
  id: string;
  createdAt: string;
  customerName: string;
  mobileNumber: string;
  serviceCategory: ServiceGroup;
  deviceOrProduct: string;
  problemOrRequirement: string;
  preferredDate: string;
  message: string;
  status: 'Received' | 'In Progress' | 'Completed';
}

export interface ContactEnquiry {
  id: string;
  createdAt: string;
  name: string;
  mobileNumber: string;
  subject: string;
  message: string;
}

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  addressLine1: string;
  addressLine2: string;
  fullAddress: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  businessHours: string;
  googleMapsUrl: string;
  paymentGatewayConfigured: boolean;
}
