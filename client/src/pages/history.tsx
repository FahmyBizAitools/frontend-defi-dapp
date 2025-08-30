import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWeb3 } from "@/hooks/use-web3";
import { shortAddr, addrUrl } from "@/lib/web3-utils";
import { ArrowLeft, Clock, ArrowUpRight, ArrowDownLeft, RefreshCw, ExternalLink, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function History() {
  const { account, chainId, chainMeta } = useWeb3();

  // Mock transaction history - in a real app, this would come from an API
  const mockTransactions = [
    {
      hash: "0x1234...5678",
      type: "send" as const,
      amount: "0.5",
      token: "ETH",
      timestamp: Date.now() - 3600000,
      status: "confirmed" as const,
      to: "0x9876...4321"
    },
    {
      hash: "0x2345...6789",
      type: "receive" as const,
      amount: "100",
      token: "USDC",
      timestamp: Date.now() - 7200000,
      status: "confirmed" as const,
      from: "0x8765...3210"
    },
    {
      hash: "0x3456...7890",
      type: "swap" as const,
      amount: "1000",
      token: "USDT → ETH",
      timestamp: Date.now() - 86400000,
      status: "confirmed" as const,
    }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case "receive":
        return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case "swap":
        return <RefreshCw className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    } else if (diff < 86400000) { // Less than 1 day
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
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
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Transaction History
                </h1>
                <p className="text-muted-foreground text-sm">
                  Your recent Web3 activity
                </p>
              </div>
            </div>
          </div>
          <Button variant="outline" className="gap-2" data-testid="button-refresh">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </header>

        {/* Filter Options */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant="default" size="sm" data-testid="filter-all">All</Button>
          <Button variant="outline" size="sm" data-testid="filter-send">Send</Button>
          <Button variant="outline" size="sm" data-testid="filter-receive">Receive</Button>
          <Button variant="outline" size="sm" data-testid="filter-swap">Swap</Button>
          <Button variant="outline" size="sm" className="gap-2" data-testid="filter-date">
            <Calendar className="w-4 h-4" />
            Date Range
          </Button>
        </div>

        {/* Transaction List */}
        <Card className="glass-effect border-0">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {account ? (
              <div className="space-y-4">
                {mockTransactions.map((tx) => (
                  <div 
                    key={tx.hash} 
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-accent/50 transition-all duration-200 group"
                    data-testid={`transaction-${tx.hash.slice(2, 8)}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg glass-effect">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold capitalize">{tx.type}</p>
                          {getStatusBadge(tx.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tx.type === "send" && tx.to && `To: ${shortAddr(tx.to)}`}
                          {tx.type === "receive" && tx.from && `From: ${shortAddr(tx.from)}`}
                          {tx.type === "swap" && "Token swap"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="font-semibold">
                        {tx.type === "send" ? "-" : tx.type === "receive" ? "+" : ""}{tx.amount} {tx.token}
                      </p>
                      <p className="text-sm text-muted-foreground">{formatTimestamp(tx.timestamp)}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        data-testid={`button-view-${tx.hash.slice(2, 8)}`}
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* Empty State for when no transactions */}
                {mockTransactions.length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Your transaction history will appear here once you start using Web3
                    </p>
                    <Link href="/">
                      <Button className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Connect your wallet</h3>
                <p className="text-muted-foreground mb-4">
                  Connect your Web3 wallet to view your transaction history
                </p>
                <Link href="/">
                  <Button className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Load More */}
        {account && mockTransactions.length > 0 && (
          <div className="text-center mt-6">
            <Button variant="outline" className="gap-2" data-testid="button-load-more">
              Load More Transactions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}