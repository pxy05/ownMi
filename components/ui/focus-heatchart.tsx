"use client";

import React, { useMemo } from "react";
import ActivityCalendar from "react-activity-calendar";
import { useAppUser, FocusSession } from "@/lib/app-user-context";

type HeatMapDay = {
  date: string;
  count_seconds: number;
  count: number;
  level: number;
};

const FocusHeatChart = () => {
  const { focusSessions } = useAppUser();

  function getLevel(seconds: number): number {
    const hours = Math.floor(seconds / 3600);
    if (hours <= 0) return 0;
    if (hours <= 1) return 1;
    if (hours <= 3) return 2;
    if (hours <= 5) return 3;
    if (hours > 6) return 4;
    return 0;
  }

  // Initialise all days for the current year
  function initialiseYear(): Map<string, HeatMapDay> {
    const map = new Map<string, HeatMapDay>();
    const year = new Date().getFullYear();
    const start = new Date(year, 0, 1); // Jan 1
    const end = new Date(year, 11, 31); // Dec 31

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const formatted =
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0");

      map.set(formatted, {
        date: formatted,
        count_seconds: 0,
        count: 0,
        level: 0,
      });
    }
    return map;
  }

  // Merge sessions into the current year’s map
  const parsedFocusSessions = useMemo(() => {
    const heatMapDays = initialiseYear();

    if (focusSessions) {
      for (const session of focusSessions) {
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

        const existing = heatMapDays.get(formatted);
        if (existing) {
          existing.count_seconds += session.duration_seconds;
          existing.count = Math.floor(existing.count_seconds / 3600);
          existing.level = getLevel(existing.count_seconds);
          heatMapDays.set(formatted, existing);
        }
      }
    }

    return Array.from(heatMapDays.values());
  }, [focusSessions]);

  return (
    <div className="flex-1">
      <ActivityCalendar data={parsedFocusSessions} />
    </div>
  );
};

export default FocusHeatChart;
