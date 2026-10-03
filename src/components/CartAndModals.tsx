import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  X,
  MessageCircle,
  MapPin,
  CreditCard,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import {
  Product,
  CartItem,
  OrderRecord,
  BusinessSettings,
} from '../types';
import { DynamicIcon } from './Icons';

// ============================================================================
// 1. PRODUCT DETAIL CONTIGUOUS PURCHASE MODAL
// ============================================================================
interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number) => void;
  onBuyNow: (product: Product, qty: number) => void;
  onWhatsAppEnquire: (message: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onWhatsAppEnquire,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full overflow-hidden shadow-xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="text-xs text-slate-500">
            <span>{product.category}</span>
            <span className="mx-1.5">·</span>
            <span>{product.subType}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            aria-label="Close product details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Left Gallery */}
          <div className="aspect-[4/3] rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center">
            {product.image && !imgError ? (
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-blue-300 mb-3">
                  <DynamicIcon name={product.iconKey} className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium text-slate-200">
                  {product.subType}
                </span>
              </div>
            )}
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{product.name}</h2>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-slate-900 font-mono-tabular">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-emerald-700 font-medium">
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                </span>
              </div>
              {product.priceNote && (
                <p className="text-xs text-slate-400 mt-0.5">{product.priceNote}</p>
              )}

              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                {product.description}
              </p>

              {product.specs && product.specs.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    Key Highlights:
                  </div>
                  <div className="flex flex-wrap gap-y-1 gap-x-3 text-xs text-slate-600">
                    {product.specs.map((spec, idx) => (
                      <span key={idx}>
                        {idx > 0 && <span className="mr-3 text-slate-300">·</span>}
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Quantity</span>
                <div className="flex items-center border border-slate-300 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-slate-600 hover:text-slate-900"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-semibold font-mono-tabular">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
                    className="p-2 text-slate-600 hover:text-slate-900"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={product.stock <= 0}
                  onClick={() => {
                    onBuyNow(product, quantity);
                    onClose();
                  }}
                  className="py-2.5 px-4 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  disabled={product.stock <= 0}
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Add to Cart
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  onWhatsAppEnquire(
                    `Hello Javid Telecom Cherpora, I would like to order ${quantity}x "${product.name}" (₹${product.price} each).`
                  )
                }
                className="w-full py-2.5 px-4 border border-slate-200 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 text-xs font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                Order / Enquire on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. SHOPPING CART & COMPLETE CHECKOUT DRAWER
// ============================================================================
interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onPlaceOrder: (orderData: Omit<OrderRecord, 'id' | 'createdAt' | 'status'>) => OrderRecord;
  settings: BusinessSettings;
  onWhatsAppOrder: (message: string) => void;
}

export const CartCheckoutDrawer: React.FC<CartCheckoutDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onPlaceOrder,
  settings,
  onWhatsAppOrder,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('Cherpora, Shangus, Anantnag');
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'Pickup at Shop' | 'Local Delivery'>('Pickup at Shop');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery / Pay at Shop' | 'UPI' | 'Online Payment'>('Cash on Delivery / Pay at Shop');
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !mobileNumber.trim() || !address.trim()) {
      setFormError('Please enter your Name, Mobile Number, and Address.');
      return;
    }
    if (mobileNumber.replace(/[^\d]/g, '').length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setFormError('');

    const newOrder = onPlaceOrder({
      customerName: customerName.trim(),
      mobileNumber: mobileNumber.trim(),
      address: address.trim(),
      fulfillmentMethod,
      paymentMethod,
      items: cart.map((c) => ({
        productId: c.product.id,
        productName: c.product.name,
        quantity: c.quantity,
        unitPrice: c.product.price,
      })),
      totalAmount: subtotal,
    });

    setConfirmedOrder(newOrder);
    setStep('confirmed');
  };

  const resetAndClose = () => {
    setStep('cart');
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg h-full flex flex-col justify-between shadow-2xl border-l border-slate-200 overflow-hidden">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900">
              {step === 'cart' && `Your Shopping Cart (${cart.reduce((a, b) => a + b.quantity, 0)})`}
              {step === 'checkout' && 'Checkout & Delivery Details'}
              {step === 'confirmed' && 'Order Confirmation'}
            </h2>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Your cart is currently empty
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Browse mobile phones, earbuds, fast chargers, power banks, smart watches, and memory cards to add items.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4 bg-slate-50/60"
                    >
                      <div className="flex-1">
                        <div className="text-xs text-slate-500">
                          {item.product.category}
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 mt-0.5">
                          {item.product.name}
                        </h4>
                        <div className="text-sm font-bold text-blue-700 font-mono-tabular mt-1">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          <span className="text-xs font-normal text-slate-500 ml-1.5">
                            (₹{item.product.price.toLocaleString('en-IN')} each)
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-3">
                          <div className="inline-flex items-center border border-slate-300 bg-white rounded-lg">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.product.id, -1)}
                              className="p-1.5 text-slate-600 hover:text-slate-900"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-semibold font-mono-tabular">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.product.id, 1)}
                              className="p-1.5 text-slate-600 hover:text-slate-900"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-xs text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
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
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:border-blue-700 focus:outline-none font-mono-tabular"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery / Pickup Option *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['Pickup at Shop', 'Local Delivery'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFulfillmentMethod(option)}
                      className={`py-2.5 px-3 text-xs font-semibold rounded-lg border text-center transition-colors ${
                        fulfillmentMethod === option
                          ? 'bg-blue-50 border-blue-700 text-blue-900'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Address / Village *
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Mohalla, Village, Tehsil Shangus, Anantnag"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:border-blue-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Method *
                </label>
                <div className="space-y-2">
                  {(
                    [
                      'Cash on Delivery / Pay at Shop',
                      'UPI',
                      'Online Payment',
                    ] as const
                  ).map((method) => (
                    <label
                      key={method}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        paymentMethod === method
                          ? 'bg-blue-50/70 border-blue-700'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="mt-0.5"
                      />
                      <div className="text-xs">
                        <div className="font-semibold text-slate-900">{method}</div>
                        {method === 'Cash on Delivery / Pay at Shop' && (
                          <div className="text-slate-500 mt-0.5">
                            Pay in cash or via QR code when picking up at Mean Somu Stand, Cherpora or upon local delivery.
                          </div>
                        )}
                        {method === 'UPI' && (
                          <div className="text-slate-500 mt-0.5">
                            Scan our shop QR code (Google Pay, PhonePe, Paytm) at confirmation or counter.
                          </div>
                        )}
                        {method === 'Online Payment' && (
                          <div className="text-slate-500 mt-0.5">
                            {settings.paymentGatewayConfigured
                              ? 'Redirect to configured merchant payment gateway.'
                              : 'Merchant API keys not yet supplied in environment — your order will be reserved and payable via verified shop link or counter.'}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Item Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-semibold text-slate-700">
                  Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} items)
                </div>
                {cart.map((c) => (
                  <div key={c.product.id} className="flex justify-between text-xs text-slate-600">
                    <span>
                      {c.quantity}x {c.product.name}
                    </span>
                    <span className="font-mono-tabular font-medium text-slate-900">
                      ₹{(c.product.price * c.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Payable</span>
                  <span className="font-mono-tabular">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </form>
          )}

          {step === 'confirmed' && confirmedOrder && (
            <div className="py-6 space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs font-mono-tabular text-emerald-700 font-semibold">
                  Order #{confirmedOrder.id} Confirmed
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Thank you, {confirmedOrder.customerName}!
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Your order has been registered with Javid Telecom Cherpora. You can pick up your order at Mean Somu Stand, Cherpora or coordinate via WhatsApp.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Fulfillment:</span>
                  <span className="font-semibold text-slate-900">
                    {confirmedOrder.fulfillmentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-semibold text-slate-900">
                    {confirmedOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mobile:</span>
                  <span className="font-mono-tabular text-slate-900">
                    {confirmedOrder.mobileNumber}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <div className="font-semibold text-slate-800 mb-1">Items:</div>
                  {confirmedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-slate-600 py-0.5">
                      <span>
                        {item.quantity}x {item.productName}
                      </span>
                      <span className="font-mono-tabular">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Amount:</span>
                  <span className="font-mono-tabular">
                    ₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onWhatsAppOrder(
                    `Hello Javid Telecom Cherpora, I just placed Order #${confirmedOrder.id} for ₹${confirmedOrder.totalAmount} (${confirmedOrder.fulfillmentMethod}). Name: ${confirmedOrder.customerName}, Mobile: ${confirmedOrder.mobileNumber}.`
                  )
                }
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Send Order Receipt on WhatsApp
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          {step === 'cart' && cart.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">Subtotal</span>
                <span className="text-lg font-bold text-slate-900 font-mono-tabular">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          )}

          {step === 'checkout' && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="py-2.5 px-4 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100"
              >
                Back to Cart
              </button>
              <button
                type="submit"
                form="checkout-form"
                className="flex-1 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Place Order (₹{subtotal.toLocaleString('en-IN')})
              </button>
            </div>
          )}

          {step === 'confirmed' && (
            <button
              type="button"
              onClick={resetAndClose}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
            >
              Continue Browsing Shop
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
