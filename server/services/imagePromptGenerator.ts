import type { ContentIdea } from "./contentGenerator";

export interface ImagePrompt {
  day: number;
  prompt: string;
}

interface GenerateImagePromptsParams {
  contentIdeas: ContentIdea[];
  imageStyle: string;
}

export async function generateImagePrompts(
  params: GenerateImagePromptsParams
): Promise<ImagePrompt[]> {
  const { contentIdeas, imageStyle } = params;

  const prompts: ImagePrompt[] = contentIdeas.map((idea) => {
    const basePrompt = idea.visual;
    const enhancedPrompt = enhancePromptWithStyle(basePrompt, imageStyle, idea.tema);

    return {
      day: idea.day,
      prompt: enhancedPrompt,
    };
  });

  return prompts;
}

function enhancePromptWithStyle(
  baseVisual: string,
  imageStyle: string,
  tema: string
): string {
  // Add technical photography details for luxury aesthetic
  const technicalDetails = [
    "shot in portrait ratio 2:3",
    "professional photography",
    "high resolution 8K",
    "sharp focus",
    "depth of field",
  ].join(", ");

  // Style-specific enhancements
  const styleEnhancements = imageStyle.toLowerCase().includes("luxury")
    ? "luxury beauty aesthetic, soft diffused lighting, minimalist composition, pastel color palette with rose gold accents"
    : imageStyle;

  // Background suggestions based on theme
  const backgrounds: Record<string, string> = {
    Tips: "clean white marble background with subtle texture",
    Review: "soft beige linen background with natural shadows",
    Transformation: "gradient pastel background, pink to cream transition",
    Routine: "minimalist setup on white marble or light wood surface",
    "Aesthetic Product Shot": "elegant marble surface with soft shadows and natural light",
  };

  const background = backgrounds[tema] || "clean minimalist background";

  // Lighting specifications
  const lighting = "soft natural window light, golden hour glow, no harsh shadows, ethereal atmosphere";

  // Composition rules
  const composition = "rule of thirds, balanced composition, negative space, elegant arrangement";

  // Final enhanced prompt
  const enhancedPrompt = `${baseVisual}, ${styleEnhancements}, ${background}, ${lighting}, ${composition}, ${technicalDetails}, no text, no watermarks, professional product photography style`;

  return enhancedPrompt;
}
