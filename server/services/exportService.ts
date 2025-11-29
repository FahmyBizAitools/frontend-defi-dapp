import fs from "fs";
import path from "path";
import archiver from "archiver";
import { createObjectCsvWriter } from "csv-writer";

interface Campaign {
  brandName: string;
  niche: string;
  targetMarket: string;
  affiliateLink: string;
  productInfo: any;
  contentIdeas: any[];
  copywriting: any[];
  boards: any[];
  imagePrompts: any[];
  images: any[];
  postingFrequency: string;
}

export async function exportToGoogleSheets(campaign: Campaign): Promise<string> {
  // Note: Full Google Sheets integration requires OAuth setup
  // For now, we'll create a CSV that can be imported to Google Sheets
  
  const timestamp = Date.now();
  const csvPath = path.join(process.cwd(), "exports", `pinterest-campaign-${timestamp}.csv`);

  // Ensure exports directory exists
  const exportsDir = path.join(process.cwd(), "exports");
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  // Prepare data for CSV
  const records = campaign.copywriting.map((copy, index) => {
    const idea = campaign.contentIdeas[index];
    const imagePrompt = campaign.imagePrompts[index];
    const image = campaign.images[index];

    return {
      Day: copy.day,
      Title_Main: copy.title_main,
      Title_A: copy.title_a,
      Title_B: copy.title_b,
      Description: copy.description,
      Keywords: copy.keywords.join(", "),
      Hashtags: copy.hashtags.join(" "),
      Theme: idea.tema,
      Visual_Idea: idea.visual,
      Emotional_Trigger: idea.trigger,
      AI_Image_Prompt: imagePrompt.prompt,
      Image_URL: image.url,
      Affiliate_Link: campaign.affiliateLink,
      Board_Suggestion: suggestBoard(idea.tema, campaign.boards),
    };
  });

  // Create CSV writer
  const csvWriter = createObjectCsvWriter({
    path: csvPath,
    header: [
      { id: "Day", title: "Day" },
      { id: "Title_Main", title: "Title Main (SEO)" },
      { id: "Title_A", title: "Title A (Benefit)" },
      { id: "Title_B", title: "Title B (Emotional)" },
      { id: "Description", title: "Description" },
      { id: "Keywords", title: "Keywords" },
      { id: "Hashtags", title: "Hashtags" },
      { id: "Theme", title: "Theme" },
      { id: "Visual_Idea", title: "Visual Idea" },
      { id: "Emotional_Trigger", title: "Emotional Trigger" },
      { id: "AI_Image_Prompt", title: "AI Image Prompt" },
      { id: "Image_URL", title: "Image URL" },
      { id: "Affiliate_Link", title: "Affiliate Link" },
      { id: "Board_Suggestion", title: "Suggested Board" },
    ],
  });

  await csvWriter.writeRecords(records);

  // Return the file path (in production, this would be a Google Sheets URL)
  return csvPath;
}

export async function exportToZip(campaign: Campaign): Promise<string> {
  const timestamp = Date.now();
  const zipPath = path.join(process.cwd(), "exports", `pinterest-campaign-${timestamp}.zip`);

  // Ensure exports directory exists
  const exportsDir = path.join(process.cwd(), "exports");
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  // Create write stream
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Maximum compression
  });

  return new Promise((resolve, reject) => {
    output.on("close", () => {
      console.log(`ZIP created: ${archive.pointer()} total bytes`);
      resolve(zipPath);
    });

    archive.on("error", (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Add campaign summary JSON
    const summary = {
      brandName: campaign.brandName,
      niche: campaign.niche,
      targetMarket: campaign.targetMarket,
      affiliateLink: campaign.affiliateLink,
      productInfo: campaign.productInfo,
      postingFrequency: campaign.postingFrequency,
      totalPins: campaign.copywriting.length,
      boards: campaign.boards,
    };

    archive.append(JSON.stringify(summary, null, 2), { name: "campaign-summary.json" });

    // Add content plan JSON
    const contentPlan = campaign.copywriting.map((copy, index) => {
      const idea = campaign.contentIdeas[index];
      const imagePrompt = campaign.imagePrompts[index];
      const image = campaign.images[index];

      return {
        day: copy.day,
        titles: {
          main: copy.title_main,
          benefit: copy.title_a,
          emotional: copy.title_b,
        },
        description: copy.description,
        keywords: copy.keywords,
        hashtags: copy.hashtags,
        theme: idea.tema,
        visualIdea: idea.visual,
        emotionalTrigger: idea.trigger,
        imagePrompt: imagePrompt.prompt,
        imageUrl: image.url,
        suggestedBoard: suggestBoard(idea.tema, campaign.boards),
      };
    });

    archive.append(JSON.stringify(contentPlan, null, 2), { name: "content-plan.json" });

    // Add boards JSON
    archive.append(JSON.stringify(campaign.boards, null, 2), { name: "pinterest-boards.json" });

    // Add README
    const readme = generateReadme(campaign);
    archive.append(readme, { name: "README.md" });

    // Note: In production, you would download actual images from URLs
    // For now, we'll create a text file with image URLs
    const imageUrls = campaign.images
      .map((img) => `Day ${img.day}: ${img.url}`)
      .join("\n");
    archive.append(imageUrls, { name: "image-urls.txt" });

    archive.finalize();
  });
}

function suggestBoard(theme: string, boards: any[]): string {
  const themeToBoard: Record<string, string> = {
    Tips: "Beauty Expert Tips",
    Review: "Luxury Beauty Essentials",
    Transformation: "Beauty Transformations",
    Routine: "Morning Glow Routines",
    "Aesthetic Product Shot": "Aesthetic Beauty Inspiration",
  };

  const boardName = themeToBoard[theme] || "Luxury Beauty Essentials";
  return boardName;
}

function generateReadme(campaign: Campaign): string {
  return `# Pinterest Campaign: ${campaign.brandName}

## Campaign Overview
- **Brand**: ${campaign.brandName}
- **Niche**: ${campaign.niche}
- **Target Market**: ${campaign.targetMarket}
- **Posting Frequency**: ${campaign.postingFrequency}

## Product Information
- **Product**: ${campaign.productInfo.nama_produk}
- **USP**: ${campaign.productInfo.USP_produk}
- **Target Audience**: ${campaign.productInfo.target_audience}

## Campaign Contents

### 📁 Files Included
1. **campaign-summary.json** - Complete campaign overview
2. **content-plan.json** - 30-day content calendar with all details
3. **pinterest-boards.json** - 15 board ideas with descriptions
4. **image-urls.txt** - All generated image URLs

### 📊 Campaign Statistics
- Total Pins: ${campaign.copywriting.length}
- Total Boards: ${campaign.boards.length}
- Content Themes: Tips, Reviews, Transformations, Routines, Aesthetic Shots

### 🎯 Next Steps
1. Import content-plan.json to your scheduling tool (Publer, Buffer, etc.)
2. Create the suggested Pinterest boards
3. Download images from the URLs provided
4. Schedule posts according to your posting frequency
5. Monitor performance and adjust strategy

### 📈 Best Practices
- Use A/B testing with the three title variations provided
- Rotate between different boards to maximize reach
- Engage with comments and repins
- Track which content themes perform best
- Adjust posting times based on audience engagement

## Support
For questions or assistance, refer to the campaign documentation or contact support.

---
Generated on: ${new Date().toLocaleDateString()}
Campaign ID: ${Date.now()}
`;
}
