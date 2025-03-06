"use client";

import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

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
import { DotPattern } from "./magicui/dot-pattern";
import { cn } from "@/lib/utils";
const chartData = [
  { month: "january", notstarted: 1260, inprogress: 570, completed: 100 },
];

const chartConfig = {
  notstarted: {
    label: "Not Started",
    color: "#fbbf24",
  },
  inprogress: {
    label: "In Progress",
    color: "#f97316",
  },
  completed: {
    label: "Completed",
    color: "#22c55e",
  },
} satisfies ChartConfig;

export function Component() {
  const totalVisitors =
    chartData[0].notstarted + chartData[0].inprogress + chartData[0].completed;

  return (
    <Card className="flex flex-col overflow-hidden relative">
      <DotPattern
        glow={true}
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
        )}
      />
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Stacked</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0 mt-3">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[190px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Courses
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="notstarted"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-notstarted)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="inprogress"
              fill="var(--color-inprogress)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="completed"
              fill="var(--color-completed)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
