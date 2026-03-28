import { useState } from "react";
import { Link } from "react-router-dom";
import { artworks } from "@/data/artworks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArtworkZoom from "@/components/ArtworkZoom";

const Paintings = () => {
  const [selectedArtwork, setSelectedArtwork] = useState<string | null>(null);
  const [zoomArtwork, setZoomArtwork] = useState<string | null>(null);

  const selected = artworks.find((a) => a.id === selectedArtwork);
  const zoomed = artworks.find((a) => a.id === zoomArtwork);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-6 md:px-12">
        <div className="container mx-auto">
          <div className="mb-12">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-2">Collection</p>
            <h1 className="font-display text-4xl md:text-5xl text-foreground">Paintings</h1>
            <div className="brand-line w-16 mt-4" />
          </div>

          {/* Gallery grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                className="group cursor-pointer"
                onClick={() => setSelectedArtwork(artwork.id)}
              >
                <div className="relative overflow-hidden bg-secondary aspect-[4/5]">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-500 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-body text-sm tracking-widest uppercase text-foreground border border-foreground/50 px-6 py-2">
                      View Details
                    </span>
                  </div>
                  {!artwork.available && (
                    <div className="absolute top-4 right-4 bg-destructive/90 text-destructive-foreground font-body text-xs tracking-widest uppercase px-3 py-1">
                      Sold
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-xl text-foreground">{artwork.title}</h3>
                  <p className="font-body text-sm text-muted-foreground mt-1">{artwork.medium} — {artwork.year}</p>
                  <p className="font-body text-sm text-primary mt-1">Rs {artwork.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md overflow-y-auto">
          <button
            onClick={() => setSelectedArtwork(null)}
            className="fixed top-6 right-6 z-50 font-body text-sm tracking-widest uppercase text-foreground/70 hover:text-primary transition-colors"
          >
            Close ✕
          </button>

          <div className="container mx-auto px-6 py-24 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="relative">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full object-contain max-h-[80vh] cursor-zoom-in"
                  onClick={() => {
                    setSelectedArtwork(null);
                    setZoomArtwork(selected.id);
                  }}
                />
                <button
                  onClick={() => {
                    setSelectedArtwork(null);
                    setZoomArtwork(selected.id);
                  }}
                  className="mt-4 font-body text-xs tracking-widest uppercase text-primary hover:text-primary/80 transition-colors"
                >
                  🔍 Open High-Resolution Zoom View
                </button>
              </div>

              <div className="flex flex-col justify-center">
                <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-2">{selected.category}</p>
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">{selected.title}</h2>
                <div className="brand-line w-12 mb-6" />
                <p className="font-elegant text-lg text-foreground/80 leading-relaxed mb-8">
                  {selected.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Medium</p>
                    <p className="font-body text-sm text-foreground mt-1">{selected.medium}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Size</p>
                    <p className="font-body text-sm text-foreground mt-1">{selected.size}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Year</p>
                    <p className="font-body text-sm text-foreground mt-1">{selected.year}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Status</p>
                    <p className={`font-body text-sm mt-1 ${selected.available ? "text-primary" : "text-destructive"}`}>
                      {selected.available ? "Available" : "Sold"}
                    </p>
                  </div>
                </div>

                <p className="font-display text-2xl text-primary mb-6">Rs {selected.price.toLocaleString()}</p>

                {selected.available && (
                  <div className="flex gap-4">
                    <Link
                      to="/contact"
                      className="px-8 py-3 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
                    >
                      Inquire to Purchase
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zoom viewer */}
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
