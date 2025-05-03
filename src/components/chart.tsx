"use client";

import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { fetchChartArticleViews } from "../services/dashboard/fetchChartArticleViews";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Skeleton } from "./ui/skeleton";

const chartConfig = {
  value: {
    label: "Viewers",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ChartArticleViews() {
  const { data, isLoading } = useQuery({
    queryKey: ["chart-article-views"],
    queryFn: () => fetchChartArticleViews(),
  });

  return isLoading ? (
    <Skeleton className="h-72 w-full" />
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>Statistik Viewers</CardTitle>
        <CardDescription>
          Menampilkan Total Viewers Dalam 30 Hari terakhir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data?.data || []}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(String(value)).toLocaleDateString("id-ID")
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="value"
              type="linear"
              fill="var(--color-value)"
              fillOpacity={0.4}
              stroke="var(--color-value)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
