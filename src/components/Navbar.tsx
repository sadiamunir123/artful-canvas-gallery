import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import logo from "@/assets/logo.jpeg";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Paintings", path: "/paintings" },
  { label: "Artist", path: "/artist" },
  { label: "Blog", path: "/blog" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const { totalItems } = useCart();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-background/80 backdrop-blur-md border-b border-border/30">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="HAQ Arts" className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-body">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={toggle}
            className="relative z-50 p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-40 bg-gallery-dark/98 backdrop-blur-lg flex items-center justify-center transition-all duration-500 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`font-display text-3xl md:text-5xl tracking-wider transition-all duration-300 hover:text-primary ${
                location.pathname === link.path
                  ? "text-primary"
                  : "text-foreground/70"
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {link.label}
            </Link>
          ))}
          <div className="brand-line w-32 mt-6" />
          <p className="font-body text-muted-foreground text-sm tracking-widest uppercase mt-2">
            Hadia Javed — Visual Artist
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
