import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useWeb3 } from "@/hooks/use-web3";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Settings as SettingsIcon, Bell, Globe, Shield, Palette, Database, Download } from "lucide-react";
import { Link } from "wouter";

export default function Settings() {
  const { account, disconnectWallet } = useWeb3();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [currency, setCurrency] = useState("usd");
  const [theme, setTheme] = useState("dark");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [slippageTolerance, setSlippageTolerance] = useState("0.5");

  const handleSaveSettings = () => {
    // In a real app, these would be saved to localStorage or a backend
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully",
    });
  };

  const handleExportData = () => {
    const data = {
      account,
      settings: {
        notifications,
        priceAlerts,
        currency,
        theme,
        autoRefresh,
        slippageTolerance,
      },
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `web3-dashboard-settings-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your settings have been downloaded",
    });
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all stored data? This action cannot be undone.")) {
      localStorage.clear();
      toast({
        title: "Data Cleared",
        description: "All local data has been removed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2" data-testid="button-back">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl glass-effect glow-effect">
                <SettingsIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-muted-foreground text-sm">
                  Customize your Web3 dashboard experience
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6">
          {/* Notifications */}
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified about important events</p>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                  data-testid="switch-notifications"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Price Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify when prices reach targets</p>
                </div>
                <Switch 
                  checked={priceAlerts} 
                  onCheckedChange={setPriceAlerts}
                  data-testid="switch-price-alerts"
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium mb-2 block">Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger data-testid="select-theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger data-testid="select-currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trading */}
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Trading Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Auto-refresh Balances</Label>
                  <p className="text-sm text-muted-foreground">Automatically update balances every 30 seconds</p>
                </div>
                <Switch 
                  checked={autoRefresh} 
                  onCheckedChange={setAutoRefresh}
                  data-testid="switch-auto-refresh"
                />
              </div>

              <div>
                <Label className="font-medium mb-2 block">Slippage Tolerance (%)</Label>
                <Input
                  type="number"
                  value={slippageTolerance}
                  onChange={(e) => setSlippageTolerance(e.target.value)}
                  placeholder="0.5"
                  className="max-w-32"
                  data-testid="input-slippage"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum price movement tolerance for trades
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="font-medium mb-1">Connected Account</p>
                  <p className="text-sm text-muted-foreground">
                    {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "No wallet connected"}
                  </p>
                </div>
                
                {account && (
                  <Button 
                    variant="outline" 
                    onClick={disconnectWallet}
                    className="w-full justify-center"
                    data-testid="button-disconnect-wallet"
                  >
                    Disconnect Wallet
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Management & Privacy
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Manage your wallet data, backups, and privacy settings. All data is stored locally on your device.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Export Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Download className="w-4 h-4 text-blue-400" />
                  <h4 className="font-medium">Export & Backup</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleExportData}
                    className="gap-2 justify-start h-auto p-4 glass-effect hover:bg-accent"
                    data-testid="button-export-settings"
                  >
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2 mb-1">
                        <Download className="w-4 h-4" />
                        <span className="font-medium">Export Settings</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-left">
                        Download app preferences and configurations
                      </span>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const watchlistData = {
                        watchlist: JSON.parse(localStorage.getItem("web3-watchlist") || "[]"),
                        timestamp: new Date().toISOString(),
                        account
                      };
                      const blob = new Blob([JSON.stringify(watchlistData, null, 2)], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `watchlist-backup-${Date.now()}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      toast({ title: "Watchlist Exported", description: "Token watchlist backup downloaded" });
                    }}
                    className="gap-2 justify-start h-auto p-4 glass-effect hover:bg-accent"
                    data-testid="button-export-watchlist"
                  >
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2 mb-1">
                        <Database className="w-4 h-4" />
                        <span className="font-medium">Export Watchlist</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-left">
                        Backup your token watchlist and addresses
                      </span>
                    </div>
                  </Button>
                </div>

                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-400 mb-1">Privacy Notice</p>
                      <p className="text-muted-foreground">
                        All exports contain only locally stored data. No private keys or sensitive wallet information is included.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Import Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-medium">Import & Restore</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const data = JSON.parse(event.target?.result as string);
                              if (data.settings) {
                                // Restore settings
                                if (confirm("This will restore your settings. Continue?")) {
                                  setNotifications(data.settings.notifications ?? true);
                                  setPriceAlerts(data.settings.priceAlerts ?? false);
                                  setCurrency(data.settings.currency ?? "usd");
                                  setTheme(data.settings.theme ?? "dark");
                                  setAutoRefresh(data.settings.autoRefresh ?? true);
                                  setSlippageTolerance(data.settings.slippageTolerance ?? "0.5");
                                  toast({ title: "Settings Restored", description: "Your preferences have been restored" });
                                }
                              }
                            } catch {
                              toast({ title: "Import Failed", description: "Invalid file format", variant: "destructive" });
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      data-testid="input-import-settings"
                    />
                    <Button 
                      variant="outline"
                      className="gap-2 justify-start h-auto p-4 glass-effect hover:bg-accent w-full pointer-events-none"
                    >
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2 mb-1">
                          <Download className="w-4 h-4 rotate-180" />
                          <span className="font-medium">Import Settings</span>
                        </div>
                        <span className="text-xs text-muted-foreground text-left">
                          Restore preferences from backup file
                        </span>
                      </div>
                    </Button>
                  </div>

                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const data = JSON.parse(event.target?.result as string);
                              if (data.watchlist && Array.isArray(data.watchlist)) {
                                if (confirm("This will replace your current watchlist. Continue?")) {
                                  localStorage.setItem("web3-watchlist", JSON.stringify(data.watchlist));
                                  toast({ title: "Watchlist Restored", description: "Token watchlist has been restored" });
                                  setTimeout(() => window.location.reload(), 1000);
                                }
                              }
                            } catch {
                              toast({ title: "Import Failed", description: "Invalid watchlist file", variant: "destructive" });
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      data-testid="input-import-watchlist"
                    />
                    <Button 
                      variant="outline"
                      className="gap-2 justify-start h-auto p-4 glass-effect hover:bg-accent w-full pointer-events-none"
                    >
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2 mb-1">
                          <Database className="w-4 h-4" />
                          <span className="font-medium">Import Watchlist</span>
                        </div>
                        <span className="text-xs text-muted-foreground text-left">
                          Restore token watchlist from backup
                        </span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Data Storage Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <h4 className="font-medium">Storage Information</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-lg glass-effect">
                    <div className="font-medium mb-1">Local Storage</div>
                    <div className="text-muted-foreground">
                      Settings, preferences, and watchlist are stored locally in your browser
                    </div>
                  </div>
                  <div className="p-3 rounded-lg glass-effect">
                    <div className="font-medium mb-1">No Server Data</div>
                    <div className="text-muted-foreground">
                      No personal data is sent to external servers or third parties
                    </div>
                  </div>
                  <div className="p-3 rounded-lg glass-effect">
                    <div className="font-medium mb-1">Wallet Security</div>
                    <div className="text-muted-foreground">
                      Private keys never leave your wallet extension
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="space-y-4 border-t border-destructive/20 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-destructive" />
                  <h4 className="font-medium text-destructive">Danger Zone</h4>
                </div>
                
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-destructive">Clear All Local Data</div>
                      <div className="text-sm text-muted-foreground">
                        Permanently delete all settings, watchlist, and cached data. This action cannot be undone.
                      </div>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={handleClearData}
                      className="ml-4 gap-2"
                      data-testid="button-clear-all-data"
                    >
                      <Database className="w-4 h-4" />
                      Clear Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveSettings}
              className="px-8"
              data-testid="button-save-settings"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}