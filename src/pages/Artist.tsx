import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import portraitRoses from "@/assets/artwork-portrait-roses.jpg";

const Artist = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        {/* Hero section */}
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
            <div>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">The Artist</p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
                Hadia Javed
              </h1>
              <div className="brand-line w-16 mb-8" />
              <p className="font-elegant text-xl text-foreground/80 leading-relaxed mb-6">
                Hadia Javed is a Lahore-based visual artist who primarily works with acrylic and oil painting. She completed her Bachelor of Fine Arts (BFA) in Painting from the Punjab University College of Art and Design (PUCAD) in 2023.
              </p>
              <p className="font-elegant text-lg text-foreground/70 leading-relaxed">
                Her artistic practice focuses on transforming ordinary spaces into meaningful visual experiences through memory and personal interpretation. Her work explores how memories reshape reality — using strong colors and slight stylization to express emotions and personal experiences.
              </p>
            </div>

            <div className="relative">
              <img
                src={portraitRoses}
                alt="Artwork by Hadia Javed"
                className="w-full max-h-[70vh] object-cover"
              />
              <div className="absolute -bottom-4 -left-4 w-full h-full border border-primary/20 -z-10" />
            </div>
          </div>
        </div>

        {/* Artist statement */}
        <div className="container mx-auto px-6 md:px-12 mt-24">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">Artist Statement</p>
            <h2 className="font-display text-3xl text-foreground mb-8">Where Memory Meets Canvas</h2>
            <blockquote className="font-elegant text-xl text-foreground/80 leading-relaxed italic">
              "My paintings are not just about places, but about the feelings and atmosphere connected to them — turning simple environments into intimate and expressive landscapes. Instead of creating exact or realistic scenes, I use strong colors and slight stylization to express the emotional truth of a space."
            </blockquote>
            <div className="brand-line w-24 mx-auto mt-8" />
          </div>
        </div>

        {/* Achievements */}
        <div className="container mx-auto px-6 md:px-12 mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-display text-2xl text-foreground mb-6">Education</h3>
              <div className="border-l-2 border-primary/30 pl-6 space-y-4">
                <div>
                  <p className="font-body text-sm text-foreground">Bachelor of Fine Arts (BFA) — Painting</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">Punjab University College of Art and Design (PUCAD), 2023</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-2xl text-foreground mb-6">Exhibitions & Awards</h3>
              <div className="border-l-2 border-primary/30 pl-6 space-y-4">
                <div>
                  <p className="font-body text-sm text-primary font-medium">🏆 First Position — HEC Oil Painting Competition, 2022</p>
                </div>
                <div>
                  <p className="font-body text-sm text-foreground">Young Artists Exhibitions — Alhamra Art Council</p>
                </div>
                <div>
                  <p className="font-body text-sm text-foreground">Exhibited across major galleries in Lahore, Islamabad & Karachi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Artist;
