import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Download, FileSpreadsheet, FileArchive, Loader2 } from "lucide-react";

interface ExportControlsProps {
  campaign: any;
}

export function ExportControls({ campaign }: ExportControlsProps) {
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingZIP, setIsExportingZIP] = useState(false);

  const handleExportCSV = async () => {
    setIsExportingCSV(true);
    try {
      const response = await fetch("/api/pinterest/export-sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ campaign }),
      });

      if (!response.ok) {
        throw new Error("Failed to export to CSV");
      }

      const data = await response.json();
      alert(`CSV exported successfully! Path: ${data.sheetUrl}`);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export CSV. Please try again.");
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleExportZIP = async () => {
    setIsExportingZIP(true);
    try {
      const response = await fetch("/api/pinterest/export-zip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ campaign }),
      });

      if (!response.ok) {
        throw new Error("Failed to export to ZIP");
      }

      // Create a blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pinterest-campaign-${campaign.brandName}-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting ZIP:", error);
      alert("Failed to export ZIP. Please try again.");
    } finally {
      setIsExportingZIP(false);
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(campaign, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pinterest-campaign-${campaign.brandName}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <FileSpreadsheet className="h-8 w-8 text-green-600 mb-2" />
            <CardTitle>Export to CSV</CardTitle>
            <CardDescription>
              Download content calendar as CSV for Google Sheets import
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleExportCSV}
              disabled={isExportingCSV}
              className="w-full"
              variant="outline"
            >
              {isExportingCSV ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileArchive className="h-8 w-8 text-blue-600 mb-2" />
            <CardTitle>Export to ZIP</CardTitle>
            <CardDescription>
              Download complete campaign package with all files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleExportZIP}
              disabled={isExportingZIP}
              className="w-full"
              variant="outline"
            >
              {isExportingZIP ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export ZIP
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Download className="h-8 w-8 text-purple-600 mb-2" />
            <CardTitle>Download JSON</CardTitle>
            <CardDescription>
              Download raw campaign data in JSON format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleDownloadJSON}
              className="w-full"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Download JSON
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Summary</CardTitle>
          <CardDescription>Overview of your generated content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-3xl font-bold text-pink-600">
                  {campaign.copywriting.length}
                </div>
                <div className="text-sm text-gray-600">Total Pins</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {campaign.boards.length}
                </div>
                <div className="text-sm text-gray-600">Pinterest Boards</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {campaign.images.length}
                </div>
                <div className="text-sm text-gray-600">AI Images</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {campaign.copywriting.length * 3}
                </div>
                <div className="text-sm text-gray-600">Title Variations</div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <h3 className="font-semibold">Product Information</h3>
              <p className="text-sm">
                <strong>Product:</strong> {campaign.productInfo.nama_produk}
              </p>
              <p className="text-sm">
                <strong>USP:</strong> {campaign.productInfo.USP_produk}
              </p>
              <p className="text-sm">
                <strong>Target:</strong> {campaign.productInfo.target_audience}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
              <h3 className="font-semibold mb-2">Next Steps</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Export your content calendar (CSV or ZIP)</li>
                <li>Create the suggested Pinterest boards</li>
                <li>Import content to your scheduling tool (Publer/Buffer)</li>
                <li>Schedule posts according to your frequency</li>
                <li>Monitor performance and adjust strategy</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
