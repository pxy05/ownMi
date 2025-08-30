import React from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { useAppUser, FocusSession } from "@/lib/app-user-context";
import { parse } from "path";

type HeatMapDay = {
  date: string;
  count: number;
  level: number;
};

const FocusHeatChart = () => {
  let heatMapDays: Map<string, HeatMapDay> = new Map();

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
          existing.count += session.duration_seconds;
          if (existing.count / 3600 <= 0) {
            existing.level = 0;
          } else if (existing.count / 3600 > 0 && existing.count / 3600 <= 1) {
            existing.level = 1;
          } else if (existing.count / 3600 > 1 && existing.count / 3600 <= 3) {
            existing.level = 2;
          } else if (existing.count / 3600 > 3 && existing.count / 3600 <= 5) {
            existing.level = 3;
          } else if (existing.count / 3600 > 6) {
            existing.level = 4;
          } else {
            existing.level = 0;
          }

          heatMapDays.set(formatted, existing);
        }
      } else {
        heatMapDays.set(formatted, {
          date: formatted,
          count: session.duration_seconds,
          level: Math.min(4, Math.floor(session.duration_seconds / 60)), // 1 level per hour, max 4
        });
      }
    }
  }

  const { focusSessions } = useAppUser();

  parseHeatMapData(focusSessions || []);

  const parsedFocusSessions = Array.from(heatMapDays.values());

  return <ActivityCalendar data={parsedFocusSessions} />;
};

export default FocusHeatChart;
