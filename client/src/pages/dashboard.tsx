import React, { useState, useMemo, Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Wallet, 
  LogIn, 
  Power, 
  Copy, 
  ExternalLink, 
  Loader2, 
  Plus, 
  Trash2, 
  TrendingUp, 
  RefreshCw,
  Send,
  Download,
  Search,
  Home,
  BarChart3,
  Clock,
  Settings,
  Inbox,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Link } from "wouter";
// Lazy load heavy chart component
const LazyChart = lazy(() => import("@/components/LazyChart"));
import { useWeb3 } from "@/hooks/use-web3";
import { useToast } from "@/hooks/use-toast";
import { shortAddr, addrUrl, tokenUrl, fmt, fmtFiat, formatPercentage, isValidAddress, POPULAR_TOKENS } from "@/lib/web3-utils";

export default function Dashboard() {
  const {
    account,
    chainId,
    chainMeta,
    nativeBalance,
    nativePrice,
    nativeUsdValue,
    connecting,
    isConnected,
    tokens,
    watchlist,
    sparklineData,
    portfolioStats,
    connectWallet,
    disconnectWallet,
    addToken,
    removeToken,
    refreshBalances,
  } = useWeb3();

  const { toast } = useToast();
  const [tokenAddress, setTokenAddress] = useState("");
  const [isAddingToken, setIsAddingToken] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'send' | 'swap' | 'remove-token' | 'clear-data';
    title: string;
    description: string;
    action: () => void;
    data?: any;
    variant?: 'default' | 'destructive';
  } | null>(null);

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive",
      });
    }
  };

  // Show confirmation modal
  const showConfirmation = (action: typeof pendingAction) => {
    setPendingAction(action);
    setShowConfirmModal(true);
  };

  // Handle confirmed action
  const handleConfirmedAction = () => {
    if (pendingAction) {
      pendingAction.action();
      setShowConfirmModal(false);
      setPendingAction(null);
    }
  };

  // Enhanced input validation
  const validateTokenAddress = (address: string): { isValid: boolean; error?: string } => {
    if (!address.trim()) {
      return { isValid: false, error: "Contract address is required" };
    }
    
    if (!address.startsWith("0x")) {
      return { isValid: false, error: "Address must start with 0x" };
    }
    
    if (address.length !== 42) {
      return { isValid: false, error: "Address must be 42 characters long" };
    }
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return { isValid: false, error: "Address contains invalid characters" };
    }

    if (!isValidAddress(address)) {
      return { isValid: false, error: "Invalid Ethereum address format" };
    }

    // Check if already in watchlist
    if (watchlist.some(addr => addr.toLowerCase() === address.toLowerCase())) {
      return { isValid: false, error: "Token already in watchlist" };
    }

    return { isValid: true };
  };

  // Handle add token with validation
  const handleAddToken = async () => {
    const validation = validateTokenAddress(tokenAddress);
    
    if (!validation.isValid) {
      toast({
        title: "Invalid Address",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    // Show confirmation modal for adding token
    showConfirmation({
      type: 'send',
      title: 'Add Token to Watchlist',
      description: `Are you sure you want to add this token (${tokenAddress}) to your watchlist? This will fetch token details and current price.`,
      action: async () => {
        setIsAddingToken(true);
        const success = await addToken(tokenAddress);
        if (success) {
          setTokenAddress("");
        }
        setIsAddingToken(false);
      },
      variant: 'default'
    });
  };

  // Handle popular token selection
  const handlePopularToken = async (address: string) => {
    setIsAddingToken(true);
    await addToken(address);
    setIsAddingToken(false);
  };

  // Filter tokens
  const filteredTokens = useMemo(() => {
    let filtered = Object.entries(tokens);

    if (searchTerm) {
      filtered = filtered.filter(([_, token]) =>
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilter !== "all") {
      // Add filter logic for stablecoins, defi, nft etc.
      const stablecoins = ["USDC", "USDT", "DAI", "FRAX"];
      const defiTokens = ["UNI", "COMP", "AAVE", "SUSHI", "CRV"];
      
      switch (selectedFilter) {
        case "stablecoins":
          filtered = filtered.filter(([_, token]) => 
            stablecoins.includes(token.symbol.toUpperCase())
          );
          break;
        case "defi":
          filtered = filtered.filter(([_, token]) => 
            defiTokens.includes(token.symbol.toUpperCase())
          );
          break;
      }
    }

    return filtered;
  }, [tokens, searchTerm, selectedFilter]);

  // Format sparkline data for chart
  const chartData = useMemo(() => {
    return sparklineData.map(point => ({
      x: new Date(point.timestamp).toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      }),
      y: point.price,
    }));
  }, [sparklineData]);

  // Get popular tokens for current chain
  const popularTokens = chainId ? POPULAR_TOKENS[chainId] || [] : [];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl glass-effect glow-effect">
              <Wallet className="w-7 h-7 text-primary" data-testid="wallet-icon" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Web3 Dashboard
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Professional wallet management • Powered by ethers.js
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 mr-4">
              <Link href="/">
                <Button variant="ghost" className="gap-2 px-4 py-2" data-testid="nav-desktop-dashboard">
                  <Home className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="ghost" className="gap-2 px-4 py-2" data-testid="nav-desktop-analytics">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Button>
              </Link>
              <Link href="/history">
                <Button variant="ghost" className="gap-2 px-4 py-2" data-testid="nav-desktop-history">
                  <Clock className="w-4 h-4" />
                  History
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" className="gap-2 px-4 py-2" data-testid="nav-desktop-settings">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </Link>
            </div>

            {/* Network Badge */}
            {chainMeta && (
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl glass-effect" data-testid="network-badge">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium">{chainMeta.name}</span>
              </div>
            )}
            
            {/* Connect/Disconnect Button */}
            {isConnected ? (
              <Button 
                variant="secondary" 
                onClick={disconnectWallet}
                className="px-6 py-3 rounded-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                data-testid="button-disconnect"
              >
                <Power className="w-4 h-4" />
                Disconnect
              </Button>
            ) : (
              <Button 
                onClick={connectWallet}
                disabled={connecting}
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200 flex items-center gap-2"
                data-testid="button-connect"
              >
                {connecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {connecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </header>

        {connecting ? (
          /* Loading State with Skeleton */
          <div className="animate-fade-in">
            <div className="text-center py-20 mb-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full glass-effect glow-effect flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Connecting Wallet...</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Please check your wallet extension and approve the connection request.
              </p>
            </div>

            {/* Loading Skeleton for Dashboard Content */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <Card className="glass-effect border-0">
                  <CardHeader className="pb-0">
                    <div className="h-6 bg-muted/30 rounded animate-pulse mb-4" />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="p-4 rounded-xl glass-effect space-y-3">
                        <div className="h-4 bg-muted/20 rounded animate-pulse" />
                        <div className="h-8 bg-muted/30 rounded animate-pulse" />
                      </div>
                      <div className="p-4 rounded-xl glass-effect space-y-3">
                        <div className="h-4 bg-muted/20 rounded animate-pulse" />
                        <div className="h-8 bg-muted/30 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-64 bg-muted/10 rounded-xl animate-pulse mb-4" />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="glass-effect border-0">
                  <CardHeader>
                    <div className="h-6 bg-muted/30 rounded animate-pulse" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-12 bg-muted/20 rounded-lg animate-pulse" />
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass-effect border-0">
                  <CardHeader>
                    <div className="h-6 bg-muted/30 rounded animate-pulse" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted/30 animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted/20 rounded animate-pulse" />
                        <div className="h-3 bg-muted/10 rounded animate-pulse w-2/3" />
                      </div>
                    </div>
                    <div className="h-10 bg-muted/20 rounded-lg animate-pulse" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : !isConnected ? (
          /* Not Connected State */
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full glass-effect glow-effect flex items-center justify-center">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Connect your Web3 wallet to start managing your portfolio, tracking tokens, and monitoring your DeFi positions.
            </p>
            <Button 
              onClick={connectWallet}
              disabled={connecting}
              size="lg"
              className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200 disabled:hover:scale-100"
              data-testid="button-connect-main"
            >
              {connecting ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Wallet className="w-5 h-5 mr-2" />
              )}
              {connecting ? "Connecting..." : "Get Started"}
            </Button>
          </div>
        ) : (
          <>
            {/* Main Wallet Overview */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Account Balance Card */}
              <div className="lg:col-span-2">
                <Card className="glass-effect glow-effect animate-slide-up border-0">
                  <CardHeader className="pb-0">
                    <CardTitle className="flex items-center justify-between">
                      <span>Portfolio Overview</span>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => copyToClipboard(account!)}
                          className="gap-2 glass-effect hover:bg-accent"
                          data-testid="button-copy-address"
                        >
                          <Copy className="w-3 h-3" />
                          {shortAddr(account || "")}
                        </Button>
                        {chainId && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            asChild
                            className="gap-2 glass-effect hover:bg-accent"
                            data-testid="button-explorer"
                          >
                            <a href={addrUrl(chainId, account!)} target="_blank" rel="noreferrer">
                              <ExternalLink className="w-3 h-3" />
                              Explorer
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {/* Balance Display */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                        <div className="text-sm text-muted-foreground mb-2">
                          Native Balance ({chainMeta?.native || "ETH"})
                        </div>
                        <div className="text-3xl font-bold text-foreground" data-testid="text-native-balance">
                          {fmt.format(Number(nativeBalance))}
                        </div>
                        <div className="text-lg text-muted-foreground mt-1" data-testid="text-native-usd">
                          {nativeUsdValue ? fmtFiat.format(nativeUsdValue) : "—"}
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                        <div className="text-sm text-muted-foreground mb-2">Total Portfolio</div>
                        <div className="text-3xl font-bold text-foreground" data-testid="text-total-portfolio">
                          {fmtFiat.format(portfolioStats.totalValue)}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 text-sm font-medium">
                            {formatPercentage(portfolioStats.change24h)}
                          </span>
                          <span className="text-muted-foreground text-sm">24h</span>
                        </div>
                      </div>
                    </div>

                    {/* Price Chart */}
                    <div>
                      <div className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Price Chart (7 days)
                      </div>
                      <div className="h-32 rounded-xl glass-effect p-4">
                        {chartData.length > 0 ? (
                          <Suspense fallback={
                            <div className="flex items-center justify-center h-full">
                              <div className="space-y-2 w-full">
                                <div className="h-4 bg-muted/30 rounded animate-pulse" />
                                <div className="h-32 bg-muted/20 rounded animate-pulse" />
                                <div className="h-4 bg-muted/10 rounded animate-pulse w-2/3" />
                              </div>
                            </div>
                          }>
                            <LazyChart chartData={chartData} />
                          </Suspense>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Network Info */}
              <div className="space-y-4">
                <Card className="glass-effect animate-slide-up border-0">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => showConfirmation({
                        type: 'send',
                        title: 'Send Tokens',
                        description: 'Are you sure you want to proceed with sending tokens? Make sure you have entered the correct recipient address and amount.',
                        action: () => {
                          toast({
                            title: "Send Tokens",
                            description: "Feature coming soon! Use your wallet to send tokens.",
                          });
                        },
                        variant: 'default'
                      })}
                      className="w-full justify-start gap-3 glass-effect hover:bg-accent hover:scale-[1.02] transition-all duration-200"
                      variant="ghost"
                      data-testid="button-send"
                    >
                      <Send className="w-5 h-5 text-primary" />
                      Send Tokens
                    </Button>
                    <Button 
                      onClick={() => {
                        if (account) {
                          copyToClipboard(account);
                        } else {
                          toast({
                            title: "Connect Wallet",
                            description: "Please connect your wallet first",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="w-full justify-start gap-3 glass-effect hover:bg-accent hover:scale-[1.02] transition-all duration-200"
                      variant="ghost"
                      data-testid="button-receive"
                    >
                      <Download className="w-5 h-5 text-emerald-400" />
                      Receive
                    </Button>
                    <Button 
                      onClick={() => showConfirmation({
                        type: 'swap',
                        title: 'Swap Tokens',
                        description: 'This will redirect you to a decentralized exchange (DEX). Always verify the exchange URL and token addresses before swapping.',
                        action: () => {
                          toast({
                            title: "Swap Tokens",
                            description: "Feature coming soon! Visit a DEX like Uniswap to swap tokens.",
                          });
                        },
                        variant: 'default'
                      })}
                      className="w-full justify-start gap-3 glass-effect hover:bg-accent hover:scale-[1.02] transition-all duration-200"
                      variant="ghost"
                      data-testid="button-swap"
                    >
                      <RefreshCw className="w-5 h-5 text-amber-400" />
                      Swap
                    </Button>
                  </CardContent>
                </Card>

                {/* Network Info */}
                {chainMeta && (
                  <Card className="glass-effect border-0">
                    <CardHeader>
                      <CardTitle>Network</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {chainMeta.native === "ETH" ? "Ξ" : chainMeta.native.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium" data-testid="text-network-name">{chainMeta.name}</div>
                          <div className="text-sm text-muted-foreground">Chain ID: {chainId}</div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          toast({
                            title: "Network Switching",
                            description: "Please use your wallet to switch networks",
                          });
                        }}
                        className="w-full rounded-lg border hover:bg-accent transition-colors text-sm"
                        variant="outline"
                        data-testid="button-switch-network"
                      >
                        Switch Network
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Token Watchlist Section */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Add Token Form */}
              <Card className="glass-effect animate-slide-up border-0">
                <CardHeader>
                  <CardTitle>Add Token to Watchlist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Contract Address
                    </Label>
                    <div className="relative">
                      <Input
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                        placeholder="0x..."
                        className="pr-20 rounded-xl bg-input border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                        data-testid="input-token-address"
                      />
                      <Button
                        onClick={handleAddToken}
                        disabled={isAddingToken || !tokenAddress.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                        data-testid="button-add-token"
                      >
                        {isAddingToken ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  {/* Popular Tokens Quick Add */}
                  {popularTokens.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-3">Popular Tokens</div>
                      <div className="flex flex-wrap gap-2">
                        {popularTokens.map((token) => (
                          <Button
                            key={token.address}
                            onClick={() => handlePopularToken(token.address)}
                            disabled={isAddingToken}
                            variant="outline"
                            size="sm"
                            className="glass-effect hover:bg-accent"
                            data-testid={`button-popular-${token.symbol.toLowerCase()}`}
                          >
                            {token.symbol}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Token Search & Filter */}
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle>Filter & Search</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search tokens..."
                      className="pl-10 rounded-xl bg-input border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                      data-testid="input-search-tokens"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {["all", "stablecoins", "defi", "nft"].map((filter) => (
                      <Button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        variant={selectedFilter === filter ? "default" : "outline"}
                        size="sm"
                        className={selectedFilter === filter ? "bg-primary text-primary-foreground" : "glass-effect hover:bg-accent"}
                        data-testid={`button-filter-${filter}`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Token Holdings List */}
            <Card className="glass-effect animate-slide-up border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Token Holdings</span>
                  <Button
                    onClick={refreshBalances}
                    variant="outline"
                    size="sm"
                    className="gap-2 glass-effect hover:bg-accent"
                    data-testid="button-refresh-balances"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Native Token Row */}
                {chainMeta && (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-accent/50 transition-all duration-200 group mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center font-bold text-white">
                        {chainMeta.native === "ETH" ? "Ξ" : chainMeta.native.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{chainMeta.name}</div>
                        <div className="text-sm text-muted-foreground">{chainMeta.native}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground" data-testid="text-token-balance-native">
                        {fmt.format(Number(nativeBalance))} {chainMeta.native}
                      </div>
                      <div className="text-sm text-muted-foreground" data-testid="text-token-usd-native">
                        {nativeUsdValue ? fmtFiat.format(nativeUsdValue) : "—"}
                      </div>
                      {nativePrice && (
                        <div className="text-xs text-emerald-400 font-medium">
                          {formatPercentage(portfolioStats.change24h)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Token List */}
                <div className="space-y-3">
                  {filteredTokens.length === 0 && Object.keys(tokens).length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full glass-effect flex items-center justify-center">
                        <Inbox className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h4 className="text-lg font-medium text-foreground mb-2">No tokens in watchlist</h4>
                      <p className="text-muted-foreground mb-4">
                        Add your first token by entering its contract address above
                      </p>
                      <Button 
                        onClick={() => document.querySelector<HTMLInputElement>('[data-testid="input-token-address"]')?.focus()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                        data-testid="button-add-first-token"
                      >
                        Add Your First Token
                      </Button>
                    </div>
                  ) : (
                    filteredTokens.map(([address, token]) => (
                      <div
                        key={address}
                        className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-accent/50 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white">
                            <span className="text-xs">{token.symbol.slice(0, 4)}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{token.name}</div>
                            <div className="text-sm text-muted-foreground">{token.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground" data-testid={`text-token-balance-${token.symbol.toLowerCase()}`}>
                            {fmt.format(Number(token.balance))} {token.symbol}
                          </div>
                          <div className="text-sm text-muted-foreground" data-testid={`text-token-usd-${token.symbol.toLowerCase()}`}>
                            {token.usd && token.balance ? 
                              fmtFiat.format(Number(token.balance) * token.usd) : 
                              "—"
                            }
                          </div>
                          {token.priceChange24h && (
                            <div className={`text-xs font-medium ${
                              token.priceChange24h >= 0 ? "text-emerald-400" : "text-red-400"
                            }`}>
                              {formatPercentage(token.priceChange24h)}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(token.contractAddress)}
                            data-testid={`button-copy-${token.symbol.toLowerCase()}`}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          {chainId && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              asChild
                              data-testid={`button-explorer-${token.symbol.toLowerCase()}`}
                            >
                              <a href={tokenUrl(chainId, token.contractAddress)} target="_blank" rel="noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => showConfirmation({
                              type: 'remove-token',
                              title: 'Remove Token',
                              description: `Are you sure you want to remove ${token.symbol} (${token.name}) from your watchlist?`,
                              action: () => removeToken(token.contractAddress),
                              variant: 'destructive'
                            })}
                            className="hover:bg-destructive/20"
                            data-testid={`button-remove-${token.symbol.toLowerCase()}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden glass-effect border-t border-border p-4 z-50">
          <div className="flex items-center justify-around">
            <Link href="/">
              <button className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent" data-testid="nav-dashboard">
                <Home className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">Dashboard</span>
              </button>
            </Link>
            <Link href="/analytics">
              <button className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent" data-testid="nav-analytics">
                <BarChart3 className="w-5 h-5" />
                <span className="text-xs text-muted-foreground">Analytics</span>
              </button>
            </Link>
            <Link href="/history">
              <button className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent" data-testid="nav-history">
                <Clock className="w-5 h-5" />
                <span className="text-xs text-muted-foreground">History</span>
              </button>
            </Link>
            <Link href="/settings">
              <button className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-accent" data-testid="nav-settings">
                <Settings className="w-5 h-5" />
                <span className="text-xs text-muted-foreground">Settings</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Confirmation Modal */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="glass-effect border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {pendingAction?.variant === 'destructive' ? (
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
                {pendingAction?.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {pendingAction?.description}
              </DialogDescription>
            </DialogHeader>
            
            {pendingAction?.variant === 'destructive' && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive mb-1">Warning</p>
                    <p className="text-muted-foreground">
                      This action cannot be undone. Please confirm you want to proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmModal(false)}
                data-testid="button-cancel-modal"
              >
                Cancel
              </Button>
              <Button 
                variant={pendingAction?.variant === 'destructive' ? 'destructive' : 'default'}
                onClick={handleConfirmedAction}
                data-testid="button-confirm-modal"
              >
                {pendingAction?.variant === 'destructive' ? 'Delete' : 'Confirm'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
