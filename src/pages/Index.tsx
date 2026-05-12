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

  // Preload neighbouring images for smoother transitions
  useEffect(() => {
    if (slides.length === 0) return;
    const nextIdx = (current + 1) % slides.length;
    const prevIdx = (current - 1 + slides.length) % slides.length;
    [nextIdx, prevIdx].forEach((i) => {
      const img = new Image();
      img.src = slides[i].image;
    });
  }, [current, slides]);

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
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <Navbar />

      {slides.map((art, i) => {
        const active = i === current;
        return (
          <div
            key={art.id}
            className={`absolute inset-0 bg-black flex items-center justify-center transition-opacity duration-1000 ease-out ${
              active ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={art.image}
              alt={art.title}
              loading={i === 0 ? "eager" : "lazy"}
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        );
      })}

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
