import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

import purpleFabric from "@/assets/artwork-purple-fabric.jpg";
import islamicDetails from "@/assets/artwork-islamic-details.jpg";
import interiorScene from "@/assets/artwork-interior-scene.jpg";
import portraitRoses from "@/assets/artwork-portrait-roses.jpg";
import greenPeas from "@/assets/artwork-green-peas.png";
import triptychFrogs from "@/assets/artwork-triptych-frogs.png";
import darkRosesHands from "@/assets/artwork-dark-roses-hands.png";
import pinkPortraitRoses from "@/assets/artwork-pink-portrait-roses.png";
import blueFlowersGarden from "@/assets/artwork-blue-flowers-garden.png";

const imageMap: Record<string, string> = {
  "artwork-purple-fabric": purpleFabric,
  "artwork-islamic-details": islamicDetails,
  "artwork-interior-scene": interiorScene,
  "artwork-portrait-roses": portraitRoses,
  "artwork-green-peas": greenPeas,
  "artwork-triptych-frogs": triptychFrogs,
  "artwork-dark-roses-hands": darkRosesHands,
  "artwork-pink-portrait-roses": pinkPortraitRoses,
  "artwork-blue-flowers-garden": blueFlowersGarden,
};

export type DbArtwork = Tables<"artworks">;

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

function resolveImage(value: string | null | undefined): string {
  if (!value) return purpleFabric;
  if (/^https?:\/\//i.test(value) || value.startsWith("/")) return value;
  return imageMap[value] ?? purpleFabric;
}

export function mapDbArtwork(db: DbArtwork): Artwork {
  return {
    id: db.id,
    title: db.title,
    price: db.price,
    description: db.description ?? "",
    medium: db.medium ?? "",
    size: db.size ?? "",
    year: db.year ?? "",
    image: resolveImage(db.image_url),
    available: db.available,
    category: db.category ?? "",
  };
}

export function useArtworks() {
  return useQuery({
    queryKey: ["artworks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(mapDbArtwork);
    },
  });
}
