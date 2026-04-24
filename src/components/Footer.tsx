import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gallery-dark border-t border-border/20">
      <div className="container mx-auto px-6 py-16 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-display text-3xl text-primary mb-4 tracking-wide">HAQ Arts</h3>
            <p className="font-body text-muted-foreground text-sm leading-relaxed max-w-md">
              Transforming ordinary spaces into meaningful visual experiences through memory, culture, and personal interpretation.
            </p>
            <div className="brand-line w-20 mt-6" />

            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 border border-border/40 text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 border border-border/40 text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://wa.me/923239341193"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-2 border border-border/40 text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-5">Explore</h4>
            <div className="flex flex-col gap-3">
              {["Paintings", "Artist", "Blog", "Services", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="font-body text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-5">Get in Touch</h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:Info@haqarts.com"
                className="flex items-center gap-3 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail size={14} className="flex-shrink-0" />
                Info@haqarts.com
              </a>
              <a
                href="tel:+923239341193"
                className="flex items-center gap-3 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone size={14} className="flex-shrink-0" />
                0323 9341193
              </a>
              <span className="flex items-center gap-3 font-body text-sm text-muted-foreground">
                <MapPin size={14} className="flex-shrink-0" />
                Kasur, Pakistan
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row gap-3 items-center justify-between">
          <p className="font-body text-xs text-muted-foreground tracking-widest uppercase">
            © {year} HAQ Arts — All Rights Reserved
          </p>
          <Link
            to="/admin"
            className="font-body text-[11px] text-muted-foreground/60 hover:text-primary tracking-widest uppercase transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
