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
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: 64,
          zIndex: 200,
          background: "rgba(0,0,0,0.78)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(201,168,76,0.18)",
          boxShadow: "0 1px 0 0 rgba(201,168,76,0.06)",
        }}
      >
        <div className="mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-10 max-w-[1400px]">
          <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="HAQ Arts home">
            <img src={logo} alt="HAQ Arts" className="h-9 w-auto" />
            <span
              className="font-display tracking-[0.18em]"
              style={{
                color: "#fff",
                fontSize: "clamp(15px, 1.6vw, 19px)",
                fontWeight: 500,
              }}
            >
              HAQ <span style={{ color: "hsl(var(--primary))" }}>·</span> ARTS
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/cart" aria-label="Cart" className="relative p-2" style={{ color: "#fff" }}>
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-body font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={toggle}
              className="p-2"
              style={{ color: "#fff", zIndex: 350, position: "relative" }}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>


      {/* Fullscreen overlay menu */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.92)",
          zIndex: 300,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 250ms ease",
        }}
      >
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#fff",
            background: "transparent",
            border: "none",
            padding: 12,
            cursor: "pointer",
            zIndex: 360,
          }}
        >
          <X size={26} />
        </button>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            paddingTop: 80,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="font-display tracking-wider"
                  style={{
                    fontSize: "clamp(28px, 5vw, 44px)",
                    color: active ? "#fff" : "rgba(255,255,255,0.7)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
