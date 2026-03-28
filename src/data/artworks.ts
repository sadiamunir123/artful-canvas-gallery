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
];
