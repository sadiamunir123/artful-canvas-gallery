import purpleFabric from "@/assets/artwork-purple-fabric.jpg";
import islamicDetails from "@/assets/artwork-islamic-details.jpg";
import interiorScene from "@/assets/artwork-interior-scene.jpg";
import portraitRoses from "@/assets/artwork-portrait-roses.jpg";
import greenPeas from "@/assets/artwork-green-peas.png";
import triptychFrogs from "@/assets/artwork-triptych-frogs.png";
import darkRosesHands from "@/assets/artwork-dark-roses-hands.png";
import pinkPortraitRoses from "@/assets/artwork-pink-portrait-roses.png";
import blueFlowersGarden from "@/assets/artwork-blue-flowers-garden.png";

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
    title: "Memory as Medium: The Story Behind 'Veiled Violet'",
    excerpt: "How a crumpled piece of purple fabric became a meditation on light, form, and the infinite variations hidden within a single color.",
    content: "When I first draped a piece of violet silk across my studio table, I wasn't planning a painting — I was cleaning up. But the way the afternoon light caught the folds stopped me completely. In those creases, I saw something I'd been trying to articulate for months: that a single color, given the right conditions, can contain an entire emotional spectrum.\n\n'Veiled Violet' became an exercise in restraint and observation. Working exclusively within the purple family forced me to slow down and really see — to distinguish between the cool shadow in a deep fold and the warm lavender where light barely grazes the surface.\n\nThe painting took three months to complete. I worked in thin glazes, building up layers of transparency that allow the canvas texture to breathe through the paint. This technique creates a luminosity that opaque application simply cannot achieve.\n\nWhat began as an accidental encounter with fabric became a profound lesson in looking. 'Veiled Violet' taught me that the ordinary holds extraordinary depth — if we're willing to sit with it long enough to see.",
    image: purpleFabric,
    date: "2023-11-15",
    category: "Process",
  },
  {
    id: "2",
    title: "Sacred Patterns: Decoding the Language of Islamic Architecture",
    excerpt: "A journey through Lahore's historic monuments and the mathematical beauty embedded in centuries-old tile work and calligraphy.",
    content: "Every Friday for six months, I visited a different mosque or monument in Lahore with my sketchbook. What I found in those visits changed how I understand art, mathematics, and spirituality.\n\nIslamic geometric patterns are not mere decoration — they are visual theology. The infinite repetition of a star pattern speaks to the boundlessness of the divine. The interlocking arabesques remind us that all things are connected.\n\n'Sacred Geometry' began as field sketches that evolved into eight focused studies. Each panel isolates a different element — a dome's calligraphic band, a tile border's geometric progression, a minaret's floral relief.\n\nWorking on these panels required a precision I wasn't accustomed to. I used traditional compass-and-straightedge techniques to lay out the geometries before painting, honoring the same methods artisans used centuries ago. The experience was itself a form of meditation.",
    image: islamicDetails,
    date: "2023-09-20",
    category: "Thesis",
  },
  {
    id: "3",
    title: "Spaces That Remember: Painting 'Grandmother's Room'",
    excerpt: "How domestic interiors hold memory and identity — a deeply personal exploration of the spaces that shaped us.",
    content: "My grandmother's living room hasn't changed in thirty years. The same crimson curtains hang heavy against the windows. The same carpet — now faded at the edges — covers the floor.\n\nWhen I decided to paint this room, I wasn't interested in architectural accuracy. I wanted to capture how it feels to walk into a space so saturated with memory that the air itself seems thicker. Every object in that room is a repository of family history.\n\nThe painting deliberately blurs the line between observation and memory. Some details are rendered with photographic precision — the pattern on the carpet, the texture of the curtains. Others are softened, almost dreamlike.\n\n'Grandmother's Room' was the most emotionally challenging painting I've ever made. Sitting in that room with my easel, I was simultaneously the artist observing and the grandchild remembering.",
    image: interiorScene,
    date: "2023-08-10",
    category: "Personal",
  },
  {
    id: "4",
    title: "Between Seen and Hidden: The Symbolism in 'Behind the Rose'",
    excerpt: "Exploring how flowers become barriers and beauty becomes a mask in this portrait of concealment and identity.",
    content: "The idea for 'Behind the Rose' came from a simple observation: how often we use beautiful things to hide behind. A smile can conceal pain. Makeup can mask exhaustion. And a flower, held just so, can obscure an entire identity.\n\nThe woman in this painting is caught in the act of being both seen and hidden. One eye is visible — direct, knowing, almost challenging the viewer. The rest of her face disappears behind dark roses. She is not hiding in fear; she is choosing what to reveal.\n\nI chose dark, almost black roses deliberately. Red roses would have been too romantic, too expected. These near-black blooms carry weight — they suggest depth, mystery, and the kind of beauty that doesn't seek approval.\n\n'Behind the Rose' has resonated deeply with women who see their own experiences reflected in its themes — the deliberate, beautiful act of choosing which parts of yourself the world gets to see.",
    image: portraitRoses,
    date: "2023-07-05",
    category: "Conceptual",
  },
  {
    id: "5",
    title: "Finding the Sacred in the Ordinary: 'Circle of Life'",
    excerpt: "How hundreds of humble green peas arranged in a circle became a meditation on nature, abundance, and interconnectedness.",
    content: "It started in my mother's kitchen. She was shelling peas for dinner, and I found myself mesmerized by the little spheres rolling across the steel plate — each one slightly different, each catching light in its own unique way.\n\n'Circle of Life' is about seeing the extraordinary in the absolutely ordinary. Each pea in this painting was individually observed and rendered — no two are identical. Together, they form a circle that has no beginning and no end, a visual metaphor for nature's cycles.\n\nThe deep emerald background was crucial. I wanted the peas to feel like they were emerging from the same green source that grew them — as if the background were the earth itself.\n\nPainting this piece required extraordinary patience. Each pea took nearly an hour to complete, and the entire painting consumed almost two months of daily work. But that meditative repetition was the point — it mirrors the patient, cyclical nature of growth itself.",
    image: greenPeas,
    date: "2024-03-12",
    category: "Process",
  },
  {
    id: "6",
    title: "Stillness and Contrast: The Duality in 'Silent Observers'",
    excerpt: "A triptych of solitary frogs against bold backgrounds explores isolation, presence, and the courage to exist in overwhelming spaces.",
    content: "I've always been drawn to frogs — not for their beauty in the conventional sense, but for their stillness. A frog can sit motionless for hours, perfectly present, perfectly patient.\n\n'Silent Observers' places three frogs in vast, empty spaces defined by bold color. The two navy panels flank a central red panel, creating a visual rhythm that echoes a heartbeat — calm, intensity, calm.\n\nThe triptych format was essential. Three panels create a narrative without a story. The navy frogs are green, alive against the cool darkness. The central frog is darker, almost merging with the red behind it.\n\nI wanted to explore what it means to be small in a big space. These frogs are not diminished by their surroundings — they are grounded. They don't need to fill the space; they simply need to be in it. That distinction became the philosophical core of the work.",
    image: triptychFrogs,
    date: "2024-04-18",
    category: "Conceptual",
  },
  {
    id: "7",
    title: "Beauty That Cuts: The Darkness Behind 'Thorns in Shadow'",
    excerpt: "When roses become weapons and beauty becomes pain — exploring the duality of love through a cloaked figure holding dark flowers.",
    content: "There is something deeply unsettling about a beautiful thing that can hurt you. A rose is perhaps the most universally recognized symbol of love and beauty, yet it comes armed with thorns.\n\nThe figure in this painting is deliberately ambiguous. Cloaked in dark fabric, face hidden, only their hands are exposed — warm, human, vulnerable. They hold a dark rose with bare hands, the thorns pressing against skin.\n\nI painted the roses in near-black tones against a blue-violet atmosphere that feels like the moment just after sunset. This transitional light mirrors the painting's emotional ambiguity. Is this figure receiving flowers or surrendering them?\n\nThis painting is about the things we hold onto despite their ability to hurt us. Relationships, memories, beliefs — sometimes the most beautiful parts of our lives are also the sharpest.",
    image: darkRosesHands,
    date: "2024-05-22",
    category: "Thesis",
  },
  {
    id: "8",
    title: "Quiet Strength: The Making of 'Crimson Grace'",
    excerpt: "A portrait of introspection and resilience — how a young woman surrounded by dark roses became a symbol of feminine power.",
    content: "'Crimson Grace' is the most personal portrait I've ever painted. The subject — a young woman in a pink dupatta — sits in quiet contemplation, her gaze lowered not in submission but in deep inner focus. Behind her, dark roses climb against a rich crimson background.\n\nThe title speaks to the dual nature of grace: it is both an effortless beauty and a divine gift. Her pink clothing — soft, delicate, traditionally feminine — contrasts with the aggressive darkness of the roses behind her. She is gentle, but she is not fragile.\n\nI spent weeks getting the skin tones right. The warm light that falls on her face needed to feel like it was coming from within — an inner luminosity that speaks to her character.\n\nWhat I love most about this painting is the quietness of its power. There is no dramatic gesture, no confrontation. Just a woman sitting with her thoughts, surrounded by beauty and danger in equal measure, completely at peace with both.",
    image: pinkPortraitRoses,
    date: "2024-06-15",
    category: "Personal",
  },
  {
    id: "9",
    title: "Color Unbound: The Expressive World of 'Garden of Dreams'",
    excerpt: "A fauvist-inspired landscape where color breaks free from reality to capture the emotional experience of being surrounded by nature.",
    content: "Every artist has a painting that surprises them. 'Garden of Dreams' was mine. It began as a plein air study in a small garden in Kasur — I set up my easel near a pot of blue cornflowers and started painting what I saw. But somewhere between the first brushstroke and the last, observation gave way to pure feeling.\n\nThe colors in this painting are not realistic — they are emotional. The ground is red and orange because that's how the warm earth felt beneath my feet. The grass is electric green because the life force of those plants felt that intense.\n\nI was inspired by the Fauves — Matisse, Derain, and Vlaminck — who liberated color from the obligation of accuracy. For them, color was an expressive tool, not a descriptive one.\n\nThe pot of blue cornflowers serves as the painting's anchor. In the midst of all that warm, vibrating color, their cool blue provides a visual rest point. 'Garden of Dreams' marked a turning point in my practice — it gave me permission to trust my emotional response over intellectual analysis.",
    image: blueFlowersGarden,
    date: "2024-02-08",
    category: "Process",
  },
];
