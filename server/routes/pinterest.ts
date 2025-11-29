import { Router } from "express";
import { scrapeDigistore24Product } from "../services/productScraper";
import { generateContentIdeas } from "../services/contentGenerator";
import { generateCopywriting } from "../services/copywritingEngine";
import { generateBoardIdeas } from "../services/boardGenerator";
import { generateImagePrompts } from "../services/imagePromptGenerator";
import { generateAIImages } from "../services/aiImageGenerator";
import { exportToGoogleSheets, exportToZip } from "../services/exportService";

const router = Router();

// Block 2: Scrape Digistore24 product
router.post("/scrape-product", async (req, res) => {
  try {
    const { affiliateLink } = req.body;
    
    if (!affiliateLink) {
      return res.status(400).json({ error: "Affiliate link is required" });
    }

    const productData = await scrapeDigistore24Product(affiliateLink);
    res.json(productData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Block 3: Generate 30 content ideas
router.post("/generate-content-ideas", async (req, res) => {
  try {
    const { brandName, niche, targetMarket, productInfo } = req.body;
    
    const contentIdeas = await generateContentIdeas({
      brandName,
      niche,
      targetMarket,
      productInfo,
    });
    
    res.json(contentIdeas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Block 4: Generate copywriting for all 30 days
router.post("/generate-copywriting", async (req, res) => {
  try {
    const { contentIdeas, productInfo, affiliateLink } = req.body;
    
    const copywriting = await generateCopywriting({
      contentIdeas,
      productInfo,
      affiliateLink,
    });
    
    res.json(copywriting);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Block 5: Generate board ideas
router.post("/generate-boards", async (req, res) => {
  try {
    const { niche, productInfo } = req.body;
    
    const boards = await generateBoardIdeas({ niche, productInfo });
    res.json(boards);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Block 6: Generate AI image prompts
router.post("/generate-image-prompts", async (req, res) => {
  try {
    const { contentIdeas, imageStyle } = req.body;
    
    const prompts = await generateImagePrompts({ contentIdeas, imageStyle });
    res.json(prompts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Block 7: Generate AI images
router.post("/generate-images", async (req, res) => {
  try {
    const { imagePrompts, imageStyle } = req.body;
    
    const images = await generateAIImages({ imagePrompts, imageStyle });
    res.json(images);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Complete campaign generation
router.post("/generate-campaign", async (req, res) => {
  try {
    const {
      brandName,
      niche,
      targetMarket,
      affiliateLink,
      imageStyle,
      postingFrequency,
    } = req.body;

    // Step 1: Scrape product
    const productInfo = await scrapeDigistore24Product(affiliateLink);

    // Step 2: Generate content ideas
    const contentIdeas = await generateContentIdeas({
      brandName,
      niche,
      targetMarket,
      productInfo,
    });

    // Step 3: Generate copywriting
    const copywriting = await generateCopywriting({
      contentIdeas,
      productInfo,
      affiliateLink,
    });

    // Step 4: Generate boards
    const boards = await generateBoardIdeas({ niche, productInfo });

    // Step 5: Generate image prompts
    const imagePrompts = await generateImagePrompts({ contentIdeas, imageStyle });

    // Step 6: Generate AI images
    const images = await generateAIImages({ imagePrompts, imageStyle });

    const campaign = {
      brandName,
      niche,
      targetMarket,
      affiliateLink,
      productInfo,
      contentIdeas,
      copywriting,
      boards,
      imagePrompts,
      images,
      postingFrequency,
    };

    res.json(campaign);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Export to Google Sheets
router.post("/export-sheets", async (req, res) => {
  try {
    const { campaign } = req.body;
    
    const sheetUrl = await exportToGoogleSheets(campaign);
    res.json({ sheetUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Export to ZIP
router.post("/export-zip", async (req, res) => {
  try {
    const { campaign } = req.body;
    
    const zipPath = await exportToZip(campaign);
    res.download(zipPath);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
