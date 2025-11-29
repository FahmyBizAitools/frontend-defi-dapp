import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";

interface ContentCalendarProps {
  campaign: any;
}

export function ContentCalendar({ campaign }: ContentCalendarProps) {
  const [selectedDay, setSelectedDay] = useState(1);

  const selectedContent = campaign.copywriting.find(
    (copy: any) => copy.day === selectedDay
  );
  const selectedIdea = campaign.contentIdeas.find(
    (idea: any) => idea.day === selectedDay
  );
  const selectedImage = campaign.images.find(
    (img: any) => img.day === selectedDay
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>30-Day Calendar</CardTitle>
          <CardDescription>Select a day to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-5 gap-2">
              {campaign.copywriting.map((copy: any) => (
                <button
                  key={copy.day}
                  onClick={() => setSelectedDay(copy.day)}
                  className={`
                    aspect-square rounded-lg border-2 flex items-center justify-center
                    font-semibold transition-all
                    ${
                      selectedDay === copy.day
                        ? "border-purple-600 bg-purple-100 text-purple-700"
                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                    }
                  `}
                >
                  {copy.day}
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Content Details */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Day {selectedDay} Content</CardTitle>
          <CardDescription>{selectedIdea?.judul}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Preview */}
          {selectedImage && (
            <div className="space-y-2">
              <h3 className="font-semibold">Image Preview</h3>
              <div className="relative aspect-[2/3] max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg">
                <img
                  src={selectedImage.url}
                  alt={`Day ${selectedDay}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Content Details */}
          <div className="space-y-4">
            <div>
              <Badge className="mb-2">{selectedIdea?.tema}</Badge>
              <Badge variant="outline" className="ml-2">
                {selectedIdea?.trigger}
              </Badge>
            </div>

            {/* Title Variations */}
            <Tabs defaultValue="main" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="main">SEO Title</TabsTrigger>
                <TabsTrigger value="benefit">Benefit Title</TabsTrigger>
                <TabsTrigger value="emotional">Emotional Title</TabsTrigger>
              </TabsList>

              <TabsContent value="main" className="mt-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium">{selectedContent?.title_main}</p>
                </div>
              </TabsContent>

              <TabsContent value="benefit" className="mt-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-medium">{selectedContent?.title_a}</p>
                </div>
              </TabsContent>

              <TabsContent value="emotional" className="mt-4">
                <div className="p-4 bg-pink-50 rounded-lg">
                  <p className="font-medium">{selectedContent?.title_b}</p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold">Pin Description</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">{selectedContent?.description}</p>
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <h3 className="font-semibold">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {selectedContent?.keywords.map((keyword: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <h3 className="font-semibold">Hashtags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedContent?.hashtags.map((hashtag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-blue-600">
                    {hashtag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Visual Idea */}
            <div className="space-y-2">
              <h3 className="font-semibold">Visual Concept</h3>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm italic">{selectedIdea?.visual}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
