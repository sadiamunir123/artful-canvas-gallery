import { useState, useCallback, useEffect } from "react";
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gallery-dark/90 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-12 h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="HAQ Arts home">
            <img src={logo} alt="HAQ Arts" className="h-9 md:h-10 w-auto" />
            <span className="hidden sm:block font-display text-base md:text-lg tracking-wider text-foreground">
              HAQ Arts
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`relative font-body text-sm tracking-widest uppercase transition-colors ${
                      active ? "text-primary" : "text-foreground/70 hover:text-primary"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute -bottom-2 left-0 right-0 h-px bg-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative p-2 text-foreground hover:text-primary transition-colors"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-body font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={toggle}
              className="lg:hidden relative z-50 p-2 text-foreground hover:text-primary transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-gallery-dark/98 backdrop-blur-lg transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6">
          {navLinks.map((link, i) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`font-display text-2xl sm:text-3xl tracking-wider transition-all duration-300 ${
                  active ? "text-primary" : "text-foreground/70 hover:text-primary"
                }`}
                style={{
                  transitionDelay: isOpen ? `${i * 40}ms` : "0ms",
                  transform: isOpen ? "translateY(0)" : "translateY(8px)",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="brand-line w-24 mt-4" />
          <p className="font-body text-muted-foreground text-xs tracking-widest uppercase">
            Hadia Javed — Visual Artist
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
