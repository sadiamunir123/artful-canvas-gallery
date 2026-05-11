import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, ZoomIn, X, Check } from "lucide-react";
import { useArtworks } from "@/hooks/useArtworks";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArtworkZoom from "@/components/ArtworkZoom";

type SortKey = "newest" | "price-asc" | "price-desc" | "title";

const Paintings = () => {
  const [selectedArtwork, setSelectedArtwork] = useState<string | null>(null);
  const [zoomArtwork, setZoomArtwork] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [availability, setAvailability] = useState<"all" | "available" | "sold">("all");
  const [sort, setSort] = useState<SortKey>("newest");

  const { addToCart } = useCart();
  const { data: artworks = [], isLoading } = useArtworks();

  const categories = useMemo(() => {
    const set = new Set(artworks.map((a) => a.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [artworks]);

  const filtered = useMemo(() => {
    let list = artworks.filter((a) => {
      if (category !== "All" && a.category !== category) return false;
      if (availability === "available" && !a.available) return false;
      if (availability === "sold" && a.available) return false;
      if (query && !`${a.title} ${a.medium} ${a.category}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "title":
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return list;
  }, [artworks, category, availability, query, sort]);

  const selected = artworks.find((a) => a.id === selectedArtwork);
  const zoomed = artworks.find((a) => a.id === zoomArtwork);

  return (
    <div className="min-h-screen bg-page">
      <Navbar />

      <div className="pt-24 md:pt-28 pb-16 px-4 sm:px-6 md:px-12">
        <div className="container mx-auto">
          <div className="mb-10 md:mb-12">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-2">Collection</p>
            <h1 className="font-display text-4xl md:text-5xl text-foreground">Paintings</h1>
            <div className="brand-line w-16 mt-4" />
            <p className="font-elegant text-base md:text-lg text-foreground/60 mt-4 max-w-2xl">
              An evolving body of work — each piece a meditation on memory, material, and light.
            </p>
          </div>

          {/* Filter bar */}
          <div className="mb-8 grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search title, medium, category..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-secondary border border-border pl-10 pr-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-secondary border border-border px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value as typeof availability)}
              className="bg-secondary border border-border px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-secondary border border-border px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title">Title (A–Z)</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <p className="font-body text-muted-foreground animate-pulse">Loading collection...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border">
              <p className="font-body text-muted-foreground">No artworks match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((artwork) => (
                <article
                  key={artwork.id}
                  className="group cursor-pointer flex flex-col"
                  onClick={() => setSelectedArtwork(artwork.id)}
                >
                  <div className="relative overflow-hidden bg-secondary aspect-[4/5]">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                        artwork.available ? "" : "grayscale-[40%] opacity-90"
                      }`}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/0 to-background/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-foreground border border-foreground/60 px-4 py-1.5 backdrop-blur-sm">
                        <ZoomIn size={12} /> View Details
                      </span>
                    </div>
                    {!artwork.available ? (
                      <div className="absolute top-3 right-3 bg-destructive/95 text-destructive-foreground font-body text-[10px] tracking-widest uppercase px-3 py-1 shadow-lg">
                        Sold
                      </div>
                    ) : (
                      <div className="absolute top-3 left-3 bg-card/85 backdrop-blur-sm border border-primary/40 text-primary font-body text-[10px] tracking-widest uppercase px-3 py-1">
                        {artwork.category}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg md:text-xl text-foreground group-hover:text-primary transition-colors truncate">
                        {artwork.title}
                      </h3>
                      <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                        {artwork.medium} — {artwork.year}
                      </p>
                    </div>
                    <p className="font-body text-sm text-primary whitespace-nowrap pt-0.5">
                      Rs {artwork.price.toLocaleString()}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md overflow-y-auto">
          <button
            onClick={() => setSelectedArtwork(null)}
            aria-label="Close"
            className="fixed top-4 right-4 md:top-6 md:right-6 z-50 p-2 bg-card/80 border border-border text-foreground/80 hover:text-primary hover:border-primary transition-colors"
          >
            <X size={20} />
          </button>

          <div className="container mx-auto px-4 sm:px-6 py-20 md:py-24 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16">
              <div className="relative">
                <div
                  className="relative bg-secondary/40 border border-border/40 cursor-zoom-in group overflow-hidden"
                  onClick={() => {
                    setSelectedArtwork(null);
                    setZoomArtwork(selected.id);
                  }}
                >
                  <img
                    src={selected.image}
                    alt={selected.title}
                    className="w-full object-contain max-h-[75vh] mx-auto"
                  />
                  <div className="absolute top-3 right-3 inline-flex items-center gap-2 px-3 py-1.5 bg-card/85 backdrop-blur-sm border border-border text-foreground/80 text-xs font-body tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn size={12} /> Zoom
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedArtwork(null);
                    setZoomArtwork(selected.id);
                  }}
                  className="mt-4 inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-primary hover:text-primary/80 transition-colors"
                >
                  <ZoomIn size={14} /> Open High-Resolution View
                </button>
              </div>

              <div className="flex flex-col justify-center">
                <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-2">{selected.category}</p>
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">{selected.title}</h2>
                <div className="brand-line w-12 mb-5" />

                <div className="flex items-center gap-3 mb-5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-body tracking-widest uppercase border ${
                      selected.available
                        ? "border-primary/50 text-primary bg-primary/5"
                        : "border-destructive/50 text-destructive bg-destructive/10"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selected.available ? "bg-primary" : "bg-destructive"}`} />
                    {selected.available ? "Available" : "Sold"}
                  </span>
                  <span className="font-body text-xs text-muted-foreground">
                    {selected.year}
                  </span>
                </div>

                <p className="font-elegant text-base md:text-lg text-foreground/80 leading-relaxed mb-8">
                  {selected.description}
                </p>

                <dl className="grid grid-cols-2 gap-4 mb-8 border-t border-b border-border/40 py-6">
                  <div>
                    <dt className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">Medium</dt>
                    <dd className="font-body text-sm text-foreground mt-1">{selected.medium}</dd>
                  </div>
                  <div>
                    <dt className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">Size</dt>
                    <dd className="font-body text-sm text-foreground mt-1">{selected.size}</dd>
                  </div>
                  <div>
                    <dt className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">Year</dt>
                    <dd className="font-body text-sm text-foreground mt-1">{selected.year}</dd>
                  </div>
                  <div>
                    <dt className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">Category</dt>
                    <dd className="font-body text-sm text-foreground mt-1">{selected.category}</dd>
                  </div>
                </dl>

                <div className="flex items-baseline gap-3 mb-6">
                  <p className="font-display text-3xl text-primary">Rs {selected.price.toLocaleString()}</p>
                  <span className="font-body text-xs text-muted-foreground">incl. all applicable taxes</span>
                </div>

                {selected.available ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                      to="/cart"
                      onClick={() => addToCart(selected)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
                    >
                      <Check size={16} /> Buy Now
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(selected);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-primary text-primary font-body text-sm tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                    <Link
                      to="/contact"
                      className="sm:col-span-2 inline-flex items-center justify-center px-6 py-3 border border-border text-foreground/80 font-body text-xs tracking-widest uppercase hover:border-primary hover:text-primary transition-colors"
                    >
                      Inquire about this artwork
                    </Link>
                  </div>
                ) : (
                  <div className="px-6 py-4 bg-destructive/15 border border-destructive/30 text-destructive font-body text-sm tracking-widest uppercase text-center">
                    This Artwork Has Been Sold
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {zoomed && (
        <ArtworkZoom
          image={zoomed.image}
          title={zoomed.title}
          onClose={() => setZoomArtwork(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Paintings;
