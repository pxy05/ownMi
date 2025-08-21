import { startOfDay, subDays, isAfter, format } from "date-fns";
import { useState, useEffect } from "react";

interface Session {
  start_time: string;
  duration_seconds: number;
}

interface ChartPoint {
  date: string;
  duration: number;
}

export function useParsedChartData(data: Session[]) {
  const [chartData, setChartData] = useState<{
    today: ChartPoint[];
    lastWeek: ChartPoint[];
    lastMonth: ChartPoint[];
    lastYear: ChartPoint[];
  }>({ today: [], lastWeek: [], lastMonth: [], lastYear: [] });

  useEffect(() => {
    if (!data || data.length === 0) return;

    const now = new Date();
    const todayStart = startOfDay(now);

    const weekStart = subDays(todayStart, 7);
    const monthStart = subDays(todayStart, 30);
    const yearStart = subDays(todayStart, 365);

    const buckets: {
      today: Record<string, number>;
      lastWeek: Record<string, number>;
      lastMonth: Record<string, number>;
      lastYear: Record<string, number>;
    } = { today: {}, lastWeek: {}, lastMonth: {}, lastYear: {} };

    for (const session of data) {
      const start = new Date(session.start_time);
      const key = format(start, "yyyy-MM-dd");

      if (isAfter(start, todayStart)) {
        buckets.today[key] =
          (buckets.today[key] || 0) + session.duration_seconds;
      } else if (isAfter(start, weekStart)) {
        buckets.lastWeek[key] =
          (buckets.lastWeek[key] || 0) + session.duration_seconds;
      } else if (isAfter(start, monthStart)) {
        buckets.lastMonth[key] =
          (buckets.lastMonth[key] || 0) + session.duration_seconds;
      } else if (isAfter(start, yearStart)) {
        buckets.lastYear[key] =
          (buckets.lastYear[key] || 0) + session.duration_seconds;
      }
    }

    setChartData({
      today: Object.entries(buckets.today).map(([date, seconds]) => ({
        date,
        duration: seconds,
      })),
      lastWeek: Object.entries(buckets.lastWeek).map(([date, seconds]) => ({
        date,
        duration: seconds,
      })),
      lastMonth: Object.entries(buckets.lastMonth).map(([date, seconds]) => ({
        date,
        duration: seconds,
      })),
      lastYear: Object.entries(buckets.lastYear).map(([date, seconds]) => ({
        date,
        duration: seconds,
      })),
    });
  }, [data]);

  return chartData;
}
