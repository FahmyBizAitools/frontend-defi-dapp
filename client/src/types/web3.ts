export interface ChainMeta {
  name: string;
  explorer: string;
  native: string;
  coingeckoPlatform?: string;
  coingeckoCoinId?: string;
}

export interface TokenData {
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  usd?: number;
  contractAddress: string;
  priceChange24h?: number;
}

export interface PriceData {
  timestamp: number;
  price: number;
}

export interface TransactionData {
  hash: string;
  type: 'send' | 'receive' | 'swap';
  amount: string;
  token: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  from?: string;
  to?: string;
}

export interface PortfolioStats {
  totalValue: number;
  change24h: number;
  change7d: number;
  change30d: number;
}

export interface GasTracker {
  standard: number;
  fast: number;
  rapid: number;
}
