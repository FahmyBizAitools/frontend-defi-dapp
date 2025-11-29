import { useState } from "react";
import { CampaignForm } from "../components/pinterest/CampaignForm";
import { ContentCalendar } from "../components/pinterest/ContentCalendar";
import { BoardsList } from "../components/pinterest/BoardsList";
import { ExportControls } from "../components/pinterest/ExportControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export default function PinterestDashboard() {
  const [campaign, setCampaign] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCampaignGenerated = (generatedCampaign: any) => {
    setCampaign(generatedCampaign);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Pinterest Automation System
          </h1>
          <p className="text-gray-600">
            Generate 30 days of luxury beauty content for your affiliate marketing campaign
          </p>
        </div>

        {!campaign ? (
          <Card className="max-w-4xl mx-auto shadow-xl">
            <CardHeader>
              <CardTitle>Create Your Campaign</CardTitle>
              <CardDescription>
                Fill in your brand details to generate a complete 30-day Pinterest content strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CampaignForm
                onCampaignGenerated={handleCampaignGenerated}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Campaign Summary */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{campaign.brandName}</span>
                  <button
                    onClick={() => setCampaign(null)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Create New Campaign
                  </button>
                </CardTitle>
                <CardDescription>
                  {campaign.niche} • {campaign.targetMarket}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">30</div>
                    <div className="text-sm text-gray-600">Content Ideas</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">15</div>
                    <div className="text-sm text-gray-600">Pinterest Boards</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">90</div>
                    <div className="text-sm text-gray-600">Title Variations</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="calendar">Content Calendar</TabsTrigger>
                <TabsTrigger value="boards">Pinterest Boards</TabsTrigger>
                <TabsTrigger value="export">Export & Download</TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="mt-6">
                <ContentCalendar campaign={campaign} />
              </TabsContent>

              <TabsContent value="boards" className="mt-6">
                <BoardsList boards={campaign.boards} />
              </TabsContent>

              <TabsContent value="export" className="mt-6">
                <ExportControls campaign={campaign} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
