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
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next, slides.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

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
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <Navbar />

      {slides.map((art, i) => (
        <div
          key={art.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-center bg-no-repeat blur-3xl scale-110 opacity-30"
            style={{ backgroundImage: `url(${art.image})`, backgroundSize: "cover" }}
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
            <img
              src={art.image}
              alt={art.title}
              className="max-w-full max-h-full w-auto h-auto object-contain"
              draggable={false}
            />
          </div>
        </div>
      ))}

      {/* Minimal nav arrows */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 text-foreground/50 hover:text-primary transition-colors"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 text-foreground/50 hover:text-primary transition-colors"
      >
        <ChevronRight size={28} />
      </button>

      {/* Counter */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10">
        <span className="font-body text-xs tracking-[0.3em] text-foreground/50 tabular-nums">
          {String(current + 1).padStart(2, "0")} — {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

export default Index;
