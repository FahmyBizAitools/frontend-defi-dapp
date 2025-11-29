import type { ContentIdea } from "./contentGenerator";
import type { ProductInfo } from "./productScraper";

export interface PinCopy {
  day: number;
  title_main: string;
  title_a: string;
  title_b: string;
  description: string;
  hashtags: string[];
  keywords: string[];
}

interface GenerateCopywritingParams {
  contentIdeas: ContentIdea[];
  productInfo: ProductInfo;
  affiliateLink: string;
}

export async function generateCopywriting(
  params: GenerateCopywritingParams
): Promise<PinCopy[]> {
  const { contentIdeas, productInfo, affiliateLink } = params;

  const copywriting: PinCopy[] = contentIdeas.map((idea) => {
    const titleMain = generateMainTitle(idea, productInfo);
    const titleA = generateBenefitTitle(idea, productInfo);
    const titleB = generateEmotionalTitle(idea, productInfo);
    const description = generateDescription(idea, productInfo, affiliateLink);
    const hashtags = generateHashtags(idea, productInfo);
    const keywords = idea.keywords;

    return {
      day: idea.day,
      title_main: titleMain,
      title_a: titleA,
      title_b: titleB,
      description,
      hashtags,
      keywords,
    };
  });

  return copywriting;
}

function generateMainTitle(idea: ContentIdea, productInfo: ProductInfo): string {
  // SEO Long Tail titles
  const templates = [
    `${idea.judul} | Luxury Beauty Guide`,
    `${idea.judul} for ${productInfo.target_audience.split(" ")[0]}`,
    `${idea.judul} - Premium Skincare Tips`,
    `${idea.judul} | Achieve Radiant Skin`,
  ];

  return templates[idea.day % templates.length];
}

function generateBenefitTitle(idea: ContentIdea, productInfo: ProductInfo): string {
  // Benefit-driven titles
  const benefits = productInfo.benefit_utama;
  const randomBenefit = benefits[idea.day % benefits.length];

  const templates = [
    `Get ${randomBenefit} with This Simple Routine`,
    `Discover the Secret to ${randomBenefit}`,
    `Transform Your Skin: ${randomBenefit} in Days`,
    `Unlock ${randomBenefit} with Premium Beauty`,
  ];

  return templates[idea.day % templates.length];
}

function generateEmotionalTitle(idea: ContentIdea, productInfo: ProductInfo): string {
  // Emotional hook titles
  const emotions = {
    trust: [
      "The Beauty Secret Everyone's Talking About",
      "This Changed My Skin Forever (Real Results)",
      "Why Thousands Trust This Beauty Solution",
      "The Honest Truth About Luxury Skincare",
    ],
    calm: [
      "Find Your Inner Glow with This Peaceful Routine",
      "Serene Beauty: Your Path to Radiant Skin",
      "Embrace Calm, Embrace Beauty",
      "Your Moment of Beauty Bliss Awaits",
    ],
    "luxury vibe": [
      "Indulge in the Ultimate Luxury Beauty Experience",
      "Elevate Your Beauty Routine to Pure Luxury",
      "Experience Beauty Like Never Before",
      "Where Luxury Meets Radiance",
    ],
  };

  const triggerEmotions = emotions[idea.trigger as keyof typeof emotions] || emotions.trust;
  return triggerEmotions[idea.day % triggerEmotions.length];
}

function generateDescription(
  idea: ContentIdea,
  productInfo: ProductInfo,
  affiliateLink: string
): string {
  const benefit = productInfo.benefit_utama[0];
  const usp = productInfo.USP_produk;
  const keywords = idea.keywords.slice(0, 3).join(", ");

  const descriptions = [
    `✨ Discover the secret to ${benefit}! ${usp} that delivers real results. Perfect for ${productInfo.target_audience}. ${keywords} | Tap to transform your beauty routine → ${affiliateLink}`,
    
    `💎 ${idea.judul} - Your guide to achieving ${benefit}. ${usp} trusted by beauty enthusiasts worldwide. Explore ${keywords} and unlock your radiant potential. Start your journey → ${affiliateLink}`,
    
    `🌟 Ready for ${benefit}? This ${usp.toLowerCase()} is your answer. Designed for ${productInfo.target_audience}, featuring ${keywords}. Discover premium beauty finds → ${affiliateLink}`,
    
    `✨ Transform your skincare with ${productInfo.nama_produk}. Experience ${benefit} through ${usp.toLowerCase()}. Perfect for ${keywords} lovers. Your glow awaits → ${affiliateLink}`,
    
    `💫 ${idea.judul} | ${usp} that brings you ${benefit}. Join thousands achieving their beauty goals. Explore ${keywords} and more. Discover now → ${affiliateLink}`,
    
    `🌸 Unlock ${benefit} with this luxury beauty solution. ${usp} designed for ${productInfo.target_audience}. Features ${keywords} for optimal results. Start glowing → ${affiliateLink}`,
    
    `✨ Your path to ${benefit} starts here! ${usp} with proven results. Perfect for ${keywords} enthusiasts. Transform your routine today → ${affiliateLink}`,
    
    `💎 Experience the luxury of ${benefit}. ${usp} that delivers visible transformation. Ideal for ${productInfo.target_audience}. Explore ${keywords} → ${affiliateLink}`,
  ];

  return descriptions[idea.day % descriptions.length];
}

function generateHashtags(idea: ContentIdea, productInfo: ProductInfo): string[] {
  const baseHashtags = [
    "#LuxuryBeauty",
    "#SkincareRoutine",
    "#BeautyTips",
    "#GlowingSkin",
    "#SelfCare",
    "#BeautyEssentials",
    "#SkincareAddict",
    "#BeautyFinds",
    "#RadiantSkin",
    "#PremiumSkincare",
  ];

  const themeHashtags: Record<string, string[]> = {
    Tips: ["#BeautyHacks", "#SkincareSecrets", "#BeautyAdvice"],
    Review: ["#ProductReview", "#HonestReview", "#BeautyReview"],
    Transformation: ["#BeforeAndAfter", "#SkinTransformation", "#GlowUp"],
    Routine: ["#MorningRoutine", "#NightRoutine", "#BeautyRitual"],
    "Aesthetic Product Shot": ["#BeautyAesthetic", "#LuxuryLifestyle", "#BeautyPhotography"],
  };

  const themeSpecific = themeHashtags[idea.tema] || [];
  const combined = [...baseHashtags.slice(0, 7), ...themeSpecific];

  return combined.slice(0, 10);
}
