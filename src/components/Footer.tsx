import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gallery-dark border-t border-border/20">
      <div className="container mx-auto px-6 py-16 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-display text-2xl text-primary mb-4">HAQ Arts</h3>
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              Transforming ordinary spaces into meaningful visual experiences through memory and personal interpretation.
            </p>
            <div className="brand-line w-20 mt-6" />
          </div>

          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {["Paintings", "Artist", "Services", "Contact", "Admin"].map((item) => (
                <Link
                  key={item}
                  to={item === "Admin" ? "/admin" : `/${item.toLowerCase()}`}
                  className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Get in Touch</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:Info@haqarts.com" className="flex items-center gap-3 font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail size={14} />
                Info@haqarts.com
              </a>
              <a href="tel:+923239341193" className="flex items-center gap-3 font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone size={14} />
                0323 9341193
              </a>
              <span className="flex items-center gap-3 font-body text-sm text-muted-foreground">
                <MapPin size={14} />
                Kasur, Pakistan
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/20 text-center">
          <p className="font-body text-xs text-muted-foreground tracking-widest uppercase">
            © {new Date().getFullYear()} HAQ Arts — All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
