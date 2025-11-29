import OpenAI from "openai";
import type { ImagePrompt } from "./imagePromptGenerator";

export interface GeneratedImage {
  day: number;
  url: string;
  prompt: string;
}

interface GenerateAIImagesParams {
  imagePrompts: ImagePrompt[];
  imageStyle: string;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function generateAIImages(
  params: GenerateAIImagesParams
): Promise<GeneratedImage[]> {
  const { imagePrompts, imageStyle } = params;

  // Check if API key is available
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OpenAI API key not found. Returning placeholder images.");
    return generatePlaceholderImages(imagePrompts);
  }

  const generatedImages: GeneratedImage[] = [];

  // Generate images in batches to avoid rate limits
  const batchSize = 5;
  for (let i = 0; i < imagePrompts.length; i += batchSize) {
    const batch = imagePrompts.slice(i, i + batchSize);

    const batchPromises = batch.map(async (promptData) => {
      try {
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: promptData.prompt,
          n: 1,
          size: "1024x1792", // Portrait ratio for Pinterest
          quality: "hd",
          style: "natural", // Natural style for luxury aesthetic
        });

        const imageUrl = response.data[0]?.url || "";

        return {
          day: promptData.day,
          url: imageUrl,
          prompt: promptData.prompt,
        };
      } catch (error: any) {
        console.error(`Error generating image for day ${promptData.day}:`, error.message);
        
        // Return placeholder if generation fails
        return {
          day: promptData.day,
          url: generatePlaceholderUrl(promptData.day),
          prompt: promptData.prompt,
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    generatedImages.push(...batchResults);

    // Add delay between batches to respect rate limits
    if (i + batchSize < imagePrompts.length) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return generatedImages;
}

function generatePlaceholderImages(imagePrompts: ImagePrompt[]): GeneratedImage[] {
  return imagePrompts.map((promptData) => ({
    day: promptData.day,
    url: generatePlaceholderUrl(promptData.day),
    prompt: promptData.prompt,
  }));
}

function generatePlaceholderUrl(day: number): string {
  // Generate placeholder image URL using a service like Unsplash
  const keywords = [
    "luxury-beauty",
    "skincare",
    "cosmetics",
    "spa",
    "wellness",
    "beauty-products",
    "makeup",
    "self-care",
  ];
  
  const keyword = keywords[day % keywords.length];
  
  // Using Unsplash Source API for high-quality placeholder images
  return `https://source.unsplash.com/1024x1792/?${keyword},luxury,aesthetic`;
}
