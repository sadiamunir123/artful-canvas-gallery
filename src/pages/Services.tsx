import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Palette, Brush, Frame, Wallpaper } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Art Consultation",
    description: "Personalized guidance on selecting artwork for your space, understanding art styles, and building a meaningful collection that reflects your taste and vision.",
  },
  {
    icon: Brush,
    title: "Workshops & Art Classes",
    description: "Hands-on painting workshops and art classes for beginners and intermediate learners, covering oil painting, acrylic techniques, color theory, and composition.",
  },
  {
    icon: Frame,
    title: "Commissioned Artworks",
    description: "Custom paintings created to your specifications — from portraits to landscapes, interior-inspired pieces to abstract compositions. Each piece is crafted with care and artistic integrity.",
  },
  {
    icon: Wallpaper,
    title: "Wall Murals & Decoration",
    description: "Transform your walls with hand-painted murals, decorative art, and bespoke furniture decoration that brings artistic beauty into everyday spaces.",
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-page">
      <Navbar />

      <div className="pt-24 pb-16 px-6 md:px-12">
        <div className="container mx-auto">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-2">What We Offer</p>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Services</h1>
            <div className="brand-line w-16 mx-auto mt-4 mb-6" />
            <p className="font-elegant text-lg text-foreground/70">
              Beyond paintings, HAQ Arts offers a range of creative services tailored to bring art into every aspect of your life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {services.map((service) => (
              <div
                key={service.title}
                className="group p-8 border border-border/30 hover:border-primary/40 transition-all duration-500 bg-secondary/30"
              >
                <service.icon className="w-8 h-8 text-primary mb-6" strokeWidth={1.2} />
                <h3 className="font-display text-xl text-foreground mb-3">{service.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/contact"
              className="inline-flex items-center px-10 py-4 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
            >
              Inquire About Services
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;
