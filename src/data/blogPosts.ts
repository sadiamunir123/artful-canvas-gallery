import purpleFabric from "@/assets/artwork-purple-fabric.jpg";
import islamicDetails from "@/assets/artwork-islamic-details.jpg";
import interiorScene from "@/assets/artwork-interior-scene.jpg";
import portraitRoses from "@/assets/artwork-portrait-roses.jpg";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Abstract Intimacy: Finding Emotion in Fabric Folds",
    excerpt: "A crumpled piece of purple cloth became the unexpected subject of my most personal painting — and taught me that abstraction is just another word for feeling.",
    content: `"Veiled Violet" began as an accident. I had draped a piece of purple fabric over a chair in my studio to use as a background for a still life, but the fabric itself — its folds, its shadows, its quiet presence — captivated me more than any arrangement of objects could.

I spent weeks simply looking at it. The way a single piece of cloth could contain so many shades of violet, from nearly black in the deepest creases to lavender where the light grazed the surface — it was a complete world in miniature.

This painting taught me something important about abstraction. I had always thought of abstract art as intellectual, conceptual, removed from emotion. But painting these fabric folds was one of the most emotionally charged experiences of my artistic practice.

Each fold became a metaphor — for concealment, for softness, for the way life crumples us and creates new, unexpected beauty in the process. The violet color itself carries associations with spirituality, royalty, and mourning across many cultures.

The monochromatic palette was essential. By eliminating the distraction of multiple colors, I forced myself (and the viewer) to pay attention to value, to the infinite gradations between light and shadow. This is where true seeing happens — not in the spectacle of color, but in the quiet attention to subtle differences.

Working on this piece at PUCAD during my final year, I discovered that the most profound subjects are often the ones hiding in plain sight. A simple piece of fabric, when observed with patience and painted with devotion, can reveal truths about form, light, and human experience that grand subjects sometimes obscure.`,
    image: purpleFabric,
    date: "2024-01-15",
    category: "Thesis",
  },
  {
    id: "2",
    title: "Sacred Geometry: Decoding the Language of Islamic Architecture",
    excerpt: "Eight painted panels, eight stories of devotion — exploring the mathematical beauty and spiritual symbolism embedded in Mughal tile work and calligraphy.",
    content: `The "Sacred Geometry" series emerged from countless hours spent sketching inside Lahore's historic mosques and Mughal monuments. I would sit cross-legged on cool marble floors, notebook in hand, trying to capture the impossible intricacy of centuries-old tile work.

What fascinated me was the intersection of mathematics and spirituality. Islamic geometric patterns are not merely decorative — they are visual prayers, expressions of the infinite through finite forms. Each repeated motif is a meditation on divine order.

For this series, I chose eight distinct architectural details: Kufic calligraphy from the Badshahi Mosque dome, chevron tile patterns in turquoise and gold, floral arabesques from the Wazir Khan Mosque, carved marble lattice work, geometric ceiling medallions, and ornamental borders that frame sacred spaces.

Each panel is painted on a 12×12 inch board using acrylic, which allowed me to capture the flat, bold quality of tile work while maintaining the painterly texture that distinguishes my interpretation from mere documentation.

The challenge was translating three-dimensional architectural surfaces onto a flat picture plane while preserving their spatial depth and material richness. I used visible brushstrokes to remind the viewer that these are paintings, not photographs — personal encounters with heritage, filtered through an artist's eye.

This body of work represents my deepest engagement with Pakistani cultural heritage and my conviction that traditional craftsmanship deserves the same reverent attention we give to contemporary art.`,
    image: islamicDetails,
    date: "2024-04-10",
    category: "Process",
  },
  {
    id: "3",
    title: "Memory as Medium: How Domestic Spaces Shape Identity",
    excerpt: "Exploring how the rooms we grow up in become landscapes of the self — and how painting transforms nostalgia into visual language.",
    content: `My thesis work at PUCAD centered on a question that haunted me throughout my undergraduate years: how do the spaces we inhabit become part of who we are?

Growing up in Kasur, my grandmother's living room was my first gallery. The crimson curtains, the ornate carpet worn thin by decades of footsteps, the particular way afternoon light fell through the window — these weren't just decorative details. They were the architecture of my emotional life.

When I began painting interiors, I realized I wasn't interested in photographic accuracy. Memory doesn't work that way. Memory amplifies certain colors, softens edges, and rearranges furniture to suit the emotional truth of a moment. My paintings attempt to capture this subjective reality — the room as it felt, not as it was.

"Grandmother's Room" is the culmination of this investigation. The crimson-draped bed, the cushions scattered with casual intimacy, the leaning canvas resting against the sofa — every object is placed precisely as memory arranged it, which is to say, imperfectly and beautifully.

The technique I developed involves layering thin glazes of oil paint to build depth, then working wet-on-wet to blur boundaries between objects. This creates a dreamlike quality that mirrors how memory functions — sharp in some places, dissolving in others.

The traditional carpet in the foreground serves as an anchor — a dense field of pattern and color that grounds the composition while also representing the layers of history and culture woven into every Pakistani home.

Through this body of work, I discovered that painting domestic spaces is ultimately about painting identity itself. We are shaped by the rooms that contain us, and in painting them, we reclaim a piece of ourselves.`,
    image: interiorScene,
    date: "2024-07-20",
    category: "Thesis",
  },
  {
    id: "4",
    title: "The Language of Concealment: Roses, Veils, and Identity",
    excerpt: "Behind every portrait lies a negotiation between what is revealed and what remains hidden — a visual dialogue about identity in Pakistani culture.",
    content: `The portrait series began with a simple observation: in Pakistani culture, women are simultaneously celebrated and concealed. This duality fascinated me as an artist and as a woman navigating these spaces.

"Behind the Rose" was the first painting where I explored this idea directly. The subject — draped in white, her gaze calm and penetrating — holds a dark rose before her face. One eye is fully visible, meeting the viewer with quiet defiance. The other is hidden behind the flower's dark petals.

The white dupatta represents purity and tradition, while the dark rose introduces complexity — beauty entangled with thorns, visibility entangled with concealment. The floating rose in the upper corner suggests that these barriers exist not just in physical space but in the atmosphere itself.

In painting these portraits, I work from photographs but deliberately alter the composition to heighten the tension between revelation and concealment. The roses are painted with thick impasto technique, making them physically prominent on the canvas, while the face behind them is rendered with delicate, almost transparent glazes.

This contrast in technique reinforces the conceptual framework: the barriers we face are often more substantial, more "real" in a material sense, than the identity they seek to hide. Yet the eye always breaks through — steady, unwavering, impossibly alive.

The response to this painting has been deeply personal for many viewers. Women from across Pakistan have shared how they see their own experiences reflected in this work — the constant negotiation between tradition and self-expression, between cultural beauty and personal freedom.

I believe the most powerful portraits are not those that show us everything, but those that invite us to look deeper, to see what lies behind the beautiful barriers we construct.`,
    image: portraitRoses,
    date: "2024-10-05",
    category: "Artist Statement",
  },
];
