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
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, slides.length]);

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

  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  if (slides.length === 0) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#000" }}>
        <Navbar />
        <div className="flex items-center justify-center h-full">
          <p className="font-body text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#000",
        overflow: "hidden",
      }}
    >
      <Navbar />

      {slides.map((art, i) => {
        const active = i === current;
        return (
          <div
            key={art.id}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#000000",
              opacity: active ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              pointerEvents: active ? "auto" : "none",
            }}
          >
            <img
              src={art.image}
              alt={art.title}
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>
        );
      })}

      <button
        onClick={prev}
        aria-label="Previous"
        className="hover:text-primary"
        style={{
          position: "absolute",
          left: 8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
          padding: 12,
          color: "rgba(255,255,255,0.6)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="hover:text-primary"
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
          padding: 12,
          color: "rgba(255,255,255,0.6)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <ChevronRight size={32} />
      </button>

      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
        }}
      >
        <span className="font-body text-xs tracking-[0.3em] tabular-nums" style={{ color: "rgba(255,255,255,0.5)" }}>
          {String(current + 1).padStart(2, "0")} — {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

export default Index;
