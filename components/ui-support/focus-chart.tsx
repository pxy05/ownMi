import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import React from "react";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { format } from "date-fns";
import { useTheme } from "next-themes";

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
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface Session {
  start_time: string;
  duration_seconds: number;
}

type TimeRange = "today" | "lastWeek" | "lastMonth" | "lastYear";

const focusChart = ({
  userId,
  theme,
  mini,
  reset,
}: {
  userId: string;
  theme: string;
  mini: boolean;
  reset: number;
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("today");
  const [rawData, setRawData] = useState<Session[]>([]);
  const chartData = useParsedChartData(rawData);

  var textColor = "text-gray-700";
  var bgColor = "bg-white";

  if (theme === "dark") {
    textColor = "text-foreground";
    bgColor = "bg-background";
  } else if (theme === "light") {
    textColor = "text-foreground";
    bgColor = "bg-background";
  }

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

      setRawData(data as Session[]);
    };

    fetchData();
  }, [userId]);

  const currentData = chartData[timeRange];

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatXAxisTick = (tickItem: string) => {
    if (timeRange === "today") {
      return format(new Date(tickItem), "HH:mm");
    } else {
      return format(new Date(tickItem), "MMM dd");
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0];
    const dateLabel =
      timeRange === "today"
        ? format(new Date(label), "HH:mm")
        : format(new Date(label), "MMM dd, yyyy");

    return (
      <div className="rounded-md bg-background px-4 py-2 shadow border">
        <div className="font-semibold text-sm mb-1">{dateLabel}</div>
        <div className="text-primary text-xs">
          Focus Time:{" "}
          <span className="font-medium">{formatDuration(data.value)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["today", "lastWeek", "lastMonth", "lastYear"] as TimeRange[]).map(
          (range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1 rounded-lg transition-colors font-medium text-sm ${
                timeRange === range
                  ? `${bgColor} ${textColor} shadow border-1`
                  : `${bgColor} text-gray-700 hover:bg-gray-200`
              }`}
            >
              {range === "today"
                ? "Today"
                : range === "lastWeek"
                ? "Last Week"
                : range === "lastMonth"
                ? "Last Month"
                : "Last Year"}
            </button>
          )
        )}
      </div>

      {!currentData || currentData.length === 0 ? (
        <Card>
          <CardContent className="p-8 flex items-center justify-center">
            <p className="text-gray-500 text-center">
              No data available for the selected time range.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              Focus Session Duration
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {timeRange === "today"
                ? "Hourly breakdown for today"
                : timeRange === "lastWeek"
                ? "Daily breakdown for the last week"
                : timeRange === "lastMonth"
                ? "Daily breakdown for the last month"
                : "Daily breakdown for the last year"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={currentData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatXAxisTick}
                  interval={
                    mini
                      ? timeRange === "today"
                        ? 4
                        : "preserveStartEnd"
                      : timeRange === "today"
                      ? 2
                      : "preserveStartEnd"
                  }
                  className={`text-xs ${textColor}`}
                />
                <YAxis
                  tickFormatter={(value) => formatDuration(value)}
                  domain={[0, "auto"]}
                  tickLine={false}
                  axisLine={false}
                  className="text-xs text-gray-400"
                />
                <ChartTooltip cursor={false} content={<CustomTooltip />} />
                <Area
                  dataKey="duration"
                  type="monotone"
                  fill="var(--chart-2)"
                  fillOpacity={0.4}
                  stroke="var(--chart-2)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex w-full items-start gap-3 text-sm">
              <div className="grid gap-1">
                <div
                  className={`flex items-center gap-2 font-medium leading-none ${textColor}`}
                >
                  Focus session data <TrendingUp className="h-4 w-4" />
                </div>
                <div
                  className={`flex items-center gap-2 leading-none ${textColor}`}
                >
                  Total:{" "}
                  <span className={`font-semibold ${textColor}`}>
                    {formatDuration(
                      currentData.reduce((sum, item) => sum + item.duration, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default focusChart;
