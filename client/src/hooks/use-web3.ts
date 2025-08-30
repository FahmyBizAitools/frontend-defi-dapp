import { useState, useEffect, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { TokenData, ChainMeta, PriceData, PortfolioStats } from "@/types/web3";
import { CHAIN_META, ERC20_ABI, cgPlatformFor } from "@/lib/web3-utils";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Cache utility with expiry
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface CacheItem {
  data: any;
  timestamp: number;
}

const getCachedData = (key: string): any | null => {
  try {
    const cached = localStorage.getItem(`price_cache_${key}`);
    if (!cached) return null;
    
    const { data, timestamp }: CacheItem = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(`price_cache_${key}`);
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
};

const setCachedData = (key: string, data: any): void => {
  try {
    const cacheItem: CacheItem = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(`price_cache_${key}`, JSON.stringify(cacheItem));
  } catch (error) {
    console.warn("Failed to cache price data:", error);
  }
};

export function useWeb3() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [nativeBalance, setNativeBalance] = useState<string>("0");
  const [connecting, setConnecting] = useState(false);
  const [tokens, setTokens] = useState<Record<string, TokenData>>({});
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("web3-watchlist");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [nativePrice, setNativePrice] = useState<number | null>(null);
  const [sparklineData, setSparklineData] = useState<PriceData[]>([]);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({
    totalValue: 0,
    change24h: 0,
    change7d: 0,
    change30d: 0,
  });

  const { toast } = useToast();

  const chainMeta = useMemo(() => 
    chainId ? CHAIN_META[chainId] : undefined, [chainId]
  );

  const isConnected = useMemo(() => !!account && !!provider, [account, provider]);

  const nativeUsdValue = useMemo(() => {
    if (!nativePrice || !nativeBalance) return null;
    const value = Number(nativeBalance) * nativePrice;
    return isFinite(value) ? value : null;
  }, [nativeBalance, nativePrice]);

  // Initialize provider
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const prov = new ethers.BrowserProvider(window.ethereum);
      setProvider(prov);

      (async () => {
        try {
          const network = await prov.getNetwork();
          setChainId(Number(network.chainId));
          const accounts = await prov.listAccounts();
          if (accounts.length) {
            setSigner(await prov.getSigner());
            setAccount(accounts[0].address);
          }
        } catch (error) {
          console.error("Failed to initialize provider:", error);
        }
      })();

      // Listen for account changes
      window.ethereum.on?.("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || null);
        if (!accounts[0]) {
          setSigner(null);
        }
      });

      // Listen for chain changes
      window.ethereum.on?.("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  // Persist watchlist
  useEffect(() => {
    try {
      localStorage.setItem("web3-watchlist", JSON.stringify(watchlist));
    } catch (error) {
      console.error("Failed to save watchlist:", error);
    }
  }, [watchlist]);

  // Fetch native balance
  useEffect(() => {
    if (!provider || !account) return;

    (async () => {
      try {
        const balance = await provider.getBalance(account);
        setNativeBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    })();
  }, [provider, account, chainId]);

  // Fetch native asset price and sparkline
  useEffect(() => {
    if (!chainMeta?.coingeckoCoinId) return;

    (async () => {
      try {
        const coinId = chainMeta.coingeckoCoinId;
        
        // Check cache first
        const priceKey = `${coinId}_price`;
        const chartKey = `${coinId}_chart`;
        
        let priceData = getCachedData(priceKey);
        let chartData = getCachedData(chartKey);
        
        // Fetch if not cached
        const promises = [];
        if (!priceData) {
          promises.push(
            fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`)
              .then(res => res.ok ? res.json() : null)
              .then(data => {
                if (data) setCachedData(priceKey, data);
                return data;
              })
          );
        } else {
          promises.push(Promise.resolve(priceData));
        }
        
        if (!chartData) {
          promises.push(
            fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=hourly`)
              .then(res => res.ok ? res.json() : null)
              .then(data => {
                if (data) setCachedData(chartKey, data);
                return data;
              })
          );
        } else {
          promises.push(Promise.resolve(chartData));
        }

        const [priceResult, chartResult] = await Promise.all(promises);

        if (priceResult) {
          const price = priceResult?.[coinId!]?.usd;
          const change24h = priceResult?.[coinId!]?.usd_24h_change;
          
          if (price) setNativePrice(price);
          if (change24h) {
            setPortfolioStats(prev => ({ ...prev, change24h }));
          }
        }

        if (chartResult && Array.isArray(chartResult?.prices)) {
          const sparkline = chartResult.prices.map(([timestamp, price]: [number, number]) => ({
            timestamp,
            price,
          }));
          setSparklineData(sparkline);
        }
      } catch (error) {
        console.error("Failed to fetch price data:", error);
      }
    })();
  }, [chainMeta?.coingeckoCoinId]);

  // Connect wallet with enhanced error handling
  const connectWallet = useCallback(async () => {
    if (!provider) {
      window.open("https://metamask.io", "_blank");
      toast({
        title: "Wallet Required",
        description: "Please install MetaMask or another Web3 wallet to continue",
        variant: "destructive",
      });
      return;
    }

    setConnecting(true);
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please unlock your wallet and try again.");
      }

      const walletSigner = await provider.getSigner();
      setSigner(walletSigner);
      setAccount(accounts[0]);
      
      const network = await provider.getNetwork();
      const currentChainId = Number(network.chainId);
      setChainId(currentChainId);

      // Check if network is supported
      const chainMeta = CHAIN_META[currentChainId];
      if (!chainMeta) {
        toast({
          title: "Unsupported Network",
          description: `Network ${currentChainId} is not supported. Please switch to Ethereum, Polygon, BSC, Optimism, Arbitrum, or Base.`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${chainMeta.name}`,
      });
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      
      let errorMessage = "Failed to connect wallet";
      
      if (error.code === 4001) {
        errorMessage = "Connection request was rejected. Please try again.";
      } else if (error.code === -32002) {
        errorMessage = "Connection request already pending. Please check your wallet.";
      } else if (error.message?.includes("accounts")) {
        errorMessage = "No accounts found. Please unlock your wallet.";
      } else if (error.message?.includes("network")) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message?.includes("unauthorized")) {
        errorMessage = "Unauthorized access. Please check wallet permissions.";
      }

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  }, [provider, toast]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setSigner(null);
    setAccount(null);
    setNativeBalance("0");
    setTokens({});
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  }, [toast]);

  // Add token to watchlist
  const addToken = useCallback(async (contractAddress: string) => {
    if (!provider || !account || !chainId) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return false;
    }

    try {
      const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
      const [symbol, name, decimals, balanceRaw] = await Promise.all([
        contract.symbol(),
        contract.name(),
        contract.decimals(),
        contract.balanceOf(account),
      ]);

      const balance = ethers.formatUnits(balanceRaw, decimals);

      // Fetch price if available (with caching)
      let usd: number | undefined;
      const platform = cgPlatformFor(chainId);
      if (platform) {
        try {
          const tokenCacheKey = `${platform}_${contractAddress.toLowerCase()}`;
          let cachedTokenPrice = getCachedData(tokenCacheKey);
          
          if (!cachedTokenPrice) {
            const response = await fetch(
              `https://api.coingecko.com/api/v3/simple/token_price/${platform}?contract_addresses=${contractAddress}&vs_currencies=usd&include_24hr_change=true`
            );
            if (response.ok) {
              cachedTokenPrice = await response.json();
              setCachedData(tokenCacheKey, cachedTokenPrice);
            }
          }
          
          if (cachedTokenPrice) {
            const tokenData = Object.values(cachedTokenPrice)[0] as any;
            if (tokenData?.usd) {
              usd = tokenData.usd;
            }
          }
        } catch (error) {
          console.warn("Failed to fetch token price:", error);
        }
      }

      const tokenData: TokenData = {
        symbol,
        name,
        decimals,
        balance,
        usd,
        contractAddress: contractAddress.toLowerCase(),
      };

      setTokens(prev => ({
        ...prev,
        [contractAddress.toLowerCase()]: tokenData,
      }));

      if (!watchlist.find(addr => addr.toLowerCase() === contractAddress.toLowerCase())) {
        setWatchlist(prev => [contractAddress, ...prev]);
      }

      toast({
        title: "Token Added",
        description: `${symbol} has been added to your watchlist`,
      });

      return true;
    } catch (error: any) {
      console.error("Failed to add token:", error);
      toast({
        title: "Failed to Add Token",
        description: "Please check the contract address and try again",
        variant: "destructive",
      });
      return false;
    }
  }, [provider, account, chainId, watchlist, toast]);

  // Remove token from watchlist
  const removeToken = useCallback((contractAddress: string) => {
    setWatchlist(prev => prev.filter(addr => addr.toLowerCase() !== contractAddress.toLowerCase()));
    setTokens(prev => {
      const updated = { ...prev };
      delete updated[contractAddress.toLowerCase()];
      return updated;
    });

    toast({
      title: "Token Removed",
      description: "Token removed from watchlist",
    });
  }, [toast]);

  // Refresh balances
  const refreshBalances = useCallback(async () => {
    if (!provider || !account) return;

    try {
      // Refresh native balance
      const nativeBalanceRaw = await provider.getBalance(account);
      setNativeBalance(ethers.formatEther(nativeBalanceRaw));

      // Refresh token balances
      const tokenAddresses = Object.keys(tokens);
      for (const address of tokenAddresses) {
        try {
          const contract = new ethers.Contract(address, ERC20_ABI, provider);
          const balanceRaw = await contract.balanceOf(account);
          const token = tokens[address];
          const balance = ethers.formatUnits(balanceRaw, token.decimals);

          setTokens(prev => ({
            ...prev,
            [address]: { ...prev[address], balance },
          }));
        } catch (error) {
          console.warn(`Failed to refresh balance for ${address}:`, error);
        }
      }

      toast({
        title: "Balances Updated",
        description: "All balances have been refreshed",
      });
    } catch (error) {
      console.error("Failed to refresh balances:", error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh balances",
        variant: "destructive",
      });
    }
  }, [provider, account, tokens, toast]);

  // Load watchlist tokens on account/network change
  useEffect(() => {
    if (!watchlist.length || !provider || !account) return;

    (async () => {
      for (const address of watchlist) {
        if (!tokens[address.toLowerCase()]) {
          try {
            await addToken(address);
          } catch (error) {
            console.warn(`Failed to load token ${address}:`, error);
          }
        }
      }
    })();
  }, [watchlist.join(","), provider, account, chainId]);

  // Calculate total portfolio value
  useEffect(() => {
    let total = nativeUsdValue || 0;
    
    Object.values(tokens).forEach(token => {
      if (token.usd && token.balance) {
        total += Number(token.balance) * token.usd;
      }
    });

    setPortfolioStats(prev => ({ ...prev, totalValue: total }));
  }, [nativeUsdValue, tokens]);

  return {
    // State
    provider,
    signer,
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

    // Actions
    connectWallet,
    disconnectWallet,
    addToken,
    removeToken,
    refreshBalances,
  };
}
