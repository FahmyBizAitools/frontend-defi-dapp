import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWeb3 } from "@/hooks/use-web3";
import { fmtFiat, fmt, formatPercentage } from "@/lib/web3-utils";
import { TrendingUp, TrendingDown, ArrowLeft, BarChart3, PieChart, Activity } from "lucide-react";
import { Link } from "wouter";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

export default function Analytics() {
  const { 
    portfolioStats, 
    tokens, 
    nativeBalance, 
    nativeUsdValue, 
    chainMeta, 
    sparklineData 
  } = useWeb3();

  // Calculate portfolio distribution
  const portfolioData = [
    {
      name: chainMeta?.native || "ETH",
      value: nativeUsdValue || 0,
      percentage: ((nativeUsdValue || 0) / portfolioStats.totalValue) * 100,
    },
    ...Object.entries(tokens).map(([_, token]) => ({
      name: token.symbol,
      value: token.usd ? Number(token.balance) * token.usd : 0,
      percentage: token.usd ? ((Number(token.balance) * token.usd) / portfolioStats.totalValue) * 100 : 0,
    }))
  ].filter(item => item.value > 0);

  const colors = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
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
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Portfolio Analytics
                </h1>
                <p className="text-muted-foreground text-sm">
                  Detailed insights into your Web3 holdings
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-effect border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold" data-testid="text-total-value">
                    {fmtFiat.format(portfolioStats.totalValue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">24h Change</p>
                  <p className={`text-2xl font-bold ${portfolioStats.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatPercentage(portfolioStats.change24h)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <PieChart className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assets</p>
                  <p className="text-2xl font-bold" data-testid="text-asset-count">
                    {Object.keys(tokens).length + 1}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Biggest Holding</p>
                  <p className="text-lg font-bold">
                    {portfolioData.length > 0 ? portfolioData[0].name : "None"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Portfolio Distribution */}
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle>Portfolio Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {portfolioData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        dataKey="value"
                        data={portfolioData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percentage }: { name: string; percentage: number }) => `${name}: ${percentage.toFixed(1)}%`}
                      >
                        {portfolioData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [fmtFiat.format(Number(value)), "Value"]}
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.95)",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          borderRadius: "0.75rem",
                          backdropFilter: "blur(12px)",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No portfolio data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Price History */}
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle>Price History (7 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {sparklineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData.map(point => ({
                      x: new Date(point.timestamp).toLocaleDateString(),
                      y: point.price,
                    }))}>
                      <XAxis dataKey="x" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => [fmtFiat.format(Number(value)), "Price"]}
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.95)",
                          border: "1px solid rgba(148, 163, 184, 0.2)",
                          borderRadius: "0.75rem",
                          backdropFilter: "blur(12px)",
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="y" 
                        stroke="hsl(var(--primary))"
                        strokeWidth={2} 
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Loading price data...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings Breakdown */}
        <Card className="glass-effect border-0">
          <CardHeader>
            <CardTitle>Holdings Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Native Token */}
              {chainMeta && (
                <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center font-bold text-white text-sm">
                      {chainMeta.native === "ETH" ? "Ξ" : chainMeta.native.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{chainMeta.native}</p>
                      <p className="text-sm text-muted-foreground">{chainMeta.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{fmt.format(Number(nativeBalance))}</p>
                    <p className="text-sm text-muted-foreground">
                      {nativeUsdValue ? fmtFiat.format(nativeUsdValue) : "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">
                      {((nativeUsdValue || 0) / portfolioStats.totalValue * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              )}

              {/* ERC-20 Tokens */}
              {Object.entries(tokens).map(([address, token]) => (
                <div key={address} className="flex items-center justify-between p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center font-bold text-white text-sm">
                      {token.symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{token.symbol}</p>
                      <p className="text-sm text-muted-foreground">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{fmt.format(Number(token.balance))}</p>
                    <p className="text-sm text-muted-foreground">
                      {token.usd ? fmtFiat.format(Number(token.balance) * token.usd) : "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">
                      {token.usd ? ((Number(token.balance) * token.usd) / portfolioStats.totalValue * 100).toFixed(1) : "0"}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}