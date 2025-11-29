import type { ProductInfo } from "./productScraper";

export interface BoardIdea {
  nama_board: string;
  deskripsi: string;
  target_audience: string;
  konten_cocok: string[];
  hook_unik: string;
}

interface GenerateBoardIdeasParams {
  niche: string;
  productInfo: ProductInfo;
}

export async function generateBoardIdeas(
  params: GenerateBoardIdeasParams
): Promise<BoardIdea[]> {
  const { niche, productInfo } = params;

  const boards: BoardIdea[] = [
    {
      nama_board: "Luxury Beauty Essentials",
      deskripsi: "Curated collection of premium beauty products and skincare must-haves",
      target_audience: "Women 25-45 seeking high-end beauty solutions",
      konten_cocok: ["Product shots", "Reviews", "Luxury aesthetics", "Beauty hauls"],
      hook_unik: "Where luxury meets everyday beauty",
    },
    {
      nama_board: "Radiant Skin Secrets",
      deskripsi: "Expert tips and routines for achieving glowing, healthy skin",
      target_audience: "Skincare enthusiasts of all ages",
      konten_cocok: ["Skincare routines", "Tips", "Before/after", "Educational content"],
      hook_unik: "Unlock your natural radiance",
    },
    {
      nama_board: "Morning Glow Routines",
      deskripsi: "Start your day with beauty rituals that bring out your inner glow",
      target_audience: "Busy professionals seeking efficient routines",
      konten_cocok: ["Morning routines", "Quick tips", "Product recommendations"],
      hook_unik: "Wake up to your best skin",
    },
    {
      nama_board: "Self-Care & Wellness",
      deskripsi: "Holistic approach to beauty through self-care and mindful practices",
      target_audience: "Wellness-focused women 20-45",
      konten_cocok: ["Self-care tips", "Spa routines", "Relaxation", "Mindfulness"],
      hook_unik: "Beauty begins with self-love",
    },
    {
      nama_board: "Beauty Transformations",
      deskripsi: "Real results and inspiring skincare journeys",
      target_audience: "Women seeking proven results",
      konten_cocok: ["Before/after", "Testimonials", "Progress photos", "Success stories"],
      hook_unik: "See the transformation, feel the confidence",
    },
    {
      nama_board: "Aesthetic Beauty Inspiration",
      deskripsi: "Visually stunning beauty content and lifestyle aesthetics",
      target_audience: "Instagram-savvy millennials and Gen Z",
      konten_cocok: ["Flat lays", "Aesthetic shots", "Lifestyle content", "Vanity goals"],
      hook_unik: "Where beauty becomes art",
    },
    {
      nama_board: "Anti-Aging Solutions",
      deskripsi: "Science-backed products and routines for youthful, ageless skin",
      target_audience: "Women 30+ concerned with aging",
      konten_cocok: ["Anti-aging tips", "Product reviews", "Expert advice", "Routines"],
      hook_unik: "Age gracefully, glow endlessly",
    },
    {
      nama_board: "Night Skincare Rituals",
      deskripsi: "Evening routines for skin repair and rejuvenation while you sleep",
      target_audience: "Women seeking overnight skin transformation",
      konten_cocok: ["Night routines", "Sleep beauty", "Recovery products", "PM skincare"],
      hook_unik: "Transform your skin overnight",
    },
    {
      nama_board: "Clean Beauty Finds",
      deskripsi: "Premium natural and clean beauty products that deliver results",
      target_audience: "Health-conscious beauty lovers",
      konten_cocok: ["Clean products", "Natural ingredients", "Eco-friendly", "Reviews"],
      hook_unik: "Pure ingredients, powerful results",
    },
    {
      nama_board: "Luxury Lifestyle & Beauty",
      deskripsi: "Elevated living through premium beauty and wellness",
      target_audience: "Affluent women seeking luxury experiences",
      konten_cocok: ["Lifestyle content", "Luxury products", "Travel beauty", "High-end"],
      hook_unik: "Live beautifully, shine brilliantly",
    },
    {
      nama_board: "Beauty on a Budget",
      deskripsi: "Affordable luxury and smart shopping for premium beauty",
      target_audience: "Value-conscious beauty enthusiasts",
      konten_cocok: ["Budget tips", "Dupes", "Sales", "Value products"],
      hook_unik: "Luxury beauty, accessible prices",
    },
    {
      nama_board: "Seasonal Beauty Guide",
      deskripsi: "Adapt your skincare routine for every season",
      target_audience: "Women seeking year-round skin perfection",
      konten_cocok: ["Seasonal tips", "Weather-specific", "Routine adjustments"],
      hook_unik: "Beautiful skin in every season",
    },
    {
      nama_board: "Minimalist Beauty",
      deskripsi: "Streamlined routines with essential products that work",
      target_audience: "Minimalists and busy professionals",
      konten_cocok: ["Simple routines", "Essential products", "Less is more", "Efficiency"],
      hook_unik: "Simplify your beauty, amplify results",
    },
    {
      nama_board: "Beauty Expert Tips",
      deskripsi: "Professional advice and insider secrets from beauty experts",
      target_audience: "Women seeking expert guidance",
      konten_cocok: ["Expert tips", "Professional advice", "Industry secrets", "How-tos"],
      hook_unik: "Learn from the pros",
    },
    {
      nama_board: "Confidence & Beauty",
      deskripsi: "Empowering content about beauty, confidence, and self-love",
      target_audience: "Women on self-improvement journeys",
      konten_cocok: ["Motivational", "Empowerment", "Self-love", "Confidence"],
      hook_unik: "Beauty is confidence in action",
    },
  ];

  return boards;
}
