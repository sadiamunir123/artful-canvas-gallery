import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Share2, Download, ShoppingBag, Info, X, Check } from "lucide-react";
import { useArtworks } from "@/hooks/useArtworks";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import ArtworkZoom from "@/components/ArtworkZoom";

const Index = () => {
  const [current, setCurrent] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const { data: slides = [] } = useArtworks();
  const { addToCart, items } = useCart();
  const { toast } = useToast();

  const next = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((c) => (c + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  // Slideshow + progress
  useEffect(() => {
    if (slides.length === 0 || zoomOpen || paused) return;
    const DURATION = 6000;
    const TICK = 50;
    const tick = setInterval(() => {
      setProgress((p) => {
        const np = p + (TICK / DURATION) * 100;
        if (np >= 100) {
          next();
          return 0;
        }
        return np;
      });
    }, TICK);
    return () => clearInterval(tick);
  }, [next, slides.length, zoomOpen, paused, current]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (zoomOpen) return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Enter" || e.key === "+" || e.key === "=") setZoomOpen(true);
      else if (e.key === "i" || e.key === "I") setDetailsOpen((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, zoomOpen]);

  const handleShare = useCallback(async () => {
    const artwork = slides[current];
    if (!artwork) return;
    const shareData = {
      title: artwork.title,
      text: `${artwork.title} — ${artwork.category}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link copied", description: "Share link copied to clipboard." });
      }
    } catch {
      /* user cancelled */
    }
  }, [current, slides, toast]);

  const handleDownload = useCallback(() => {
    const artwork = slides[current];
    if (!artwork) return;
    const a = document.createElement("a");
    a.href = artwork.image;
    a.download = `${artwork.title.replace(/\s+/g, "-").toLowerCase()}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [current, slides]);

  const handleAddToCart = useCallback(() => {
    const artwork = slides[current];
    if (!artwork) return;
    if (!artwork.available) {
      toast({ title: "Sold", description: "This artwork is no longer available.", variant: "destructive" });
      return;
    }
    addToCart(artwork);
    toast({ title: "Added to cart", description: artwork.title });
  }, [current, slides, addToCart, toast]);

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

  const artwork = slides[current];
  const inCart = items.some((i) => i.artwork.id === artwork?.id);

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-background"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Navbar />

      {slides.map((art, i) => (
        <div
          key={art.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-center bg-no-repeat blur-2xl scale-110 opacity-40"
            style={{ backgroundImage: `url(${art.image})`, backgroundSize: "cover" }}
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 md:p-16">
            <img
              src={art.image}
              alt={art.title}
              onClick={() => i === current && setZoomOpen(true)}
              className="max-w-full max-h-full w-auto h-auto object-contain cursor-zoom-in shadow-2xl"
              draggable={false}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30 pointer-events-none" />
        </div>
      ))}

      {/* Progress bar */}
      <div className="absolute top-[64px] sm:top-[72px] left-0 right-0 h-[2px] bg-foreground/5 z-10">
        <div
          className="h-full bg-primary transition-[width] duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Title + meta */}
      <div className="absolute bottom-28 sm:bottom-24 md:bottom-20 left-4 sm:left-6 md:left-16 right-4 sm:right-auto z-10 max-w-md">
        <p className="font-body text-[10px] sm:text-xs tracking-[0.2em] uppercase text-foreground/50">
          {artwork?.category} · {artwork?.year}
        </p>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground/95 drop-shadow-lg mt-1 leading-tight">
          {artwork?.title}
        </h1>
        <p className="font-body text-sm text-primary/90 mt-2">
          Rs {artwork?.price?.toLocaleString()}
          {!artwork?.available && <span className="ml-2 text-foreground/40 uppercase tracking-wider text-xs">Sold</span>}
        </p>
      </div>

      {/* Action toolbar */}
      <div className="absolute top-20 sm:top-24 right-3 sm:right-6 md:right-16 z-10 flex flex-col gap-2">
        <ActionBtn onClick={handleAddToCart} title={inCart ? "In cart" : "Add to cart"} disabled={!artwork?.available}>
          {inCart ? <Check size={16} /> : <ShoppingBag size={16} />}
        </ActionBtn>
        <ActionBtn onClick={() => setDetailsOpen((o) => !o)} title="Details">
          <Info size={16} />
        </ActionBtn>
        <ActionBtn onClick={handleShare} title="Share">
          <Share2 size={16} />
        </ActionBtn>
        <ActionBtn onClick={handleDownload} title="Download">
          <Download size={16} />
        </ActionBtn>
        <ActionBtn onClick={() => setZoomOpen(true)} title="Full view">
          <Maximize2 size={16} />
        </ActionBtn>
      </div>

      {/* Nav arrows + counter */}
      <div className="absolute bottom-6 sm:bottom-10 right-4 sm:right-6 md:right-16 z-10 flex items-center gap-2 sm:gap-4">
        <button
          onClick={prev}
          aria-label="Previous"
          className="p-2 border border-foreground/20 text-foreground/70 hover:text-primary hover:border-primary transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-body text-xs sm:text-sm text-muted-foreground tabular-nums">
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
        <button
          onClick={next}
          aria-label="Next"
          className="p-2 border border-foreground/20 text-foreground/70 hover:text-primary hover:border-primary transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="absolute bottom-6 sm:bottom-10 left-4 sm:left-6 md:left-16 z-10 hidden sm:flex items-center gap-2 max-w-[40vw] overflow-x-auto scrollbar-none">
        {slides.map((art, i) => (
          <button
            key={art.id}
            onClick={() => { setCurrent(i); setProgress(0); }}
            aria-label={`Go to ${art.title}`}
            className={`relative shrink-0 w-12 h-12 md:w-14 md:h-14 overflow-hidden border transition-all ${
              i === current
                ? "border-primary scale-105"
                : "border-foreground/15 opacity-60 hover:opacity-100"
            }`}
          >
            <img src={art.image} alt="" className="w-full h-full object-cover" draggable={false} />
          </button>
        ))}
      </div>

      {/* Mobile dot indicators */}
      <div className="absolute bottom-2 left-0 right-0 z-10 flex sm:hidden items-center justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setProgress(0); }}
            aria-label={`Slide ${i + 1}`}
            className={`h-1 rounded-full transition-all ${
              i === current ? "w-6 bg-primary" : "w-1.5 bg-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Slide-up details panel */}
      {detailsOpen && artwork && (
        <div
          className="absolute inset-x-0 bottom-0 z-20 bg-background/95 backdrop-blur-md border-t border-border/40 animate-in slide-in-from-bottom duration-300"
          onMouseEnter={() => setPaused(true)}
        >
          <div className="max-w-5xl mx-auto px-6 py-6 sm:py-8 relative">
            <button
              onClick={() => setDetailsOpen(false)}
              aria-label="Close details"
              className="absolute top-3 right-3 p-2 text-foreground/60 hover:text-primary"
            >
              <X size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">Title</p>
                <p className="font-display text-lg text-foreground mt-1">{artwork.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <Detail label="Medium" value={artwork.medium || "—"} />
                <Detail label="Size" value={artwork.size || "—"} />
                <Detail label="Year" value={artwork.year || "—"} />
                <Detail label="Price" value={`Rs ${artwork.price.toLocaleString()}`} />
              </div>
              {artwork.description && (
                <p className="md:col-span-3 font-body text-sm text-foreground/70 leading-relaxed">
                  {artwork.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 brand-line" />

      {zoomOpen && artwork && (
        <ArtworkZoom
          image={artwork.image}
          title={artwork.title}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </div>
  );
};

const ActionBtn = ({
  children,
  onClick,
  title,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    title={title}
    aria-label={title}
    disabled={disabled}
    className="p-2 sm:p-2.5 bg-background/60 backdrop-blur-sm border border-foreground/15 text-foreground/70 hover:text-primary hover:border-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">{label}</p>
    <p className="font-body text-sm text-foreground/90 mt-1">{value}</p>
  </div>
);

export default Index;
