import interiorScene from "@/assets/artwork-interior-scene.jpg";
import portraitRoses from "@/assets/artwork-portrait-roses.jpg";
import streetScene from "@/assets/artwork-street-scene.jpg";
import mosqueSunset from "@/assets/artwork-mosque-sunset.jpg";
import purpleFabric from "@/assets/artwork-purple-fabric.jpg";

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
    title: "Memory as Medium: How Domestic Spaces Shape Identity",
    excerpt: "Exploring how the rooms we grow up in become landscapes of the self — and how painting transforms nostalgia into visual language.",
    content: `My thesis work at PUCAD centered on a question that haunted me throughout my undergraduate years: how do the spaces we inhabit become part of who we are?

Growing up in Kasur, my grandmother's living room was my first gallery. The crimson curtains, the ornate carpet worn thin by decades of footsteps, the particular way afternoon light fell through the jali screen — these weren't just decorative details. They were the architecture of my emotional life.

When I began painting interiors, I realized I wasn't interested in photographic accuracy. Memory doesn't work that way. Memory amplifies certain colors, softens edges, and rearranges furniture to suit the emotional truth of a moment. My paintings attempt to capture this subjective reality — the room as it felt, not as it was.

The technique I developed involves layering thin glazes of oil paint to build depth, then working wet-on-wet to blur boundaries between objects. This creates a dreamlike quality that mirrors how memory functions — sharp in some places, dissolving in others.

Through this body of work, I discovered that painting domestic spaces is ultimately about painting identity itself. We are shaped by the rooms that contain us, and in painting them, we reclaim a piece of ourselves.`,
    image: interiorScene,
    date: "2024-01-15",
    category: "Thesis",
  },
  {
    id: "2",
    title: "The Language of Concealment: Roses, Veils, and Identity",
    excerpt: "Behind every portrait lies a negotiation between what is revealed and what remains hidden — a visual dialogue about identity in Pakistani culture.",
    content: `The portrait series began with a simple observation: in Pakistani culture, women are simultaneously celebrated and concealed. This duality fascinated me as an artist and as a woman navigating these spaces.

"Behind the Rose" was the first painting where I explored this idea directly. The subject's eyes — intense, unapologetic, alive — peer through dark roses that partially obscure her face. The flowers aren't decorative. They're a metaphor for the beautiful barriers society places between women and full visibility.

In painting these portraits, I work from photographs but deliberately alter the composition to heighten the tension between revelation and concealment. The roses are painted with thick impasto technique, making them physically prominent on the canvas, while the face behind them is rendered with delicate, almost transparent glazes.

This contrast in technique reinforces the conceptual framework: the barriers we face are often more substantial, more "real" in a material sense, than the identity they seek to hide. Yet the eyes always break through.

The response to this series has been deeply personal for many viewers. Women from across Pakistan have shared how they see their own experiences reflected in these paintings — the constant negotiation between tradition and self-expression, between cultural beauty and personal freedom.`,
    image: portraitRoses,
    date: "2024-03-20",
    category: "Artist Statement",
  },
  {
    id: "3",
    title: "Colors of Commerce: Painting the Living Bazaar",
    excerpt: "The traditional bazaar is not just a marketplace — it's a living canvas of color, texture, and human connection that disappears a little more each year.",
    content: `Pakistan's old bazaars are disappearing. Modern shopping malls and online commerce are slowly erasing these vibrant corridors of culture, and I felt an urgency to capture them before they vanish entirely.

"Bazaar of Colors" was painted after spending three weeks sketching in the old markets of Lahore. I sat on wooden stools, drank chai with shopkeepers, and filled notebook after notebook with observations — the exact shade of orange on a faded awning, the way bolts of fabric catch the afternoon sun, the geometry of stacked merchandise.

What struck me most was how the bazaar functions as an unconscious work of art. No designer planned the color palette — it emerged organically from decades of trade, weather, and human activity. The rust of old metal shutters against fresh vermillion fabrics, the dusty gold of sandstone against bright synthetic packaging — these juxtapositions are more visually complex than anything I could compose in a studio.

My challenge was translating this chaotic beauty into a coherent painting without sanitizing it. I wanted the viewer to feel the heat, smell the spices, hear the calls of vendors. Oil paint, with its rich materiality, became the perfect medium for capturing the sensory density of the bazaar.`,
    image: streetScene,
    date: "2024-05-10",
    category: "Process",
  },
  {
    id: "4",
    title: "Sacred Light: Painting Mughal Architecture at Golden Hour",
    excerpt: "The Badshahi Mosque at sunset is not just a building — it's a symphony of light and devotion that has inspired artists for four centuries.",
    content: `There is a specific moment — roughly twenty minutes before sunset — when the Badshahi Mosque transforms. The red sandstone absorbs the dying light and seems to glow from within, the domes catch the last golden rays, and the reflecting pool becomes a mirror of fire.

I have painted the mosque dozens of times, but "Golden Hour at Badshahi" represents my most ambitious attempt to capture this transformation. The painting took four months to complete, requiring multiple visits to study how the light changes across seasons.

Technically, the challenge was rendering the mosque's massive scale while maintaining the intimate, emotional quality of the light. I used a limited palette — primarily burnt sienna, raw umber, cadmium yellow, and ultramarine blue — mixed on the canvas rather than the palette to create the living, breathing quality of sunset light.

The reflecting pool in the foreground was the most difficult element. Water at sunset is not simply a mirror — it has its own depth, its own color, its own movement. I painted and repainted this section seventeen times before achieving the luminous transparency I was seeking.

This painting is ultimately about devotion — not just spiritual devotion, but the artist's devotion to seeing, truly seeing, what is before us.`,
    image: mosqueSunset,
    date: "2024-07-01",
    category: "Process",
  },
  {
    id: "5",
    title: "Abstract Intimacy: Finding Emotion in Fabric Folds",
    excerpt: "A crumpled piece of purple cloth became the unexpected subject of my most personal painting — and taught me that abstraction is just another word for feeling.",
    content: `"Veiled Violet" began as an accident. I had draped a piece of purple fabric over a chair in my studio to use as a background for a still life, but the fabric itself — its folds, its shadows, its quiet presence — captivated me more than any arrangement of objects could.

I spent weeks simply looking at it. The way a single piece of cloth could contain so many shades of violet, from nearly black in the deepest creases to lavender where the light grazed the surface — it was a complete world in miniature.

This painting taught me something important about abstraction. I had always thought of abstract art as intellectual, conceptual, removed from emotion. But painting these fabric folds was one of the most emotionally charged experiences of my artistic practice.

Each fold became a metaphor — for concealment, for softness, for the way life crumples us and creates new, unexpected beauty in the process. The violet color itself carries associations with spirituality, royalty, and mourning across many cultures.

The monochromatic palette was essential. By eliminating the distraction of multiple colors, I forced myself (and the viewer) to pay attention to value, to the infinite gradations between light and shadow. This is where true seeing happens — not in the spectacle of color, but in the quiet attention to subtle differences.`,
    image: purpleFabric,
    date: "2024-09-15",
    category: "Thesis",
  },
];
