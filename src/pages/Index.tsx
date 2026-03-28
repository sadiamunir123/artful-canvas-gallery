import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { artworks } from "@/data/artworks";

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
      {/* Slideshow */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-24 px-6 md:px-16">
        <div className="max-w-2xl animate-slide-up">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">
            {slides[current].category} — {slides[current].year}
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground mb-4 leading-tight">
            {slides[current].title}
          </h1>
          <p className="font-elegant text-lg md:text-xl text-foreground/70 mb-8 max-w-lg">
            {slides[current].description.substring(0, 120)}...
          </p>
          <div className="flex gap-4">
            <Link
              to="/paintings"
              className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
            >
              View Collection
            </Link>
            <Link
              to="/artist"
              className="inline-flex items-center px-8 py-3 border border-foreground/30 text-foreground font-body text-sm tracking-widest uppercase hover:border-primary hover:text-primary transition-colors"
            >
              About the Artist
            </Link>
          </div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-8 right-6 md:right-16 flex items-center gap-4">
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
      </div>

      {/* Brand line */}
      <div className="absolute bottom-0 left-0 right-0 brand-line" />
    </div>
  );
};

export default Index;
