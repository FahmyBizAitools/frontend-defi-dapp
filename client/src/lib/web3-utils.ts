import { ChainMeta } from "@/types/web3";

// Known chain mappings → explorer + CoinGecko platform id
export const CHAIN_META: Record<number, ChainMeta> = {
  1: { 
    name: "Ethereum", 
    explorer: "https://etherscan.io", 
    native: "ETH", 
    coingeckoPlatform: "ethereum", 
    coingeckoCoinId: "ethereum" 
  },
  137: { 
    name: "Polygon", 
    explorer: "https://polygonscan.com", 
    native: "MATIC", 
    coingeckoPlatform: "polygon-pos", 
    coingeckoCoinId: "matic-network" 
  },
  56: { 
    name: "BNB Smart Chain", 
    explorer: "https://bscscan.com", 
    native: "BNB", 
    coingeckoPlatform: "binance-smart-chain", 
    coingeckoCoinId: "binancecoin" 
  },
  10: { 
    name: "OP Mainnet", 
    explorer: "https://optimistic.etherscan.io", 
    native: "ETH", 
    coingeckoPlatform: "optimistic-ethereum", 
    coingeckoCoinId: "ethereum" 
  },
  42161: { 
    name: "Arbitrum One", 
    explorer: "https://arbiscan.io", 
    native: "ETH", 
    coingeckoPlatform: "arbitrum-one", 
    coingeckoCoinId: "ethereum" 
  },
  8453: { 
    name: "Base", 
    explorer: "https://basescan.org", 
    native: "ETH", 
    coingeckoPlatform: "base", 
    coingeckoCoinId: "ethereum" 
  },
  11155111: { 
    name: "Sepolia", 
    explorer: "https://sepolia.etherscan.io", 
    native: "ETH", 
    coingeckoCoinId: "ethereum" 
  },
};

// Minimal ERC-20 ABI
export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
];

// Popular tokens for quick add
export const POPULAR_TOKENS: Record<number, Array<{address: string, symbol: string}>> = {
  1: [
    { address: "0xA0b86a33E6441c8C79d86e27c2bb6e2A42A36C7c", symbol: "USDC" },
    { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", symbol: "USDT" },
    { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", symbol: "WETH" },
    { address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", symbol: "UNI" },
  ],
};

// Helper functions
export const shortAddr = (addr?: string) => 
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

export const addrUrl = (chainId: number, addr: string) => 
  `${CHAIN_META[chainId]?.explorer || "https://etherscan.io"}/address/${addr}`;

export const tokenUrl = (chainId: number, addr: string) => 
  `${CHAIN_META[chainId]?.explorer || "https://etherscan.io"}/token/${addr}`;

export const cgPlatformFor = (chainId?: number) => 
  chainId ? CHAIN_META[chainId]?.coingeckoPlatform : undefined;

// Formatters
export const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 6 });
export const fmtFiat = new Intl.NumberFormat(undefined, { 
  style: "currency", 
  currency: "USD", 
  maximumFractionDigits: 2 
});

export const formatPercentage = (value: number) => 
  `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

// Validation
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
