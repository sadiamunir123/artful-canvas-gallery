import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowLeft, CheckCircle, Truck, ShieldCheck, Lock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SHIPPING_FLAT = 1500; // Rs flat domestic shipping
const FREE_SHIPPING_THRESHOLD = 100000;
const TAX_RATE = 0; // included in price; show 0 line for transparency

const Cart = () => {
  const { items, removeFromCart, totalPrice, submitOrder, isSubmitting } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  const subtotal = totalPrice;
  const shipping = items.length === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = Math.round(subtotal * TAX_RATE);
  const grandTotal = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitOrder(form);
    if (success) setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-page">
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 md:px-12 flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-lg w-full bg-secondary/30 border border-border p-8 md:p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 mb-6">
              <CheckCircle className="text-primary" size={36} />
            </div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-2">Confirmed</p>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-4">Order Placed</h1>
            <div className="brand-line w-12 mx-auto mb-6" />
            <p className="font-elegant text-base md:text-lg text-foreground/70 mb-8">
              Thank you for your purchase. A confirmation has been sent to your email.
              Our team will contact you shortly to arrange delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/paintings" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors">
                Continue Browsing
              </Link>
              <Link to="/" className="inline-flex items-center justify-center px-8 py-3 border border-border text-foreground/80 font-body text-sm tracking-widest uppercase hover:border-primary hover:text-primary transition-colors">
                Back Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <div className="pt-24 md:pt-28 pb-16 px-4 sm:px-6 md:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <Link to="/paintings" className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors mb-4">
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
            <h1 className="font-display text-3xl md:text-4xl text-foreground">
              {showCheckout ? "Checkout" : "Your Cart"}
            </h1>
            <div className="brand-line w-16 mt-4" />
          </div>

          {items.length === 0 && !showCheckout ? (
            <div className="text-center py-20 border border-dashed border-border">
              <ShoppingBag className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="font-display text-xl text-foreground mb-2">Your cart is empty</p>
              <p className="font-body text-sm text-muted-foreground mb-6">Discover original artwork to take home.</p>
              <Link to="/paintings" className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors">
                Browse Paintings
              </Link>
            </div>
          ) : showCheckout ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-12">
              <div className="space-y-6">
                <h2 className="font-display text-xl md:text-2xl text-foreground">Shipping Details</h2>
                {[
                  { key: "name", label: "Full Name", type: "text" },
                  { key: "email", label: "Email", type: "email" },
                  { key: "phone", label: "Phone Number", type: "tel" },
                  { key: "address", label: "Shipping Address", type: "text" },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label className="font-body text-[10px] tracking-widest uppercase text-muted-foreground block mb-2">{label}</label>
                    <input
                      type={type}
                      required
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                ))}
                <p className="inline-flex items-center gap-2 font-body text-xs text-muted-foreground">
                  <Lock size={12} /> Your information is encrypted and never shared.
                </p>
              </div>

              <div>
                <div className="bg-secondary/50 border border-border p-6">
                  <h2 className="font-display text-lg text-foreground mb-4">Order Summary</h2>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1 mb-4">
                    {items.map(({ artwork }) => (
                      <div key={artwork.id} className="flex gap-3">
                        <img src={artwork.image} alt={artwork.title} className="w-14 h-16 object-contain flex-shrink-0 bg-secondary" />
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm text-foreground truncate">{artwork.title}</p>
                          <p className="font-body text-xs text-muted-foreground truncate">{artwork.medium}</p>
                        </div>
                        <span className="font-body text-sm text-primary whitespace-nowrap">Rs {artwork.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <SummaryLines subtotal={subtotal} shipping={shipping} tax={tax} grandTotal={grandTotal} />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 px-8 py-4 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Placing Order..." : "Place Order"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="w-full mt-3 px-8 py-3 border border-border text-foreground/80 font-body text-sm tracking-widest uppercase hover:border-primary hover:text-primary transition-colors"
                  >
                    Back to Cart
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-12">
              <div className="space-y-4">
                {items.map(({ artwork }) => (
                  <div key={artwork.id} className="flex gap-4 sm:gap-6 bg-secondary/40 border border-border p-3 sm:p-4">
                    <img src={artwork.image} alt={artwork.title} className="w-20 h-28 sm:w-24 sm:h-32 object-contain flex-shrink-0 bg-secondary" loading="lazy" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-display text-base sm:text-lg text-foreground truncate">{artwork.title}</h3>
                        <p className="font-body text-xs text-muted-foreground mt-1 truncate">{artwork.medium} — {artwork.size}</p>
                        <p className="font-body text-[10px] tracking-widest uppercase text-primary mt-1">{artwork.category}</p>
                      </div>
                      <p className="font-body text-sm text-primary mt-2">Rs {artwork.price.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(artwork.id)}
                      aria-label="Remove"
                      className="self-start p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <aside className="lg:sticky lg:top-28 self-start">
                <div className="bg-secondary/50 border border-border p-6">
                  <h2 className="font-display text-lg text-foreground mb-4">Order Summary</h2>
                  <SummaryLines subtotal={subtotal} shipping={shipping} tax={tax} grandTotal={grandTotal} />
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full mt-6 px-8 py-4 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
                  >
                    Proceed to Checkout
                  </button>

                  <div className="mt-6 pt-6 border-t border-border space-y-3 font-body text-xs text-muted-foreground">
                    <p className="flex items-center gap-2"><Truck size={14} className="text-primary" /> Free shipping on orders over Rs {FREE_SHIPPING_THRESHOLD.toLocaleString()}</p>
                    <p className="flex items-center gap-2"><ShieldCheck size={14} className="text-primary" /> Insured delivery & certificate of authenticity</p>
                    <p className="flex items-center gap-2"><Lock size={14} className="text-primary" /> Secure checkout</p>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const SummaryLines = ({
  subtotal,
  shipping,
  tax,
  grandTotal,
}: {
  subtotal: number;
  shipping: number;
  tax: number;
  grandTotal: number;
}) => (
  <div className="space-y-2 font-body text-sm">
    <div className="flex justify-between text-foreground/80">
      <span>Subtotal</span>
      <span>Rs {subtotal.toLocaleString()}</span>
    </div>
    <div className="flex justify-between text-foreground/80">
      <span>Shipping</span>
      <span>{shipping === 0 ? "Free" : `Rs ${shipping.toLocaleString()}`}</span>
    </div>
    <div className="flex justify-between text-foreground/60">
      <span>Tax</span>
      <span>{tax === 0 ? "Included" : `Rs ${tax.toLocaleString()}`}</span>
    </div>
    <div className="border-t border-border pt-3 mt-3 flex justify-between items-baseline">
      <span className="font-display text-lg text-foreground">Total</span>
      <span className="font-display text-xl text-primary">Rs {grandTotal.toLocaleString()}</span>
    </div>
  </div>
);

export default Cart;
