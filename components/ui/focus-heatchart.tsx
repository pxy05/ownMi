import React from "react";
import ActivityCalendar from "react-activity-calendar";
import { useAppUser, FocusSession } from "@/lib/app-user-context";
import { get } from "http";

type HeatMapDay = {
  date: string;
  count_seconds: number; // actual total seconds
  count: number; // in hours please lads using floor
  level: number;
};

const FocusHeatChart = () => {
  let heatMapDays: Map<string, HeatMapDay> = new Map();

  function getLevel(seconds: number): number {
    const hours = Math.floor(seconds / 3600);
    if (hours <= 0) return 0;
    if (hours <= 1) return 1;
    if (hours <= 3) return 2;
    if (hours <= 5) return 3;
    if (hours > 6) return 4;
    return 0;
  }

  function parseHeatMapData(sessions: FocusSession[]): void {
    for (var session of sessions) {
      if (
        !session.duration_seconds ||
        !session.start_time ||
        !session.end_time
      ) {
        continue;
      }

      const date = new Date(session.start_time);
      const formatted =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");

      if (heatMapDays.has(formatted)) {
        const existing = heatMapDays.get(formatted);
        if (existing) {
          existing.count_seconds += session.duration_seconds;
          existing.count += Math.floor(existing.count_seconds / 3600);
          existing.level = getLevel(existing.count_seconds);

          heatMapDays.set(formatted, existing);
        }
      } else {
        heatMapDays.set(formatted, {
          date: formatted,
          count_seconds: session.duration_seconds,
          count: Math.floor(session.duration_seconds / 3600),
          level: getLevel(Math.floor(session.duration_seconds / 3600)),
        });
      }
    }
  }

  const { focusSessions } = useAppUser();

  parseHeatMapData(focusSessions || []);

  const parsedFocusSessions = Array.from(heatMapDays.values());

  return (
    <div className="flex-1">
      <ActivityCalendar data={parsedFocusSessions} />
    </div>
  );
};

export default FocusHeatChart;
