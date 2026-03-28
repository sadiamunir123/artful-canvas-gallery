export interface Artwork {
  id: string;
  title: string;
  price: number;
  description: string;
  medium: string;
  size: string;
  year: string;
  image: string;
  available: boolean;
  category: string;
}

import purpleFabric from "@/assets/artwork-purple-fabric.jpg";
import islamicDetails from "@/assets/artwork-islamic-details.jpg";
import interiorScene from "@/assets/artwork-interior-scene.jpg";
import portraitRoses from "@/assets/artwork-portrait-roses.jpg";
import streetScene from "@/assets/artwork-street-scene.jpg";
import windowLight from "@/assets/artwork-window-light.jpg";
import mughalAbstract from "@/assets/artwork-mughal-abstract.jpg";
import courtyard from "@/assets/artwork-courtyard.jpg";
import truckArt from "@/assets/artwork-truck-art.jpg";
import mosqueSunset from "@/assets/artwork-mosque-sunset.jpg";

export const artworks: Artwork[] = [
  {
    id: "1",
    title: "Veiled Violet",
    price: 85000,
    description: "A monochromatic study in purple, exploring the delicate folds and shadows of crumpled fabric. This painting captures the interplay of light and form through rich violet tones, transforming an ordinary material into something deeply expressive and sculptural.",
    medium: "Oil on Canvas",
    size: "36 × 36 inches",
    year: "2023",
    image: purpleFabric,
    available: true,
    category: "Abstract",
  },
  {
    id: "2",
    title: "Sacred Geometry",
    price: 120000,
    description: "A series of eight studies capturing the intricate tile work and calligraphic details of Mughal and Islamic architecture. Each panel reveals the mathematical beauty and spiritual symbolism embedded in traditional decorative patterns.",
    medium: "Acrylic on Board",
    size: "12 × 12 inches (each panel)",
    year: "2022",
    image: islamicDetails,
    available: true,
    category: "Architectural",
  },
  {
    id: "3",
    title: "Grandmother's Room",
    price: 95000,
    description: "An intimate portrayal of a traditional Pakistani living room, rich with cultural detail — from the ornate carpet to the crimson curtains. This painting explores how domestic spaces hold memory and identity, transforming the ordinary into a deeply personal landscape.",
    medium: "Oil on Canvas",
    size: "30 × 36 inches",
    year: "2023",
    image: interiorScene,
    available: false,
    category: "Interior",
  },
  {
    id: "4",
    title: "Behind the Rose",
    price: 150000,
    description: "A powerful portrait of a woman partially concealed behind dark roses, exploring themes of identity, beauty, and mystery. The interplay between the subject's gaze and the obscuring flowers creates a tension between revelation and concealment.",
    medium: "Oil on Canvas",
    size: "30 × 40 inches",
    year: "2023",
    image: portraitRoses,
    available: true,
    category: "Portrait",
  },
  {
    id: "5",
    title: "Bazaar of Colors",
    price: 110000,
    description: "A vibrant depiction of a traditional Pakistani market street bathed in warm golden light. The painting captures the energy and visual richness of everyday life — stacked fabrics, bustling vendors, and the timeless architecture of old city lanes.",
    medium: "Oil on Canvas",
    size: "36 × 48 inches",
    year: "2024",
    image: streetScene,
    available: true,
    category: "Landscape",
  },
  {
    id: "6",
    title: "Waiting for Dawn",
    price: 135000,
    description: "A contemplative portrait of a woman draped in crimson, seated by a sunlit window. The warm golden light streaming through the glass creates a deeply intimate atmosphere, exploring themes of patience, solitude, and quiet strength.",
    medium: "Oil on Canvas",
    size: "30 × 40 inches",
    year: "2024",
    image: windowLight,
    available: false,
    category: "Portrait",
  },
  {
    id: "7",
    title: "Crimson Heritage",
    price: 98000,
    description: "A bold geometric composition inspired by Mughal decorative arts, featuring intricate gold patterns on a deep crimson ground. The work bridges traditional Islamic ornamentation with contemporary abstract expression.",
    medium: "Acrylic & Gold Leaf on Canvas",
    size: "36 × 36 inches",
    year: "2024",
    image: mughalAbstract,
    available: true,
    category: "Abstract",
  },
  {
    id: "8",
    title: "The Old Courtyard",
    price: 88000,
    description: "A nostalgic rendering of an ancestral courtyard with a towering tree, terracotta pots, and dappled afternoon shadows. The painting evokes the quiet permanence of family spaces and the gentle passage of time in traditional Pakistani homes.",
    medium: "Oil on Canvas",
    size: "30 × 36 inches",
    year: "2023",
    image: courtyard,
    available: true,
    category: "Interior",
  },
  {
    id: "9",
    title: "Jingle Truck Dreams",
    price: 145000,
    description: "A vivid celebration of Pakistani truck art tradition, merging folk decorative aesthetics with a sweeping mountain landscape. Flowers, bold colors, and ornamental patterns create a joyful visual anthem to cultural identity and artistic craft.",
    medium: "Acrylic on Canvas",
    size: "40 × 30 inches",
    year: "2024",
    image: truckArt,
    available: false,
    category: "Folk Art",
  },
  {
    id: "10",
    title: "Golden Hour at Badshahi",
    price: 175000,
    description: "A majestic sunset view of the Badshahi Mosque, Lahore, rendered in warm amber and gold tones. The reflective water channel leads the eye toward the grand dome, capturing the spiritual grandeur and architectural splendor of Mughal heritage.",
    medium: "Oil on Canvas",
    size: "48 × 36 inches",
    year: "2024",
    image: mosqueSunset,
    available: true,
    category: "Architectural",
  },
];
