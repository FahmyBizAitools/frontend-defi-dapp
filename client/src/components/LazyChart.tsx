import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fmtFiat } from "@/lib/web3-utils";

interface LazyChartProps {
  chartData: Array<{ x: string; y: number }>;
}

export default function LazyChart({ chartData }: LazyChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <XAxis dataKey="x" hide />
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Tooltip 
          formatter={(value: any) => [fmtFiat.format(Number(value)), "Price"]}
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: "0.75rem",
            backdropFilter: "blur(12px)",
            fontSize: "12px"
          }}
          cursor={{
            stroke: "hsl(var(--primary))",
            strokeWidth: 1,
            strokeDasharray: "4 4"
          }}
        />
        <Line 
          type="monotone" 
          dataKey="y" 
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          strokeLinecap="round"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}