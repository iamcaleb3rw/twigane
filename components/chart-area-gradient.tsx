"use client";

import { useEffect, useRef, useState } from "react";
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
    label: "Math Grade",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile Activity",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartAreaGradient() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Trigger only once
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full">
      {isInView && (
        <ChartContainer className="w-full" config={chartConfig}>
          <AreaChart data={chartData}>
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
              type="monotone"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="#22c55e"
              animationDuration={800}
              animationEasing="ease"
            />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  );
}
