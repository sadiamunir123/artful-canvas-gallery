import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useArtworks } from "@/hooks/useArtworks";
import Navbar from "@/components/Navbar";

const Index = () => {
  const [current, setCurrent] = useState(0);
  const { data: slides = [] } = useArtworks();

  const next = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-full">
          <p className="font-body text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Navbar />

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
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30" />
        </div>
      ))}

      <div className="absolute bottom-10 left-6 md:left-16 z-10">
        <p className="font-display text-xl md:text-2xl text-foreground/90 drop-shadow-lg">
          {slides[current]?.title}
        </p>
        <p className="font-body text-xs tracking-widest uppercase text-foreground/50 mt-1">
          {slides[current]?.category} — {slides[current]?.year}
        </p>
      </div>

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

      <div className="absolute bottom-0 left-0 right-0 brand-line" />
    </div>
  );
};

export default Index;
