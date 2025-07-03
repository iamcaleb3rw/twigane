"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description =
  "An area chart demonstrating accelerated growth with gradient fill.";

const chartData = [
  { term: "1st Term", desktop: 30 },
  { term: "2nd Term", desktop: 40 },
  { term: "3rd Term", desktop: 93 },
];

const chartConfig = {
  desktop: {
    label: "Math Grade", // Renamed label for clarity
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile Activity", // Renamed label for clarity
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartAreaGradient() {
  return (
    <ChartContainer className="w-full" config={chartConfig}>
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />

        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1} />
          </linearGradient>

          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>

        <Area
          dataKey="desktop"
          type="natural"
          fill="url(#fillDesktop)"
          fillOpacity={0.4}
          stroke="#22c55e"
          stackId="a" // Keep stackId if you plan to add other stacked areas
        />
      </AreaChart>
    </ChartContainer>
  );
}
