import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";

interface CampaignFormProps {
  onCampaignGenerated: (campaign: any) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

export function CampaignForm({
  onCampaignGenerated,
  isGenerating,
  setIsGenerating,
}: CampaignFormProps) {
  const [formData, setFormData] = useState({
    brandName: "LuxeBeautyFindsGlobal",
    niche: "Luxury Beauty & Wellness",
    targetMarket: "Women 20-45 in USA, UK, and Canada",
    affiliateLink: "",
    imageStyle: "Luxury beauty aesthetic, soft lighting, minimalism, pastel tones",
    postingFrequency: "1 post per day for 30 days",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch("/api/pinterest/generate-campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate campaign");
      }

      const campaign = await response.json();
      onCampaignGenerated(campaign);
    } catch (error) {
      console.error("Error generating campaign:", error);
      alert("Failed to generate campaign. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="brandName">Brand Name</Label>
        <Input
          id="brandName"
          name="brandName"
          value={formData.brandName}
          onChange={handleChange}
          placeholder="e.g., LuxeBeautyFindsGlobal"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="niche">Niche</Label>
        <Input
          id="niche"
          name="niche"
          value={formData.niche}
          onChange={handleChange}
          placeholder="e.g., Luxury Beauty & Wellness"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetMarket">Target Market</Label>
        <Input
          id="targetMarket"
          name="targetMarket"
          value={formData.targetMarket}
          onChange={handleChange}
          placeholder="e.g., Women 20-45 in USA, UK, and Canada"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="affiliateLink">Affiliate Link (Digistore24)</Label>
        <Input
          id="affiliateLink"
          name="affiliateLink"
          value={formData.affiliateLink}
          onChange={handleChange}
          placeholder="https://www.digistore24.com/..."
          type="url"
          required
        />
        <p className="text-sm text-gray-500">
          Enter your Digistore24 product affiliate link
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageStyle">Image Style</Label>
        <Textarea
          id="imageStyle"
          name="imageStyle"
          value={formData.imageStyle}
          onChange={handleChange}
          placeholder="Describe your desired image aesthetic"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="postingFrequency">Posting Frequency</Label>
        <Input
          id="postingFrequency"
          name="postingFrequency"
          value={formData.postingFrequency}
          onChange={handleChange}
          placeholder="e.g., 1 post per day for 30 days"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Campaign...
          </>
        ) : (
          "Generate 30-Day Campaign"
        )}
      </Button>

      {isGenerating && (
        <div className="text-center text-sm text-gray-600">
          <p>This may take a few minutes...</p>
          <p className="mt-2">
            We're scraping product info, generating content ideas, creating
            copywriting, and generating AI images.
          </p>
        </div>
      )}
    </form>
  );
}
