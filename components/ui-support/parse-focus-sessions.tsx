import { startOfDay, subDays, isAfter, format, startOfHour } from "date-fns";
import { useState, useEffect } from "react";

interface Session {
  start_time: string;
  duration_seconds: number;
}

interface ChartPoint {
  date: string;
  duration: number;
  timeLabel?: string;
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

      if (isAfter(start, todayStart)) {
        // For today: group by hour (HH:00 format)
        const hourStart = startOfHour(start);
        const key = format(hourStart, "yyyy-MM-dd HH:00");
        buckets.today[key] =
          (buckets.today[key] || 0) + session.duration_seconds;
      } else if (isAfter(start, weekStart)) {
        // For last week: group by day
        const key = format(start, "yyyy-MM-dd");
        buckets.lastWeek[key] =
          (buckets.lastWeek[key] || 0) + session.duration_seconds;
      } else if (isAfter(start, monthStart)) {
        // For last month: group by day
        const key = format(start, "yyyy-MM-dd");
        buckets.lastMonth[key] =
          (buckets.lastMonth[key] || 0) + session.duration_seconds;
      } else if (isAfter(start, yearStart)) {
        // For last year: group by day
        const key = format(start, "yyyy-MM-dd");
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

    const createChartPoints = (
      bucket: Record<string, number>,
      isToday = false
    ) => {
      return Object.entries(bucket)
        .map(([dateKey, seconds]) => ({
          date: dateKey,
          duration: seconds,
          ...(isToday && {
            timeLabel: format(new Date(dateKey), "HH:mm"),
          }),
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    };

    const fillTodayHours = (todayPoints: ChartPoint[]) => {
      const filledHours: ChartPoint[] = [];
      const existingHours = new Map(todayPoints.map((p) => [p.date, p]));

      for (let hour = 0; hour < 24; hour++) {
        const hourDate = new Date(todayStart);
        hourDate.setHours(hour, 0, 0, 0);
        const key = format(hourDate, "yyyy-MM-dd HH:00");

        if (existingHours.has(key)) {
          filledHours.push(existingHours.get(key)!);
        } else {
          filledHours.push({
            date: key,
            duration: 0,
            timeLabel: format(hourDate, "HH:mm"),
          });
        }
      }

      return filledHours;
    };

    const todayPoints = createChartPoints(buckets.today, true);
    const filledTodayPoints = fillTodayHours(todayPoints);

    setChartData({
      today: filledTodayPoints,
      lastWeek: createChartPoints(buckets.lastWeek),
      lastMonth: createChartPoints(buckets.lastMonth),
      lastYear: createChartPoints(buckets.lastYear),
    });
  }, [data]);

  return chartData;
}
