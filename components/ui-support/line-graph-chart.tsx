import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import React from "react";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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

import { useParsedChartData } from "./parse-focus-sessions";

export const description = "An area chart with gradient fill";

const chartConfig = {
  focus_time: {
    label: "Focus Time",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface Session {
  start_time: string;
  duration_seconds: number;
}

const ChartAreaGradient = ({
  userId,
  timeSpan,
}: {
  userId: string;
  timeSpan: string;
}) => {
  console.log("User ID:", userId, "Type", typeof userId);
  const [rawData, setRawData] = useState<Session[]>([]);
  const chartData = useParsedChartData(rawData);

  useEffect(() => {
    const supabase = createClientComponentClient();

    const fetchData = async () => {
      const { data, error } = await supabase
        .from("focus_sessions")
        .select("start_time, duration_seconds")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      console.log("Fetched data:", data);

      setRawData(data as Session[]);
    };

    fetchData();
  }, [userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Focus Sessions</CardTitle>
        <CardDescription>
          Showing Focus Sessions For the Last Week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData.today}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            {timeSpan === "today" && (
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(5)}
              />
            )}
            {timeSpan === "lastWeek" && (
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(5)}
              />
            )}
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
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
              dataKey="duration"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              <span>Last 7 days</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChartAreaGradient;
