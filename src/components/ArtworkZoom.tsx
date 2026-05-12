import { useState, useRef, useCallback, useEffect } from "react";
import { X, ZoomIn, ZoomOut, Maximize2, Minus, Plus } from "lucide-react";

interface ArtworkZoomProps {
  image: string;
  title: string;
  onClose: () => void;
}

const MIN = 1;
const MAX = 6;

const ArtworkZoom = ({ image, title, onClose }: ArtworkZoomProps) => {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);

  const clampPos = useCallback((p: { x: number; y: number }, s: number) => {
    const el = containerRef.current;
    if (!el) return p;
    const { width, height } = el.getBoundingClientRect();
    const maxX = (width * (s - 1)) / 2;
    const maxY = (height * (s - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, p.x)),
      y: Math.max(-maxY, Math.min(maxY, p.y)),
    };
  }, []);

  const zoomAt = useCallback(
    (newScale: number, cx?: number, cy?: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const s = Math.max(MIN, Math.min(MAX, newScale));
      const ox = cx !== undefined ? cx - rect.left - rect.width / 2 : 0;
      const oy = cy !== undefined ? cy - rect.top - rect.height / 2 : 0;
      setScale((prev) => {
        const ratio = s / prev;
        const next = {
          x: pos.x * ratio + ox * (1 - ratio),
          y: pos.y * ratio + oy * (1 - ratio),
        };
        setPos(s === 1 ? { x: 0, y: 0 } : clampPos(next, s));
        return s;
      });
    },
    [pos, clampPos]
  );

  const zoomIn = useCallback(() => zoomAt(scale + 0.5), [scale, zoomAt]);
  const zoomOut = useCallback(() => zoomAt(scale - 0.5), [scale, zoomAt]);
  const reset = useCallback(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "+" || e.key === "=") zoomIn();
      else if (e.key === "-" || e.key === "_") zoomOut();
      else if (e.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, zoomIn, zoomOut, reset]);

  // Native wheel listener (passive: false to preventDefault)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.0025;
      zoomAt(scale * (1 + delta), e.clientX, e.clientY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [scale, zoomAt]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...pos };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setPos(
      clampPos(
        {
          x: posStart.current.x + (e.clientX - dragStart.current.x),
          y: posStart.current.y + (e.clientY - dragStart.current.y),
        },
        scale
      )
    );
  };
  const onPointerUp = () => setDragging(false);

  // Pinch zoom
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStart.current = { dist: Math.hypot(dx, dy), scale };
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStart.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      zoomAt(pinchStart.current.scale * (dist / pinchStart.current.dist), cx, cy);
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) pinchStart.current = null;
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    if (scale > 1) reset();
    else zoomAt(2.5, e.clientX, e.clientY);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-gallery-dark flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="min-w-0">
          <p className="font-body text-[10px] sm:text-xs tracking-widest uppercase text-muted-foreground">
            High-Resolution View
          </p>
          <h3 className="font-display text-base sm:text-lg text-foreground truncate">{title}</h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="p-2 text-foreground/70 hover:text-primary transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Image area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden flex items-center justify-center touch-none select-none"
        style={{ cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onDoubleClick={onDoubleClick}
      >
        <img
          src={image}
          alt={title}
          draggable={false}
          className="max-w-full max-h-full object-contain will-change-transform"
          style={{
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${scale})`,
            transition: dragging ? "none" : "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>

      {/* Floating control dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background/80 backdrop-blur-md border border-border/40 rounded-full px-2 py-1.5 shadow-lg">
        <button
          onClick={zoomOut}
          aria-label="Zoom out"
          disabled={scale <= MIN}
          className="p-2 text-foreground/70 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={16} />
        </button>
        <span className="font-body text-xs text-foreground/80 tabular-nums min-w-[3.5rem] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={zoomIn}
          aria-label="Zoom in"
          disabled={scale >= MAX}
          className="p-2 text-foreground/70 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={16} />
        </button>
        <div className="w-px h-5 bg-border/60 mx-1" />
        <button
          onClick={reset}
          aria-label="Reset"
          className="p-2 text-foreground/70 hover:text-primary transition-colors"
        >
          <Maximize2 size={15} />
        </button>
      </div>

      {/* Hint */}
      <div className="hidden sm:block absolute bottom-2 right-4">
        <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground/60">
          Scroll · Pinch · Double-click · Drag
        </p>
      </div>
    </div>
  );
};

export default ArtworkZoom;
