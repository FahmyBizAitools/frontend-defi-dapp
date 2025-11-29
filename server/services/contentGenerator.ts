import type { ProductInfo } from "./productScraper";

export interface ContentIdea {
  day: number;
  judul: string;
  tema: string;
  visual: string;
  trigger: string;
  keywords: string[];
}

interface GenerateContentIdeasParams {
  brandName: string;
  niche: string;
  targetMarket: string;
  productInfo: ProductInfo;
}

export async function generateContentIdeas(
  params: GenerateContentIdeasParams
): Promise<ContentIdea[]> {
  const { brandName, niche, targetMarket, productInfo } = params;

  const contentIdeas: ContentIdea[] = [
    // Week 1: Introduction & Trust Building
    {
      day: 1,
      judul: "5 Luxury Beauty Secrets Every Woman Should Know",
      tema: "Tips",
      visual: "Elegant flat lay of luxury beauty products on marble surface with soft morning light",
      trigger: "trust",
      keywords: ["luxury beauty tips", "skincare secrets", "beauty routine", "premium skincare", "beauty essentials"],
    },
    {
      day: 2,
      judul: "Morning Glow Routine for Radiant Skin",
      tema: "Routine",
      visual: "Serene morning scene with beauty products, natural light streaming through window, minimalist aesthetic",
      trigger: "calm",
      keywords: ["morning skincare", "glow routine", "radiant skin", "beauty morning", "skincare ritual"],
    },
    {
      day: 3,
      judul: `Why ${productInfo.nama_produk} Changed My Skin Forever`,
      tema: "Review",
      visual: "Before and after comparison with elegant typography, soft pastel background",
      trigger: "trust",
      keywords: ["beauty transformation", "skincare review", "product results", "beauty testimonial", "skin improvement"],
    },
    {
      day: 4,
      judul: "The Science Behind Luxury Skincare",
      tema: "Tips",
      visual: "Sophisticated infographic with beauty ingredients, clean design, rose gold accents",
      trigger: "trust",
      keywords: ["skincare science", "beauty ingredients", "luxury skincare", "effective skincare", "beauty education"],
    },
    {
      day: 5,
      judul: "Aesthetic Beauty Vanity Goals",
      tema: "Aesthetic Product Shot",
      visual: "Dreamy vanity setup with luxury products, fairy lights, soft focus, Instagram-worthy",
      trigger: "luxury vibe",
      keywords: ["beauty vanity", "aesthetic beauty", "luxury setup", "beauty organization", "vanity goals"],
    },
    {
      day: 6,
      judul: "Self-Care Sunday: Luxury Spa at Home",
      tema: "Routine",
      visual: "Relaxing spa scene with candles, beauty products, plush towels, calming atmosphere",
      trigger: "calm",
      keywords: ["self care sunday", "spa at home", "beauty ritual", "relaxation", "pamper routine"],
    },
    {
      day: 7,
      judul: "7-Day Skin Transformation Challenge",
      tema: "Transformation",
      visual: "Week-by-week progress photos in elegant grid layout, soft pink background",
      trigger: "trust",
      keywords: ["skin transformation", "7 day challenge", "beauty results", "skincare journey", "glow up"],
    },

    // Week 2: Product Focus & Benefits
    {
      day: 8,
      judul: "The One Product That Changed Everything",
      tema: "Review",
      visual: "Hero product shot with dramatic lighting, luxury packaging highlighted",
      trigger: "luxury vibe",
      keywords: ["holy grail product", "beauty favorite", "must have skincare", "game changer", "beauty essential"],
    },
    {
      day: 9,
      judul: "Night Routine for Anti-Aging Results",
      tema: "Routine",
      visual: "Evening beauty routine with moonlight aesthetic, calming blue tones",
      trigger: "calm",
      keywords: ["night skincare", "anti aging routine", "evening beauty", "youthful skin", "nighttime ritual"],
    },
    {
      day: 10,
      judul: "Luxury Beauty on a Budget? Here's How",
      tema: "Tips",
      visual: "Smart shopping concept with elegant price tags, luxury aesthetic maintained",
      trigger: "trust",
      keywords: ["affordable luxury", "beauty budget", "smart shopping", "value beauty", "luxury for less"],
    },
    {
      day: 11,
      judul: "Glowing Skin Secrets from Beauty Experts",
      tema: "Tips",
      visual: "Expert quotes overlaid on beautiful skin close-up, professional aesthetic",
      trigger: "trust",
      keywords: ["expert beauty tips", "glowing skin secrets", "professional advice", "beauty experts", "skin glow"],
    },
    {
      day: 12,
      judul: "My Luxury Beauty Favorites This Month",
      tema: "Aesthetic Product Shot",
      visual: "Curated collection of products on velvet surface, editorial style photography",
      trigger: "luxury vibe",
      keywords: ["beauty favorites", "monthly picks", "luxury products", "beauty haul", "top products"],
    },
    {
      day: 13,
      judul: "Transform Your Skin in 30 Days",
      tema: "Transformation",
      visual: "Timeline infographic with progress photos, elegant design, inspiring layout",
      trigger: "trust",
      keywords: ["30 day transformation", "skin improvement", "beauty journey", "skincare results", "glow transformation"],
    },
    {
      day: 14,
      judul: "The Ultimate Hydration Routine",
      tema: "Routine",
      visual: "Water droplets, dewy skin, hydrating products, fresh and clean aesthetic",
      trigger: "calm",
      keywords: ["hydration routine", "dewy skin", "moisture boost", "hydrating skincare", "plump skin"],
    },

    // Week 3: Lifestyle & Aspiration
    {
      day: 15,
      judul: "Luxury Beauty Lifestyle Essentials",
      tema: "Aesthetic Product Shot",
      visual: "Lifestyle flat lay with beauty products, coffee, flowers, aspirational living",
      trigger: "luxury vibe",
      keywords: ["beauty lifestyle", "luxury living", "aesthetic life", "beauty essentials", "elevated routine"],
    },
    {
      day: 16,
      judul: "5 Mistakes Ruining Your Skincare Results",
      tema: "Tips",
      visual: "Educational infographic with do's and don'ts, clean modern design",
      trigger: "trust",
      keywords: ["skincare mistakes", "beauty errors", "skincare tips", "avoid mistakes", "better results"],
    },
    {
      day: 17,
      judul: "Radiant Skin for Every Season",
      tema: "Tips",
      visual: "Seasonal beauty concept with four-season aesthetic, elegant transitions",
      trigger: "calm",
      keywords: ["seasonal skincare", "year round beauty", "skin adaptation", "beauty seasons", "radiant skin"],
    },
    {
      day: 18,
      judul: "My Honest Review: Worth the Hype?",
      tema: "Review",
      visual: "Authentic review setup with product, handwritten notes, personal touch",
      trigger: "trust",
      keywords: ["honest review", "product review", "worth it", "beauty opinion", "real results"],
    },
    {
      day: 19,
      judul: "Minimalist Beauty Routine That Works",
      tema: "Routine",
      visual: "Clean, minimal setup with few essential products, Scandinavian aesthetic",
      trigger: "calm",
      keywords: ["minimalist beauty", "simple routine", "essential skincare", "less is more", "streamlined beauty"],
    },
    {
      day: 20,
      judul: "Luxury Packaging That Feels Like Art",
      tema: "Aesthetic Product Shot",
      visual: "Artistic product photography with shadows, textures, museum-quality aesthetic",
      trigger: "luxury vibe",
      keywords: ["luxury packaging", "beauty art", "aesthetic products", "designer beauty", "premium packaging"],
    },
    {
      day: 21,
      judul: "3-Week Transformation: My Journey",
      tema: "Transformation",
      visual: "Personal journey collage with progress photos, emotional storytelling",
      trigger: "trust",
      keywords: ["transformation journey", "3 week results", "beauty progress", "skin journey", "real transformation"],
    },

    // Week 4: Advanced Tips & Community
    {
      day: 22,
      judul: "Pro Tips for Flawless Application",
      tema: "Tips",
      visual: "Step-by-step application guide with elegant hand models, professional lighting",
      trigger: "trust",
      keywords: ["application tips", "pro techniques", "flawless beauty", "expert application", "beauty hacks"],
    },
    {
      day: 23,
      judul: "Evening Elegance: Luxury Night Routine",
      tema: "Routine",
      visual: "Sophisticated evening scene with dim lighting, luxury products, silk textures",
      trigger: "luxury vibe",
      keywords: ["evening routine", "luxury night care", "elegant beauty", "nighttime luxury", "sophisticated skincare"],
    },
    {
      day: 24,
      judul: "The Glow-Up Guide: Start to Finish",
      tema: "Transformation",
      visual: "Complete transformation guide with timeline, elegant infographic design",
      trigger: "trust",
      keywords: ["glow up guide", "complete transformation", "beauty makeover", "skin improvement", "total glow"],
    },
    {
      day: 25,
      judul: "Luxury Beauty Trends You Need to Try",
      tema: "Tips",
      visual: "Trendy beauty collage with modern aesthetic, fashion-forward styling",
      trigger: "luxury vibe",
      keywords: ["beauty trends", "luxury trends", "trending skincare", "beauty innovation", "must try"],
    },
    {
      day: 26,
      judul: "My Travel Beauty Essentials",
      tema: "Aesthetic Product Shot",
      visual: "Travel flat lay with beauty products, passport, elegant travel aesthetic",
      trigger: "luxury vibe",
      keywords: ["travel beauty", "beauty essentials", "travel skincare", "on the go", "travel routine"],
    },
    {
      day: 27,
      judul: "Confidence Through Self-Care",
      tema: "Tips",
      visual: "Empowering imagery with beauty products, motivational aesthetic, soft lighting",
      trigger: "calm",
      keywords: ["self care", "confidence boost", "beauty confidence", "self love", "empowerment"],
    },
    {
      day: 28,
      judul: "The Complete Luxury Beauty Routine",
      tema: "Routine",
      visual: "Comprehensive routine layout with all products, editorial magazine style",
      trigger: "luxury vibe",
      keywords: ["complete routine", "full beauty routine", "luxury skincare", "comprehensive care", "total beauty"],
    },

    // Final Days: Strong CTAs
    {
      day: 29,
      judul: "Why I'll Never Go Back to Regular Products",
      tema: "Review",
      visual: "Comparison shot with dramatic before/after, testimonial aesthetic",
      trigger: "trust",
      keywords: ["never go back", "life changing", "best product", "game changer", "permanent switch"],
    },
    {
      day: 30,
      judul: "Your Journey to Radiant Skin Starts Here",
      tema: "Transformation",
      visual: "Inspiring final call-to-action with beautiful results, aspirational imagery",
      trigger: "luxury vibe",
      keywords: ["start your journey", "radiant skin", "beauty transformation", "begin now", "your glow"],
    },
  ];

  return contentIdeas;
}
