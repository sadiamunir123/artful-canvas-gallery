import { ArrowLeft, Calendar, Tag, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const PUBLISHED = "2026-06-27";
const CANONICAL = "/blog/buying-original-art-online";

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "Why buy an original oil painting instead of a print",
    body: [
      "An original oil painting carries the artist's hand — visible brushwork, layered pigment, and a surface that changes with the light in your room. A print, however well produced, is a flat reproduction. When you buy an original you are also buying provenance, a one-of-one object, and a story that can be passed on.",
      "For first-time collectors, originals from emerging painters often cost less than a designer sofa and appreciate in meaning over the years you live with them.",
    ],
  },
  {
    heading: "How to evaluate the medium and surface",
    body: [
      "Oil on canvas is the traditional choice — slow drying, deep colour, and a long archival life when varnished. Acrylic on canvas dries quickly and holds vivid hues. Mixed media on board can introduce texture, collage, and unconventional materials. None of these is inherently better; they suit different subjects and different rooms.",
      "Ask the seller what surface the work is painted on (canvas, linen, board, paper) and whether the work has been varnished or sealed. A well-finished original oil painting for sale should arrive ready to hang and stable for decades.",
    ],
  },
  {
    heading: "Reading size and proportion before you buy",
    body: [
      "Photos online flatten scale. Before you commit, measure the wall you have in mind and tape that rectangle on it with painter's tape. Stand back. A 36 × 48 inch painter oil painting feels very different in a hallway than above a sofa.",
      "If a listing only shows the painting cropped tight, ask for a photo of the piece in a room or held by a person for scale. Reputable galleries and artists are happy to share this.",
    ],
  },
  {
    heading: "Understanding the artist's statement",
    body: [
      "The artist's statement explains the why behind a series — the concepts, references, and personal threads that connect the paintings. Read it before you buy. A piece you understand is a piece you keep looking at.",
      "On HAQ Arts, every painting links back to a journal entry that gives the thinking behind the brushwork. If a painting moves you, read the story; if the story deepens the painting, you have found a work worth living with.",
    ],
  },
  {
    heading: "Pricing originals fairly",
    body: [
      "Original oil paintings are typically priced by size, medium, and the artist's track record. Pakistani Rupee pricing on HAQ Arts reflects the local studio cost of materials, framing-ready preparation, and the artist's time. There is no upcharge for a middleman.",
      "Beware of suspiciously cheap 'original' oils online — they are often factory-produced overpaints, not unique works.",
    ],
  },
  {
    heading: "Shipping, packing, and customs",
    body: [
      "Originals ship rolled in a tube for large unstretched canvases, or flat in a custom crate for stretched and framed pieces. Always confirm packing method, transit insurance, and an estimated delivery window before paying.",
      "International buyers should ask about import duty in their country. Most carriers treat original art under HS code 9701, which often qualifies for reduced or zero duty — but the buyer is responsible for clearance fees.",
    ],
  },
  {
    heading: "Caring for the painting once it arrives",
    body: [
      "Hang originals out of direct sunlight, away from heating vents, and at a stable humidity. Dust the surface gently with a soft, dry brush — never water or household cleaners. A properly cared-for oil painting will outlive its first owner.",
    ],
  },
  {
    heading: "Commissioning a custom original",
    body: [
      "If nothing on the wall feels exactly right, commission. A good commission begins with a conversation about the subject, the room, the palette, and the size. Expect to pay a deposit, see progress photos at key stages, and wait several weeks to months depending on scale.",
      "HAQ Arts accepts commissions through the services page — share your reference, your wall, and your story, and Hadia will reply with a quote and a timeline.",
    ],
  },
];

const BuyingOriginalArtOnline = () => {
  return (
    <div className="min-h-screen bg-page">
      <SEO
        title="How to Buy Original Oil Paintings Online — A Collector's Guide | HAQ Arts"
        description="A practical guide for first-time collectors on buying original oil paintings online — evaluating medium, size, the artist's statement, pricing, shipping, and care."
        path={CANONICAL}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How to Buy Original Oil Paintings Online",
          description:
            "A practical guide for first-time collectors on buying original oil paintings online — evaluating medium, size, the artist's statement, pricing, shipping, and care.",
          author: { "@type": "Person", name: "Hadia Javed" },
          publisher: { "@type": "Organization", name: "HAQ Arts" },
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          mainEntityOfPage: `https://palette-showcase-gallery.lovable.app${CANONICAL}`,
        }}
      />
      <Navbar />

      <div className="pt-24 md:pt-28 pb-16 px-4 sm:px-6 md:px-12">
        <div className="container mx-auto">
          <article className="max-w-3xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={14} /> Back to Journal
            </Link>

            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5">
                <span className="inline-flex items-center gap-1.5 font-body text-[10px] tracking-[0.25em] uppercase text-primary">
                  <Tag size={11} /> Collector's Guide
                </span>
                <span className="inline-flex items-center gap-1.5 font-body text-[11px] text-muted-foreground">
                  <Calendar size={11} /> June 27, 2026
                </span>
                <span className="inline-flex items-center gap-1.5 font-body text-[11px] text-muted-foreground">
                  <Clock size={11} /> 7 min read
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground leading-[1.1] tracking-tight mb-6">
                How to Buy Original Oil Paintings Online
              </h1>
              <div className="brand-line w-16 mb-6" />
              <p className="font-elegant text-lg sm:text-xl text-foreground/70 leading-relaxed">
                A practical guide for first-time collectors — how to evaluate
                medium and size, read an artist's statement, understand pricing,
                and handle the logistics of shipping an original painting to
                your door.
              </p>
            </div>

            <div className="prose prose-invert max-w-none">
              {sections.map((section, i) => (
                <section key={section.heading} className="mb-10">
                  <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-4 leading-tight">
                    {section.heading}
                  </h2>
                  {section.body.map((paragraph, j) => (
                    <p
                      key={j}
                      className={`font-elegant text-lg sm:text-xl text-foreground/85 leading-[1.8] mb-5 ${
                        i === 0 && j === 0
                          ? "first-letter:font-display first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-primary"
                          : ""
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}

              <section className="mt-12 pt-8 border-t border-border/40">
                <h2 className="font-display text-2xl text-foreground mb-4">
                  Start your collection
                </h2>
                <p className="font-elegant text-lg text-foreground/80 leading-relaxed mb-6">
                  Browse current originals in the gallery, or get in touch to
                  commission a custom piece.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/paintings"
                    className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-primary hover:text-primary/80 transition-colors"
                  >
                    View paintings →
                  </Link>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-primary hover:text-primary/80 transition-colors"
                  >
                    Commission a painting →
                  </Link>
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BuyingOriginalArtOnline;
