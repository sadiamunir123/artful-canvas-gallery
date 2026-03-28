import { useState, useRef, useCallback } from "react";
import { X, ZoomIn, ZoomOut, Maximize } from "lucide-react";

interface ArtworkZoomProps {
  image: string;
  title: string;
  onClose: () => void;
}

const ArtworkZoom = ({ image, title, onClose }: ArtworkZoomProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  const zoomIn = useCallback(() => setScale((s) => Math.min(s + 0.5, 5)), []);
  const zoomOut = useCallback(() => {
    setScale((s) => {
      const next = Math.max(s - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);
  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  }, [zoomIn, zoomOut]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...position };
  }, [scale, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: posStart.current.x + (e.clientX - dragStart.current.x),
      y: posStart.current.y + (e.clientY - dragStart.current.y),
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (scale <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    posStart.current = { ...position };
  }, [scale, position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: posStart.current.x + (e.touches[0].clientX - dragStart.current.x),
      y: posStart.current.y + (e.touches[0].clientY - dragStart.current.y),
    });
  }, [isDragging]);

  return (
    <div className="fixed inset-0 z-[60] bg-gallery-dark flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div>
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">High-Resolution View</p>
          <h3 className="font-display text-lg text-foreground">{title}</h3>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={zoomOut} className="p-2 text-foreground/60 hover:text-primary transition-colors" title="Zoom Out">
            <ZoomOut size={18} />
          </button>
          <span className="font-body text-xs text-muted-foreground tabular-nums min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button onClick={zoomIn} className="p-2 text-foreground/60 hover:text-primary transition-colors" title="Zoom In">
            <ZoomIn size={18} />
          </button>
          <button onClick={resetZoom} className="p-2 text-foreground/60 hover:text-primary transition-colors" title="Reset">
            <Maximize size={18} />
          </button>
          <div className="w-px h-6 bg-border mx-2" />
          <button onClick={onClose} className="p-2 text-foreground/60 hover:text-primary transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        className="flex-1 overflow-hidden flex items-center justify-center"
        style={{ cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onClick={() => { if (scale === 1) zoomIn(); }}
      >
        <img
          src={image}
          alt={title}
          className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          }}
          draggable={false}
        />
      </div>

      {/* Hint */}
      <div className="px-6 py-3 bg-background/60 text-center">
        <p className="font-body text-xs text-muted-foreground">
          Scroll to zoom • Drag to pan • Click to zoom in
        </p>
      </div>
    </div>
  );
};

export default ArtworkZoom;
