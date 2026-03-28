import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { artworks } from "@/data/artworks";
import Navbar from "@/components/Navbar";

const Index = () => {
  const [current, setCurrent] = useState(0);
  const slides = artworks;

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Navbar />

      {/* Slideshow — artwork only */}
      {slides.map((artwork, i) => (
        <div
          key={artwork.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 animate-kenburns">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Subtle gradient for readability of controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30" />
        </div>
      ))}

      {/* Minimal artwork title at bottom left */}
      <div className="absolute bottom-10 left-6 md:left-16 z-10">
        <p className="font-display text-xl md:text-2xl text-foreground/90 drop-shadow-lg">
          {slides[current].title}
        </p>
        <p className="font-body text-xs tracking-widest uppercase text-foreground/50 mt-1">
          {slides[current].category} — {slides[current].year}
        </p>
      </div>

      {/* Slide controls */}
      <div className="absolute bottom-10 right-6 md:right-16 z-10 flex items-center gap-4">
        <button onClick={prev} className="p-2 border border-foreground/20 text-foreground/60 hover:text-primary hover:border-primary transition-colors">
          <ChevronLeft size={20} />
        </button>
        <span className="font-body text-sm text-muted-foreground tabular-nums">
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
        <button onClick={next} className="p-2 border border-foreground/20 text-foreground/60 hover:text-primary hover:border-primary transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Brand line */}
      <div className="absolute bottom-0 left-0 right-0 brand-line" />
    </div>
  );
};

export default Index;
