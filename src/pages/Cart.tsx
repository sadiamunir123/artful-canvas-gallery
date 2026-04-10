import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowLeft, CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cart = () => {
  const { items, removeFromCart, totalPrice, submitOrder, isSubmitting } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitOrder(form);
    if (success) setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-page">
        <Navbar />
        <div className="pt-24 pb-16 px-6 md:px-12 flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md">
            <CheckCircle className="mx-auto mb-6 text-primary" size={64} />
            <h1 className="font-display text-3xl text-foreground mb-4">Order Placed!</h1>
            <p className="font-body text-muted-foreground mb-8">
              Thank you for your order. We will contact you shortly to confirm your purchase and arrange delivery.
            </p>
            <Link to="/paintings" className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors">
              Continue Browsing
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <div className="pt-24 pb-16 px-6 md:px-12">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Link to="/paintings" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
              <ArrowLeft size={16} /> Back to Paintings
            </Link>
            <h1 className="font-display text-4xl text-foreground">
              {showCheckout ? "Checkout" : "Shopping Cart"}
            </h1>
            <div className="brand-line w-16 mt-4" />
          </div>

          {items.length === 0 && !showCheckout ? (
            <div className="text-center py-20">
              <ShoppingBag className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="font-body text-muted-foreground mb-6">Your cart is empty</p>
              <Link to="/paintings" className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors">
                Browse Paintings
              </Link>
            </div>
          ) : showCheckout ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="font-display text-2xl text-foreground">Shipping Details</h2>
                {[
                  { key: "name", label: "Full Name", type: "text" },
                  { key: "email", label: "Email", type: "email" },
                  { key: "phone", label: "Phone Number", type: "tel" },
                  { key: "address", label: "Shipping Address", type: "text" },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">{label}</label>
                    <input
                      type={type}
                      required
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-6">Order Summary</h2>
                <div className="bg-secondary border border-border p-6 space-y-4">
                  {items.map(({ artwork }) => (
                    <div key={artwork.id} className="flex justify-between items-center">
                      <span className="font-body text-sm text-foreground">{artwork.title}</span>
                      <span className="font-body text-sm text-primary">Rs {artwork.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-4 flex justify-between">
                    <span className="font-display text-lg text-foreground">Total</span>
                    <span className="font-display text-lg text-primary">Rs {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
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
                  className="w-full mt-3 px-8 py-3 border border-border text-foreground font-body text-sm tracking-widest uppercase hover:border-primary hover:text-primary transition-colors"
                >
                  Back to Cart
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="space-y-6">
                {items.map(({ artwork }) => (
                  <div key={artwork.id} className="flex gap-6 bg-secondary border border-border p-4">
                    <img src={artwork.image} alt={artwork.title} className="w-24 h-32 object-cover" loading="lazy" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-display text-lg text-foreground">{artwork.title}</h3>
                        <p className="font-body text-xs text-muted-foreground mt-1">{artwork.medium} — {artwork.size}</p>
                      </div>
                      <p className="font-body text-sm text-primary">Rs {artwork.price.toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeFromCart(artwork.id)} className="self-start p-2 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6">
                <p className="font-display text-2xl text-foreground">
                  Total: <span className="text-primary">Rs {totalPrice.toLocaleString()}</span>
                </p>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="px-10 py-4 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
