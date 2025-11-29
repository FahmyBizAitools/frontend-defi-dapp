# Pinterest Automation System for Luxury Beauty Affiliate Marketing

A comprehensive automation system that generates 30 days of Pinterest content for luxury beauty affiliate marketing campaigns.

## 🎯 Features

### Complete Campaign Generation
- **Product Scraping**: Automatically extracts product information from Digistore24 affiliate links
- **30-Day Content Calendar**: Generates unique content ideas for each day
- **AI Copywriting**: Creates SEO-optimized titles (3 variations per pin), descriptions, hashtags, and keywords
- **Pinterest Boards**: Generates 15 board ideas with descriptions and targeting
- **AI Image Generation**: Creates luxury aesthetic images using DALL-E 3
- **Export Options**: CSV, ZIP, and JSON exports for easy integration

### Dashboard Features
- Beautiful React-based UI with Tailwind CSS
- Interactive 30-day calendar view
- Pin preview with A/B title testing
- Board management interface
- One-click export and download

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- OpenAI API key (for DALL-E image generation)
- Digistore24 affiliate link

### Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5000`

## 📋 Usage Guide

### Step 1: Create Campaign
Fill in the campaign form with:
- **Brand Name**: Your brand name (e.g., LuxeBeautyFindsGlobal)
- **Niche**: Your niche (e.g., Luxury Beauty & Wellness)
- **Target Market**: Your audience (e.g., Women 20-45 in USA, UK, Canada)
- **Affiliate Link**: Your Digistore24 product link
- **Image Style**: Desired aesthetic (e.g., Luxury beauty aesthetic, soft lighting, minimalism)
- **Posting Frequency**: Schedule (e.g., 1 post per day for 30 days)

### Step 2: Generate Content
Click "Generate 30-Day Campaign" and wait 2-5 minutes while the system:
1. Scrapes product information
2. Generates 30 unique content ideas
3. Creates copywriting for each pin
4. Generates 15 Pinterest board ideas
5. Creates AI image prompts
6. Generates 30 AI images (or placeholders)

### Step 3: Review Content
Browse through the generated content:
- **Content Calendar**: View all 30 days of content
- **Pinterest Boards**: Review board suggestions
- **Export & Download**: Get your files

### Step 4: Export
Choose your export format:
- **CSV**: Import to Google Sheets or Excel
- **ZIP**: Complete package with all files
- **JSON**: Raw data for custom integrations

## 🎨 Content Structure

### Each Pin Includes:
- **3 Title Variations**:
  - SEO Long Tail Title
  - Benefit-Driven Title
  - Emotional Hook Title
- **Optimized Description** (400-450 characters)
- **10 Hashtags**
- **10 Keywords**
- **AI-Generated Image** (1024x1792 portrait)
- **Board Suggestion**
- **Theme & Emotional Trigger**

### Content Themes:
- Tips & Educational
- Product Reviews
- Transformations (Before/After)
- Daily Routines
- Aesthetic Product Shots

## 🔧 API Endpoints

### Generate Complete Campaign
```
POST /api/pinterest/generate-campaign
```
Body:
```json
{
  "brandName": "LuxeBeautyFindsGlobal",
  "niche": "Luxury Beauty & Wellness",
  "targetMarket": "Women 20-45 in USA, UK, Canada",
  "affiliateLink": "https://www.digistore24.com/...",
  "imageStyle": "Luxury beauty aesthetic, soft lighting, minimalism",
  "postingFrequency": "1 post per day for 30 days"
}
```

### Individual Services
- `POST /api/pinterest/scrape-product` - Scrape Digistore24 product
- `POST /api/pinterest/generate-content-ideas` - Generate 30 content ideas
- `POST /api/pinterest/generate-copywriting` - Generate pin copy
- `POST /api/pinterest/generate-boards` - Generate board ideas
- `POST /api/pinterest/generate-image-prompts` - Generate AI prompts
- `POST /api/pinterest/generate-images` - Generate AI images
- `POST /api/pinterest/export-sheets` - Export to CSV
- `POST /api/pinterest/export-zip` - Export to ZIP

## 📦 Project Structure

```
/vercel/sandbox/
├── server/
│   ├── index.ts                 # Express server
│   ├── routes.ts                # Route registration
│   ├── routes/
│   │   └── pinterest.ts         # Pinterest API routes
│   └── services/
│       ├── productScraper.ts    # Digistore24 scraper
│       ├── contentGenerator.ts  # Content idea generator
│       ├── copywritingEngine.ts # Copywriting generator
│       ├── boardGenerator.ts    # Board idea generator
│       ├── imagePromptGenerator.ts # AI prompt generator
│       ├── aiImageGenerator.ts  # DALL-E integration
│       └── exportService.ts     # Export functionality
├── client/
│   └── src/
│       ├── pages/
│       │   └── PinterestDashboard.tsx
│       └── components/
│           └── pinterest/
│               ├── CampaignForm.tsx
│               ├── ContentCalendar.tsx
│               ├── BoardsList.tsx
│               └── ExportControls.tsx
└── shared/
    └── schema.ts                # Database schema
```

## 🎯 Automation Blocks

### Block 1: Campaign Inputs
- Brand name, niche, target market
- Affiliate link, image style, posting frequency

### Block 2: Product Scraping
- Extracts product info from Digistore24
- Generates product benefits, USP, pain points

### Block 3: Content Ideas (30 Days)
- Unique content idea for each day
- Theme, visual concept, emotional trigger
- SEO keywords per pin

### Block 4: Copywriting
- 3 title variations per pin
- SEO-optimized descriptions
- Hashtags and keywords

### Block 5: Board Ideas (15 Boards)
- Board names and descriptions
- Target audience
- Content suggestions

### Block 6: AI Image Prompts
- Luxury aesthetic prompts
- Technical photography details
- Portrait ratio (2:3) for Pinterest

### Block 7: AI Image Generation
- DALL-E 3 integration
- High-quality 1024x1792 images
- Fallback to Unsplash placeholders

### Block 8: Export & Download
- CSV for Google Sheets
- ZIP with complete package
- JSON for custom integrations

## 🔐 Environment Variables

Required:
- `OPENAI_API_KEY` - For DALL-E image generation

Optional:
- `DATABASE_URL` - For data persistence
- `PUBLER_API_KEY` - For auto-scheduling
- `BUFFER_ACCESS_TOKEN` - For auto-scheduling
- `GOOGLE_SHEETS_*` - For Google Sheets integration

## 🎨 Image Generation

### With OpenAI API Key:
- Uses DALL-E 3 for high-quality images
- Portrait ratio (1024x1792) optimized for Pinterest
- Luxury aesthetic with professional photography style

### Without API Key:
- Falls back to Unsplash placeholder images
- Still maintains luxury aesthetic
- Keywords: luxury-beauty, skincare, cosmetics, spa

## 📊 Export Formats

### CSV Export
- Importable to Google Sheets
- Columns: Day, Titles (3), Description, Keywords, Hashtags, Theme, Image URL, etc.

### ZIP Export
Contains:
- `campaign-summary.json` - Campaign overview
- `content-plan.json` - Complete 30-day plan
- `pinterest-boards.json` - Board ideas
- `image-urls.txt` - All image URLs
- `README.md` - Campaign documentation

### JSON Export
- Raw campaign data
- All generated content
- Easy integration with other tools

## 🚀 Next Steps After Generation

1. **Import to Scheduling Tool**
   - Use Publer, Buffer, or Tailwind
   - Import CSV or use API integration

2. **Create Pinterest Boards**
   - Use the 15 generated board ideas
   - Create boards in your Pinterest account

3. **Download Images**
   - Download from provided URLs
   - Upload to Pinterest or scheduling tool

4. **Schedule Posts**
   - Follow your posting frequency
   - Use A/B testing with title variations

5. **Monitor Performance**
   - Track which themes perform best
   - Adjust strategy based on analytics

## 🎯 Best Practices

### Content Strategy
- Rotate between different themes
- Use all 15 boards for maximum reach
- Test different title variations
- Post consistently per schedule

### Pinterest Optimization
- Use all 10 hashtags per pin
- Include keywords in descriptions
- Create visually cohesive boards
- Engage with comments and repins

### Affiliate Marketing
- Disclose affiliate relationships
- Provide genuine value in content
- Focus on benefits, not just sales
- Build trust with audience

## 🐛 Troubleshooting

### Images Not Generating
- Check OpenAI API key is set correctly
- Verify API key has credits
- System will use placeholders if API fails

### Export Not Working
- Check `exports/` directory exists
- Verify write permissions
- Check browser download settings

### Campaign Generation Slow
- Normal: 2-5 minutes for complete campaign
- Includes 30 AI image generations
- Be patient during generation

## 📝 License

MIT License - Feel free to use for your affiliate marketing campaigns!

## 🤝 Support

For issues or questions:
1. Check this README
2. Review error messages in console
3. Verify environment variables
4. Check API key validity

---

**Generated with ❤️ for Luxury Beauty Affiliate Marketers**
