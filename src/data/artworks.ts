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
import greenPeas from "@/assets/artwork-green-peas.png";
import triptychFrogs from "@/assets/artwork-triptych-frogs.png";
import darkRosesHands from "@/assets/artwork-dark-roses-hands.png";
import pinkPortraitRoses from "@/assets/artwork-pink-portrait-roses.png";
import blueFlowersGarden from "@/assets/artwork-blue-flowers-garden.png";

export const artworks: Artwork[] = [
  {
    id: "1",
    title: "Veiled Violet",
    price: 85000,
    description: "A monochromatic study in purple, exploring the delicate folds and shadows of crumpled fabric. This painting captures the interplay of light and form through rich violet tones, transforming an ordinary material into something deeply expressive and sculptural. The work investigates how a single hue can contain infinite variation — from near-black in the deepest creases to pale lavender where light grazes the surface.",
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
    description: "A series of eight studies capturing the intricate tile work and calligraphic details of Mughal and Islamic architecture. Each panel reveals the mathematical beauty and spiritual symbolism embedded in traditional decorative patterns — from the bold Kufic calligraphy of mosque domes to the delicate floral arabesques of Lahore's historic monuments.",
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
    description: "An intimate portrayal of a traditional Pakistani living room, rich with cultural detail — from the ornate carpet to the crimson curtains. This painting explores how domestic spaces hold memory and identity, transforming the ordinary into a deeply personal landscape. The leaning canvas, scattered cushions, and warm textures evoke the quiet permanence of family spaces.",
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
    description: "A powerful portrait of a woman in white, partially concealed behind dark roses, exploring themes of identity, beauty, and mystery. The interplay between the subject's visible eye and the obscuring flower creates a tension between revelation and concealment — a visual metaphor for the beautiful barriers society places between women and full visibility.",
    medium: "Oil on Canvas",
    size: "30 × 40 inches",
    year: "2023",
    image: portraitRoses,
    available: true,
    category: "Portrait",
  },
  {
    id: "5",
    title: "Circle of Life",
    price: 110000,
    description: "A mesmerizing circular arrangement of green peas against a deep emerald background. Each pea is rendered with meticulous attention to its unique form and the way light catches its surface, creating a meditative composition that celebrates the beauty in the mundane. The circular formation suggests cycles of nature, growth, and the interconnectedness of all living things — transforming a humble kitchen staple into a profound visual statement about abundance and unity.",
    medium: "Oil on Canvas",
    size: "36 × 36 inches",
    year: "2024",
    image: greenPeas,
    available: true,
    category: "Still Life",
  },
  {
    id: "6",
    title: "Silent Observers",
    price: 180000,
    description: "A striking triptych featuring solitary frogs set against contrasting backgrounds of deep navy and vivid red. The three panels create a visual dialogue between stillness and tension, presence and absence. Each frog sits motionless, a quiet witness to the vast emptiness surrounding it. The bold color choices amplify the emotional weight — the cool blue panels flanking the warm red center evoke themes of isolation, duality, and the courage to exist boldly in an overwhelming space.",
    medium: "Acrylic on Canvas",
    size: "18 × 36 inches (each panel)",
    year: "2024",
    image: triptychFrogs,
    available: true,
    category: "Contemporary",
  },
  {
    id: "7",
    title: "Thorns in Shadow",
    price: 135000,
    description: "A hauntingly atmospheric painting of a cloaked figure holding dark roses, their thorny stems climbing into the blue-violet background. The contrast between the warm flesh tones of the hands and the cool darkness of the clothing and flowers creates a powerful tension between vulnerability and strength. The roses, traditionally symbols of love and beauty, are rendered in near-black tones — suggesting that beauty can carry pain, and that holding onto something beautiful sometimes means embracing its thorns.",
    medium: "Oil on Canvas",
    size: "30 × 36 inches",
    year: "2024",
    image: darkRosesHands,
    available: true,
    category: "Figurative",
  },
  {
    id: "8",
    title: "Crimson Grace",
    price: 200000,
    description: "A deeply emotive portrait of a young woman in pink, her gaze cast downward in quiet contemplation, set against a rich crimson background adorned with dark roses. The painting captures a moment of profound inner stillness — the subject's soft expression and the gentle drape of her dupatta contrasting with the boldness of the thorned roses behind her. This work explores themes of femininity, resilience, and the quiet strength found in introspection.",
    medium: "Oil on Canvas",
    size: "36 × 40 inches",
    year: "2024",
    image: pinkPortraitRoses,
    available: true,
    category: "Portrait",
  },
  {
    id: "9",
    title: "Garden of Dreams",
    price: 90000,
    description: "A vibrant, expressive landscape bursting with color — blue flowers dance around a tree trunk while fields of red, orange, and green stretch into the background. This painting embraces an almost fauvist intensity, where colors are freed from realistic constraints to capture the emotional experience of being in a garden. The blue cornflowers in their pot serve as the focal point, their cool hue providing a visual anchor amidst the warm, pulsating earth tones surrounding them.",
    medium: "Acrylic on Canvas",
    size: "24 × 24 inches",
    year: "2023",
    image: blueFlowersGarden,
    available: true,
    category: "Landscape",
  },
];
