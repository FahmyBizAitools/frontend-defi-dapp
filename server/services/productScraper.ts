import axios from "axios";
import * as cheerio from "cheerio";

export interface ProductInfo {
  nama_produk: string;
  benefit_utama: string[];
  target_audience: string;
  usia_target: string;
  pain_points: string[];
  USP_produk: string;
  harga: string;
  affiliate_CTA: string;
}

export async function scrapeDigistore24Product(
  affiliateLink: string
): Promise<ProductInfo> {
  try {
    // Fetch the page
    const response = await axios.get(affiliateLink, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    // Extract product information
    // Note: These selectors may need to be adjusted based on actual Digistore24 page structure
    const productName =
      $("h1").first().text().trim() ||
      $('meta[property="og:title"]').attr("content") ||
      "Luxury Beauty Product";

    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "";

    const price =
      $(".price").first().text().trim() ||
      $('[class*="price"]').first().text().trim() ||
      "Premium";

    // Generate intelligent product info based on scraped data
    const productInfo: ProductInfo = {
      nama_produk: productName,
      benefit_utama: extractBenefits(description, productName),
      target_audience: "Women aged 20-45 in USA, UK, and Canada seeking luxury beauty solutions",
      usia_target: "20-45 years",
      pain_points: generatePainPoints(description),
      USP_produk: extractUSP(description, productName),
      harga: price,
      affiliate_CTA: "Discover your beauty transformation →",
    };

    return productInfo;
  } catch (error: any) {
    console.error("Error scraping product:", error.message);
    
    // Return fallback data if scraping fails
    return {
      nama_produk: "Premium Beauty & Wellness Solution",
      benefit_utama: [
        "Radiant, youthful skin",
        "Natural beauty enhancement",
        "Confidence boost",
        "Professional-grade results at home",
      ],
      target_audience: "Women aged 20-45 in USA, UK, and Canada seeking luxury beauty solutions",
      usia_target: "20-45 years",
      pain_points: [
        "Dull, tired-looking skin",
        "Signs of aging",
        "Lack of confidence in appearance",
        "Expensive salon treatments",
      ],
      USP_produk: "Premium, science-backed beauty solution with visible results",
      harga: "Premium",
      affiliate_CTA: "Discover your beauty transformation →",
    };
  }
}

function extractBenefits(description: string, productName: string): string[] {
  const benefits = [
    "Radiant, youthful skin",
    "Natural beauty enhancement",
    "Confidence boost",
    "Professional-grade results",
  ];

  // Add context-specific benefits based on keywords
  const lowerDesc = description.toLowerCase();
  const lowerName = productName.toLowerCase();

  if (lowerDesc.includes("anti-aging") || lowerName.includes("anti-aging")) {
    benefits.push("Reduces fine lines and wrinkles");
  }
  if (lowerDesc.includes("hydrat") || lowerName.includes("hydrat")) {
    benefits.push("Deep hydration and moisture");
  }
  if (lowerDesc.includes("glow") || lowerName.includes("glow")) {
    benefits.push("Luminous, glowing complexion");
  }

  return benefits.slice(0, 5);
}

function generatePainPoints(description: string): string[] {
  return [
    "Dull, tired-looking skin",
    "Signs of aging and fine lines",
    "Lack of confidence in appearance",
    "Expensive salon treatments",
    "Inconsistent skincare results",
  ];
}

function extractUSP(description: string, productName: string): string {
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes("clinical") || lowerDesc.includes("dermatologist")) {
    return "Clinically-proven, dermatologist-recommended luxury beauty solution";
  }
  if (lowerDesc.includes("natural") || lowerDesc.includes("organic")) {
    return "Premium natural ingredients with science-backed results";
  }
  
  return "Luxury beauty solution with professional-grade, visible results";
}
